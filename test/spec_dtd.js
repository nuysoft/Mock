// 数据模板定义（Data Temaplte Definition，DTD）
module('DTD')

// 1 整数部分 2 小数部分
var RE_FLOAT = /([\+\-]?\d+)\.?(\d+)?/

test('Basic', function() {
    doit('', function(tpl, data, message) {
        equal(data, tpl, message)
    })
    doit('foo', function(tpl, data, message) {
        equal(data, tpl, message)
    })
    doit(1, function(tpl, data, message) {
        equal(data, tpl, message)
    })
    doit(true, function(tpl, data, message) {
        equal(data, tpl, message)
    })
    doit(false, function(tpl, data, message) {
        equal(data, tpl, message)
    })
    doit({}, function(tpl, data, message) {
        deepEqual(data, tpl, message)
    })
    doit([], function(tpl, data, message) {
        deepEqual(data, tpl, message)
    })
    doit(function() {}, function(tpl, data, message) {
        equal(data, undefined, message)
    })
    doit('@EMAIL', function(tpl, data, message) {
        notEqual(data, tpl, message)
    })
})

test('String', function() {
    doit({
        'name|1-10': '★号'
    }, function(tpl, data, message) {
        equal(typeof data.name, 'string', message)
        ok(data.name.length >= 2, message)
        ok(data.name.length <= 20, message)
    })
    doit({
        'name|10': '★号'
    }, function(tpl, data, message) {
        equal(typeof data.name, 'string', message)
        ok(data.name.length === 20, message)
    })
})

test('Number', function() {
    // `'name|+step': value`
    doit({
        'list|10': [{
            'name|+1': 100
        }]
    }, function(tpl, data, message) {
        equal(data.list.length, 10, message)
        _.each(data.list, function(item, index) {
            equal(typeof item.name, 'number', message)
            // if (index === 0) equal(item.name, 100, message)
            if (index > 0) equal(item.name, data.list[index - 1].name + 1, message)
        })
    })

    // `'name|min-max': value`
    doit({
        'name|1-10': 100
    }, function(tpl, data, message) {
        equal(typeof data.name, 'number', message)
        ok(data.name >= 1, message)
        ok(data.name <= 10, message)
    })
    doit({
        'name|10-1': 100
    }, function(tpl, data, message) {
        equal(typeof data.name, 'number', message)
        ok(data.name >= 1, message)
        ok(data.name <= 10, message)
    })
    doit({ // #26 生成规则 支持 负数，例如 number|-100-100
        'name|-10--1': 100
    }, function(tpl, data, message) {
        equal(typeof data.name, 'number', message)
        ok(data.name >= -10, message)
        ok(data.name <= -1, message)
    })
    doit({
        'name|-1--10': 100
    }, function(tpl, data, message) {
        equal(typeof data.name, 'number', message)
        ok(data.name >= -10, message)
        ok(data.name <= -1, message)
    })
    doit({
        'name|10-10': 100
    }, function(tpl, data, message) {
        equal(typeof data.name, 'number', message)
        ok(data.name === 10, message)
    })

    function numberValid(number, min, max, dmin, dmax, message) {
        equal(typeof number, 'number', message)
        var parts = function() {
            RE_FLOAT.lastIndex = 0
            return RE_FLOAT.exec('' + number)
        }()
        ok(+parts[1] >= min, message)
        ok(+parts[1] <= max, message)
        ok(parts[2].length >= dmin, message)
        ok(parts[2].length <= dmax, message)
    }

    // `'name|min-max.dmin-dmax': value`
    doit({
        'name|1-10.1-10': 123.456
    }, function(tpl, data, message) {
        numberValid(data.name, 1, 10, 1, 10, message)
    })
    // `'name|min-max.dcount': value`
    doit({
        'name|1-10.10': 123.456
    }, function(tpl, data, message) {
        numberValid(data.name, 1, 10, 10, 10, message)
    })
    // `'name|count.dmin-dmax': value`
    doit({
        'name|10.1-10': 123.456
    }, function(tpl, data, message) {
        numberValid(data.name, 10, 10, 1, 10, message)
    })
    // `'name|count.dcount': value`
    doit({
        'name|10.10': 123.456
    }, function(tpl, data, message) {
        numberValid(data.name, 10, 10, 10, 10, message)
    })
    // `'name|.dmin-dmax': value`
    doit({
        'name|.1-10': 123.456
    }, function(tpl, data, message) {
        numberValid(data.name, 123, 123, 1, 10, message)
    })
    // `'name|.dcount': value`
    doit({
        'name|.10': 123.456
    }, function(tpl, data, message) {
        numberValid(data.name, 123, 123, 10, 10, message)
    })
})

