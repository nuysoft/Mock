// 使用不完全覆盖的方式，使用继承方式继承所有的属性
// 只在 send 方式调用的时候对其进行数据返回
import { find, convert } from '../ajax-tools';
import HTTP_STATUS_CODES from './constant';

const voidFunc = function () {};
const window = globalThis.window || {};
const XMLHttpRequest = window?.XMLHttpRequest ? window.XMLHttpRequest : class __NULL__ {};
const SEND = XMLHttpRequest?.prototype?.send || voidFunc;
const OPEN = XMLHttpRequest?.prototype?.open || voidFunc;

// ! 虽然 XMLHttpRequest 不能够修改，但是可以通过设置 getter 和 setter 将属性映射到 $属性上，这样的话，原生 XHR 会将数据写入和读取的位置更改为新的对象属性上，这样就可以被我们修改了。

// 不可以在原生的 XMLHttpRequest 上直接定义 getter 和 setter，
// 也不可以在 XHR 实例上定义
// 这样的话会导致无法接收到数据
// 但是确认为是 mockjs 内的数据返回就可以直接修改 XHR 实例了
const defineGetAndSet = function (XHR) {
    // 将这些 键值对 映射到 $Mock 属性对象的对应值上去
    const array = ['readyState', 'status', 'response', 'responseText', 'statusText'];
    Object.defineProperties(
        XHR,
        array.reduce((col, cur) => {
            col[cur] = {
                get() {
                    return this.$Mock[cur];
                },
                set: function (state) {
                    this.$Mock[cur] = state;
                },
            };
            return col;
        }, {}),
    );
};
class MockXMLHttpRequest extends XMLHttpRequest {
    constructor(...args) {
        super(...args);
    }
    _send = SEND;
    _open = OPEN;
    open(method, url, async, username, password) {
        // 不进行同步操作
        this._open(method, url, true, username, password);
        this.$url = url;
        this.$type = method.toLowerCase();
    }
    send(body) {
        if (this.$mock) {
            this.$template = find({ url: this.$url, type: this.$type });
            if (this.$template) {
                this.$template = { ...this.$template, body };
                defineGetAndSet(this);
                this.dispatchEvent(new Event('loadstart'));
                setTimeout(this.$done.bind(this), this.timeout || 100);
                return null;
            }
        }
        this._send(body);
    }
    get mock() {
        return this.$mock;
    }
    set mock(value) {
        if (typeof value === 'boolean') this.$mock = value;
    }
    $Mock = {
        // 原生属性的 getter 和 setter
        readyState: 0,
        status: 200,
        response: '',
        responseText: '',
        statusText: '',
    };
    $type = 'get';
    $url = '';
    $mock = true;
    $template = null;

    $done() {
        // 伪造 XHR 返回事件
        this.readyState = this.HEADERS_RECEIVED;
        this.dispatchEvent(new Event('readystatechange'));
        this.readyState = this.LOADING;
        this.dispatchEvent(new Event('readystatechange'));

        this.status = 200;
        this.statusText = HTTP_STATUS_CODES[200];
        const data = convert(this.$template, { url: this.$url, type: this.$type });
        this.response = data;
        this.responseText = typeof this.response === 'string' ? this.response : JSON.stringify(this.response);
        this.readyState = this.DONE;
        this.dispatchEvent(new Event('readystatechange'));
        this.dispatchEvent(new Event('load'));
        this.dispatchEvent(new Event('loadend'));
    }
}
export { MockXMLHttpRequest };
