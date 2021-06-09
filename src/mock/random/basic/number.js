const isNumber = function (el) {
    return typeof el === "number" && !isNaN(el);
};
const random = function (min, max) {
    return Math.random() * (max - min) + min;
};

// 返回一个随机的整数。
const integer = function (min, max) {
    min = isNumber(min) ? parseInt(min, 10) : -9007199254740992;
    max = isNumber(max) ? parseInt(max, 10) : 9007199254740992; // 2^53
    return Math.round(random(min, max));
};
const natural = function (min, max) {
    return Math.abs(integer(min, max));
};
export { integer, isNumber, random, natural };
