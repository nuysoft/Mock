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

var Constant = require('./constant')
var Util = require('./util')
var Parser = require('./parser')
var Random = require('./random/')
var RE = require('./regexp')

var Handler = {
    extend: Util.extend
}

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
Handler.gen = function(template, name, context) {
    /* jshint -W041 */
    name = name == undefined ? '' : (name + '')

    context = context || {}
    context = {
            // 当前访问路径，只有属性名，不包括生成规则
            path: context.path || [Constant.GUID],
            templatePath: context.templatePath || [Constant.GUID++],
            // 最终属性值的上下文
            currentContext: context.currentContext,
            // 属性值模板的上下文
            templateCurrentContext: context.templateCurrentContext || template,
            // 最终值的根
            root: context.root || context.currentContext,
            // 模板的根
            templateRoot: context.templateRoot || context.templateCurrentContext || template
        }
        // console.log('path:', context.path.join('.'), template)

    var rule = Parser.parse(name)
    var type = Util.type(template)
    var data

    if (Handler[type]) {
        data = Handler[type]({
            // 属性值类型
            type: type,
            // 属性值模板
            template: template,
            // 属性名 + 生成规则
            name: name,
            // 属性名
            parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

            // 解析后的生成规则
            rule: rule,
            // 相关上下文
            context: context
        })

        if (!context.root) context.root = data
        return data
    }

    return template
}

