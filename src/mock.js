var Random = require('./random'),
    Util = require('./util');

var Mock = module.exports = {
    _mocked: {}
};

// BEGIN(BROWSER)
/*
    mock data
*/

/*
    rkey
        name|+inc
        name|repeat
        name|min-max
        name|min-max.dmin-dmax
        name|int.dmin-dmax

        1 name, 2 inc, 3 range, 4 decimal

    rplaceholder
        placeholder(*)

    [正则查看工具](http://www.regexper.com/)

    #26 生成规则 支持 负数，例如 number|-100-100
*/
var rkey = /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
    rrange = /([\+\-]?\d+)-?([\+\-]?\d+)?/,
    rplaceholder = /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g; // (^(?:.|\r|\n)*?)

Mock.extend = Util.extend

/*
    ## Mock

    ### Mock.mock( rurl?, rtype?, template|function() )

    根据数据模板生成模拟数据。

    * Mock.mock( template )
    * Mock.mock( rurl, template )
    * Mock.mock( rurl, function() )
    * Mock.mock( rurl, rtype, template )
    * Mock.mock( rurl, rtype, function() )
*/
Mock.mock = function(rurl, rtype, template) {
    // Mock.mock(template)
    if (arguments.length === 1) {
        return Handle.gen(rurl)
    }
    // Mock.mock(rurl, template)
    if (arguments.length === 2) {
        template = rtype
        rtype = undefined
    }
    Mock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
        template: template
    }
    return Mock
}

var Handle = {
    extend: Util.extend
}

