import { random } from "lodash-es";
// 返回一个随机的整数。
const integer = function (min, max) {
    return random(min, max, false);
};
const natural = function (min, max) {
    return Math.abs(integer(min, max));
};

const isNumber = function (el) {
    return typeof el === "number" && !isNaN(el);
};
export { integer, isNumber, random, natural, integer as int };
