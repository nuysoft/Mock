/*
    ## Helpers
*/

import { natural } from "./basic/number.js";
import { shuffle as _shuffle, capitalize } from "lodash-es";
const upper = function (str) {
    return (str + "").toUpperCase();
};
const lower = function (str) {
    return (str + "").toLowerCase();
};
// 从数组中随机选取一个元素，并返回。
const pick = function (...args) {
    let [arr, min, max] = args;
    // pick( item1, item2 ... )
    if (!(arr instanceof Array)) {
        arr = args;
        min = 1;
        max = 1;
    } else {
        // pick( [ item1, item2 ... ] )
        if (min === undefined) min = 1;
        // pick( [ item1, item2 ... ], count )
        if (max === undefined) max = min;
    }
    if (min === 1 && max === 1) return arr[natural(0, arr.length - 1)];
    // pick( [ item1, item2 ... ], min, max )
    return this.shuffle(arr, min, max);
};
/*
    打乱数组中元素的顺序，并返回。
    Given an array, scramble the order and return it.

    其他的实现思路：
        // https://code.google.com/p/jslibs/wiki/JavascriptTips
        result = result.sort(function() {
            return Math.random() - 0.5
        })
*/
const shuffle = function (arr, min, max) {
    let result = _shuffle(arr);
    switch (arguments.length) {
        case 0:
        case 1:
            return result;
        case 2:
            max = min;
        /* falls through */
        case 3:
            min = parseInt(min, 10);
            max = parseInt(max, 10);
            return result.slice(0, natural(min, max));
    }
};
/*
	    * Random.order(item, item)
	    * Random.order([item, item ...])

	    顺序获取数组中的元素

	    [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)

	    不支持单独调用！
	*/
const order = function order(array) {
    order.cache = order.cache || {};

    if (arguments.length > 1) array = [].slice.call(arguments, 0);

    // options.context.path/templatePath
    var options = order.options;
    var templatePath = options.context.templatePath.join(".");

    var cache = (order.cache[templatePath] = order.cache[templatePath] || {
        index: 0,
        array: array,
    });

    return cache.array[cache.index++ % cache.array.length];
};
export { capitalize, upper, lower, pick, shuffle, order };
