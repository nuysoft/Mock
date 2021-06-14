import { type as Type, isFunction } from "../util.js";
import { gen } from "../handle/gen.js"; // 从模板生成数据
import { _mocked } from "../_mocked.js";

// 查找与请求参数匹配的数据模板：URL，Type
function find({ url, type }) {
    type = type.toLowerCase();
    for (var sUrlType in _mocked) {
        var item = _mocked[sUrlType];
        let { rurl, rtype } = item;
        if (match(rurl, url) && match(rtype, type)) {
            // console.log('[mock]', url, '>', item.rurl)
            return item;
        }
    }
    return false;
}

function match(expected, actual) {
    switch (Type(expected)) {
        case "string":
            return expected === actual;
        case "regexp":
            return expected.test(actual);
        default:
            return false;
    }
}

// 数据模板 ＝> 响应数据
function convert({ template }, options) {
    return isFunction(template) ? template(options) : gen(template);
}
export { find, convert, match };