test('Boolean', function() {
    // `'name|1': value`
    doit({
        'name|1': true
    }, function(tpl, data, message) {
        equal(typeof data.name, 'boolean', message)
    })
    // `'name|min-max': value`
    doit({
        'name|8-2': true
    }, function(tpl, data, message) {
        equal(typeof data.name, 'boolean', message)
    })
})

/* jshint -W083 */
test('Object', function() {
    var methods = {
        GET: '@URL',
        POST: '@URL',
        HEAD: '@URL',
        PUT: '@URL',
        DELETE: '@URL'
    }
    var methodsLength = _.keys(methods).length
    var tpl;

    // `'name|min-max': {}`
    for (var min = 0, max; min <= methodsLength + 1; min++) {
        tpl = {}
        max = Random.integer(0, methodsLength)
        // methods|0-? |1-? |2-? |3-? |4-? |5-? |6-?
        tpl['methods|' + min + '-' + max] = methods
        doit(tpl, function(tpl, data, message) {
            ok(_.keys(data.methods).length >= Math.min(min, max), message)
            ok(_.keys(data.methods).length <= Math.max(min, max), message)
        })
    }

    // `'name|count': {}`
    for (var count = 0; count <= methodsLength + 1; count++) {
        tpl = {}
        tpl['methods|' + count] = methods
        doit(tpl, function(tpl, data, message) {
            equal(
                _.keys(data.methods).length,
                Math.min(count, methodsLength),
                message
            )
        })
    }

})
test('Array', function() {
    var array

    // `'name': []`
    array = [{
        foo: 'foo'
    }, {
        bar: 'bar'
    }, {
        foobar: 'foobar'
    }]
    doit({
        'name': array
    }, function(tpl, data, message) {
        notEqual(data.name, array, message)
        deepEqual(data.name, array, message)
    })

    // `'name|1': []`
    array = [1, 2, 4, 8]
    doit({
        'name|1': array
    }, function(tpl, data, message) {
        ok(_.indexOf(array, data.name) != -1, message)
    })
    array = ['GET', 'POST', 'HEAD', 'DELETE']
    doit({
        'name|1': array
    }, function(tpl, data, message) {
        ok(_.indexOf(array, data.name) != -1, message)
    })
    doit({
        'name|1': []
    }, function(tpl, data, message) {
        equal(data.name.length, 0, message)
    })

    // `'name|+1': [{}, {} ...]`
    doit({
        'list|5': [{
            'name|+1': ['a', 'b', 'c']
        }]
    }, function(tpl, data, message) {
        equal(data.list.length, 5, message)
        equal(data.list[0].name, 'a', message)
        equal(data.list[1].name, 'b', message)
        equal(data.list[2].name, 'c', message)
        equal(data.list[3].name, 'a', message)
        equal(data.list[4].name, 'b', message)
    })
    doit({
        'list|5-10': [{
            'name|+1': ['@integer', '@email', '@boolean']
        }]
    }, function(tpl, data, message) {
        ok(data.list.length >= 5, message)
        ok(data.list.length <= 10, message)
        equal(typeof data.list[0].name, 'number', message)
        equal(typeof data.list[1].name, 'string', message)
        equal(typeof data.list[2].name, 'boolean', message)
        equal(typeof data.list[3].name, 'number', message)
        equal(typeof data.list[4].name, 'string', message)
    })

    // `'name|1': [{}, {} ...]`
    doit({
        'name|1': [{}]
    }, function(tpl, data, message) {
        deepEqual(data.name, {}, message)
    })
    doit({
        'name|1': [{}, {}, {}]
    }, function(tpl, data, message) {
        deepEqual(data.name, {}, message)
    })
    array = [{
        method: 'GET'
    }, {
        method: 'POST'
    }, {
        method: 'HEAD'
    }, {
        method: 'DELETE'
    }]
    doit({
        'name|1': array
    }, function(tpl, data, message) {
        ok(
            _.indexOf(
                ['GET', 'POST', 'HEAD', 'DELETE'],
                data.name.method
            ) != -1,
            message
        )
    })
    // `'name|min-max': [{}, {} ...]`
    doit({
        'name|1-1': [{}]
    }, function(tpl, data, message) {
        equal(data.name.length, 1, message)
        deepEqual(data.name[0], {}, message)
    })
    doit({
        'name|1-10': [{}]
    }, function(tpl, data, message) {
        ok(data.name.length >= 1, message)
        ok(data.name.length <= 10, message)
        _.each(data.name, function(item, index) {
            deepEqual(item, {}, message)
        })
    })
    doit({
        'name|1-10': [{}, {}]
    }, function(tpl, data, message) {
        ok(data.name.length >= 2, message)
        ok(data.name.length <= 20, message)
        _.each(data.name, function(item, index) {
            deepEqual(item, {}, message)
        })
    })
    // `'name|count': [{}, {} ...]`
    doit({
        'name|10': [{}]
    }, function(tpl, data, message) {
        equal(data.name.length, 10, message)
        _.each(data.name, function(item, index) {
            deepEqual(item, {}, message)
        })
    })
    doit({
        'name|10': [{}, {}]
    }, function(tpl, data, message) {
        equal(data.name.length, 20, message)
        _.each(data.name, function(item, index) {
            deepEqual(item, {}, message)
        })
    })
})
test('Function', function() {
    // `'name': function(){}`
    doit({
        prop: 'hello',
        nameFn: function(root, path) {
            return this.prop
        }
    }, function(tpl, data, message) {
        equal(data.nameFn, 'hello', message)
    })
    doit({ // 无序的 function
        nameFn2: function() {
            return this.prop * 2
        },
        prop: 1,
        nameFn4: function() {
            return this.prop * 4
        }
    }, function(tpl, data, message) {
        equal(data.nameFn2, 2, message)
        equal(data.nameFn4, 4, message)
    })
    doit({ // #25 改变了非函数属性的顺序，查找起来不方便
        nameFn: function() {},
        first: '',
        second: '',
        third: ''
    }, function(tpl, data, message) {
        var keys = _.keys(data)
        equal('first', keys[0], message)
        equal('second', keys[1], message)
        equal('third', keys[2], message)
        equal('nameFn', keys[3], message)
    })

})

test('Complex', function() {
    var data = Mock.mock({
        'title': 'Syntax Demo',

        'string1|1-10': '★',
        'string2|3': 'value',

        'number1|+1': 100,
        'number2|1-100': 100,
        'number3|1-100.1-10': 1,
        'number4|123.1-10': 1,
        'number5|123.3': 1,
        'number6|123.10': 1.123,

        'boolean1|1': true,
        'boolean2|1-2': true,

        'object1|2-4': {
            '110000': '北京市',
            '120000': '天津市',
            '130000': '河北省',
            '140000': '山西省'
        },
        'object2|2': {
            '310000': '上海市',
            '320000': '江苏省',
            '330000': '浙江省',
            '340000': '安徽省'
        },

        'array1|1': ['AMD', 'CMD', 'KMD', 'UMD'],
        'array2|1-10': ['Mock.js'],
        'array3|3': ['Mock.js'],

        'function': function() {
            return this.title
        }
    })
    ok(data, JSON.stringify(data, null, 4))
})