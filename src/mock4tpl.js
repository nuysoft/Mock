(function(global) {

    // nodejs
    var Mock;
    if (typeof require !== 'undefined') {
        Mock = require('./mock');
    } else {
        Mock = global.Mock
    }

    var Util = Mock.Util;

    if (!console.group) {
        console._log = console.log
        console._indent = ''
        console.log = function() {
            var args = [].slice.call(arguments, 0)
            if (console._indent) args = [console._indent].concat(args)
            console._log.apply(console, args)
        }
        console._styles = {
            'bold': ['\x1B[1m', '\x1B[22m'],
            'italic': ['\x1B[3m', '\x1B[23m'],
            'underline': ['\x1B[4m', '\x1B[24m'],
            'inverse': ['\x1B[7m', '\x1B[27m']
        }
        console.group = function() {
            var args = [].slice.call(arguments, 0),
                style = console._styles.bold;
            args[0] = style[0] + args[0] + style[1]
            console.log.apply(console, args)

            console._indent += '    '
        }
        console.groupEnd = function() {
            console._indent = console._indent.slice(0, console._indent.length - 4)
        }

    }

    /*
        Mock4Tpl.gen(ast)
        Mock4Tpl.gen(node, result)
        Mock4Tpl.gen(node, result, options)
        Mock4Tpl.gen(node, result, options, helpers)
     */
    var Mock4Tpl = {
        gen: function(node, result, options, helpers) {
            result = result || {}
            options = options || {}

            // console.group('[' + node.type + ']', (node))
            // console.log('[result]', result)

            this[node.type](node, result, options, helpers)

            // console.log('[result]', result)
            // console.groupEnd()

            return result
        },
        /*
            name    字符串，属性名
            options 字符串或对象，数据模板
            result  父节点
            def     默认值
        */
        val: function(name, options, result, def) {
            if (def) def = Mock.mock(def)
            if (options) {
                var mocked = Mock.mock(options)
                if (Util.isString(mocked)) return mocked
                if (name in mocked) {
                    if (Util.isArray(mocked[name])) return mocked[name]
                        // if (Util.isObject(mocked[name])) return {}
                    return mocked[name]
                }
            }
            if (Util.isArray(result)) return []
            return def || (name) || Mock.Random.word()
        }
    }


    /*
        for (var n in Handlebars.AST) console.log(n);
    */
    Mock4Tpl.program = function(node, result, options, helpers) {
        for (var i = 0; i < node.statements.length; i++) {
            this.gen(node.statements[i], result, options, helpers)
        }
        // TODO node.inverse
    }
    Mock4Tpl.mustache = function(node, result, options, helpers) { // string id params
        var i, len, cur, prev, type, params, def, val;
        parts = node.id.parts
        if (Util.type(result) === 'array') {
            result.push({})
            result = result[result.length - 1]
        }

        // "isHelper": 1
        if (node.isHelper || helpers && helpers[node.id.string]) {
            if (node.params.length === 0) {
                // TODO
            } else {
                params = node.params[0].parts
                for (i = 0; params && i < params.length; i++) {
                    cur = params[i]
                    if (params.length > 1) {
                        // a.b.c 待优化
                        def = i === params.length - 1 ? [] : {}
                    } else def = undefined
                    val = this.val(cur, options, result, def)
                    result = result[cur] = val
                }
            }
        } else {
            if (!parts.length) {
                // TODO 修正父节点的类型
            } else {
                for (i = 0, len = parts.length; i < len; i++) {
                    cur = parts[i]
                    prev = parts[i - 1]

                    if (i === 0) {
                        if (!result[cur]) result[cur] = this.val(cur, options, result)
                    } else {
                        type = Util.type(result[prev])
                        if (type !== 'object' && type !== 'array') {
                            result[prev] = {}
                            result[prev][cur] = this.val(cur, options, result[prev])
                        }
                        if (type === 'object') {
                            val = this.val(cur, options, result[prev])
                            result = result[prev]
                            result[cur] = val
                        }
                    }
                }
            }
        }


    }
    Mock4Tpl.partial = function() {}
    Mock4Tpl.block = function(node, result, options, helpers) { // mustache program inverse
        var mustache = node.mustache,
            parts = mustache.id.parts,
            i, len, cur, val, params, def;

        if (node.inverse) {
            // TODO 
        }

        // block.mustache
        if (mustache.isHelper) {
            // helper: each if unless with log
            switch (parts[0]) {
                case 'each':
                    params = mustache.params[0].parts
                    for (i = 0; i < params.length; i++) {
                        cur = params[i]
                        def = i === params.length - 1 ? [] : {}
                        val = this.val(cur, options, result, def)
                        result = result[cur] = Util.isArray(val) ? [] : val
                    }
                    break;
                case 'if':
                case 'unless':
                    params = mustache.params[0].parts
                    for (i = 0; i < params.length; i++) {
                        cur = params[i]
                        def = i === params.length - 1 ? '@BOOL' : {}
                        val = this.val(cur, options, result, def)
                        if (val === 'true') val = true
                        if (val === 'false') val = false
                        result[cur] = Util.isArray(val) ? [] : val
                        if (Util.isObject(result[cur]) || Util.isArray(result[cur])) result = result[cur]
                    }
                    break;
                case 'with':
                    params = mustache.params[0].parts
                    for (i = 0; i < params.length; i++) {
                        cur = params[i]
                        def = {}
                        val = this.val(cur, options, result, def)
                        result = result[cur] = val
                    }
                    break;
                case 'log':
                    break;
                default:
                    // custom helper
                    params = mustache.params[0].parts
                    for (i = 0; i < params.length; i++) {
                        cur = params[i]
                        def = i === params.length - 1 ? [] : {}
                        val = this.val(cur, options, result, def)
                        result = result[cur] = val
                    }
                    // result = result[expression] = {}
            }
        } else {
            for (i = 0; i < parts.length; i++) {
                cur = parts[i]

                val = this.val(cur, options, result, {})
                if (Util.isArray(val)) val = []
                result[cur] = val

                if (Util.isObject(result[cur]) || Util.isArray(result[cur])) result = result[cur]
            }
        }
        // block.program
        if (!node.program) return
        if (Util.type(result) === 'array') {
            // val = this.val(cur, options, result)
            len = val.length || Mock.Random.integer(3, 7)
            for (i = 0; i < len; i++) {
                if (val[i]) result.push(val[i])
                else result.push({})
                this.gen(node.program, result[result.length - 1], options, helpers)
            }
        } else this.gen(node.program, result, options, helpers)
    }
    Mock4Tpl.content = function() {}
    Mock4Tpl.hash = function() {}
    Mock4Tpl.ID = function() {}
    Mock4Tpl.PARTIAL_NAME = function() {}
    Mock4Tpl.DATA = function() {}
    Mock4Tpl.STRING = function() {}
    Mock4Tpl.INTEGER = function() {}
    Mock4Tpl.BOOLEAN = function() {}
    Mock4Tpl.comment = function() {}

    // for node
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Mock4Tpl
    }
    // for browser
    global.Mock4Tpl = Mock4Tpl

})(this)