module('mock')

test('array', function() {
    function t(name, min, max) {
        var tpl = {}
        tpl[name] = [{}]

        var data = Mock.mock(tpl)
        ok(data.list.length >= min && data.list.length <= max, name)
    }
    t('list|1', 1, 1)
    t('list|10', 10, 10)
    t('list|5-10', 5, 10)
})

test('float', function() {
    function t(name, value, min, max, dmin, dmax) {
        var tpl = {}
        tpl[name] = value

        var data = Mock.mock(tpl)
        ok(data.float >= min && data.float < max, name + ' ' + data.float)

        var sfloat = data.float + '',
            decimal = sfloat.slice(sfloat.indexOf('.') + 1);
        ok(decimal.length >= dmin && decimal.length <= dmax, name)
    }

    t('float|.1-10', 10, 10, 11, 1, 10)
    t('float|.3-10', 123.123, 123, 124, 3, 10)
    t('float|20-100.1-10', 10, 20, 100, 1, 10)
    t('float|99.1-10', 10, 99, 100, 1, 10)
})

test('integer', function() {
    function t(name, value, min, max) {
        var tpl = {}
        tpl[name] = value

        var data = Mock.mock(tpl)
        ok(data.integer != value && data.integer >= min && data.integer <= max, name)
    }

    t('integer|2-100', 1, 2, 100)
    t('integer|100-2', 1, 2, 100)
    t('integer|2-2', 1, 2, 2)
})

test('string', function() {
    function t(name, value, min, max) {
        var tpl = {}
        tpl[name] = value

        var data = Mock.mock(tpl)
        ok(data.string.length >= min && data.string.length <= max, name)
    }

    t('string|1-10', '★号', 2, 20)
    t('string|10', '★号', 20, 20)
})

test('boolen', function() {
    var data = Mock.mock({
        'bool|0-1': false
    });
    ok(data.bool === true || data.bool === false);
})

test('holder', function() {
    function t(value) {
        var tpl = {
            holder: value
        }
        var data = Mock.mock(tpl)
        ok(data)
        // console.log(value, data.holder)
    }

    t('@EMAIL')
    t('@DATE')
    t('@TIME')
    t('@DATETIME')
})

test('ajax', function() {
    Mock.mock(/\.json/, {
        'list|1-10': [{
            'id|+1': 1
        }]
    })
    stop()
    if (window.$) {
        $.ajax({
            url: 'data.json',
            dataType: 'json',
            success: function(data) {
                // console.log(arguments)
                ok(data.list.length >= 1, 'data.json')
            },
            fail: function() {
                ok(false, 'data.json')
            },
            complete: function() {
                start()
            }
        })
    } else {
        expect(0)
        start()
    }
})

// @麦少 提供的 TC
test('jsonp', function() {
    Mock.mock(/\.json/, {
        'list|1-10': [{
            'id|+1': 1
        }]
    })
    stop()
    if (window.$) {
        $.ajax({
            url: 'data.json',
            dataType: 'jsonp',
            success: function(data) {
                ok(data.list.length >= 1, 'data.json')
            },
            fail: function() {
                ok(false, 'data.json')
            },
            complete: function() {
                start()
            }
        })
    } else {
        expect(0)
        start()
    }
})