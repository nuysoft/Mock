var Mock = require('../src/mock'),
  Print = require('node-print'),
  $ = require('jquery');

Mock.mockjax($)

exports.testOrigArray = function(test) {
  var arr = [{
      foo: 'foo'
    }, {
      bar: 'bar'
    }, {
      foobar: 'foobar'
    }
  ];
  var data = Mock.mock({
    arr: arr
  })
  test.ok(data.arr === arr)
  test.done();
}

exports.testArray = function(test) {
  function t(name, min, max) {
    var tpl = {}
    tpl[name] = [{}]

    var data = Mock.mock(tpl)
    test.ok(data.list.length >= min && data.list.length <= max, name)
  }

  t('list|1', 1, 1)
  t('list|10', 10, 10)
  t('list|5-10', 5, 10)

  test.done();
};

exports.testSelect = function(test) {
  function t(name, value) {
    var tpl = {}
    tpl[name] = value
    var data = Mock.mock(tpl)
    test.ok(value.indexOf(data.opt) >= 0)
  }

  t('opt|1', [1, 2, 4, 8]);
  t('opt|1', ['GET', 'POST', 'HEAD', 'DELETE']);
  t('opt|1', [{
      a: 1
    }, {
      a: 2
    }, {
      a: 3
    }, {
      a: 4
    }
  ]);

  test.done();
}

exports.testFloat = function(test) {
  function t(name, value, min, max, dmin, dmax) {
    var tpl = {}
    tpl[name] = value

    var data = Mock.mock(tpl)
    test.ok(data.float >= min && data.float < max, name)

    var sfloat = data.float + '',
      decimal = sfloat.slice(sfloat.indexOf('.') + 1);
    test.ok(decimal.length >= dmin && decimal.length <= dmax, name)
  }

  t('float|.1-10', 10, 10, 11, 1, 10)
  t('float|.3-10', 123.123, 123, 124, 3, 10)
  t('float|20-100.1-10', 10, 20, 100, 1, 10)
  t('float|99.1-10', 10, 99, 100, 1, 10)

  test.done();
};
exports.testInteger = function(test) {
  function t(name, value, min, max) {
    var tpl = {}
    tpl[name] = value

    var data = Mock.mock(tpl)
    test.ok(data.integer != value && data.integer >= min && data.integer <= max, name)
  }

  t('integer|2-100', 1, 2, 100)
  t('integer|100-2', 1, 2, 100)
  t('integer|2-2', 1, 2, 2)

  test.done();
}
exports.testString = function(test) {
  function t(name, value, min, max) {
    var tpl = {}
    tpl[name] = value

    var data = Mock.mock(tpl)
    test.ok(data.string.length >= min && data.string.length <= max, name)
  }

  t('string|1-10', '★号', 2, 20)
  t('string|10', '★号', 20, 20)

  test.done();
}
exports.testBoolean = function(test) {
  var data = Mock.mock({
    'bool|0-1': false
  });
  test.ok(data.bool === true || data.bool === false);
  test.done();
}
exports.testHolder = function(test) {
  test.expect(0)

  function t(value) {
    var tpl = {
      holder: value
    }
    var data = Mock.mock(tpl)
    console.log(value, data)
  }
  t('@EMAIL')
  t('@DATE')
  t('@TIME')
  t('@DATETIME')
  test.done();
}

exports.testComplex = function(test) {
  test.expect(0)
  var tpl = {
    'list|1-10': [{
        'id|+1': 1,
        'grade|1-100': 1,
        'float|1-100.1-10': 1,
        'star|1-5': '★',
        'published|0-1': false,
        'email': '@EMAIL',
        'date': '@DATE',
        'time': '@TIME(yyyy-mm-dd)',
        'datetime': '@DATETIME'
      }
    ]
  }
  var data = Mock.mock(tpl)
  Print.pt(data.list)
  test.done();
}

exports.testRequest = function(test) {
  Mock.mock(/\.json/, {
    'list|1-10': [{
        'id|+1': 1,
        'email': '@EMAIL'
      }
    ]
  })
  console.log('testRequest');
  $.ajax({
    url: 'data.json',
    dataType: 'json',
    success: function(data) {
      test.ok(data.list.length, 'data.json');
      Print.pt(data.list)
    },
    complete: function() {
      test.done();
    }
  })
}

exports.testRandom = function(test) {
  console.log('testRandom');

  function t(name, result) {
    Print.pf('%40s %s', name, result);
  }

  var Random = Mock.Random
  t('bool()', Random.bool())
  t('natural()', Random.natural())
  t('natural(1,3)', Random.natural(1, 3))
  t('natural(1)', Random.natural(1))
  t('integer()', Random.integer())
  t('integer(-10, 10)', Random.integer(-10, 10))
  t('character()', Random.character())
  t('character("lower")', Random.character('lower'))
  t('character("upper")', Random.character('upper'))
  t('character("number")', Random.character('number'))
  t('character("symbol")', Random.character('symbol'))
  t('string()', Random.string())
  t('string(10,20)', Random.string(10, 20))
  t('string(10)', Random.string(10))

  t('date()', Random.date())
  t('time()', Random.time())
  t('datetime()', Random.datetime())
  t('datetime("yyyy-MM-dd A HH:mm:ss")', Random.datetime("yyyy-MM-dd A HH:mm:ss"))
  t('datetime("yyyy-MM-dd a HH:mm:ss")', Random.datetime("yyyy-MM-dd a HH:mm:ss"))
  t('datetime("yy-MM-dd HH:mm:ss")', Random.datetime("yy-MM-dd HH:mm:ss"))
  t('datetime("y-MM-dd HH:mm:ss")', Random.datetime("y-MM-dd HH:mm:ss"))
  t('datetime("y-M-d H:m:s")', Random.datetime("y-M-d H:m:s"))

  t('img()', Random.img())
  t('img()', Random.img('100x200', '000'))
  t('img()', Random.img('100x200', '000', 'hello'))
  t('img()', Random.img('100x200', '000', 'FFF', 'hello'))
  t('img()', Random.img('100x200', '000', 'FFF', 'png', 'hello'))

  t('capitalize()', Random.capitalize('hello'))
  t('pick()', Random.pick(Random.ad_size))

  t('word()', Random.word())
  t('sentence()', Random.sentence())
  t('paragraph()', Random.paragraph())

  t('first()', Random.first())
  t('last()', Random.last())
  t('name()', Random.name())
  t('name(true)', Random.name(true))

  t('domain()', Random.domain())
  t('email()', Random.email())
  t('ip()', Random.ip())
  t('tld()', Random.tld())

  t('d4()', Random.d4())
  t('d6()', Random.d6())
  t('d8()', Random.d8())
  t('d12()', Random.d12())
  t('d20()', Random.d20())
  t('d100()', Random.d100())

  t('guid()', Random.guid())
  t('id()', Random.id())

  t('area()', Random.area())
  t('region()', Random.region())

  test.ok(true);
  test.done();
}