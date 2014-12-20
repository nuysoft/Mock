var Mock = require('../../src/mock'),
    Random = require('../../src/random'),
    Util = require('../../src/util'),
    Print = require('node-print'),
    jsdom = require("jsdom"),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    $ = require('jquery')(jsdom.jsdom().createWindow()),
    util = require('util'),
    _ = require('underscore');

require('../../src/mockjax')
require('../../src/mock4tpl')
require('../../src/mock4xtpl')

$.support.cors = true
$.ajaxSettings.xhr = function() {
    return new XMLHttpRequest
}

Mock.mockjax($)

// http://www.network-science.de/ascii/ doom
console.log(Util.heredoc(function() {
    /*
___  ___              _        _      
|  \/  |             | |      (_)     
| .  . |  ___    ___ | | __    _  ___ 
| |\/| | / _ \  / __|| |/ /   | |/ __|
| |  | || (_) || (__ |   <  _ | |\__ \
\_|  |_/ \___/  \___||_|\_\(_)| ||___/
                             _/ |     
                            |__/      
     */
}));

function range(input, min, max) {
    return input >= min && input <= max
}

var rEmail = /[\w.]+@\w+\.\w+/,
    rDate = /\d{4}-\d{2}-\d{2}/,
    rTime = /\d{2}:\d{2}:\d{2}/,
    rDatetime = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
    rFloat = /(\d+)\.?(\d+)?/;

exports.testBasic = function(test) {
    test.equal(Mock.mock(1), 1)

    test.equal(Mock.mock(true), true)
    test.equal(Mock.mock(false), false)

    test.equal(Mock.mock(''), '')
    test.equal(Mock.mock('foo'), 'foo')

    test.deepEqual(Mock.mock([]), [])
    test.deepEqual(Mock.mock({}), {})

    test.notEqual(Mock.mock('@EMAIL'), '@EMAIL')

    test.done()
}

exports.testOrigArray = function(test) {
    var arr = [{
        foo: 'foo'
    }, {
        bar: 'bar'
    }, {
        foobar: 'foobar'
    }];
    var data = Mock.mock({
        arr: arr
    })
    test.ok(data.arr.length === 3)
    test.ok(data.arr != arr)
    for (var i = 0; i < data.arr.length; i++) {
        test.ok(data.arr[i] !== arr[i])
    }
    test.done();
}

exports.testArray = function(test) {
    var data;

    data = Mock.mock({
        'list|1': [{}]
    })
    test.ok(data.list.length === 1)

    data = Mock.mock({
        'list|10': [{}]
    })
    test.ok(data.list.length === 10)

    data = Mock.mock({
        'list|5-10': [{}]
    })
    test.ok(data.list.length >= 5)
    test.ok(data.list.length <= 10)

    test.done();
};

exports.testPick = function(test) {
    function target(name, value) {
        var tpl = {}
        tpl[name] = value

        var data = Mock.mock(tpl)
        test.equal(typeof data.opt, typeof value[0])
        test.ok(value.indexOf(data.opt) >= 0)
    }

    target('opt|1', [1, 2, 4, 8])
    target('opt|1', ['GET', 'POST', 'HEAD', 'DELETE'])
    test.done();
}

exports.testPickObjectFromArray = function(test) {
    var tpl = {
        'opt|1': [{ // 对备选元素会再次做解析
            method: 'GET'
        }, {
            method: 'POST'
        }, {
            method: 'HEAD'
        }, {
            method: 'DELETE'
        }]
    }
    var data = Mock.mock(tpl)
    test.equal(typeof data.opt, typeof tpl['opt|1'][0])
    for (var i = 0; i < tpl['opt|1'].length; i++) {
        if (data.opt.method === tpl['opt|1'][i].method) {
            test.done();
            break;
        }
    }
}

