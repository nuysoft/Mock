import Constant from '../constant.js';
import { type as Type } from '../util.js';
import { pick } from '../random/index.js';
import * as Random from '../random/index.js';
import { gen } from './gen.js';
import { splitPathToArray, getValueByKeyPath } from './path.js';

// 占位符即是字符串函数的意思
function placeholder(Placeholder, obj, templateContext, options) {
    // console.log(options.context.path)
    // 1 key, 2 params
    Constant.RE_PLACEHOLDER.exec('');
    let [, key, params] = Constant.RE_PLACEHOLDER.exec(Placeholder);

    const lkey = key && key.toLowerCase();
    const pathParts = splitPathToArray(key);

    // 占位符优先引用数据模板中的属性
    if (obj && key in obj) return obj[key];

    // 绝对路径 or 相对路径
    if (key.charAt(0) === '/' || pathParts.length > 1) return getValueByKeyPath(key, options);

    // 递归引用数据模板中的属性
    if (
        templateContext &&
        typeof templateContext === 'object' &&
        key in templateContext &&
        Placeholder !== templateContext[key] // fix #15 避免自己依赖自己
    ) {
        // 先计算被引用的属性值
        templateContext[key] = gen(templateContext[key], key, {
            currentContext: obj,
            templateCurrentContext: templateContext,
        });
        return templateContext[key];
    }

    // 如果未找到，则原样返回
    if (!(key in Random) && !(lkey in Random)) return Placeholder;

    // 解析占位符的参数
    // !不进行低版本浏览器的匹配
    if (params) {
        params = params.split(/\s*,\s*/).map((param) => {
            // 递归解析参数中的占位符
            Constant.RE_PLACEHOLDER.exec('');
            if (Constant.RE_PLACEHOLDER.test(param)) {
                return placeholder(param, obj, templateContext, options);
            }
            return param;
        });
    } else {
        params = [];
    }

    const handle = Random[key] || Random[lkey];
    switch (Type(handle)) {
        case 'array': {
            // 自动从数组中取一个，例如 @areas
            return pick(handle);
        }
        case 'function': {
            // 执行占位符方法（大多数情况）
            handle.options = options;
            const re = handle.apply(Random, params) ?? ''; // 因为是在字符串中，所以默认为空字符串。
            delete handle.options;
            return re;
        }
    }
}
export { placeholder };
