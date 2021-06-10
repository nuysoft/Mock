import { isNumber } from "./number.js";
const boolean = function (min, max, cur) {
    if (cur) {
        min = isNumber(min) ? parseInt(min, 10) : 1;
        max = isNumber(max) ? parseInt(max, 10) : 1;
        return Math.random() > (1.0 / (min + max)) * min ? !cur : cur;
    }
    return Math.random() >= 0.5;
};
export { boolean, boolean as bool };
