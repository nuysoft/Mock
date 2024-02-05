/*eslint-disable*/
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

import * as Util from '../util';

import { pick } from '../random/helper';
import { character, boolean, integer } from '../random/basic';
/*

    */
const Handler = {
    extend: Util.extend,
};

// http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
/* let ASCII_CONTROL_CODE_CHART = {
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
// let LOWER = 'abcdefghijklmnopqrstuvwxyz'
// let UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
// let NUMBER = '0123456789'
// let SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
const LOWER = ascii(97, 122);
const UPPER = ascii(65, 90);
const NUMBER = ascii(48, 57);
const OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126); // 排除 95 _ ascii(91, 94) + ascii(96, 96)
const PRINTABLE = ascii(32, 126);
const SPACE = ' \f\n\r\t\v\u00A0\u2028\u2029';
const CHARACTER_CLASSES = {
    '\\w': LOWER + UPPER + NUMBER + '_', // ascii(95, 95)
    '\\W': OTHER.replace('_', ''),
    '\\s': SPACE,
    '\\S': (function () {
        let result = PRINTABLE;
        for (let i = 0; i < SPACE.length; i++) {
            result = result.replace(SPACE[i], '');
        }
        return result;
    })(),
    '\\d': NUMBER,
    '\\D': LOWER + UPPER + OTHER,
};

// 从 from 到 to 包含两个端点的字符串
function ascii(from, to) {
    return [...Array(to - from + 1).keys()].map((i) => String.fromCharCode(i + from)).join('');
}

// let ast = RegExpParser.parse(regexp.source)
Handler.gen = function (node, result, cache) {
    cache = cache || {
        guid: 1,
    };
    return Handler[node.type] ? Handler[node.type](node, result, cache) : Handler.token(node, result, cache);
};

Handler.extend({
    /* jshint unused:false */
    token: function (node, result, cache) {
        switch (node.type) {
            case 'start':
            case 'end':
                return '';
            case 'any-character':
                return character();
            case 'backspace':
                return '';
            case 'word-boundary': // TODO
                return '';
            case 'non-word-boundary': // TODO
                break;
            case 'digit':
                return pick(NUMBER.split(''));
            case 'non-digit':
                return pick((LOWER + UPPER + OTHER).split(''));
            case 'form-feed':
                break;
            case 'line-feed':
                return node.body || node.text;
            case 'carriage-return':
                break;
            case 'white-space':
                return pick(SPACE.split(''));
            case 'non-white-space':
                return pick((LOWER + UPPER + NUMBER).split(''));
            case 'tab':
                break;
            case 'vertical-tab':
                break;
            case 'word': // \w [a-zA-Z0-9]
                return pick((LOWER + UPPER + NUMBER).split(''));
            case 'non-word': // \W [^a-zA-Z0-9]
                return pick(OTHER.replace('_', '').split(''));
            case 'null-character':
                break;
        }
        return node.body || node.text;
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
    alternate: function (node, result, cache) {
        // node.left/right {}
        return this.gen(boolean() ? node.left : node.right, result, cache);
    },
    /*
        {
            type: 'match',
            offset: 0,
            text: '',
            body: []
        }
    */
    match: function (node, result, cache) {
        result = '';
        // node.body []
        for (let i = 0; i < node.body.length; i++) {
            result += this.gen(node.body[i], result, cache);
        }
        return result;
    },
    // ()
    'capture-group': function (node, result, cache) {
        // node.body {}
        result = this.gen(node.body, result, cache);
        cache[cache.guid++] = result;
        return result;
    },
    // (?:...)
    'non-capture-group': function (node, result, cache) {
        // node.body {}
        return this.gen(node.body, result, cache);
    },
    // (?=p)
    'positive-lookahead': function (node, result, cache) {
        // node.body
        return this.gen(node.body, result, cache);
    },
    // (?!p)
    'negative-lookahead': function (node, result, cache) {
        // node.body
        return '';
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
    quantified: function (node, result, cache) {
        result = '';
        // node.quantifier {}
        const count = this.quantifier(node.quantifier);
        // node.body {}
        for (let i = 0; i < count; i++) {
            result += this.gen(node.body, result, cache);
        }
        return result;
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
    quantifier: function (node, result, cache) {
        const min = Math.max(node.min, 0);
        const max = isFinite(node.max) ? node.max : min + integer(3, 7);
        return integer(min, max);
    },
    /*

    */
    charset: function (node, result, cache) {
        // node.invert
        if (node.invert) return this['invert-charset'](node, result, cache);

        // node.body []
        const literal = pick(node.body);
        return this.gen(literal, result, cache);
    },
    'invert-charset': function (node, result, cache) {
        let pool = PRINTABLE;
        for (let i = 0, item; i < node.body.length; i++) {
            item = node.body[i];
            switch (item.type) {
                case 'literal': {
                    pool = pool.replace(item.body, '');
                    break;
                }
                case 'range':
                    const min = this.gen(item.start, result, cache).charCodeAt();
                    const max = this.gen(item.end, result, cache).charCodeAt();
                    for (let ii = min; ii <= max; ii++) {
                        pool = pool.replace(String.fromCharCode(ii), '');
                    }
                /* falls through */
                default:
                    const characters = CHARACTER_CLASSES[item.text];
                    if (characters) {
                        for (let iii = 0; iii <= characters.length; iii++) {
                            pool = pool.replace(characters[iii], '');
                        }
                    }
            }
        }
        return pick(pool.split(''));
    },
    range: function (node, result, cache) {
        // node.start, node.end
        const min = this.gen(node.start, result, cache).charCodeAt();
        const max = this.gen(node.end, result, cache).charCodeAt();
        return String.fromCharCode(integer(min, max));
    },
    literal: function (node, result, cache) {
        return node.escaped ? node.body : node.text;
    },
    // Unicode \u
    unicode: function (node, result, cache) {
        return String.fromCharCode(parseInt(node.code, 16));
    },
    // 十六进制 \xFF
    hex: function (node, result, cache) {
        return String.fromCharCode(parseInt(node.code, 16));
    },
    // 八进制 \0
    octal: function (node, result, cache) {
        return String.fromCharCode(parseInt(node.code, 8));
    },
    // 反向引用
    'back-reference': function (node, result, cache) {
        return cache[node.code] || '';
    },
    /*
        http://en.wikipedia.org/wiki/C0_and_C1_control_codes
    */
    CONTROL_CHARACTER_MAP: (function () {
        const CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ');
        const CONTROL_CHARACTER_UNICODE =
            '\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F'.split(
                ' ',
            );
        const map = {};
        for (let i = 0; i < CONTROL_CHARACTER.length; i++) {
            map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i];
        }
        return map;
    })(),
    'control-character': function (node, result, cache) {
        return this.CONTROL_CHARACTER_MAP[node.code];
    },
});

export { Handler };
