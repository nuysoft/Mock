/*
    ## RegExp Handler

    https://github.com/ForbesLindesay/regexp
    https://github.com/dmajda/pegjs
    http://www.regexper.com/

    每个节点的结构
        {
            type: '',
            offset: number,
            text: '',
            body: {},
            escaped: true/false
        }

    type 可选值
        alternate             |         选择
        match                 匹配
        capture-group         ()        捕获组
        non-capture-group     (?:...)   非捕获组
        positive-lookahead    (?=p)     零宽正向先行断言
        negative-lookahead    (?!p)     零宽负向先行断言
        quantified            a*        重复节点
        quantifier            *         量词
        charset               []        字符集
        range                 {m, n}    范围
        literal               a         直接量字符
        unicode               \uxxxx    Unicode
        hex                   \x        十六进制
        octal                 八进制
        back-reference        \n        反向引用
        control-character     \cX       控制字符

        // Token
        start               ^       开头
        end                 $       结尾
        any-character       .       任意字符
        backspace           [\b]    退格直接量
        word-boundary       \b      单词边界
        non-word-boundary   \B      非单词边界
        digit               \d      ASCII 数字，[0-9]
        non-digit           \D      非 ASCII 数字，[^0-9]
        form-feed           \f      换页符
        line-feed           \n      换行符
        carriage-return     \r      回车符
        white-space         \s      空白符
        non-white-space     \S      非空白符
        tab                 \t      制表符
        vertical-tab        \v      垂直制表符
        word                \w      ASCII 字符，[a-zA-Z0-9]
        non-word            \W      非 ASCII 字符，[^a-zA-Z0-9]
        null-character      \o      NUL 字符
 */

var Util = require('../util')
var Random = require('../random/')
    /*
        
    */
var Handler = {
    extend: Util.extend
}

// http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
/*var ASCII_CONTROL_CODE_CHART = {
    '@': ['\u0000'],
    A: ['\u0001'],
    B: ['\u0002'],
    C: ['\u0003'],
    D: ['\u0004'],
    E: ['\u0005'],
    F: ['\u0006'],
    G: ['\u0007', '\a'],
    H: ['\u0008', '\b'],
    I: ['\u0009', '\t'],
    J: ['\u000A', '\n'],
    K: ['\u000B', '\v'],
    L: ['\u000C', '\f'],
    M: ['\u000D', '\r'],
    N: ['\u000E'],
    O: ['\u000F'],
    P: ['\u0010'],
    Q: ['\u0011'],
    R: ['\u0012'],
    S: ['\u0013'],
    T: ['\u0014'],
    U: ['\u0015'],
    V: ['\u0016'],
    W: ['\u0017'],
    X: ['\u0018'],
    Y: ['\u0019'],
    Z: ['\u001A'],
    '[': ['\u001B', '\e'],
    '\\': ['\u001C'],
    ']': ['\u001D'],
    '^': ['\u001E'],
    '_': ['\u001F']
}*/

// ASCII printable code chart
// var LOWER = 'abcdefghijklmnopqrstuvwxyz'
// var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
// var NUMBER = '0123456789'
// var SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
var LOWER = ascii(97, 122)
var UPPER = ascii(65, 90)
var NUMBER = ascii(48, 57)
var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126) // 排除 95 _ ascii(91, 94) + ascii(96, 96)
var PRINTABLE = ascii(32, 126)
var SPACE = ' \f\n\r\t\v\u00A0\u2028\u2029'
var CHARACTER_CLASSES = {
    '\\w': LOWER + UPPER + NUMBER + '_', // ascii(95, 95)
    '\\W': OTHER.replace('_', ''),
    '\\s': SPACE,
    '\\S': function() {
        var result = PRINTABLE
        for (var i = 0; i < SPACE.length; i++) {
            result = result.replace(SPACE[i], '')
        }
        return result
    }(),
    '\\d': NUMBER,
    '\\D': LOWER + UPPER + OTHER
}

function ascii(from, to) {
    var result = ''
    for (var i = from; i <= to; i++) {
        result += String.fromCharCode(i)
    }
    return result
}

// var ast = RegExpParser.parse(regexp.source)
Handler.gen = function(node, result, cache) {
    cache = cache || {
        guid: 1
    }
    return Handler[node.type] ? Handler[node.type](node, result, cache) :
        Handler.token(node, result, cache)
}