exports.testPickFromObject = function(test) {
    var tpl = {
        'pick1|1': {
            get: '@URL',
            post: '@URL',
            head: '@URL',
            put: '@URL',
            'delete': '@URL'
        }
    }
    tpl['pick2|2'] = tpl['pick1|1']
    tpl['pick3|3'] = tpl['pick1|1']
    tpl['pick6|6'] = tpl['pick1|1']

    var data = Mock.mock(tpl)
    test.equal(1, _.keys(data.pick1).length)
    test.equal(2, _.keys(data.pick2).length)
    test.equal(3, _.keys(data.pick3).length)
    test.equal(5, _.keys(data.pick6).length)
    test.done()
}

exports.testFloat = function(test) {
    function target(tpl, min, max, dmin, dmax) {
        var data, parts, i;
        for (i = 0; i < 1000; i++) {
            data = Mock.mock(tpl)
            rFloat.lastIndex = 0
            parts = rFloat.exec('' + data.float) // 可能会自动转为整数，例如 10.0 > 10

            test.equal(typeof data.float, 'number', JSON.stringify(tpl))
            test.ok(data.float >= min && data.float <= max, JSON.stringify(tpl))
            if (parts[2]) test.ok(parts[2].length >= dmin && parts[2].length <= dmax, JSON.stringify(tpl))
        }
    }

    target({
        'float|.1-10': 10
    }, 10, 11, 1, 10)

    target({
        'float|.3-10': 123.123
    }, 123, 124, 3, 10)

    target({
        'float|20-100.1-10': 10
    }, 20, 101, 1, 10)

    target({
        'float|99.1-10': 10
    }, 99, 100, 1, 10)

    test.done();
};

exports.testInteger = function(test) {
    function target(tpl, min, max) {
        var data, i;
        for (i = 0; i < 1000; i++) {
            data = Mock.mock(tpl)
            test.equal(typeof data.integer, 'number')
            test.ok(data.integer != 1)
            test.ok(data.integer >= min && data.integer <= max)
        }
    }

    target({
        'integer|2-100': 1
    }, 2, 100)

    target({
        'integer|100-2': 1
    }, 2, 100)

    target({
        'integer|2-2': 1
    }, 2, 2)

    test.done();
}
exports.testString = function(test) {
    function target(tpl, min, max) {
        var data, i;
        for (i = 0; i < 1000; i++) {
            data = Mock.mock(tpl)

            test.equal(typeof data.string, 'string')
            test.ok(data.string.length >= min && data.string.length <= max)
        }
    }

    target({
        'string|1-10': '★号'
    }, 2, 20)

    target({
        'string|10': '★号'
    }, 20, 20)

    test.done();
}
exports.testBoolean = function(test) {
    var data, count = 0,
        i;
    for (i = 0; i < 1000; i++) {
        data = Mock.mock({
            'bool|1': false
        })

        test.ok(typeof data.bool === 'boolean');
        if (data.bool) count++
    }
    test.ok(range(count, 300, 700), count) // 可能会失败，但是仍在预期范围内，因为结果毕竟是随机的。
    test.done();
}
exports.testFunction = function(test) {
    var tpl = {
        prop: 'hello',
        fn: function(root, path) {
            return this.prop
        }
    }
    var data = Mock.mock(tpl)
    test.equal('hello', data.fn)
    test.done()
}
exports.testDisorderlyFunction = function(test) {
    var tpl = {
        xfn2: function() {
            return this.x * 2
        },
        x: 1,
        xfn4: function() {
            return this.x * 4
        }
    }
    var data = Mock.mock(tpl)
    test.equal('1', data.x)
    test.equal('2', data.xfn2)
    test.equal('4', data.xfn4)
    test.done()
}
exports.testHolder = function(test) {
    test.ok(rEmail.test(Mock.mock('@EMAIL')))
    test.ok(rDate.test(Mock.mock('@DATE')))
    test.ok(rTime.test(Mock.mock('@TIME')))
    test.ok(rDatetime.test(Mock.mock('@DATETIME')))

    test.done();
}

