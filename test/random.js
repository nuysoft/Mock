module('Random')

function doRandom(expression, validator) {
    /* jshint -W061 */
    var data = eval(expression)
    var message = JSON.stringify(expression, null, 4) + ' => ' + JSON.stringify(data, null, 4)
    if (validator) validator(expression, data, message)
    else log('`' + JSON.stringify(expression, null, 4) + '`' + ' => ' + JSON.stringify(data, null, 4))
}

test('Basics', function() {

    doRandom('Random.boolean()', function(expr, data, message) {
        equal(typeof data, 'boolean', message)
    })

    doRandom('Random.natural()', function(expr, data, message) {
        ok(data >= 0, message)
        ok(data <= 9007199254740992, message)
    })
    doRandom('Random.natural(1, 3)', function(expr, data, message) {
        ok(data >= 1, message)
        ok(data <= 9007199254740992, message)
    })
    doRandom('Random.natural(1)', function(expr, data, message) {
        ok(data >= 1, message)
    })
    doRandom('Random.natural(1)', function(expr, data, message) {
        ok(data >= 1, message)
    })

    doRandom('Random.integer()', function(expr, data, message) {
        ok(data >= -9007199254740992, message)
        ok(data <= 9007199254740992, message)
    })
    doRandom('Random.integer(-10, 10)', function(expr, data, message) {
        ok(data >= -10, message)
        ok(data <= 10, message)
    })

    // 1 整数部分 2 小数部分
    var RE_FLOAT = /(\-?\d+)\.?(\d+)?/

    function floatValidator(float, message, min, max, dmin, dmax) {
        RE_FLOAT.lastIndex = 0
        var parts = RE_FLOAT.exec(float + '')
        parts[1] = +parts[1]

        ok(parts[1] >= min, message)
        ok(parts[1] <= max, message)

        /* jshint -W041 */
        if (parts[2] != undefined) {
            ok(parts[2].length >= dmin, message)
            ok(parts[2].length <= dmax, message)
        }
    }

    doRandom('Random.float()', function(expr, data, message) {
        floatValidator(data, message, -9007199254740992, 9007199254740992, 0, 17)
    })
    doRandom('Random.float(0)', function(expr, data, message) {
        floatValidator(data, message, 0, 9007199254740992, 0, 17)
    })
    doRandom('Random.float(60, 100)', function(expr, data, message) {
        floatValidator(data, message, 60, 100, 0, 17)
    })
    doRandom('Random.float(60, 100, 3)', function(expr, data, message) {
        floatValidator(data, message, 60, 100, 3, 17)
    })
    doRandom('Random.float(60, 100, 3, 5)', function(expr, data, message) {
        floatValidator(data, message, 60, 100, 3, 5)
    })

    var CHARACTER_LOWER = 'abcdefghijklmnopqrstuvwxyz'
    var CHARACTER_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var CHARACTER_NUMBER = '0123456789'
    var CHARACTER_SYMBOL = '!@#$%^&*()[]'
    doRandom('Random.character()', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 1, message)
        ok(
            (
                CHARACTER_LOWER +
                CHARACTER_UPPER +
                CHARACTER_NUMBER +
                CHARACTER_SYMBOL
            ).indexOf(data) != -1,
            message
        )
    })
    doRandom('Random.character("lower")', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 1, message)
        ok(
            CHARACTER_LOWER.indexOf(data) != -1,
            message
        )
    })
    doRandom('Random.character("upper")', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 1, message)
        ok(
            CHARACTER_UPPER.indexOf(data) != -1,
            message
        )
    })
    doRandom('Random.character("number")', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 1, message)
        ok(
            CHARACTER_NUMBER.indexOf(data) != -1,
            message
        )
    })
    doRandom('Random.character("symbol")', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 1, message)
        ok(
            CHARACTER_SYMBOL.indexOf(data) != -1,
            message
        )
    })
    doRandom('Random.character("aeiou")', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 1, message)
        ok(
            'aeiou'.indexOf(data) != -1,
            message
        )
    })

    doRandom('Random.string()', function(expr, data, message) {
        equal(typeof data, 'string', message)
        ok(data.length >= 3, message)
        ok(data.length <= 7, message)
    })
    doRandom('Random.string(5)', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 5, message)
    })
    doRandom('Random.string("lower", 5)', function(expr, data, message) {
        equal(typeof data, 'string', message)
        equal(data.length, 5, message)
        for (var i = 0; i < data.length; i++) {
            ok(
                CHARACTER_LOWER.indexOf(data[i]) != -1,
                message
            )
        }
    })
    doRandom('Random.string(7, 10)', function(expr, data, message) {
        equal(typeof data, 'string', message)
        ok(data.length >= 7, message)
        ok(data.length <= 10, message)
    })
    doRandom('Random.string("aeiou", 1, 3)', function(expr, data, message) {
        equal(typeof data, 'string', message)
        ok(data.length >= 1, message)
        ok(data.length <= 3, message)
        for (var i = 0; i < data.length; i++) {
            ok(
                'aeiou'.indexOf(data[i]) != -1,
                message
            )
        }
    })

    doRandom('Random.range(10)', function(expr, data, message) {
        ok(data instanceof Array, message)
        equal(data.length, 10, message)
    })
    doRandom('Random.range(3, 7)', function(expr, data, message) {
        ok(data instanceof Array, message)
        deepEqual(data, [3, 4, 5, 6], message)
    })
    doRandom('Random.range(1, 10, 2)', function(expr, data, message) {
        ok(data instanceof Array, message)
        deepEqual(data, [1, 3, 5, 7, 9], message)
    })
    doRandom('Random.range(1, 10, 3)', function(expr, data, message) {
        ok(data instanceof Array, message)
        deepEqual(data, [1, 4, 7], message)
    })

    var RE_DATE = /\d{4}-\d{2}-\d{2}/
    var RE_TIME = /\d{2}:\d{2}:\d{2}/
    var RE_DATETIME = new RegExp(RE_DATE.source + ' ' + RE_TIME.source)

    doRandom('Random.date()', function(expr, data, message) {
        ok(RE_DATE.test(data), message)
    })

    doRandom('Random.time()', function(expr, data, message) {
        ok(RE_TIME.test(data), message)
    })

    doRandom('Random.datetime()', function(expr, data, message) {
        ok(RE_DATETIME.test(data), message)
    })
    doRandom('Random.datetime("yyyy-MM-dd A HH:mm:ss")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.datetime("yyyy-MM-dd a HH:mm:ss")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.datetime("yy-MM-dd HH:mm:ss")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.datetime("y-MM-dd HH:mm:ss")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.datetime("y-M-d H:m:s")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")', function(expr, data, message) {
        ok(true, message)
    })

    doRandom('Random.now()', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("year")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("month")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("day")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("hour")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("minute")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("second")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("week")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.now("yyyy-MM-dd HH:mm:ss SS")', function(expr, data, message) {
        ok(true, message)
    })
})

