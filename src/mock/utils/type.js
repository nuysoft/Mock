// 使用 lodash 提供的方式
import { isObject, isArray } from 'lodash-es';
export function type(obj) {
    return obj === null || obj === undefined
        ? String(obj)
        : Object.prototype.toString
              .call(obj)
              .match(/\[object (\w+)\]/)[1]
              .toLowerCase();
}

export function isObjectOrArray(value) {
    return isObject(value) || isArray(value);
}

export function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
export { isString, isObject, isArray, isRegExp, isFunction } from 'lodash-es';
