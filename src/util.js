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
            options, name, src, copy, clone

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

    Util.each('String Object Array RegExp Function'.split(' '), function(value) {
        Util['is' + value] = function(obj) {
            return Util.type(obj) === value.toLowerCase()
        }
    })

    Util.isObjectOrArray = function(value) {
        return Util.isObject(value) || Util.isArray(value)
    }

    Util.isNumeric = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value)
    }

    Util.keys = function(obj) {
        var keys = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) keys.push(key)
        }
        return keys
    }
    Util.values = function(obj) {
        var values = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) values.push(obj[key])
        }
        return values
    }

    /*
        ### Mock.heredoc(fn)

        * Mock.mockjax(fn)

        以直观、安全的方式书写（多行）HTML 模板。

        **使用示例**如下所示：

            var tpl = Mock.heredoc(function() {
                /*!
            {{email}}{{age}}
            <!-- Mock { 
                email: '@EMAIL',
                age: '@INT(1,100)'
            } -->
                *\/
            })
        
        **相关阅读**
        * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)、
    */
    Util.heredoc = function heredoc(fn) {
        // 1. 移除起始的 function(){ /*!
        // 2. 移除末尾的 */ }
        // 3. 移除起始和末尾的空格
        return fn.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') // .trim()
    }

    Util.noop = function() {}

    return Util
})()

// END(BROWSER)

module.exports = Util

if (!console.group) {
    console._log = console.log
    console._indent = ''
    console._styles = {
        //styles
        'bold': ['\033[1m', '\033[22m'],
        'italic': ['\033[3m', '\033[23m'],
        'underline': ['\033[4m', '\033[24m'],
        'inverse': ['\033[7m', '\033[27m'],
        //grayscale
        'white': ['\033[37m', '\033[39m'],
        'grey': ['\033[90m', '\033[39m'],
        'black': ['\033[30m', '\033[39m'],
        //colors
        'blue': ['\033[34m', '\033[39m'],
        'cyan': ['\033[36m', '\033[39m'],
        'green': ['\033[32m', '\033[39m'],
        'magenta': ['\033[35m', '\033[39m'],
        'red': ['\033[31m', '\033[39m'],
        'yellow': ['\033[33m', '\033[39m']
    }

    console.log = function() {
        var args = [].slice.call(arguments, 0)
        if (args[0] === '[context]') args[0] = console._styles.green[0] + args[0] + console._styles.green[1]
        if (args[0] === '[options]') args[0] = console._styles.yellow[0] + args[0] + console._styles.yellow[1]
        if (console._indent) {
            args = args.join(' ').split('')
            for (var i = 0, len = args.length; i < len; i++) {
                if (i > 0 && i % 150 === 0) args.splice(i, 0, '\n' + console._indent)
            }
            args = [args.join('')]
            args = [console._indent.slice(0, console._indent.length - 4) + '├── '].concat(args)
        }
        console._log.apply(console, args)
    }

    console.group = function() {
        var args = [].slice.call(arguments, 0),
            style = console._styles.bold
        args[0] = style[0] + args[0] + style[1]
        console.log.apply(console, args)

        console._indent += '│   ' // │ ├ ─ ─
    }
    console.groupEnd = function() {
        console._indent = console._indent.slice(0, console._indent.length - 4)
    }

}