Handler.extend({
    /* jshint unused:false */
    token: function(node, result, cache) {
        switch (node.type) {
            case 'start':
            case 'end':
                return ''
            case 'any-character':
                return Random.character()
            case 'backspace':
                return ''
            case 'word-boundary': // TODO
                return ''
            case 'non-word-boundary': // TODO
                break
            case 'digit':
                return Random.pick(
                    NUMBER.split('')
                )
            case 'non-digit':
                return Random.pick(
                    (LOWER + UPPER + OTHER).split('')
                )
            case 'form-feed':
                break
            case 'line-feed':
                return node.body || node.text
            case 'carriage-return':
                break
            case 'white-space':
                return Random.pick(
                    SPACE.split('')
                )
            case 'non-white-space':
                return Random.pick(
                    (LOWER + UPPER + NUMBER).split('')
                )
            case 'tab':
                break
            case 'vertical-tab':
                break
            case 'word': // \w [a-zA-Z0-9]
                return Random.pick(
                    (LOWER + UPPER + NUMBER).split('')
                )
            case 'non-word': // \W [^a-zA-Z0-9]
                return Random.pick(
                    OTHER.replace('_', '').split('')
                )
            case 'null-character':
                break
        }
        return node.body || node.text
    },
    /*
        {
            type: 'alternate',
            offset: 0,
            text: '',
            left: {
                boyd: []
            },
            right: {
                boyd: []
            }
        }
    */
    alternate: function(node, result, cache) {
        // node.left/right {}
        return this.gen(
            Random.boolean() ? node.left : node.right,
            result,
            cache
        )
    },
    /*
        {
            type: 'match',
            offset: 0,
            text: '',
            body: []
        }
    */
    match: function(node, result, cache) {
        result = ''
            // node.body []
        for (var i = 0; i < node.body.length; i++) {
            result += this.gen(node.body[i], result, cache)
        }
        return result
    },
    // ()
    'capture-group': function(node, result, cache) {
        // node.body {}
        result = this.gen(node.body, result, cache)
        cache[cache.guid++] = result
        return result
    },
    // (?:...)
    'non-capture-group': function(node, result, cache) {
        // node.body {}
        return this.gen(node.body, result, cache)
    },
    // (?=p)
    'positive-lookahead': function(node, result, cache) {
        // node.body
        return this.gen(node.body, result, cache)
    },
    // (?!p)
    'negative-lookahead': function(node, result, cache) {
        // node.body
        return ''
    },
    /*
        {
            type: 'quantified',
            offset: 3,
            text: 'c*',
            body: {
                type: 'literal',
                offset: 3,
                text: 'c',
                body: 'c',
                escaped: false
            },
            quantifier: {
                type: 'quantifier',
                offset: 4,
                text: '*',
                min: 0,
                max: Infinity,
                greedy: true
            }
        }
    */
    quantified: function(node, result, cache) {
        result = ''
            // node.quantifier {}
        var count = this.quantifier(node.quantifier);
        // node.body {}
        for (var i = 0; i < count; i++) {
            result += this.gen(node.body, result, cache)
        }
        return result
    },
    /*
        quantifier: {
            type: 'quantifier',
            offset: 4,
            text: '*',
            min: 0,
            max: Infinity,
            greedy: true
        }
    */
    quantifier: function(node, result, cache) {
        var min = Math.max(node.min, 0)
        var max = isFinite(node.max) ? node.max :
            min + Random.integer(3, 7)
        return Random.integer(min, max)
    },
    /*
        
    */
    charset: function(node, result, cache) {
        // node.invert
        if (node.invert) return this['invert-charset'](node, result, cache)

        // node.body []
        var literal = Random.pick(node.body)
        return this.gen(literal, result, cache)
    },
    'invert-charset': function(node, result, cache) {
        var pool = PRINTABLE
        for (var i = 0, item; i < node.body.length; i++) {
            item = node.body[i]
            switch (item.type) {
                case 'literal':
                    pool = pool.replace(item.body, '')
                    break
                case 'range':
                    var min = this.gen(item.start, result, cache).charCodeAt()
                    var max = this.gen(item.end, result, cache).charCodeAt()
                    for (var ii = min; ii <= max; ii++) {
                        pool = pool.replace(String.fromCharCode(ii), '')
                    }
                    /* falls through */
                default:
                    var characters = CHARACTER_CLASSES[item.text]
                    if (characters) {
                        for (var iii = 0; iii <= characters.length; iii++) {
                            pool = pool.replace(characters[iii], '')
                        }
                    }
            }
        }
        return Random.pick(pool.split(''))
    },
    range: function(node, result, cache) {
        // node.start, node.end
        var min = this.gen(node.start, result, cache).charCodeAt()
        var max = this.gen(node.end, result, cache).charCodeAt()
        return String.fromCharCode(
            Random.integer(min, max)
        )
    },
    literal: function(node, result, cache) {
        return node.escaped ? node.body : node.text
    },
    // Unicode \u
    unicode: function(node, result, cache) {
        return String.fromCharCode(
            parseInt(node.code, 16)
        )
    },
    // 十六进制 \xFF
    hex: function(node, result, cache) {
        return String.fromCharCode(
            parseInt(node.code, 16)
        )
    },
    // 八进制 \0
    octal: function(node, result, cache) {
        return String.fromCharCode(
            parseInt(node.code, 8)
        )
    },
    // 反向引用
    'back-reference': function(node, result, cache) {
        return cache[node.code] || ''
    },
    /*
        http://en.wikipedia.org/wiki/C0_and_C1_control_codes
    */
    CONTROL_CHARACTER_MAP: function() {
        var CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ')
        var CONTROL_CHARACTER_UNICODE = '\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F'.split(' ')
        var map = {}
        for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
            map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i]
        }
        return map
    }(),
    'control-character': function(node, result, cache) {
        return this.CONTROL_CHARACTER_MAP[node.code]
    }
})

module.exports = Handler