test('Image', function() {
    doRandom('Random.image()', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.dataImage()', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.dataImage("200x100")', function(expr, data, message) {
        ok(true, message)
    })
    doRandom('Random.dataImage("200x100", "Hello Mock.js!")', function(expr, data, message) {
        ok(true, message)
    })
})

var RE_COLOR = /^#[0-9a-fA-F]{6}$/
test('Color', function() {
    doRandom('Random.color()', function(expr, data, message) {
        ok(RE_COLOR.test(data), message)
    })
})

test('Text', function() {
    doRandom('Random.paragraph()', function(expr, data, message) {
        ok(data, message)
        var len = data.split('.').length - 1
        ok(len >= 3, message + '(' + len + ')')
        ok(len <= 7, message + '(' + len + ')')
    })
    doRandom('Random.paragraph(2)', function(expr, data, message) {
        ok(data, message)
        var len = data.split('.').length - 1
        equal(len, 2, message + '(' + len + ')')
    })
    doRandom('Random.paragraph(1, 3)', function(expr, data, message) {
        ok(data, message)
        var len = data.split('.').length - 1
        ok(len >= 1, message + '(' + len + ')')
        ok(len <= 3, message + '(' + len + ')')
    })

    doRandom('Random.sentence()', function(expr, data, message) {
        equal(data[0], data.toUpperCase()[0], message)
        var len = data.split(' ').length
        ok(len >= 12, message + '(' + len + ')')
        ok(len <= 18, message + '(' + len + ')')
    })
    doRandom('Random.sentence(4)', function(expr, data, message) {
        equal(data[0], data.toUpperCase()[0], message)
        var len = data.split(' ').length
        equal(len, 4, message + '(' + len + ')')
    })
    doRandom('Random.sentence(3, 5)', function(expr, data, message) {
        equal(data[0], data.toUpperCase()[0], message)
        var len = data.split(' ').length
        ok(len >= 3, message + '(' + len + ')')
        ok(len <= 5, message + '(' + len + ')')
    })

    doRandom('Random.word()', function(expr, data, message) {
        var len = data.length
        ok(len >= 3, message + '(' + len + ')')
        ok(len <= 10, message + '(' + len + ')')
    })
    doRandom('Random.word(4)', function(expr, data, message) {
        var len = data.length
        equal(len, 4, message + '(' + len + ')')
    })
    doRandom('Random.word(3, 5)', function(expr, data, message) {
        var len = data.length
        ok(len >= 3, message + '(' + len + ')')
        ok(len <= 5, message + '(' + len + ')')
    })

    doRandom('Random.title()', function(expr, data, message) {
        var words = data.split(' ')
        var len = words.length
        for (var i = 0; i < len; i++) {
            equal(words[i][0].toUpperCase(), words[i][0], message + '(' + len + ')')
        }
        ok(len >= 3, message + '(' + len + ')')
        ok(len <= 7, message + '(' + len + ')')
    })
    doRandom('Random.title(4)', function(expr, data, message) {
        var words = data.split(' ')
        var len = words.length
        for (var i = 0; i < len; i++) {
            equal(words[i][0].toUpperCase(), words[i][0], message + '(' + len + ')')
        }
        equal(len, 4, message + '(' + len + ')')
    })
    doRandom('Random.title(3, 5)', function(expr, data, message) {
        var words = data.split(' ')
        var len = words.length
        for (var i = 0; i < len; i++) {
            equal(words[i][0].toUpperCase(), words[i][0], message + '(' + len + ')')
        }
        ok(len >= 3, message + '(' + len + ')')
        ok(len <= 5, message + '(' + len + ')')
    })
})

