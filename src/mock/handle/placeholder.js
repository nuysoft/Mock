import Constant from "../constant.js";
import { type as Type } from "../util.js";
import { pick } from "../random/index.js";
import * as Random from "../random/index.js";
import { gen } from "./gen.js";
import { splitPathToArray, getValueByKeyPath } from "./path.js";
const _all = Object.keys(Random).reduce((col, key) => {
    col[key.toLowerCase()] = key;
    return col;
}, {});
export function placeholder(placeholder, obj, templateContext, options) {
    // console.log(options.context.path)
    // 1 key, 2 params
    Constant.RE_PLACEHOLDER.exec("");
    var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
        key = parts && parts[1],
        lkey = key && key.toLowerCase(),
        okey = _all[lkey],
        params = (parts && parts[2]) || "";
    var pathParts = splitPathToArray(key);

    // 解析占位符的参数
    try {
        // 1. 尝试保持参数的类型
        /*
            #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
            [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
            应该属于 Window Firefox 30.0 的 BUG
        */
        /* jshint -W061 */
        params = eval("(function(){ return [].splice.call(arguments, 0 ) })(" + params + ")");
    } catch (error) {
        // 2. 如果失败，只能解析为字符串
        // console.error(error)
        // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
        // else throw error
        params = parts[2].split(/,\s*/);
    }

    // 占位符优先引用数据模板中的属性
    if (obj && key in obj) return obj[key];

    // @index @key
    // if (Constant.RE_INDEX.test(key)) return +options.name
    // if (Constant.RE_KEY.test(key)) return options.name

    // 绝对路径 or 相对路径
    if (key.charAt(0) === "/" || pathParts.length > 1) return getValueByKeyPath(key, options);

    // 递归引用数据模板中的属性
    if (
        templateContext &&
        typeof templateContext === "object" &&
        key in templateContext &&
        placeholder !== templateContext[key] // fix #15 避免自己依赖自己
    ) {
        // 先计算被引用的属性值
        templateContext[key] = gen(templateContext[key], key, {
            currentContext: obj,
            templateCurrentContext: templateContext,
        });
        return templateContext[key];
    }

    // 如果未找到，则原样返回
    if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder;

    // 递归解析参数中的占位符
    for (var i = 0; i < params.length; i++) {
        Constant.RE_PLACEHOLDER.exec("");
        if (Constant.RE_PLACEHOLDER.test(params[i])) {
            params[i] = placeholder(params[i], obj, templateContext, options);
        }
    }

    var handle = Random[key] || Random[lkey] || Random[okey];
    switch (Type(handle)) {
        case "array":
            // 自动从数组中取一个，例如 @areas
            return pick(handle);
        case "function":
            // 执行占位符方法（大多数情况）
            handle.options = options;
            var re = handle.apply(Random, params);
            if (re === undefined) re = ""; // 因为是在字符串中，所以默认为空字符串。
            delete handle.options;
            return re;
    }
}
