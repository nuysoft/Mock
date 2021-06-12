import Constant from "../constant.js";
import { isNumeric } from "../util.js";
import { string as _string } from "../random/index.js";
import { placeholder as Placeholder } from "./placeholder.js";
export function string(options) {
    let {
        rule: { range, count },
        context: { currentContext, templateCurrentContext },
        template = "",
    } = options;
    var result = "";

    if (template.length) {
        //  'foo': '★', count 为 undefined 时
        // 'star|1-5': '★',
        result += count === undefined ? template : Array(count).fill(template).join("");

        // 'email|1-10': '@EMAIL, ',
        let placeholders = result.match(Constant.RE_PLACEHOLDER) || []; // A-Z_0-9 > \w_
        placeholders.some((ph, index) => {
            // 遇到转义斜杠，不需要解析占位符
            if (/^\\/.test(ph)) {
                placeholders.splice(index--, 1);
                return;
            }

            let phed = Placeholder(ph, currentContext, templateCurrentContext, options);

            // 只有一个占位符，并且没有其他字符
            if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) {
                //
                result = phed;
                return true;

                if (isNumeric(phed)) {
                    result = parseFloat(phed, 10);
                    return true;
                }
                if (/^(true|false)$/.test(phed)) {
                    result = phed === "true" ? true : phed === "false" ? false : phed; // 已经是布尔值
                    return true;
                }
            }
            result = result.replace(ph, phed);
        });
    } else {
        // 'ASCII|1-10': '',
        // 'ASCII': '',
        result = range ? _string(count) : template;
    }
    return result;
}
