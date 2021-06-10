import { isObject, isArray } from "./type.js";
export function extend() {
    var target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        options,
        name,
        src,
        copy,
        clone;

    if (length === 1) {
        target = this;
        i = 0;
    }

    for (; i < length; i++) {
        options = arguments[i];
        if (!options) continue;

        for (name in options) {
            src = target[name];
            copy = options[name];

            if (target === copy) continue;
            if (copy === undefined) continue;

            if (isArray(copy) || isObject(copy)) {
                if (isArray(copy)) clone = src && isArray(src) ? src : [];
                if (isObject(copy)) clone = src && isObject(src) ? src : {};

                target[name] = extend(clone, copy);
            } else {
                target[name] = copy;
            }
        }
    }

    return target;
}
