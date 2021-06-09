import { integer, isNumber, natural } from "./number.js";
const float = function (min, max, dmin, dmax) {
    dmin = isNumber(dmin) ? dmin : 0;
    dmax = isNumber(dmax) ? dmax : 17;
    dmin = Math.max(Math.min(dmin, 17), 0);
    dmax = Math.max(Math.min(dmax, 17), 0);
    let dcount = natural(dmin, dmax);
    var ret =
        integer(min, max) +
        "." +
        [...Array(dcount).keys()]
            .map((i) => {
                // 最后一位不能为 0，所以必须进行处理
                return i < dcount - 1 ? this.character("number") : this.character("123456789");
            })
            .join("");
    return parseFloat(ret, 10);
};
export { float };
