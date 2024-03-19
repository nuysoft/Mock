import { type as Type, isFunction } from '../util';
import { gen } from '../handle/gen'; // 从模板生成数据
import { _mocked } from '../_mocked';

// 查找与请求参数匹配的数据模板：URL，Type
function find({ url, type }) {
    type = type.toLowerCase();

    for (const item of _mocked.$getAll()) {
        const { url: rurl, type: rtype } = item;
        if (match(rurl, url) && match(rtype, type)) {
            console.log('[mock]', url, '>', item.rurl);
            return item;
        }
    }
    return false;
}

function match(expected, actual) {
    switch (Type(expected)) {
        case 'string':
            return expected === actual;
        case 'regexp':
            return expected.test(actual);
        default:
            return false;
    }
}

// 数据模板 ＝> 响应数据
function convert({ template, body }, options) {
    return isFunction(template)
        ? template({ ...options, type: options.type.toUpperCase(), body: body ?? null })
        : gen(template);
}
export { find, convert, match };
