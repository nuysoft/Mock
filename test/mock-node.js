var Mock = require('../src/mock'),
  Print = require('node-print'),
  $ = require('jquery');

// Mock.mockjax($)

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
  }]);

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
    console.log(value, data.holder)
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
    }]
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
    }]
  })
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