/*
    ## Handler

    处理数据模板。

    * Handler.gen( template, name?, context? )

        入口方法。

    * Data Template Definition, DTD

        处理数据模板定义。

        * Handler.array( options )
        * Handler.object( options )
        * Handler.number( options )
        * Handler.boolean( options )
        * Handler.string( options )
        * Handler.function( options )
        * Handler.regexp( options )

        处理路径（相对和绝对）。

        * Handler.getValueByKeyPath( key, options )

    * Data Placeholder Definition, DPD

        处理数据占位符定义

        * Handler.placeholder( placeholder, context, templateContext, options )

*/

import { extend } from './util.js';
import * as Random from './random/index.js';
import { gen } from './handle/gen.js';
/*
    template        属性值（即数据模板）
    name            属性名
    context         数据上下文，生成后的数据
    templateContext 模板上下文，

    Handle.gen(template, name, options)
    context
        currentContext, templateCurrentContext,
        path, templatePath
        root, templateRoot
*/
const Handler = {
    gen,
    extend,
};

import { array, object, number, boolean, string as _string, function as _function, regexp } from './handle/index.js';
Handler.extend({
    array,
    object,
    number,
    boolean,
    string: _string,
    function: _function,
    regexp,
});

import { placeholder } from './handle/placeholder.js';
import { getValueByKeyPath, normalizePath, splitPathToArray } from './handle/path.js';
Handler.extend({
    _all: function () {
        return Object.keys(Random).reduce((col, key) => {
            col[key.toLowerCase()] = key;
            return col;
        }, {});
    },
    // 处理占位符，转换为最终值
    placeholder,
    getValueByKeyPath,
    normalizePath,
    splitPathToArray,
});

export default Handler;
