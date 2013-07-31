(function(global) {

    // nodejs
    var Mock;
    if (typeof require !== 'undefined') {
        Mock = require('./mock');
    } else {
        Mock = global.Mock
    }

    var Util = {};
    Util.type = function type(obj) {
        return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
    }
    Util.each = function(obj, iterator, context) {
        var i, key
        if (this.type(obj) === 'number') {
            for (i = 0; i < obj; i++) {
                iterator(i, i)
            }
        } else if (obj.length === +obj.length) {
            for (i = 0; i < obj.length; i++) {
                if (iterator.call(context, obj[i], i, obj) === false) break;
            }
        } else {
            for (key in obj) {
                if (iterator.call(context, obj[key], key, obj) === false) break;
            }
        }
    }

    // if (!console.group) console.group = console.groupEnd = console.log
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
        for (var n in Handlebars.AST) console.log(n);
     */
    var Mock4Tpl = {
        gen: function(node, result, options) {
            result = result || {}
            options = options || {}

            // console.group('[' + node.type + ']', (node))
            // console.log('[result]', result)

            this[node.type](node, result, options)

            // console.log('[result]', result)
            // console.groupEnd()

            return result
        },
        val: function(name, options, result, def) {
            if (options) {
                var mocked = Mock.mock(options)
                if (name in mocked) {
                    if (Util.type(mocked[name]) === 'array') return []
                    if (Util.type(mocked[name]) === 'object') return {}
                    return mocked[name]
                }
            }
            return def || (name) || Mock.Random.word()
        }
    }
    Mock4Tpl.program = function(node, result, options) {
        for (var i = 0; i < node.statements.length; i++) {
            Mock4Tpl.gen(node.statements[i], result, options)
        }
    }
    Mock4Tpl.mustache = function(node, result, options) { // string id params
        var i, len, cur, prev, type;
        parts = node.id.parts
        if (Util.type(result) === 'array') {
            result.push({})
            result = result[result.length - 1]
        }
        for (i = 0, len = parts.length; i < len; i++) {
            cur = parts[i]
            prev = parts[i - 1]
            type = Util.type(prev)
            if (i === 0) {
                if (!result[cur]) result[cur] = this.val(cur, options, result)
            } else {
                if (type !== 'object' && type !== 'array') {
                    result[prev] = {}
                    result[prev][cur] = this.val(cur, options, result[prev])
                }
            }
        }
    }
    Mock4Tpl.partial = function() {}
    Mock4Tpl.block = function(node, result, options) { // mustache program inverse
        var mustache = node.mustache,
            expression = mustache.id.string,
            parts = mustache.id.parts,
            i, len, type;

        // block.mustache
        if (mustache.isHelper) {
            // helper: each if unless with log
            switch (parts[0]) {
                case 'each':
                    var params = mustache.params[0].parts,
                        param, def, val
                    for (i = 0; i < params.length; i++) {
                        param = params[i]
                        def = i === params.length - 1 ? [] : {}
                        val = this.val(param, options, null, def)
                        result = result[param] = val
                    }
                    break;
                case 'if':
                    break;
                case 'unless':
                    break;
                case 'with':
                    break;
                case 'log':
                    break;
                default:
                    result = result[expression] = {}
            }
        } else {
            for (i = 0; i < parts.length; i++) {
                cur = parts[i]
                result[cur] = this.val(cur, options, result, {})
                type = Util.type(result[cur])
                if (type === 'object' || type === 'array') result = result[cur]
            }
        }
        // block.program
        if (!node.program) return
        if (Util.type(result) === 'array') {
            for (i = 0, len = Mock.Random.integer(3, 7); i < len; i++) {
                var item = this.gen(node.program, {}, options)
                result.push(item)

                /*
                // 不会更新 {}
                result.push({})
                result[result.length - 1]['random'] = Math.random()
                this.gen(node.program, result[result.length - 1], options)
                */
            }
        } else Mock4Tpl.gen(node.program, result, options)
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

    if (typeof module !== 'undefined' && module.exports) { // for node
        module.exports = Mock4Tpl
    }

    global.Mock4Tpl = Mock4Tpl
    return Mock4Tpl

})(this)