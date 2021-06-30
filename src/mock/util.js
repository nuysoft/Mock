/*
    ## Utilities
*/
export { type } from './utils/type.js';
export { extend } from './utils/extend.js';
export { isObjectOrArray, isNumeric, isString, isObject, isArray, isRegExp, isFunction } from './utils/type.js';
export { each } from './utils/each.js';
export { heredoc } from './utils/heredoc.js';
export function keys(obj) {
    return Object.keys(obj);
}
export function values(obj) {
    return Object.values(obj);
}
export function noop() {}
