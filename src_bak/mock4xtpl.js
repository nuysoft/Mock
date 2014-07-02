var KISSY = require('kissy'),
    Mock = require('./mock'),
    Random = require('./random'),
    Util = require('./util');

// BEGIN(BROWSER)
(function(undefined) {
    if (typeof KISSY === 'undefined') return

    var Mock4XTpl = {
        debug: false
    }

    var XTemplate;

    KISSY.use('xtemplate', function(S, T) {
        XTemplate = T
    })

    if (!this.Mock) module.exports = Mock4XTpl

    Mock.xtpl = function(input, options, helpers, partials) {
        return Mock4XTpl.mock(input, options, helpers, partials)
    }
    Mock.xparse = function(input) {
        return XTemplate.compiler.parse(input)
    }

    /*
        参数 options 可以通过 {{mock ...}} 指定，有2种方式：
        1. 为属性值设置单独的配置，例如：
            {{title}}{{mock @EMAIL}}
        2. 集中配置整个模板，例如：
            {{#article}}{{title}}{{/article}}
            {{mock title=@EMAIL }}
        支持嵌套指定、上下文，支持所有 Mock 占位符。
    */
    Mock4XTpl.mock = function(input, options, helpers, partials) {
        helpers = helpers ? Util.extend({}, helpers, XTemplate.RunTime.commands) :
            XTemplate.RunTime.commands
        partials = partials ? Util.extend({}, partials, XTemplate.RunTime.subTpls) :
            XTemplate.RunTime.subTpls
        // XTemplate.RunTime.subTpls // 全局子模板
        // xtemplate.option.subTpls 局部子模板
        return this.gen(input, null, options, helpers, partials, {})
    }

    Mock4XTpl.parse = function(input) {
        return XTemplate.compiler.parse(input)
    }

    Mock4XTpl.gen = function(node, context, options, helpers, partials, other) {
        if (typeof node === 'string') {
            if (Mock4XTpl.debug) {
                console.log('[tpl    ]\n', node)
            }
            var ast = this.parse(node)
            options = this.parseOptions(node, options)
            var data = this.gen(ast, context, options, helpers, partials, other)
            return data
        }

        context = context || [{}]
        options = options || {}

        node.type = node.type
        // for (var n in node) node[n] = node[n]

        if (this[node.type] === Util.noop) return

        options.__path = options.__path || []

        if (Mock4XTpl.debug) {
            console.log()
            console.group('[' + node.type + ']', JSON.stringify(node))
            console.log('[context]', '[before]', context.length, JSON.stringify(context))
            console.log('[options]', '[before]', options.__path.length, JSON.stringify(options))
            console.log('[other  ]', '[before]', JSON.stringify(other))
        }

        var preLength = options.__path.length
        this[node.type](node, context, options, helpers, partials, other)

        if (Mock4XTpl.debug) {
            console.log('[__path ]', '[after ]', options.__path);
        }

        if (!other.hold ||
            typeof other.hold === 'function' && !other.hold(node, options, context)) {
            options.__path.splice(preLength)
        }

        if (Mock4XTpl.debug) {
            console.log('[context]', '[after ]', context.length, JSON.stringify(context))
            console.groupEnd()
        }

        return context[context.length - 1]
    }


    /*
        {{email}}{{age}}
        <!-- Mock { email: '@EMAIL' } -->
        <!-- Mock { age: '@INT' } -->

        > 关于模板引擎的注释节点 `{{! 注释内容 }}`（不是 HTML 注释 <!-- -->）：**在 Handlebars 中，注释节点会出现在从 HTML 模板解析得到的语法树中**，因为 Mock.js 是基于 HTML 模板的语法树生成模拟数据，因此从理论上（尚未实现，原因下表），可以通过注释节点来配置数据模板，例如 `{{email}}{{! @EMAIL }}`。这种配置方式的好处有：1) 不需要敲打略显繁琐的 `{{email}}<!-- Mock { email: '@EMAIL' } -->`，2) 可以省去敲打 `email:`，3) 可以就近配置方便阅读。这种配置方式的坏处有：1) 过于零碎不易管理。另外，**KISSY XTempalte 不会把注释节点放入语法树中**。因此，暂时不提供这种配置方式。如果您有更好的想法，欢迎提交 [Issues]() 讨论。
    */
    Mock4XTpl.parseOptions = function(input, options) {
        var rComment = /<!--\s*\n*Mock\s*\n*([\w\W]+?)\s*\n*-->/g;
        var comments = input.match(rComment),
            ret = {},
            i, ma, option;
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

    Mock4XTpl.parseVal = function(expr, object) {

        function queryArray(prop, context) {
            if (typeof context === 'object' && prop in context) return [context[prop]]

            var ret = []
            for (var i = 0; i < context.length; i++) {
                ret.push.apply(ret, query(prop, [context[i]]))
            }
            return ret
        }

        function queryObject(prop, context) {
            if (typeof context === 'object' && prop in context) return [context[prop]]

            var ret = [];
            for (var key in context) {
                ret.push.apply(ret, query(prop, [context[key]]))
            }
            return ret
        }

        function query(prop, set) {
            var ret = [];
            for (var i = 0; i < set.length; i++) {
                if (typeof set [i] !== 'object') continue
                if (prop in set [i]) ret.push(set [i][prop])
                else {
                    ret.push.apply(ret, Util.isArray(set [i]) ?
                        queryArray(prop, set [i]) :
                        queryObject(prop, set [i]))
                }
            }
            return ret
        }

        function parse(expr, context) {
            var parts = typeof expr === 'string' ? expr.split('.') : expr.slice(0),
                set = [context];
            while (parts.length) {
                set = query(parts.shift(), set)
            }
            return set
        }

        return parse(expr, object)
    }

    Mock4XTpl.val = function(name, options, context, def) {
        if (name !== options.__path[options.__path.length - 1]) throw new Error(name + '!==' + options.__path)
        if (def !== undefined) def = Mock.mock(def)
        if (options) {
            var mocked = Mock.mock(options)
            if (Util.isString(mocked)) return mocked

            // TODO 深沉嵌套配置
            var ret = Mock4XTpl.parseVal(options.__path, mocked)
            if (ret.length > 0) return ret[0]

            if (name in mocked) {
                return mocked[name]
            }
        }
        if (Util.isArray(context[0])) return {}
        return def !== undefined ? def : name
    }

    Mock4XTpl.program = function(node, context, options, helpers, partials, other) {
        // node.statements
        for (var i = 0; i < node.statements.length; i++) {
            this.gen(node.statements[i], context, options, helpers, partials, other)
        }
        // node.inverse
        for (var j = 0; node.inverse && j < node.inverse.length; j++) {
            this.gen(node.inverse[j], context, options, helpers, partials, other)
        }
    }

    Mock4XTpl.block = function(node, context, options, helpers, partials, other) { // mustache program inverse
        var contextLength = context.length

        // node.tpl
        this.gen(node.tpl, context, options, helpers, partials, Util.extend({}, other, {
            /*
                TODO
                {{#noop}}{{body}}{{/noop}}    -> { "noop": { "body": "body"} }
                {{#list nav}}{{url}}{{/list}} -> { "nav": { "url": "url", "title": "title"} }
            */
            def: {}, // 
            hold: true
        }))

        // node.program
        var currentContext = context[0],
            mocked, i, len;
        if (Util.type(currentContext) === 'array') {
            mocked = this.val(options.__path[options.__path.length - 1], options, context)
            len = mocked && mocked.length || Random.integer(3, 7)
            for (i = 0; i < len; i++) {
                // test_relational_expression_each > mocked[i] != undefined
                currentContext.push(mocked && mocked[i] !== undefined ? mocked[i] : {})

                options.__path.push(i)
                context.unshift(currentContext[currentContext.length - 1])

                this.gen(node.program, context, options, helpers, partials, other)

                options.__path.pop()
                context.shift()
            }
        } else this.gen(node.program, context, options, helpers, partials, other)

        if (!other.hold ||
            typeof other.hold === 'function' && !other.hold(node, options, context)) {
            context.splice(0, context.length - contextLength)
        }
    }

    Mock4XTpl.tpl = function(node, context, options, helpers, partials, other) {
        if (node.params && node.params.length) {
            other = Util.extend({}, other, {
                def: {
                    'each': [],
                    'if': '@BOOL(2,1,true)', // node.params[0].type === 'id' ? '@BOOL(2,1,true)' : undefined,
                    'unless': '@BOOL(2,1,false)',
                    'with': {}
                }[node.path.string],
                hold: {
                    'each': true,
                    'if': function(_, __, ___, name, value) { // 暂时不需要关注前三个参数：node, options, context。
                        return typeof value === 'object'
                    },
                    'unless': function(_, __, ___, name, value) {
                        return typeof value === 'object'
                    },
                    'with': true,
                    'include': false
                }[node.path.string]
            })
            // node.params
            for (var i = 0, input; i < node.params.length; i++) {
                if (node.path.string === 'include') {
                    input = partials && partials[node.params[i].value]
                } else input = node.params[i]
                if (input) this.gen(input, context, options, helpers, partials, other)
            }
            // node.hash
            if (node.hash) {
                this.gen(node.hash, context, options, helpers, partials, other)
            }
        } else {
            this.gen(node.path, context, options, helpers, partials, other)
        }
    }
    Mock4XTpl.tplExpression = function(node, context, options, helpers, partials, other) {
        this.gen(node.expression, context, options, helpers, partials, other)
    }

    Mock4XTpl.content = Util.noop
    Mock4XTpl.unaryExpression = Util.noop

    Mock4XTpl.multiplicativeExpression =
        Mock4XTpl.additiveExpression = function(node, context, options, helpers, partials, other) {
            // TODO 如果参与运算是数值型，默认为整数或浮点数
            this.gen(node.op1, context, options, helpers, partials, Util.extend({}, other, {
                def: function() {
                    return node.op2.type === 'number' ?
                        node.op2.value.indexOf('.') > -1 ?
                        Random.float(-Math.pow(10, 10), Math.pow(10, 10), 1, Math.pow(10, 6)) :
                        Random.integer() :
                        undefined
                }()
            }))
            this.gen(node.op2, context, options, helpers, partials, Util.extend({}, other, {
                def: function() {
                    return node.op1.type === 'number' ?
                        node.op1.value.indexOf('.') > -1 ?
                        Random.float(-Math.pow(10, 10), Math.pow(10, 10), 1, Math.pow(10, 6)) :
                        Random.integer() :
                        undefined
                }()
            }))
    }

    Mock4XTpl.relationalExpression = function(node, context, options, helpers, partials, other) {
        this.gen(node.op1, context, options, helpers, partials, other)
        this.gen(node.op2, context, options, helpers, partials, other)
    }

    Mock4XTpl.equalityExpression = Util.noop
    Mock4XTpl.conditionalAndExpression = Util.noop
    Mock4XTpl.conditionalOrExpression = Util.noop
    Mock4XTpl.string = Util.noop
    Mock4XTpl.number = Util.noop
    Mock4XTpl.boolean = Util.noop

    Mock4XTpl.hash = function(node, context, options, helpers, partials, other) {
        var pairs = node.value,
            key;
        for (key in pairs) {
            this.gen(pairs[key], context, options, helpers, partials, other)
        }
    }

    Mock4XTpl.id = function(node, context, options, helpers, partials, other) {
        var contextLength = context.length

        var parts = node.parts,
            currentContext = context[node.depth],
            i, len, cur, def, val;

        function fix(currentContext, index, length, name, val) {
            var type = Util.type(currentContext[name]),
                valType = Util.type(val);
            val = val === 'true' ? true :
                val === 'false' ? false : val
            if (type === 'undefined') {
                // 如果不是最后一个属性，并且当前值不是 [] 或 {}，则修正为 [] 或 {}
                if (index < length - 1 && !Util.isObjectOrArray(val)) {
                    currentContext[name] = {}
                } else {
                    currentContext[name] = Util.isArray(val) && [] || val
                }
            } else {
                // 已有值
                // 如果不是最后一个属性，并且不是 [] 或 {}，则修正为 [] 或 {}
                if (index < length - 1 && type !== 'object' && type !== 'array') {
                    currentContext[name] = Util.isArray(val) && [] || {}
                } else {
                    /*
                        其他情况下，
                        尽量不改变类型（对象、数组、基本类型）的情况下，覆盖已有值，
                        以支持在后面的模拟过程中修正模拟值。
                    */
                    if (type !== 'object' && type !== 'array' &&
                        valType !== 'object' && valType !== 'array') {
                        currentContext[name] = val
                    }
                }


            }
            return currentContext[name]
        }

        if (Util.isArray(currentContext)) currentContext = context[node.depth + 1]

        for (i = 0, len = parts.length; i < len; i++) {
            /*
                TODO 过滤掉 this、内置占位符（xindex、xcount、xkey）、helper，
                然而万全之策是先检查 options 中是否存在对应的配置，如果没有则忽略，如果有则生成。
                不过，在应用中不建议覆盖内置占位符。
                TODO 遇到 xindex、xcount 要修正为数组
                TODO 遇到 xkey 要修正为对象
            */
            if (i === 0 && parts[i] === 'this') continue
            if (/^(xindex|xcount|xkey)$/.test(parts[i])) continue // TODO 需要判断内置占位符（xindex、xcount、xkey）的位置吗，例如是否是第一个？
            if (i === 0 && len === 1 && parts[i] in helpers) continue

            options.__path.push(parts[i])

            cur = parts[i]

            def = i === len - 1 ?
                other.def !== undefined ? other.def :
                context[0][cur] : {}
            val = this.val(cur, options, context, def)

            if (Mock4XTpl.debug) {
                console.log('[def    ]', JSON.stringify(def))
                console.log('[val    ]', JSON.stringify(val))
            }

            val = fix(currentContext, i, len, cur, val)

            if (Util.isObjectOrArray(currentContext[cur])) {
                context.unshift(currentContext = currentContext[cur])
            }
        }

        if (!other.hold ||
            typeof other.hold === 'function' && !other.hold(node, options, context, cur, val)) {
            context.splice(0, context.length - contextLength)
        }
    }

}).call(this);
// END(BROWSER)