exports.testComplex = function(test) {
    var tpl = {
        'list|1-5': [{
            'id|+1': 1,
            'grade|1-100': 1,
            'float|1-100.1-10': 1,
            'star|1-5': '★',
            'published|1': false,
            'email': '@EMAIL',
            'date': '@DATE(HH:mm:ss)', // 属性 date 与 time 的格式互换
            'time': '@TIME(yyyy-MM-dd)',
            'datetime': '@DATETIME'
        }]
    };

    function validator(list) {
        var i, item, parts;
        test.ok(list.length >= 1 && list.length <= 5)
        for (i = 0; i < list.length; i++) {
            item = list[i]

            test.equal(typeof item.id, 'number')
            if (i > 0) test.equal(item.id, list[i - 1].id + 1)

            test.equal(typeof item.grade, 'number')
            test.ok(range(item.grade, 1, 100))

            test.equal(typeof item.float, 'number')
            test.ok(range(item.float, 1, 101))

            rFloat.lastIndex = 0
            parts = rFloat.exec('' + item.float) // 可能会自动转为整数，例如 10.0 > 10
            if (parts[2]) test.ok(parts[2].length >= 1 && parts[2].length <= 10)

            test.ok(range(item.star.length, 1, 5))

            test.equal(typeof item.published, 'boolean')

            test.ok(rEmail.test(item.email))
            test.ok(rTime.test(item.date))
            test.ok(rDate.test(item.time))
            test.ok(rDatetime.test(item.datetime))
        }
    }

    function target(tpl) {
        var list = Mock.mock(tpl).list
        if (false) {
            console.log();
            Print.pt(list)
        }
        validator(list)
    }

    for (var i = 0; i < 1000; i++) {
        target(tpl)
    }


    test.done();
}

exports.testRequest = function(test) {
    var count = 0;

    function validator(data) {
        test.ok(data.list)
        test.ok(data.list.length >= 1 && data.list.length <= 10);
        for (var i = 0, item; i < data.list.length; i++) {
            item = data.list[i]
            if (i > 0) test.equal(item.id, data.list[i - 1].id + 1)
            test.ok(rEmail.test(item.email), item.email)
        }
    }

    function success(data) {
        validator(data)
        count++
    }

    function complete(jqXHR, textStatus) {
        if (count === 1000) test.done()
    }

    // 拦截 hello.json 请求
    Mock.mock(/hello.json/, {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL'
        }]
    })

    for (i = 0; i < 1000; i++) {
        $.ajax({
            url: 'hello.json',
            dataType: 'json'
        }).done(success).complete(complete)
    }
}

exports.testRequestType = function(test) {
    var count = 0;

    function success(data) {
        count++
    }

    function complete() {
        if (count === 2) test.done()
    }

    Mock.mock(/type.json/, 'get', {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL',
            type: 'get'
        }]
    })
    Mock.mock(/type.json/, 'post', {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL',
            type: 'post'
        }]
    })

    $.ajax({
        url: 'type.json',
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.list[0].type, 'get')
    }).complete(complete)

    $.ajax({
        url: 'type.json',
        type: 'post',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.list[0].type, 'post')
    }).complete(complete)

}

exports.testRequestFunction = function(test) {
    var count = 0;

    function success(data) {
        count++
    }

    function complete() {
        if (count === 2) test.done()
    }

    Mock.mock(/fn\.json/, function() {
        return {
            type: 'fn'
        }
    })

    $.ajax({
        url: 'fn.json',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.type, 'fn')
    }).complete(complete)

    $.ajax({
        url: 'fn.json',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.type, 'fn')
    }).complete(complete)

}

exports.testRequestTypeFunction = function(test) {
    Mock._mocked = {}

    var count = 0;

    function success(data) {
        count++
    }

    function complete() {
        if (count === 3) test.done()
    }

    Mock.mock(/fn\.json/, /get/, function() {
        return {
            type: 'get'
        }
    })
    Mock.mock(/fn\.json/, /post|put/, function(options) {
        return {
            type: options.type.toLowerCase()
        }
    })

    $.ajax({
        url: 'fn.json',
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.type, 'get')
    }).complete(complete)

    $.ajax({
        url: 'fn.json',
        type: 'post',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.type, 'post')
    }).complete(complete)

    $.ajax({
        url: 'fn.json',
        type: 'put',
        dataType: 'json'
    }).done(function(data) {
        success(data)
        test.equal(data.type, 'put')
    }).complete(complete)

}

