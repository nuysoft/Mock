/*
    ## Utilities
*/
export { type } from './utils/type';
export { extend } from './utils/extend';
export { isObjectOrArray, isNumeric, isString, isObject, isArray, isRegExp, isFunction } from './utils/type';
export { each } from './utils/each';
export { heredoc } from './utils/heredoc';
export function keys(obj) {
    return Object.keys(obj);
}
export function values(obj) {
    return Object.values(obj);
}
export function noop() {}
