import { gen } from './gen';
function getValueByKeyPath(key, options) {
    const originalKey = key;
    const keyPathParts = splitPathToArray(key);
    let absolutePathParts = [];

    // 绝对路径
    if (key.charAt(0) === '/') {
        absolutePathParts = [options.context.path[0]].concat(normalizePath(keyPathParts));
    } else {
        // 相对路径
        if (keyPathParts.length > 1) {
            absolutePathParts = options.context.path.slice(0);
            absolutePathParts.pop();
            absolutePathParts = normalizePath(absolutePathParts.concat(keyPathParts));
        }
    }

    try {
        key = keyPathParts[keyPathParts.length - 1];
        let currentContext = options.context.root;
        let templateCurrentContext = options.context.templateRoot;
        for (let i = 1; i < absolutePathParts.length - 1; i++) {
            currentContext = currentContext[absolutePathParts[i]];
            templateCurrentContext = templateCurrentContext[absolutePathParts[i]];
        }
        // 引用的值已经计算好
        if (currentContext && key in currentContext) return currentContext[key];

        // 尚未计算，递归引用数据模板中的属性
        if (
            templateCurrentContext &&
            typeof templateCurrentContext === 'object' &&
            key in templateCurrentContext &&
            originalKey !== templateCurrentContext[key] // fix #15 避免自己依赖自己
        ) {
            // 先计算被引用的属性值
            templateCurrentContext[key] = gen(templateCurrentContext[key], key, {
                currentContext: currentContext,
                templateCurrentContext: templateCurrentContext,
            });
            return templateCurrentContext[key];
        }
    } catch (err) {
        console.log(err);
    }

    return '@' + keyPathParts.join('/');
}
// https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
function normalizePath(pathParts) {
    const newPathParts = [];
    for (let i = 0; i < pathParts.length; i++) {
        switch (pathParts[i]) {
            case '..':
                newPathParts.pop();
                break;
            case '.':
                break;
            default:
                newPathParts.push(pathParts[i]);
        }
    }
    return newPathParts;
}
function splitPathToArray(path) {
    let parts = path.split(/\/+/);
    if (!parts[parts.length - 1]) parts = parts.slice(0, -1);
    if (!parts[0]) parts = parts.slice(1);
    return parts;
}
export { getValueByKeyPath, normalizePath, splitPathToArray };
