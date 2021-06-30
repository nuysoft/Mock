/**
 * Check if `obj` is a URLSearchParams object
 * ref: https://github.com/node-fetch/node-fetch/issues/296#issuecomment-307598143
 *
 * @param  {*} obj
 * @return {boolean}
 */
export const isURLSearchParameters = (object) => {
    return (
        typeof object === 'object' &&
        typeof object.append === 'function' &&
        typeof object.delete === 'function' &&
        typeof object.get === 'function' &&
        typeof object.getAll === 'function' &&
        typeof object.has === 'function' &&
        typeof object.set === 'function' &&
        typeof object.sort === 'function' &&
        object[Symbol.toStringTag] === 'URLSearchParams' // 获取类名的方式哦
    );
};