exports.testRandom = function(test) {
    function t(name, result, validator) {
        // Print.pf('%40s %s', name, result);
        if (validator) test.ok(validator(result), name);
    }

    // Basics
    t('bool()', Random.bool(), function(result) {
        return typeof result === 'boolean'
    })
    t('natural()', Random.natural(), function(result) {
        return range(result, 0, 9007199254740992)
    })
    t('natural(1,3)', Random.natural(1, 3), function(result) {
        return range(result, 1, 3)
    })
    t('natural(1)', Random.natural(1), function(result) {
        return result >= 1
    })
    t('integer()', Random.integer(), function(result) {
        return range(result, -9007199254740992, 9007199254740992)
    })
    t('integer(-10, 10)', Random.integer(-10, 10), function(result) {
        return range(result, -10, 10)
    })
    t('character()', Random.character())
    t('character("lower")', Random.character('lower'))
    t('character("upper")', Random.character('upper'))
    t('character("number")', Random.character('number'))
    t('character("symbol")', Random.character('symbol'))
    t('string()', Random.string())
    t('string(10,20)', Random.string(10, 20))
    t('string(10)', Random.string(10))

    // Date
    t('date()', Random.date())
    t('time()', Random.time())
    t('datetime()', Random.datetime())
    t('datetime("yyyy-MM-dd A HH:mm:ss")', Random.datetime("yyyy-MM-dd A HH:mm:ss"))
    t('datetime("yyyy-MM-dd a HH:mm:ss")', Random.datetime("yyyy-MM-dd a HH:mm:ss"))
    t('datetime("yy-MM-dd HH:mm:ss")', Random.datetime("yy-MM-dd HH:mm:ss"))
    t('datetime("y-MM-dd HH:mm:ss")', Random.datetime("y-MM-dd HH:mm:ss"))
    t('datetime("y-M-d H:m:s")', Random.datetime("y-M-d H:m:s"))
    // yyyy-MM-dd HH:mm:ss
    t('now("year")', Random.now('year'), function(result) {
        return Random.format(new Date(), 'yyyy-01-01 00:00:00') === result
    })
    t('now("month")', Random.now('month'), function(result) {
        return Random.format(new Date(), 'yyyy-MM-01 00:00:00') === result
    })
    t('now("day")', Random.now('day'), function(result) {
        return Random.format(new Date(), 'yyyy-MM-dd 00:00:00') === result
    })
    t('now("hour")', Random.now('hour'), function(result) {
        return Random.format(new Date(), 'yyyy-MM-dd HH:00:00') === result
    })
    t('now("minute")', Random.now('minute'), function(result) {
        return Random.format(new Date(), 'yyyy-MM-dd HH:mm:00') === result
    })
    t('now("second")', Random.now('second', 'yyyy-MM-dd HH:mm:ss SS'), function(result) {
        return Random.format(new Date(), 'yyyy-MM-dd HH:mm:ss 000') === result
    })
    t('now("week")', Random.now('week', 'yyyy-MM-dd HH:mm:ss SS'), function(result) {
        var date = new Date()
        date.setDate(date.getDate() - date.getDay())
        return Random.format(date, 'yyyy-MM-dd 00:00:00 000') === result
    })
    t('now("yyyy-MM-dd HH:mm:ss SS")', Random.now("yyyy-MM-dd HH:mm:ss SS"), function(result) {
        test.equal(Random.format(new Date(), 'yyyy-MM-dd HH:mm:ss SS'), result)
        return true
    })

    // Image
    t('img()', Random.img())
    t('img(100x200, 000)', Random.img('100x200', '000'))
    t('img(100x200, 000, hello)', Random.img('100x200', '000', 'hello'))
    t('img(100x200, 000, FFF, hello)', Random.img('100x200', '000', 'FFF', 'hello'))
    t('img(100x200, 000, FFF, png, hello)', Random.img('100x200', '000', 'FFF', 'png', 'hello'))

    // Color
    t('color()', Random.color())

    // Helpers
    t('capitalize()', Random.capitalize('hello'))
    t('pick()', Random.pick(Random.ad_size))
    t('shuffle()', Random.shuffle(Random.ad_size))

    // Text
    t('word()', Random.word())
    t('sentence()', Random.sentence())
    t('paragraph()', Random.paragraph())

    // Name
    t('first()', Random.first())
    t('last()', Random.last())
    t('name()', Random.name())
    t('name(true)', Random.name(true))

    // Web
    t('domain()', Random.domain())
    t('email()', Random.email())
    t('ip()', Random.ip())
    t('tld()', Random.tld())

    // Miscellaneous
    t('d4()', Random.d4())
    t('d6()', Random.d6())
    t('d8()', Random.d8())
    t('d12()', Random.d12())
    t('d20()', Random.d20())
    t('d100()', Random.d100())
    t('guid()', Random.guid())
    t('id()', Random.id())

    // Address
    t('area()', Random.area())
    t('region()', Random.region())

    test.done();
}