test('Name', function() {
    doRandom('Random.first()', function(expr, data, message) {
        equal(data[0].toUpperCase(), data[0], message)
    })
    doRandom('Random.last()', function(expr, data, message) {
        equal(data[0].toUpperCase(), data[0], message)
    })
    doRandom('Random.name()', function(expr, data, message) {
        var words = data.split(' ')
        equal(words.length, 2, message)
        equal(words[0][0].toUpperCase(), words[0][0], message)
        equal(words[1][0].toUpperCase(), words[1][0], message)
    })
    doRandom('Random.name(true)', function(expr, data, message) {
        var words = data.split(' ')
        equal(words.length, 3, message)
        equal(words[0][0].toUpperCase(), words[0][0], message)
        equal(words[1][0].toUpperCase(), words[1][0], message)
        equal(words[2][0].toUpperCase(), words[2][0], message)
    })

    doRandom('Random.cfirst()', function(expr, data, message) {
        ok(data, message)
    })
    doRandom('Random.clast()', function(expr, data, message) {
        ok(data, message)
    })
    doRandom('Random.cname()', function(expr, data, message) {
        ok(data, message)
    })
})

var RE_URL = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
var RE_IP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
test('Web', function() {
    doRandom('Random.url()', function(expr, data, message) {
        ok(RE_URL.test(data), message)
    })
    doRandom('Random.domain()', function(expr, data, message) {
        ok(data, message)
    })
    doRandom('Random.domain("com")', function(expr, data, message) {
        ok(
            data.indexOf('.com') != -1,
            message
        )
    })
    doRandom('Random.tld()', function(expr, data, message) {
        ok(data, message)
    })

    doRandom('Random.email()', function(expr, data, message) {
        ok(data, message)
    })
    doRandom('Random.email("nuysoft.com")', function(expr, data, message) {
        ok(
            data.indexOf('@nuysoft.com') != -1,
            message
        )
    })
    doRandom('Random.ip()', function(expr, data, message) {
        ok(RE_IP.test(data), message)
    })
})
test('Address', function() {
    doRandom('Random.area()', function(expr, data, message) {
        ok(
            _.indexOf(Random.areas, data) != -1,
            message
        )
    })
    doRandom('Random.region()', function(expr, data, message) {
        ok(
            Random.regions.join(' ').indexOf(data) != -1,
            message
        )
    })
})
test('Helpers', function() {
    doRandom('Random.capitalize()', function(expr, data, message) {
        equal(data, 'Undefined', message)
    })
    doRandom('Random.capitalize("hello")', function(expr, data, message) {
        equal(data, 'Hello', message)
    })

    doRandom('Random.upper()', function(expr, data, message) {
        equal(data, 'UNDEFINED', message)
    })
    doRandom('Random.upper("hello")', function(expr, data, message) {
        equal(data, 'HELLO', message)
    })

    doRandom('Random.lower()', function(expr, data, message) {
        equal(data, 'undefined', message)
    })
    doRandom('Random.lower("HELLO")', function(expr, data, message) {
        equal(data, 'hello', message)
    })

    doRandom('Random.pick()', function(expr, data, message) {
        equal(data, undefined, message)
    })
    doRandom('Random.pick(["a", "e", "i", "o", "u"])', function(expr, data, message) {
        ok(
            _.indexOf(["a", "e", "i", "o", "u"], data) != -1,
            message
        )
    })

    doRandom('Random.shuffle()', function(expr, data, message) {
        deepEqual(data, [], message)
    })
    doRandom('Random.shuffle(["a", "e", "i", "o", "u"])', function(expr, data, message) {
        notEqual(data.join(''), 'aeiou', message)
        equal(data.sort().join(''), 'aeiou', message)
    })
})

var RE_GUID = /[a-fA-F0-9]{8}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{12}/
test('Miscellaneous', function() {
    doRandom('Random.guid()', function(expr, data, message) {
        equal(data.length, 36, message)
        ok(RE_GUID.test(data), message)
    })
    doRandom('Random.id()', function(expr, data, message) {
        equal(data.length, 18, message)
    })
})