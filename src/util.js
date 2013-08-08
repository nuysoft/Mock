// BEGIN(BROWSER)
/*
    Utilities
*/
var Util = (function() {
    var Util = {}

    Util.extend = function extend() {
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            options, name, src, copy

        if (length === 1) {
            target = this
            i = 0
        }

        for (; i < length; i++) {
            options = arguments[i]
            if (!options) continue

            for (name in options) {
                src = target[name]
                copy = options[name]

                if (target === copy) continue
                if (copy === undefined) continue

                if (Util.isArray(copy) || Util.isObject(copy)) {
                    if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
                    if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

                    target[name] = Util.extend(clone, copy)
                } else {
                    target[name] = copy
                }
            }
        }

        return target
    }

    Util.each = function each(obj, iterator, context) {
        var i, key
        if (this.type(obj) === 'number') {
            for (i = 0; i < obj; i++) {
                iterator(i, i)
            }
        } else if (obj.length === +obj.length) {
            for (i = 0; i < obj.length; i++) {
                if (iterator.call(context, obj[i], i, obj) === false) break
            }
        } else {
            for (key in obj) {
                if (iterator.call(context, obj[key], key, obj) === false) break
            }
        }
    }

    Util.type = function type(obj) {
        return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
    }

    Util.each('String Object Array'.split(' '), function(value) {
        Util['is' + value] = function(obj) {
            return Util.type(obj) === value.toLowerCase()
        }
    })

    return Util
})()

// END(BROWSER)

module.exports = Util

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