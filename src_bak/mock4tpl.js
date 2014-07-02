var Mock = require('./mock'),
    Random = require('./random'),
    Util = require('./util'),
    Handlebars = require('handlebars');

// BEGIN(BROWSER)

/*
    Mock4Tpl - 基于客户端模板生成模拟数据

    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
(function(undefined) {
    var Mock4Tpl = {
        version: '0.0.1'
    }

    if (!this.Mock) module.exports = Mock4Tpl

    Mock.tpl = function(input, options, helpers, partials) {
        return Mock4Tpl.mock(input, options, helpers, partials)
    }
    Mock.parse = function(input) {
        return Handlebars.parse(input)
    }

    /*
        Mock4Tpl.mock(input)
        Mock4Tpl.mock(input, options)
        Mock4Tpl.mock(input, options, helpers)
        Mock4Tpl.mock(input, options, helpers, partials)
    */
    Mock4Tpl.mock = function(input, options, helpers, partials) {
        helpers = helpers ? Util.extend({}, helpers, Handlebars.helpers) :
            Handlebars.helpers
        partials = partials ? Util.extend({}, partials, Handlebars.partials) :
            Handlebars.partials
        return Handle.gen(input, null, options, helpers, partials)
    }

    var Handle = {
        debug: Mock4Tpl.debug || false,
        extend: Util.extend
    }

    /*
        Handle.gen(input, context, options, helpers, partials)
        Handle.gen(ast, context, options, helpers, partials)
        Handle.gen(node, context, options, helpers, partials)

        input      HTML 模板
        ast        HTML 模板
        node
        context
        options
        helpers
        partials

        ## 构造路径
        * 对于对象 
            {
                a: {
                    b: {
                        c: d
                    }
                }
            }
            → 
            [ a, b, c, d]
        * 对于数组
            {
                a: [{
                        b: [{
                                c: d
                            }
                        ]
                    }
                ]
            }
            ->
            [ a, [], b, [], c ]

     */
    Handle.gen = function(node, context, options, helpers, partials) {
        if (Util.isString(node)) {
            var ast = Handlebars.parse(node)
            options = Handle.parseOptions(node, options)
            var data = Handle.gen(ast, context, options, helpers, partials)
            return data
        }

        context = context || [{}]
        options = options || {}

        if (this[node.type] === Util.noop) return

        options.__path = options.__path || []

        if (Mock4Tpl.debug || Handle.debug) {
            console.log()
            console.group('[' + node.type + ']', JSON.stringify(node))
            // console.log('[context]', context.length, JSON.stringify(context))
            console.log('[options]', options.__path.length, JSON.stringify(options))
        }

        var preLength = options.__path.length
        this[node.type](node, context, options, helpers, partials)
        options.__path.splice(preLength)

        if (Mock4Tpl.debug || Handle.debug) {
            // console.log('[context]', context.length, JSON.stringify(context))
            console.groupEnd()
        }

        return context[context.length - 1]
    }

    Handle.parseOptions = function(input, options) {
        var rComment = /<!--\s*\n*Mock\s*\n*([\w\W]+?)\s*\n*-->/g;
        var comments = input.match(rComment),
            ret = {}, i, ma, option;
        for (i = 0; comments && i < comments.length; i++) {
            rComment.lastIndex = 0
            ma = rComment.exec(comments[i])
            if (ma) {
                /*jslint evil: true */
                option = new Function('return ' + ma[1])
                option = option()
                Util.extend(ret, option)
            }
        }
        return Util.extend(ret, options)
    }

    /*
        name    字符串，属性名
        options 字符串或对象，数据模板
        context 父节点，任意值
        def     默认值
    */
    Handle.val = function(name, options, context, def) {
        if (name !== options.__path[options.__path.length - 1]) throw new Error(name + '!==' + options.__path)
        if (Mock4Tpl.debug || Handle.debug) console.log('[options]', name, options.__path);
        if (def !== undefined) def = Mock.mock(def)
        if (options) {
            var mocked = Mock.mock(options)
            if (Util.isString(mocked)) return mocked
            if (name in mocked) {
                return mocked[name]
            }
        }
        if (Util.isArray(context[0])) return {}
        return def !== undefined ? def : (name) || Random.word()
    }


    /*
        AST
    */

    Handle.program = function(node, context, options, helpers, partials) {
        for (var i = 0; i < node.statements.length; i++) {
            this.gen(node.statements[i], context, options, helpers, partials)
        }
        // TODO node.inverse
    }

    Handle.mustache = function(node, context, options, helpers, partials) { // string id params
        var i,
            currentContext = context[0],
            contextLength = context.length;

        if (Util.type(currentContext) === 'array') {
            currentContext.push({})
            currentContext = currentContext[currentContext.length - 1]
            context.unshift(currentContext)
        }

        // "isHelper": 1
        // 为何要明确的 isHelper？因为 eligibleHelper 实在不可靠！
        if (node.isHelper || helpers && helpers[node.id.string]) {
            // node.params
            if (node.params.length === 0) {
                // TODO test_helper_this_with_register_and_holder
            } else {
                for (i = 0; i < node.params.length; i++) {
                    this.gen(node.params[i], context, options, helpers, partials)
                }
            }
            // node.hash
            if (node.hash) this.gen(node.hash, context, options, helpers, partials)
        } else {
            // node.id
            this.gen(node.id, context, options, helpers, partials)
            /*
                node.id.type === 'DATA'
                eg @index，放到 DATA 中处理 TODO 
            */
        }
        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }

    Handle.block = function(node, context, options, helpers, partials) { // mustache program inverse
        var parts = node.mustache.id.parts,
            i, len, cur, val, type,
            currentContext = context[0],
            contextLength = context.length;

        if (node.inverse) {} // TODO

        /*
        ## 关于自定义 block
        {{#block}}{{...}}{{/block}}
        | helper | type     | 模板引擎的行为                              | 模拟数据      | 
        | ------ | -------- | ----------------------------------------- | ------------ |
        | Y      | function | 由 helper 负责返回最后的结果                 | 不处理       |
        | N      | array    | 遍历该数组，渲染包含的 statements            | 默认为对象    |
        | N      | object   | 把该对象作为新 context，渲染包含的 statements | 默认为对象    |
        | N      | boolean  | 用当前 context 渲染包含的 statements         | 默认为对象    |

        ### 为什么默认为对象
        无论默认为对象或数组，当真实数据的类型与默认数据不匹配时，模拟数据的渲染结果都会与预期不符合。
        而把模拟数据的默认值设置为对象，则可以在渲染 object、boolean 时大致符合预期。
        更直观（易读）的做法是
        1. 明确指定数据的类型：数组 []、对象 {}、布尔 true/false。
        2. 遍历数组时，用 each helper。
        3. 为数据属性设置 Mock 参数，例如 `arr|5-10`: []。
        然而，目前开发过程中遇到的更多的是因此数组，这不是一个好习惯，因为在理解上会造成模棱两可的印象。
            我希望 Mock 是一个可用，并且好用的工具，除了这两个原则之外，任何固有的原则都可以放弃，
            因此如果有任何感受和建议，请反馈给我，如果可以贡献代码就更好了。
        
        ### 另外，为什么称为上下文 context，而不是作用域 scope 呢？
        在 Mock4Tpl 的模拟过程中，以及模板引擎的渲染过程中，只是在某个对象或数组上设置或设置属性，是上下文的概念，根本没有“作用域”的概念。
            虽然从理解的角度，这两个过程与作用域极为“相似”，但是如果描述成“相似”，其实是对本质和概念的误导。
            但是。。。好吧，确实“作用域”要更形象，更易于被不了解内部原理的人所接受。
     */

        // block.mustache
        if (node.mustache.isHelper ||
            helpers && helpers[node.mustache.id.string]) {
            type = parts[0] // helper: each if unless with log
            // 指定 Handle 为上下文是为了使用 Handle 的方法
            val = (Helpers[type] || Helpers.custom).apply(this, arguments)
            currentContext = context[0]
        } else {
            for (i = 0; i < parts.length; i++) {
                options.__path.push(parts[i])

                cur = parts[i]

                val = this.val(cur, options, context, {})
                currentContext[cur] = Util.isArray(val) && [] || val

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }

        // block.program
        if (node.program) {
            if (Util.type(currentContext) === 'array') {
                len = val.length || Random.integer(3, 7)
                // Handle.program() 可以自己解析和生成数据，但是不知道该重复几次，所以这里需要循环调用
                for (i = 0; i < len; i++) {
                    currentContext.push(typeof val[i] !== 'undefined' ? val[i] : {})

                    options.__path.push('[]')
                    context.unshift(currentContext[currentContext.length - 1])
                    this.gen(node.program, context, options, helpers, partials)
                    options.__path.pop()
                    context.shift()
                }
            } else this.gen(node.program, context, options, helpers, partials)
        }

        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }

    Handle.hash = function(node, context, options, helpers, partials) {
        var pairs = node.pairs,
            pair, i, j;
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i]
            for (j = 1; j < pair.length; j++) {
                this.gen(pair[j], context, options, helpers, partials)
            }
        }
    }

    Handle.ID = function(node, context, options) { // , helpers, partials
        var parts = node.parts,
            i, len, cur, prev, def, val, type, valType, preOptions,
            currentContext = context[node.depth], // back path, eg {{../permalink}}
            contextLength = context.length;

        if (Util.isArray(currentContext)) currentContext = context[node.depth + 1]

        if (!parts.length) {
            // TODO 修正父节点的类型
        } else {
            for (i = 0, len = parts.length; i < len; i++) {
                options.__path.push(parts[i])

                cur = parts[i]
                prev = parts[i - 1]
                preOptions = options[prev]

                def = i === len - 1 ? currentContext[cur] : {}
                val = this.val(cur, /*preOptions && preOptions[cur] ? preOptions :*/ options, context, def)

                type = Util.type(currentContext[cur])
                valType = Util.type(val)
                if (type === 'undefined') {
                    // 如果不是最后一个属性，并且当前值不是 [] 或 {}，则修正为 [] 或 {}
                    if (i < len - 1 && valType !== 'object' && valType !== 'array') {
                        currentContext[cur] = {}
                    } else {
                        currentContext[cur] = Util.isArray(val) && [] || val
                    }
                } else {
                    // 已有值
                    // 如果不是最后一个属性，并且不是 [] 或 {}，则修正为 [] 或 {}
                    if (i < len - 1 && type !== 'object' && type !== 'array') {
                        currentContext[cur] = Util.isArray(val) && [] || {}
                    }
                }

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }
        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }

    Handle.partial = function(node, context, options, helpers, partials) {
        var name = node.partialName.name,
            partial = partials && partials[name],
            contextLength = context.length;

        if (partial) Handle.gen(partial, context, options, helpers, partials)

        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }
    Handle.content = Util.noop
    Handle.PARTIAL_NAME = Util.noop
    Handle.DATA = Util.noop
    Handle.STRING = Util.noop
    Handle.INTEGER = Util.noop
    Handle.BOOLEAN = Util.noop
    Handle.comment = Util.noop

    var Helpers = {}

    Helpers.each = function(node, context, options) {
        var i, len, cur, val, parts, def, type,
            currentContext = context[0];

        parts = node.mustache.params[0].parts // each 只需要处理第一个参数，更多的参数由 each 自己处理
        for (i = 0, len = parts.length; i < len; i++) {
            options.__path.push(parts[i])

            cur = parts[i]
            def = i === len - 1 ? [] : {}

            val = this.val(cur, options, context, def)

            currentContext[cur] = Util.isArray(val) && [] || val

            type = Util.type(currentContext[cur])
            if (type === 'object' || type === 'array') {
                currentContext = currentContext[cur]
                context.unshift(currentContext)
            }
        }

        return val
    }

    Helpers['if'] = Helpers.unless = function(node, context, options) {
        var params = node.mustache.params,
            i, j, cur, val, parts, def, type,
            currentContext = context[0];

        for (i = 0; i < params.length; i++) {
            parts = params[i].parts
            for (j = 0; j < parts.length; j++) {
                if (i === 0) options.__path.push(parts[j])

                cur = parts[j]
                def = j === parts.length - 1 ? '@BOOL(2,1,true)' : {}

                val = this.val(cur, options, context, def)
                if (j === parts.length - 1) {
                    val = val === 'true' ? true :
                        val === 'false' ? false : val
                }

                currentContext[cur] = Util.isArray(val) ? [] : val

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }
        return val
    }

    Helpers['with'] = function(node, context, options) {
        var i, cur, val, parts, def,
            currentContext = context[0];

        parts = node.mustache.params[0].parts
        for (i = 0; i < parts.length; i++) {
            options.__path.push(parts[i])

            cur = parts[i]
            def = {}

            val = this.val(cur, options, context, def)

            currentContext = currentContext[cur] = val
            context.unshift(currentContext)
        }
        return val
    }

    Helpers.log = function() {
        // {{log "Look at me!"}}
    }

    Helpers.custom = function(node, context, options) {
        var i, len, cur, val, parts, def, type,
            currentContext = context[0];

        // custom helper
        // 如果 helper 没有参数，则认为是在当前上下文中判断 helper 是否为 true
        if (node.mustache.params.length === 0) {
            return

            // 按理说，Mock4Tpl 不需要也不应该模拟 helper 的行为（返回值），只需要处理 helper 的 params 和 statements。
            // 之所以保留下面的代码，是为了以防需要时扩展，也就是说，如果连 helper 也需要模拟的话！
            options.__path.push(node.mustache.id.string)

            cur = node.mustache.id.string
            def = '@BOOL(2,1,true)'

            val = this.val(cur, options, context, def)

            currentContext[cur] = Util.isArray(val) && [] || val

            type = Util.type(currentContext[cur])
            if (type === 'object' || type === 'array') {
                currentContext = currentContext[cur]
                context.unshift(currentContext)
            }

        } else {
            parts = node.mustache.params[0].parts
            for (i = 0, len = parts.length; i < len; i++) {
                options.__path.push(parts[i])

                cur = parts[i]
                def = i === len - 1 ? [] : {} // 默认值也可以是 []，如果有必要的话

                val = this.val(cur, options, context, def)

                currentContext[cur] = Util.isArray(val) && [] || val

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }
        return val
    }

}).call(this);
// END(BROWSER)