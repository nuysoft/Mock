import { random } from 'game-random';
const boolean = function (min, max, cur = false) {
    // ! cur:boolean 是划分概率的一个启动符号
    // if (cur) {
    //     min = isNumber(min) ? parseInt(min, 10) : 1;
    //     max = isNumber(max) ? parseInt(max, 10) : 1;
    //     return Math.random() > (1.0 / (min + max)) * min ? !cur : cur;
    // }
    if (cur) {
        return random(0, min + max) > min ? !cur : !!cur;
    }
    return random(10, -10) > 0;
};
export { boolean, boolean as bool };