Handler.extend({
    array: function(options) {
        var result = [],
            i, ii;

        // 'name|1': []
        // 'name|count': []
        // 'name|min-max': []
        if (options.template.length === 0) return result

        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
        if (!options.rule.parameters) {
            for (i = 0; i < options.template.length; i++) {
                options.context.path.push(i)
                options.context.templatePath.push(i)
                result.push(
                    Handler.gen(options.template[i], i, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            }
        } else {
            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
            if (options.rule.min === 1 && options.rule.max === undefined) {
                // fix #17
                options.context.path.push(options.name)
                options.context.templatePath.push(options.name)
                result = Random.pick(
                    Handler.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            } else {
                // 'data|+1': [{}, {}]
                if (options.rule.parameters[2]) {
                    options.template.__order_index = options.template.__order_index || 0

                    options.context.path.push(options.name)
                    options.context.templatePath.push(options.name)
                    result = Handler.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })[
                        options.template.__order_index % options.template.length
                    ]

                    options.template.__order_index += +options.rule.parameters[2]

                    options.context.path.pop()
                    options.context.templatePath.pop()

                } else {
                    // 'data|1-10': [{}]
                    for (i = 0; i < options.rule.count; i++) {
                        // 'data|1-10': [{}, {}]
                        for (ii = 0; ii < options.template.length; ii++) {
                            options.context.path.push(result.length)
                            options.context.templatePath.push(ii)
                            result.push(
                                Handler.gen(options.template[ii], result.length, {
                                    path: options.context.path,
                                    templatePath: options.context.templatePath,
                                    currentContext: result,
                                    templateCurrentContext: options.template,
                                    root: options.context.root || result,
                                    templateRoot: options.context.templateRoot || options.template
                                })
                            )
                            options.context.path.pop()
                            options.context.templatePath.pop()
                        }
                    }
                }
            }
        }
        return result
    },
    object: function(options) {
        var result = {},
            keys, fnKeys, key, parsedKey, inc, i;

        // 'obj|min-max': {}
        /* jshint -W041 */
        if (options.rule.min != undefined) {
            keys = Util.keys(options.template)
            keys = Random.shuffle(keys)
            keys = keys.slice(0, options.rule.count)
            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = Handler.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
            }

        } else {
            // 'obj': {}
            keys = []
            fnKeys = [] // #25 改变了非函数属性的顺序，查找起来不方便
            for (key in options.template) {
                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
            }
            keys = keys.concat(fnKeys)

            /*
                会改变非函数属性的顺序
                keys = Util.keys(options.template)
                keys.sort(function(a, b) {
                    var afn = typeof options.template[a] === 'function'
                    var bfn = typeof options.template[b] === 'function'
                    if (afn === bfn) return 0
                    if (afn && !bfn) return 1
                    if (!afn && bfn) return -1
                })
            */

            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = Handler.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
                    // 'id|+1': 1
                inc = key.match(Constant.RE_KEY)
                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
                    options.template[key] += parseInt(inc[2], 10)
                }
            }
        }
        return result
    },
    number: function(options) {
        var result, parts;
        if (options.rule.decimal) { // float
            options.template += ''
            parts = options.template.split('.')
                // 'float1|.1-10': 10,
                // 'float2|1-100.1-10': 1,
                // 'float3|999.1-10': 1,
                // 'float4|.3-10': 123.123,
            parts[0] = options.rule.range ? options.rule.count : parts[0]
            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
            while (parts[1].length < options.rule.dcount) {
                parts[1] += (
                    // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                    (parts[1].length < options.rule.dcount - 1) ? Random.character('number') : Random.character('123456789')
                )
            }
            result = parseFloat(parts.join('.'), 10)
        } else { // integer
            // 'grade1|1-100': 1,
            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
        }
        return result
    },
    boolean: function(options) {
        var result;
        // 'prop|multiple': false, 当前值是相反值的概率倍数
        // 'prop|probability-probability': false, 当前值与相反值的概率
        result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template
        return result
    },
    string: function(options) {
        var result = '',
            i, placeholders, ph, phed;
        if (options.template.length) {

            //  'foo': '★',
            /* jshint -W041 */
            if (options.rule.count == undefined) {
                result += options.template
            }

            // 'star|1-5': '★',
            for (i = 0; i < options.rule.count; i++) {
                result += options.template
            }
            // 'email|1-10': '@EMAIL, ',
            placeholders = result.match(Constant.RE_PLACEHOLDER) || [] // A-Z_0-9 > \w_
            for (i = 0; i < placeholders.length; i++) {
                ph = placeholders[i]

                // 遇到转义斜杠，不需要解析占位符
                if (/^\\/.test(ph)) {
                    placeholders.splice(i--, 1)
                    continue
                }

                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)

                // 只有一个占位符，并且没有其他字符
                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) { // 
                    result = phed
                    break

                    if (Util.isNumeric(phed)) {
                        result = parseFloat(phed, 10)
                        break
                    }
                    if (/^(true|false)$/.test(phed)) {
                        result = phed === 'true' ? true :
                            phed === 'false' ? false :
                            phed // 已经是布尔值
                        break
                    }
                }
                result = result.replace(ph, phed)
            }

        } else {
            // 'ASCII|1-10': '',
            // 'ASCII': '',
            result = options.rule.range ? Random.string(options.rule.count) : options.template
        }
        return result
    },
    'function': function(options) {
        // ( context, options )
        return options.template.call(options.context.currentContext, options)
    },
    'regexp': function(options) {
        // regexp.source
        var source = options.template.source

        // 'name|1-5': /regexp/,
        for (var i = 0; i < options.rule.count; i++) {
            source += options.template.source
        }

        return RE.Handler.gen(
            RE.Parser.parse(
                source
            )
        )
    }
})

