var Parser = require('./parser'),
    Mock = require('../mock'),
    Random = require('../random'),
    Util = require('../util');

var Mock4Tpl = module.exports = {}

// BEGIN(BROWSER)

Mock4Tpl.debug = false
/*
    Mock4Tpl.mock(input)
    Mock4Tpl.mock(input, options)
    Mock4Tpl.mock(input, options, helpers)
*/
Mock4Tpl.mock = function(input, options, helpers) {
    return Mock4Tpl.gen(input, options, helpers)
}

/*
    Mock4Tpl.gen(input)
    Mock4Tpl.gen(input, options)
    Mock4Tpl.gen(input, options, helpers)

    Mock4Tpl.gen(ast)
    Mock4Tpl.gen(node, result)
    Mock4Tpl.gen(node, result, options)
    Mock4Tpl.gen(node, result, options, helpers)
 */
Mock4Tpl.gen = function(node, result, options, helpers) {
    if (Util.isString(node)) {
        var ast = Parser.parse(node)
        var data = Mock4Tpl.gen(ast, null, result, options)
        return data
    }

    result = result || {}
    options = options || {}

    if (Mock4Tpl.debug) {
        console.group('[' + node.type + ']', JSON.stringify(node))
        console.log('[result]', result)
        console.log('[options]', options)
    }

    this[node.type](node, result, options, helpers)

    if (Mock4Tpl.debug) {
        console.log('[result]', JSON.stringify(result))
        console.groupEnd()
    }

    return result
}


/*
    name    字符串，属性名
    options 字符串或对象，数据模板
    result  父节点
    def     默认值
*/
Mock4Tpl.val = function(name, options, result, def) {
    if (def) def = Mock.mock(def)
    if (options) {
        var mocked = Mock.mock(options)
        if (Util.isString(mocked)) return mocked
        if (name in mocked) {
            return mocked[name]
        }
    }
    if (Util.isArray(result)) return {}
    return def || (name) || Random.word()
}


/*
    AST
*/
Mock4Tpl.program = function(node, result, options, helpers) {
    for (var i = 0; i < node.statements.length; i++) {
        this.gen(node.statements[i], result, options, helpers)
    }
    // TODO node.inverse
}
Mock4Tpl.mustache = function(node, result, options, helpers) { // string id params
    var i, len, cur, prev, type, def, val, preOptions, parts;
    if (Util.type(result) === 'array') {
        result.push({})
        result = result[result.length - 1]
    }

    // "isHelper": 1
    if (node.isHelper || helpers && helpers[node.id.string]) {
        // node.params
        if (node.params.length === 0) {
            // TODO test_helper_this_with_register_and_holder
        } else {
            for (i = 0; i < node.params.length; i++) {
                this.gen(node.params[i], result, options, helpers)
            }
        }
        // node.hash
        if (node.hash) this.gen(node.hash, result, options, helpers)
    } else {
        // @index TODO 放到 DATA 中
        if (node.id.type === 'DATA') return

        // node.id.parts
        parts = node.id.parts
        if (!parts.length) {
            // TODO 修正父节点的类型
        } else {
            for (i = 0, len = parts.length; i < len; i++) {
                cur = parts[i]
                prev = parts[i - 1]
                preOptions = options[prev]

                def = i === len - 1 ? result[cur] || undefined : {}
                val = this.val(cur, preOptions && preOptions[cur] ? preOptions : options, result, def)

                // if (cur in result && (Util.type(val) === Util.type(result[cur]))) continue

                type = Util.type(val)
                result[cur] = i < len - 1 && type !== 'object' && type !== 'array' ? {} :
                    type === 'array' ? [] :
                    val

                type = Util.type(result[cur])
                if (type === 'object' || type === 'array') result = result[cur]
            }
        }
    }


}
Mock4Tpl.partial = function() {}
Mock4Tpl.block = function(node, result, options, helpers) { // mustache program inverse
    var mustache = node.mustache,
        parts = mustache.id.parts,
        i, j, len, cur, val, params, param, def, type;

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

                    result[cur] = Util.isArray(val) && [] || val

                    type = Util.type(result[cur])
                    if (type === 'object' || type === 'array') result = result[cur]
                }
                break
            case 'if':
            case 'unless':
                for (i = 0; i < mustache.params.length; i++) {
                    param = mustache.params[i]
                    parts = param.parts
                    for (j = 0; j < parts.length; j++) {
                        cur = parts[j]
                        def = j === parts.length - 1 ? '@BOOL(3,1,true)' : {}

                        val = this.val(cur, options, result, def)
                        if (j === parts.length - 1) {
                            val = val === 'true' ? true :
                                val === 'false' ? false : val
                        }

                        result[cur] = Util.isArray(val) ? [] : val

                        type = Util.type(result[cur])
                        if (type === 'object' || type === 'array') result = result[cur]
                    }
                }
                break
            case 'with':
                params = mustache.params[0].parts
                for (i = 0; i < params.length; i++) {
                    cur = params[i]
                    def = {}
                    val = this.val(cur, options, result, def)
                    result = result[cur] = val
                }
                break
            case 'log': // {{log "Look at me!"}}
                break
            default:
                // custom helper
                params = mustache.params[0].parts
                for (i = 0; i < params.length; i++) {
                    cur = params[i]
                    def = i === params.length - 1 ? [] : {}

                    val = this.val(cur, options, result, def)

                    result[cur] = Util.isArray(val) && [] || val

                    type = Util.type(result[cur])
                    if (type === 'object' || type === 'array') result = result[cur]
                }
                // result = result[expression] = {}
        }
    } else {
        for (i = 0; i < parts.length; i++) {
            cur = parts[i]

            val = this.val(cur, options, result, {})
            result[cur] = Util.isArray(val) && [] || val

            type = Util.type(result[cur])
            if (type === 'object' || type === 'array') result = result[cur]
        }
    }
    // block.program
    if (!node.program) return
    if (Util.type(result) === 'array') {
        // val = this.val(cur, options, result)
        len = val.length || Random.integer(3, 7)
        for (i = 0; i < len; i++) {
            if (val[i]) result.push(val[i])
            else result.push({})
            this.gen(node.program, result[result.length - 1], options, helpers)
        }
    } else this.gen(node.program, result, options, helpers)
}
Mock4Tpl.content = function() {}
Mock4Tpl.hash = function(node, result, options, helpers) {
    var pairs = node.pairs,
        pair, i, j;
    for (i = 0; i < pairs.length; i++) {
        pair = pairs[i]
        for (j = 1; j < pair.length; j++) {
            this.gen(pair[j], result, options, helpers)
        }
    }
}
Mock4Tpl.ID = function(node, result, options) { // , helpers
    var parts = node.parts,
        i, cur, def, val, type;
    for (i = 0; i < parts.length; i++) {
        cur = parts[i]

        def = i < parts.length - 1 ? {} : undefined
        val = this.val(cur, options, result, def)

        // 已有值
        type = Util.type(result[cur])
        if (type === 'undefined' ||
            i < parts.length - 1 && type !== 'undefined' && type !== 'object' && type !== 'array') {
            result[cur] = Util.isArray(val) && [] || val
        }

        type = Util.type(val)
        if (type === 'object' || type === 'array') result = result[cur]
    }
}
Mock4Tpl.PARTIAL_NAME = function() {}
Mock4Tpl.DATA = function() {}
Mock4Tpl.STRING = function() {}
Mock4Tpl.INTEGER = function() {}
Mock4Tpl.BOOLEAN = function() {}
Mock4Tpl.comment = function() {}
// END(BROWSER)