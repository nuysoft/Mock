/* global require, chai, describe, before, it */
/* global window */
var expect = chai.expect
var Mock, Random, $, _

describe('Mock.valid', function() {
    before(function(done) {
        require(['mock', 'underscore', 'jquery'], function() {
            Mock = arguments[0]
            window.Random = Random = Mock.Random
            _ = arguments[1]
            $ = arguments[2]
            expect(Mock).to.not.equal(undefined)
            expect(_).to.not.equal(undefined)
            expect($).to.not.equal(undefined)
            done()
        })
    })

    function stringify(json) {
        return JSON.stringify(json /*, null, 4*/ )
    }

    function title(tpl, data, result, test) {
        test.title = stringify(tpl) + ' VS ' + stringify(data) + '\n\tresult: ' + stringify(result)
        for (var i = 0; i < result.length; i++) {
            // test.title += '\n\t' + result[i].message
        }
    }

    function doit(tpl, data, len) {
        it('', function() {
            var result = Mock.valid(tpl, data)
            expect(result).to.be.an('array').with.length(len)
            title(tpl, data, result, this.test)
        })
    }

    describe('Name', function() {
        doit({
            name: 1
        }, {
            name: 1
        }, 0)

        doit({
            name1: 1
        }, {
            name2: 1
        }, 1)
    })
    describe('Value - Number', function() {
        doit({
            name: 1
        }, {
            name: 1
        }, 0)

        doit({
            name: 1
        }, {
            name: 2
        }, 1)

        doit({
            name: 1.1
        }, {
            name: 2.2
        }, 1)

        doit({
            'name|1-10': 1
        }, {
            name: 5
        }, 0)

        doit({
            'name|1-10': 1
        }, {
            name: 0
        }, 1)

        doit({
            'name|1-10': 1
        }, {
            name: 11
        }, 1)
    })
    describe('Value - String', function() {
        doit({
            name: 'value'
        }, {
            name: 'value'
        }, 0)

        doit({
            name: 'value1'
        }, {
            name: 'value2'
        }, 1)

        doit({
            'name|1': 'value'
        }, {
            name: 'value'
        }, 0)

        doit({
            'name|2': 'value'
        }, {
            name: 'valuevalue'
        }, 0)

        doit({
            'name|2': 'value'
        }, {
            name: 'value'
        }, 1)

        doit({
            'name|2-3': 'value'
        }, {
            name: 'value'
        }, 1)

        doit({
            'name|2-3': 'value'
        }, {
            name: 'valuevaluevaluevalue'
        }, 1)
    })
    describe('Value - Object', function() {
        doit({
            name: 1
        }, {
            name: 1
        }, 0)
        doit({
            name1: 1
        }, {
            name2: 2
        }, 1)
        doit({
            name1: 1,
            name2: 2
        }, {
            name3: 3
        }, 1)
        doit({
            name1: 1,
            name2: 2
        }, {
            name1: '1',
            name2: '2'
        }, 2)
        doit({
            a: {
                b: {
                    c: {
                        d: 1
                    }
                }
            }
        }, {
            a: {
                b: {
                    c: {
                        d: 2
                    }
                }
            }
        }, 1)
    })
    describe('Value - Array', function() {
        doit([1, 2, 3], [1, 2, 3], 0)

        doit([1, 2, 3], [1, 2, 3, 4], 1)

        doit({
            'name|2-3': [1]
        }, {
            'name': [1, 2, 3, 4]
        }, 1)

        doit({
            'name|2-3': [1]
        }, {
            'name': [1]
        }, 1)

        doit({
            'name|2-3': [1, 2, 3]
        }, {
            'name': [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]
        }, 1)

        doit({
            'name|2-3': [1, 2, 3]
        }, {
            'name': [1, 2, 3]
        }, 1)

        doit({
            'name|2-3': [1]
        }, {
            'name': [1, 1, 1]
        }, 0)

        doit({
            'name|2-3': [1]
        }, {
            'name': [1, 2, 3]
        }, 2)
    })
})