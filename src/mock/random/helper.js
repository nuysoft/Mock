/*
    ## Helpers
*/
import { random, sample, sampleSize } from 'game-random';
import { shuffle as _shuffle, capitalize as _capitalize } from 'lodash-es';
const capitalize = (info = 'undefined') => _capitalize(info);
const upper = function (str) {
    return (str + '').toUpperCase();
};

const lower = function (str) {
    return (str + '').toLowerCase();
};

// 从数组中随机选取一个元素，并返回。
// 更改 pick 函数 , 函数不进行重载
const pick = function (arr, ...args) {
    let min;
    let max;
    let count;
    if (arr === undefined) return undefined;
    switch (args.length) {
        case 0:
            return sample(arr);
        case 1:
            [count] = args;
            return sampleSize(arr, count);
        case 2:
            [min, max] = args;
            return sampleSize(arr, random(min, max));
        default:
            return sample([arr, ...args]);
    }
};
/*
    打乱数组中元素的顺序，并返回。
    Given an array, scramble the order and return it.
*/
const shuffle = function (arr, min, max) {
    const result = _shuffle(arr);
    switch (arguments.length) {
        case 0:
        case 1:
            return result;
        case 2:
            return result.slice(0, min);
        /* falls through */
        case 3:
            return result.slice(min, max);
    }
};
/*
        * Random.order(item, item)
        * Random.order([item, item ...])

        顺序获取数组中的元素

        [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)

        不支持单独调用！
    */
const Cache = {};
const order = function (...array) {
    // 重载 (item1,item2,item3) 和 ([item1,item2,item3])
    if (array.length === 1) array = array[0];

    // options.context.path/templatePath
    const options = order.options;
    const templatePath = options.context.templatePath.join('.');

    const cache = (Cache[templatePath] = Cache[templatePath] || {
        index: 0,
        array: array,
    });

    return cache.array[cache.index++ % cache.array.length];
};
export { capitalize, upper, lower, pick, shuffle, order };
