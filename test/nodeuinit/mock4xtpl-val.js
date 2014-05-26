var Mock4XTpl = require('../../src/mock4xtpl')
var KISSY = require('kissy')

KISSY.Config.debug = false

var object = {
    a: {
        b: {
            c: {
                d: 'd-1'
            }
        }
    },
    b: {
        c: {
            d: 'd-2'
        }
    },
    d: 'd-4',

    e: {
        f: {
            g: 'g-1'
        }
    }
}

/*
    Mock4XTpl.parseVal(expr, object) 负责从 object 中查找 expr 对应的值。
    该方法的行为类似于 querySelector() 和 querySelectorAll()。
*/
exports.test_simple = function(test) {
    var path, ret;

    // console.log()

    /*
        最基本的路径，从根属性开始
    */
    ret = Mock4XTpl.parseVal(path = 'a.b', object)
    test.deepEqual(ret, [{
        "c": {
            "d": "d-1"
        }
    }])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    ret = Mock4XTpl.parseVal(path = 'a.b.c', object)
    test.deepEqual(ret, [{
        "d": "d-1"
    }])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    ret = Mock4XTpl.parseVal(path = 'a.b.c.d', object)
    test.deepEqual(ret, ["d-1"])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    ret = Mock4XTpl.parseVal(path = 'a.b.c.d.e', object)
    test.deepEqual(ret, [])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    /*
        不同深度的属性，从根属性开始
    */
    ret = Mock4XTpl.parseVal(path = 'b.c', object)
    test.deepEqual(ret, [{
        "d": "d-2"
    }])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    /*
        深度不连续的属性
    */
    ret = Mock4XTpl.parseVal(path = 'a.c', object)
    test.deepEqual(ret, [{
        "d": "d-1"
    }])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    /*
        不同深度的属性，从非根属性开始
    */
    ret = Mock4XTpl.parseVal(path = 'c', object)
    test.deepEqual(ret, [{
        "d": "d-1"
    }, {
        "d": "d-2"
    }])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    ret = Mock4XTpl.parseVal(path = 'd', object)
    test.deepEqual(ret, ["d-4"])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    ret = Mock4XTpl.parseVal(path = 'c.d', object)
    test.deepEqual(ret, ["d-1", "d-2"])
    // console.log(path.red, JSON.stringify(ret, null, 4))

    test.ok(true)
    test.done()
}