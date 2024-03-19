import Constant from '../constant';
import { isNumeric } from '../util';
import { string as _string } from '../random/basic';
import { placeholder as Placeholder } from './placeholder';
export function string(options) {
    const {
        rule: { range, count },
        context: { currentContext, templateCurrentContext },
        template = '',
    } = options;
    let result = '';

    if (template.length) {
        //  'foo': '★', count 为 undefined 时
        // 'star|1-5': '★',
        result += count === undefined ? template : Array(count).fill(template).join('');

        // 'email|1-10': '@EMAIL, ',
        const placeholders = result.match(Constant.RE_PLACEHOLDER) || []; // A-Z_0-9 > \w_
        placeholders.some((ph, index) => {
            // 遇到转义斜杠，不需要解析占位符
            if (/^\\/.test(ph)) {
                placeholders.splice(index--, 1);
                return;
            }

            const phed = Placeholder(ph, currentContext, templateCurrentContext, options);

            // 只有一个占位符，并且没有其他字符
            if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) {
                if (isNumeric(phed)) {
                    result = parseFloat(phed, 10);
                    return true;
                }
                if (/^(true|false)$/.test(phed)) {
                    result = phed === 'true' ? true : phed === 'false' ? false : phed; // 已经是布尔值
                    return true;
                } //
                result = phed;
                return true;
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
