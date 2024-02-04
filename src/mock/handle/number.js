import { float } from '../random/basic/number.js';
export function number({ rule: { min, max, dmax, dmin, decimal, range, count, dcount, parameters }, template = '' }) {
    let result;

    if (decimal) {
        if (min === undefined && max === undefined) min = max = parseInt(template);
        if (max === undefined && min) max = min;
        result = float(min ?? 0, max, dmin, dmax, count, dcount); // 内置字符串转数字
        // console.log(min, max, dmax, dmin, decimal, range, count, dcount, template);
        // console.log(result);
    } else {
        // integer
        // 'grade1|1-100': 1,
        result = range && !parameters[2] ? count : template;
    }
    return result;
}
