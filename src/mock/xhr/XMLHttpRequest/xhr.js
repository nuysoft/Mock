// 使用不完全覆盖的方式，使用继承方式继承所有的属性
// 只在 send 方式调用的时候对其进行数据返回
import { find, convert } from "../ajax-tools.js";
import HTTP_STATUS_CODES from "./constant.js";

let SEND = XMLHttpRequest.prototype.send;
const OPEN = XMLHttpRequest.prototype.open;

//! 虽然 XMLHttpRequest 不能够修改，但是可以通过设置 getter 和 setter 将属性映射到 $属性上，这样的话，原生 XHR 会将数据写入和读取的位置更改为新的对象属性上，这样就可以被我们修改了。

class MockXMLHttpRequest extends XMLHttpRequest {
    constructor() {
        super(...arguments);
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
                this.dispatchEvent(new Event("loadstart"));
                setTimeout(this.$done.bind(this), this.$timeout);
                return null;
            }
        }
        this._send(body);
    }
    get mock() {
        return this.$mock;
    }
    set mock(value) {
        if (typeof value === "boolean") this.$mock = value;
    }

    $type = "get";
    $url = "";
    $mock = true;
    $timeout = 1000;
    $data = null;
    $template = null;

    $done() {
        this.readyState = this.HEADERS_RECEIVED;
        this.dispatchEvent(new Event("readystatechange"));
        this.readyState = this.LOADING;
        this.dispatchEvent(new Event("readystatechange"));

        this.status = 200;
        this.statusText = HTTP_STATUS_CODES[200];
        this.$data = convert(this.$template, {});
        this.response = JSON.stringify(this.$data, null, 4);
        this.responseText = this.response;
        this.readyState = this.DONE;
        this.dispatchEvent(new Event("readystatechange"));
        this.dispatchEvent(new Event("load"));
        this.dispatchEvent(new Event("loadend"));
    }

    // 原生属性的 getter 和 setter
    $readyState = 0;
    $status = 200;
    $response = "";
    $responseText = "";
    $statusText = "";
    set readyState(state) {
        this.$readyState = state;
    }
    get readyState() {
        return this.$readyState;
    }
    set status(code) {
        this.$status = code;
    }
    get status() {
        return this.$status;
    }
    set statusText(code) {
        this.$statusText = code;
    }
    get statusText() {
        return this.$statusText;
    }

    get response() {
        return this.$response;
    }
    set response(code) {
        this.$response = code;
    }
    set responseText(code) {
        this.$responseText = code;
    }
    get responseText() {
        return this.$responseText;
    }
}
export { MockXMLHttpRequest };
