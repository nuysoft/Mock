import { float } from "../random/basic/number.js";
export function number({ rule: { decimal, range, count, dcount = 0, parameters }, template = "" }) {
    var result;
    if (decimal) {
        // 'float1|.1-10': 10,
        // 'float2|1-100.1-10': 1,
        // 'float3|999.1-10': 1,
        // 'float4|.3-10': 123.123,
        parameters.input.replace(/\|(\d*-?)(\d*)\.(\d*-?)(\d*)/, function (all, min, max, dmin, dmax) {
            result = float(min, max, dmin, dmax); // 内置字符串转数字
        });
    } else {
        // integer
        // 'grade1|1-100': 1,
        result = range && !parameters[2] ? count : template;
    }
    return result;
}