exports.test_escape = function(test) {
    var tpl;

    tpl = '\\@EMAIL'
    test.equal(Mock.mock(tpl), tpl)

    tpl = '\\\\@EMAIL' // TODO 如果有多个转义斜杠怎么办？只有奇数个转义斜杠，才会被认为是要转义 @
    test.equal(Mock.mock(tpl), tpl)

    test.done()
}

exports.test_range = function(test) {
    var data;

    data = Random.range()
    test.ok(util.isArray(data))
    test.equal(data.length, 0)
    // console.log(data)

    data = Random.range(10)
    test.ok(util.isArray(data))
    test.equal(data.length, 10)
    // console.log(data)

    data = Random.range(10, 20)
    test.ok(util.isArray(data))
    test.equal(data.length, 10)
    test.equal(data[0], 10)
    test.equal(data[9], 19)
    // console.log(data)

    data = Random.range(10, 20, 3)
    test.ok(util.isArray(data))
    test.equal(data.length, 4)
    test.equal(data[0], 10)
    test.equal(data[3], 19)
    // console.log(data)

    test.ok(true)
    test.done()
}

exports.test_increment = function(test) {
    test.equal(Random.increment(1), 1)
    test.equal(Random.increment(2), 3)
    test.equal(Random.increment(3), 6)
    test.done()
}

exports.test_reference = function(test) {
    var tpl = {
        name: '@first @last',
        first: 'fffffirst',
        last: 'lllllast'
    }
    var data = Mock.mock(tpl)
    test.equal(data.name, 'fffffirst lllllast')
    test.done()
}

// #25 改变了非函数属性的顺序，查找起来不方便
exports.test_key_order = function(test) {
    var tpl = {
        fn: function() {},
        first: '',
        second: '',
        third: ''
    }
    var data = Mock.mock(tpl)
    var keys = _.keys(data)
    test.equal('first', keys[0])
    test.equal('second', keys[1])
    test.equal('third', keys[2])
    test.equal('fn', keys[3])
    test.done()
}

// #26 生成规则 支持 负数，例如 number|-100-100
exports.test_negative_number = function(test) {
    var data

    data = Mock.mock({
        'number|-10--5': 1
    })
    test.ok(range(data.number, -10, -5), data.number)

    data = Mock.mock({
        'number|-5--10': 1
    })
    test.ok(range(data.number, -10, -5), data.number)

    test.done()
}

// #23 Mock.mockjax 导致 $.getScript 不执行回调
/*
    $.getScript('/test/nodeunit/noop.js', function(script, textStatus, jqXHR) {
        console.log(arguments)
    })
*/

// #22 步加载js文件的时候发现问题
/*
    $('<div>').load('/test/nodeunit/noop.html', function(responseText, textStatus, jqXHR) {
        console.log(arguments)
    })
*/