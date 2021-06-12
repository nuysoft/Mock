import { character } from "../random/index.js";
export function number({ rule: { decimal, range, count, dcount = 0, parameters }, template = "" }) {
    var result;
    if (decimal) {
        let [Integer, Decimal] = ("" + template).split(".");
        // 'float1|.1-10': 10,
        // 'float2|1-100.1-10': 1,
        // 'float3|999.1-10': 1,
        // 'float4|.3-10': 123.123,
        Integer = range ? count : Integer;
        Decimal = (Decimal || "").slice(0, dcount);
        while (Decimal.length < dcount) {
            Decimal +=
                // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                Decimal.length < dcount - 1 ? character("number") : character("123456789");
        }
        result = parseFloat(Integer + "." + Decimal, 10);
    } else {
        // integer
        // 'grade1|1-100': 1,
        result = range && !parameters[2] ? count : template;
    }
    return result;
}
