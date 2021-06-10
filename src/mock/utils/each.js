export function each(obj, iterator, context) {
    // each
    var i, key;
    if (type(obj) === "number") {
        //表示重复几次
        [...Array(obj).keys()].forEach((index) => iterator(index, index));
    } else if (obj.length === +obj.length) {
        for (i = 0; i < obj.length; i++) {
            if (iterator.call(context, obj[i], i, obj) === false) break;
        }
    } else {
        for (key in obj) {
            if (iterator.call(context, obj[key], key, obj) === false) break;
        }
    }
}
