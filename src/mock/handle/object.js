import { shuffle } from "../random/index.js";
import Constant from "../constant.js";
import { type as Type } from "../util.js";
import { gen } from "./gen.js";
export function object({ template, rule: { min, count }, context: { path, templatePath, root, templateRoot } }) {
    var result = {},
        keys = [],
        fnKeys = [];

    // 'obj|min-max': {}
    /* jshint -W041 */
    if (min != undefined) {
        keys = shuffle(Object.keys(template)).slice(0, count);
        keys.forEach((key) => {
            let parsedKey = key.replace(Constant.RE_KEY, "$1");

            result[parsedKey] = gen(template[key], key, {
                path: [...path, parsedKey],
                templatePath: [...templatePath, key],
                currentContext: result,
                templateCurrentContext: template,
                root: root || result,
                templateRoot: templateRoot || template,
            });
        });
    } else {
        // 'obj': {}
        // #25 改变了非函数属性的顺序，查找起来不方便
        for (let key in template) {
            (typeof template[key] === "function" ? fnKeys : keys).push(key);
        }
        keys = keys.concat(fnKeys);

        /*
            会改变非函数属性的顺序
            keys = Object.keys(template)
            keys.sort(function(a, b) {
                var afn = typeof template[a] === 'function'
                var bfn = typeof template[b] === 'function'
                if (afn === bfn) return 0
                if (afn && !bfn) return 1
                if (!afn && bfn) return -1
            })
        */

        keys.forEach((key) => {
            let parsedKey = key.replace(Constant.RE_KEY, "$1");
            result[parsedKey] = gen(template[key], key, {
                path: [...path, parsedKey],
                templatePath: [...templatePath, key],
                currentContext: result,
                templateCurrentContext: template,
                root: root || result,
                templateRoot: templateRoot || template,
            });
            // 'id|+1': 1
            let inc = key.match(Constant.RE_KEY);
            if (inc && inc[2] && Type(template[key]) === "number") {
                template[key] += parseInt(inc[2], 10);
            }
        });
    }
    return result;
}