Handle.rule = function(name) {
    name = (name || '') + ''

    var parameters = (name || '').match(rkey),

        range = parameters && parameters[3] && parameters[3].match(rrange),
        min = range && parseInt(range[1], 10), // || 1
        max = range && parseInt(range[2], 10), // || 1
        // repeat || min-max || 1
        count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1,

        decimal = parameters && parameters[4] && parameters[4].match(rrange),
        dmin = decimal && parseInt(decimal[1], 10), // || 0,
        dmax = decimal && parseInt(decimal[2], 10), // || 0,
        // int || dmin-dmax || 0
        dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : 0,

        point = parameters && parameters[4];

    return {
        parameters: parameters,
        range: range,
        min: min,
        max: max,
        count: count,
        decimal: decimal,
        dmin: dmin,
        dmax: dmax,
        dcount: dcount,
        point: point
    }
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
Handle.gen = function(template, name, context) {
    name = name = (name || '') + ''

    context = context || {}
    context = {
        // 当前访问路径，只有属性名，不包括生成规则
        path: context.path || [],
        templatePath: context.templatePath || [],
        // 最终属性值的上下文
        currentContext: context.currentContext,
        // 属性值模板的上下文
        templateCurrentContext: context.templateCurrentContext || template,
        root: context.root,
        templateRoot: context.templateRoot
    }
    // console.log('path:', path.join('.'), template)

    var rule = Handle.rule(name)
    var type = Util.type(template)

    if (Handle[type]) {
        return Handle[type]({
            // 属性值类型
            type: type,
            // 属性值模板
            template: template,
            // 属性名 + 生成规则
            name: name,
            // 属性名
            parsedName: name ? name.replace(rkey, '$1') : name,

            // 解析后的生成规则
            rule: rule,
            // 相关上下文
            context: context
        })
    }
    return template
}

Handle.extend({
    array: function(options) {
        var result = [],
            i, j;
        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
        if (!options.rule.parameters) {
            for (i = 0; i < options.template.length; i++) {
                options.context.path.push(i)
                result.push(
                    Handle.gen(options.template[i], i, {
                        currentContext: result,
                        templateCurrentContext: options.template,
                        path: options.context.path
                    })
                )
                options.context.path.pop()
            }
        } else {
            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
            if (options.rule.count === 1 && options.template.length > 1) {
                // fix #17
                options.context.path.push(options.name)
                result = Random.pick(Handle.gen(options.template, undefined, {
                    currentContext: result,
                    templateCurrentContext: options.template,
                    path: options.context.path
                }))
                options.context.path.pop()
            } else {
                // 'data|1-10': [{}]
                for (i = 0; i < options.rule.count; i++) {
                    // 'data|1-10': [{}, {}]
                    j = 0
                    do {
                        // 'data|1-10': []
                        result.push(Handle.gen(options.template[j++]))
                    } while (j < options.template.length)
                }
            }
        }
        return result
    },
    object: function(options) {
        var result = {},
            keys, fnKeys, key, parsedKey, inc, i;

        // 'obj|min-max': {}
        if (options.rule.min) {
            keys = Util.keys(options.template)
            keys = Random.shuffle(keys)
            keys = keys.slice(0, options.rule.count)
            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(rkey, '$1')
                options.context.path.push(parsedKey)
                result[parsedKey] = Handle.gen(options.template[key], key, {
                    currentContext: result,
                    templateCurrentContext: options.template,
                    path: options.context.path
                })
                options.context.path.pop()
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
                parsedKey = key.replace(rkey, '$1')
                options.context.path.push(parsedKey)
                result[parsedKey] = Handle.gen(options.template[key], key, {
                    currentContext: result,
                    templateCurrentContext: options.template,
                    path: options.context.path
                })
                options.context.path.pop()
                // 'id|+1': 1
                inc = key.match(rkey)
                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
                    options.template[key] += parseInt(inc[2], 10)
                }
            }
        }
        return result
    },
    number: function(options) {
        var result, parts, i;
        if (options.rule.point) { // float
            options.template += ''
            parts = options.template.split('.')
            // 'float1|.1-10': 10,
            // 'float2|1-100.1-10': 1,
            // 'float3|999.1-10': 1,
            // 'float4|.3-10': 123.123,
            parts[0] = options.rule.range ? options.rule.count : parts[0]
            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
            for (i = 0; parts[1].length < options.rule.dcount; i++) {
                parts[1] += Random.character('number')
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
            // 'star|1-5': '★',
            for (i = 0; i < options.rule.count; i++) {
                result += options.template
            }
            // 'email|1-10': '@EMAIL, ',
            placeholders = result.match(rplaceholder) || [] // A-Z_0-9 > \w_
            for (i = 0; i < placeholders.length; i++) {
                ph = placeholders[i]
                // TODO 只有转义斜杠是偶数时，才不需要解析占位符？
                if (/^\\/.test(ph)) {
                    placeholders.splice(i--, 1)
                    continue
                }
                phed = Handle.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext)
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
        return options.template.call(options.context.currentContext)
    }
})

Handle.extend({
    _all: function() {
        var re = {};
        for (var key in Random) re[key.toLowerCase()] = key
        return re
    },
    placeholder: function(placeholder, obj, templateContext) {
        // 1 key, 2 params
        rplaceholder.exec('')
        var parts = rplaceholder.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this._all()[lkey],
            params = parts && parts[2] || ''

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

        if (templateContext &&
            (typeof templateContext === 'object') &&
            (key in templateContext) &&
            (placeholder !== templateContext[key]) // fix #15 避免自己依赖自己
        ) {
            templateContext[key] = Handle.gen(templateContext[key], key, {
                currentContext: obj,
                templateCurrentContext: templateContext
            })
            return templateContext[key]
        }

        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

        for (var i = 0; i < params.length; i++) {
            rplaceholder.exec('')
            if (rplaceholder.test(params[i])) {
                params[i] = Handle.placeholder(params[i], obj)
            }
        }

        var handle = Random[key] || Random[lkey] || Random[okey]
        switch (Util.type(handle)) {
            case 'array':
                return Random.pick(handle)
            case 'function':
                var re = handle.apply(Random, params)
                if (re === undefined) re = ''
                return re
        }
    }
})
// END(BROWSER)