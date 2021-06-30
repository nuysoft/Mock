import { random } from 'lodash-es';
const isNumber = function (el) {
    return typeof el === 'number' && !isNaN(el);
};
const numberGate = function (input) {
    if (isNumber(input)) return input;
    const res = parseInt(input);
    return isNumber(res) ? res : undefined;
};
// 返回一个随机的整数。
const integer = function (min, max) {
    min = numberGate(min);
    if (!isNumber(min)) min = -9007199254740992;
    max = numberGate(max);
    if (!isNumber(max)) max = 9007199254740992;
    return random(min, max, false);
};
const natural = function (min, max) {
    return Math.abs(integer(min, max));
};

const float = function (min, max, dmin, dmax) {
    min = numberGate(min);
    if (!isNumber(min)) min = -9007199254740992;
    max = numberGate(max);
    if (!isNumber(max)) max = 9007199254740992;
    dmin = numberGate(dmin) || 1;
    dmax = numberGate(dmax) || 17;
    if (dmin < 1) dmin = 1;
    if (dmax > 17) dmax = 17;
    const dcount = random(dmin, dmax, false);
    return parseFloat(random(min, max, true).toFixed(dcount));
};
export { integer, isNumber, random, natural, integer as int, float };