Handler.extend({
    _all: function() {
        var re = {};
        for (var key in Random) re[key.toLowerCase()] = key
        return re
    },
    // 处理占位符，转换为最终值
    placeholder: function(placeholder, obj, templateContext, options) {
        // console.log(options.context.path)
        // 1 key, 2 params
        Constant.RE_PLACEHOLDER.exec('')
        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this._all()[lkey],
            params = parts && parts[2] || ''
        var pathParts = this.splitPathToArray(key)

        // 解析占位符的参数
        try {
            // 1. 尝试保持参数的类型
            /*
                #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
                [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
                应该属于 Window Firefox 30.0 的 BUG
            */
            /* jshint -W061 */
            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
        } catch (error) {
            // 2. 如果失败，只能解析为字符串
            // console.error(error)
            // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
            // else throw error
            params = parts[2].split(/,\s*/)
        }

        // 占位符优先引用数据模板中的属性
        if (obj && (key in obj)) return obj[key]

        // @index @key
        // if (Constant.RE_INDEX.test(key)) return +options.name
        // if (Constant.RE_KEY.test(key)) return options.name

        // 绝对路径 or 相对路径
        if (
            key.charAt(0) === '/' ||
            pathParts.length > 1
        ) return this.getValueByKeyPath(key, options)

        // 递归引用数据模板中的属性
        if (templateContext &&
            (typeof templateContext === 'object') &&
            (key in templateContext) &&
            (placeholder !== templateContext[key]) // fix #15 避免自己依赖自己
        ) {
            // 先计算被引用的属性值
            templateContext[key] = Handler.gen(templateContext[key], key, {
                currentContext: obj,
                templateCurrentContext: templateContext
            })
            return templateContext[key]
        }

        // 如果未找到，则原样返回
        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

        // 递归解析参数中的占位符
        for (var i = 0; i < params.length; i++) {
            Constant.RE_PLACEHOLDER.exec('')
            if (Constant.RE_PLACEHOLDER.test(params[i])) {
                params[i] = Handler.placeholder(params[i], obj, templateContext, options)
            }
        }

        var handle = Random[key] || Random[lkey] || Random[okey]
        switch (Util.type(handle)) {
            case 'array':
                // 自动从数组中取一个，例如 @areas
                return Random.pick(handle)
            case 'function':
                // 执行占位符方法（大多数情况）
                handle.options = options
                var re = handle.apply(Random, params)
                if (re === undefined) re = '' // 因为是在字符串中，所以默认为空字符串。
                delete handle.options
                return re
        }
    },
    getValueByKeyPath: function(key, options) {
        var originalKey = key
        var keyPathParts = this.splitPathToArray(key)
        var absolutePathParts = []

        // 绝对路径
        if (key.charAt(0) === '/') {
            absolutePathParts = [options.context.path[0]].concat(
                this.normalizePath(keyPathParts)
            )
        } else {
            // 相对路径
            if (keyPathParts.length > 1) {
                absolutePathParts = options.context.path.slice(0)
                absolutePathParts.pop()
                absolutePathParts = this.normalizePath(
                    absolutePathParts.concat(keyPathParts)
                )

            }
        }

        key = keyPathParts[keyPathParts.length - 1]
        var currentContext = options.context.root
        var templateCurrentContext = options.context.templateRoot
        for (var i = 1; i < absolutePathParts.length - 1; i++) {
            currentContext = currentContext[absolutePathParts[i]]
            templateCurrentContext = templateCurrentContext[absolutePathParts[i]]
        }
        // 引用的值已经计算好
        if (currentContext && (key in currentContext)) return currentContext[key]

        // 尚未计算，递归引用数据模板中的属性
        if (templateCurrentContext &&
            (typeof templateCurrentContext === 'object') &&
            (key in templateCurrentContext) &&
            (originalKey !== templateCurrentContext[key]) // fix #15 避免自己依赖自己
        ) {
            // 先计算被引用的属性值
            templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
                currentContext: currentContext,
                templateCurrentContext: templateCurrentContext
            })
            return templateCurrentContext[key]
        }
    },
    // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
    normalizePath: function(pathParts) {
        var newPathParts = []
        for (var i = 0; i < pathParts.length; i++) {
            switch (pathParts[i]) {
                case '..':
                    newPathParts.pop()
                    break
                case '.':
                    break
                default:
                    newPathParts.push(pathParts[i])
            }
        }
        return newPathParts
    },
    splitPathToArray: function(path) {
        var parts = path.split(/\/+/);
        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
        if (!parts[0]) parts = parts.slice(1)
        return parts;
    }
})

module.exports = Handler