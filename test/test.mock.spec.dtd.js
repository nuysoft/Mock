/* global require, chai, describe, before, it */
// 数据模板定义（Data Temaplte Definition，DTD）
/*
    ## BDD
    1. 结构 
        describe suite
            [ describe ]
            before after beforeEach afterEach
            it test
        done
            搜索 this.async = fn && fn.length
    2. 常用 expect
        expect().to
            .equal .deep.equal .not.equal
            .match
            .have.length .with.length
            .have.property .have.deep.property
            .to.be.a .to.be.an
            .that
            .least .most .within
    3. 速度 
        搜索 test.speed
        slow > 75
        75 / 2 < medium < 75
        fast < 75 / 2
 */
var expect = chai.expect
var Mock, $, _

describe('DTD', function() {
    before(function(done) {
        require(['mock', 'underscore', 'jquery'], function() {
            Mock = arguments[0]
            _ = arguments[1]
            $ = arguments[2]
            expect(Mock).to.not.equal(undefined)
            expect(_).to.not.equal(undefined)
            expect($).to.not.equal(undefined)
            done()
        })
    })
    describe('Literal', function() {
        it('', function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.equal(this.test.title)
        })
        it('foo', function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.equal(this.test.title)
        })
        it(1, function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.equal(this.test.title)
        })
        it(true, function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.equal(this.test.title)
        })
        it(false, function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.equal(this.test.title)
        })
        it({}, function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.deep.equal(this.test.title)
        })
        it([], function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.deep.equal(this.test.title)
        })
        it(function() {}, function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.equal(undefined)
        })
    })
    describe('String', function() {
        // `'name|min-max': 'value'`
        it('name|min-max', function() {
            var data = Mock.mock({
                'name|1-10': '★号'
            })
            expect(data.name).to.have.length.within(2, 20)
        })

        // `'name|count': 'value'`
        it('name|count', function() {
            var data = Mock.mock({
                'name|10': '★号'
            })
            expect(data.name).to.be.a('string')
                .that.have.length(20)
        })
    })
    describe('Number', function() {
        // `'name|+step': value`
        it('name|+step', function() {
            var data = Mock.mock({
                'list|10': [{
                    'name|+1': 100
                }]
            })
            expect(data.list).to.be.an('array').with.length(10)
            _.each(data.list, function(item, index) {
                expect(item).to.have.property('name')
                    .that.be.a('number')
                if (index === 0) expect(item.name).to.equal(100)
                else expect(item.name).to.equal(
                    data.list[index - 1].name + 1
                )
            })
        })

        // `'name|min-max': value`
        it('name|min-max', function() {
            var data = Mock.mock({
                'name|1-100': 100
            })
            expect(data).to.have.property('name')
                .that.be.a('number').within(1, 100)
        })
        it('name|max-min', function() {
            var data = Mock.mock({
                'name|100-1': 100
            })
            expect(data).to.have.property('name')
                .that.be.a('number').within(1, 100)
        })
        it('name|-min--max', function() {
            var data = Mock.mock({
                'name|-100--1': 100
            })
            expect(data).to.have.property('name')
                .that.be.a('number').within(-100, -1)
        })
        it('name|-max--min', function() {
            var data = Mock.mock({
                'name|-1--100': 100
            })
            expect(data).to.have.property('name')
                .that.be.a('number').within(-100, -1)
        })
        it('name|min-min', function() {
            var data = Mock.mock({
                'name|10-10': 100
            })
            expect(data).to.have.property('name')
                .that.be.a('number').equal(10)
        })
        it('name|count', function() {
            var data = Mock.mock({
                'name|10': 100
            })
            expect(data).to.have.property('name')
                .that.be.a('number').equal(10)
        })

        // `'name|min-max.dmin-dmax': value`

        // 1 整数部分 2 小数部分
        var RE_FLOAT = /([\+\-]?\d+)\.?(\d+)?/

        function validNumber(number, min, max, dmin, dmax) {
            expect(number).to.be.a('number')
            RE_FLOAT.lastIndex = 0
            var parts = RE_FLOAT.exec('' + number)
            expect(+parts[1]).to.be.a('number').within(min, max)
            expect(parts[2]).to.have.length.within(dmin, dmax)
        }

        it('name|min-max.dmin-dmax', function() {
            var data = Mock.mock({
                'name|1-10.1-10': 123.456
            })
            validNumber(data.name, 1, 10, 1, 10)
        })
        it('name|min-max.dcount', function() {
            var data = Mock.mock({
                'name|1-10.10': 123.456
            })
            validNumber(data.name, 1, 10, 10, 10)
        })
        it('name|count.dmin-dmax', function() {
            var data = Mock.mock({
                'name|10.1-10': 123.456
            })
            validNumber(data.name, 10, 10, 1, 10)
        })
        it('name|count.dcount', function() {
            var data = Mock.mock({
                'name|10.10': 123.456
            })
            validNumber(data.name, 10, 10, 10, 10)
        })
        it('name|.dmin-dmax', function() {
            var data = Mock.mock({
                'name|.1-10': 123.456
            })
            validNumber(data.name, 123, 123, 1, 10)
        })
        it('name|.dcount', function() {
            var data = Mock.mock({
                'name|.10': 123.456
            })
            validNumber(data.name, 123, 123, 10, 10)
        })
    })
    describe('Boolean', function() {
        // `'name|1': value` 
        it('name|1', function() {
            var data = Mock.mock({
                'name|1': true
            })
            expect(data).to.have.property('name')
                .that.be.a('boolean')
        })

        // `'name|min-max': value`
        it('name|min-max', function() {
            var data = Mock.mock({
                'name|8-2': true
            })
            expect(data).to.have.property('name')
                .that.be.a('boolean')
        })
    })
    describe('Object', function() {
        var methods = {
            GET: '@URL',
            POST: '@URL',
            HEAD: '@URL',
            PUT: '@URL',
            DELETE: '@URL'
        }
        var methodCount, tpl, data

        // `'name|min-max': {}`
        it('name|min-max', function() {
            methodCount = _.keys(methods).length // 5
            for (var min = 0, max; min <= methodCount + 1; min++) {
                tpl = {}
                max = Mock.Random.integer(0, methodCount)

                // methods|0-? |1-? |2-? |3-? |4-? |5-? |6-?
                tpl['methods|' + min + '-' + max] = methods
                data = Mock.mock(tpl)
                expect(_.keys(data.methods)).to.have.length
                    .that.within(Math.min(min, max), Math.max(min, max))
            }
        })

        // `'name|count': {}`
        it('name|count', function() {
            methodCount = _.keys(methods).length // 5
            for (var count = 0; count <= methodCount + 1; count++) {
                tpl = {}
                tpl['methods|' + count] = methods
                data = Mock.mock(tpl)
                expect(_.keys(data.methods)).to.have.length(
                    Math.min(count, methodCount)
                )
            }
        })
    })
    describe('Array', function() {
        // `'name': [{}, {} ...]`
        it('name', function() {
            var value = [{
                foo: 'foo'
            }, {
                bar: 'bar'
            }, {
                foobar: 'foobar'
            }]
            var data = Mock.mock({
                name: value
            })
            expect(data).to.have.property('name')
                .that.be.an('array').with.length(3)
                .that.not.equal(value)
            expect(data).to.have.property('name')

            for (var i = 0; i < data.name.length; i++) {
                expect(data.name[i]).to.not.equal(value[i])
                expect(data.name[i]).to.deep.equal(value[i])
            }
        })

        // `'name|1': [{}, {} ...]`
        it('name|1: [1, 2, 4, 8]', function() {
            // number array
            var value = [1, 2, 4, 8]
            var data = Mock.mock({
                'name|1': value
            })
            expect(data).to.have.property('name')
                .that.be.a('number')
            expect(value).to.include(data.name)
        })
        it('name|1: ["GET", "POST", "HEAD", "DELETE"]', function() {
            // string array
            var value = ['GET', 'POST', 'HEAD', 'DELETE']
            var data = Mock.mock({
                'name|1': value
            })
            expect(data).to.have.property('name')
                .that.be.a('string')
            expect(value).to.include(data.name)
        })
        it('name|1 [{}]', function() {
            // object array
            var value = [{}]
            var data = Mock.mock({
                'name|1': value
            })
            expect(data).to.have.property('name')
                .that.be.a('object')
                .that.deep.equal({})
            expect(data.name).to.not.equal(value[0])
        })
        it('name|1 [{}, {}, {}]', function() {
            // object array
            var data = Mock.mock({
                'name|1': [{}, {}, {}]
            })
            expect(data).to.have.property('name')
                .that.be.a('object')
                .that.deep.equal({})
        })
        it('name|1 [{}, {}, {}]', function() {
            // object array
            var value = [{
                method: 'GET'
            }, {
                method: 'POST'
            }, {
                method: 'HEAD'
            }, {
                method: 'DELETE'
            }]
            var data = Mock.mock({
                'name|1': value
            })
            expect(data).to.have.property('name')
                .that.be.a('object')
                .that.have.property('method')
                .that.be.a('string')
            expect(_.pluck(value, 'method')).include(data.name.method)
        })

        // `'name|+1': [{}, {} ...]`
        it('name|+1: ["a", "b", "c"]', function() {
            var data = Mock.mock({
                'list|5': [{
                    'name|+1': ['a', 'b', 'c']
                }]
            })
            expect(data).to.have.property('list')
                .that.be.an('array').with.length(5)
            expect(data.list[0].name).to.equal('a')
            expect(data.list[1].name).to.equal('b')
            expect(data.list[2].name).to.equal('c')
            expect(data.list[3].name).to.equal('a')
            expect(data.list[4].name).to.equal('b')
        })
        it('name|+1: ["@integer", "@email", "@boolean"]', function() {
            var data = Mock.mock({
                'list|5-10': [{
                    'name|+1': ['@integer', '@email', '@boolean']
                }]
            })
            expect(data).to.have.property('list')
                .that.be.an('array').have.length.within(5, 10)
            expect(data.list[0].name).to.be.a('number')
            expect(data.list[1].name).to.be.a('string')
            expect(data.list[2].name).to.be.a('boolean')
            expect(data.list[3].name).to.be.a('number')
            expect(data.list[4].name).to.be.a('string')
        })

        // `'name|min-max': [{}, {} ...]`
        it('name|min-min', function() {
            var data = Mock.mock({
                'name|1-1': [{}]
            })
            expect(data.name).to.be.an('array').with.length(1)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })
        it('name|min-max [{}]', function() {
            var data = Mock.mock({
                'name|1-10': [{}]
            })
            expect(data.name).to.be.an('array').with.length.within(1, 10)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })
        it('name|max-min [{}]', function() {
            var data = Mock.mock({
                'name|10-1': [{}]
            })
            expect(data.name).to.be.an('array').with.length.within(1, 10)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })
        it('name|min-max [{}, {}]', function() {
            var data = Mock.mock({
                'name|1-10': [{}, {}]
            })
            expect(data.name).to.be.an('array').with.length.within(2, 20)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })
        it('name|max-min [{}, {}]', function() {
            var data = Mock.mock({
                'name|10-1': [{}, {}]
            })
            expect(data.name).to.be.an('array').with.length.within(2, 20)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })

        // `'name|count': [{}, {} ...]`
        it('name|count [{}]', function() {
            var data = Mock.mock({
                'name|10': [{}]
            })
            expect(data.name).to.be.an('array').with.length(10)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })
        it('name|count [{}, {}]', function() {
            var data = Mock.mock({
                'name|10': [{}, {}]
            })
            expect(data.name).to.be.an('array').with.length(20)
            _.each(data.name, function(item /*, index*/ ) {
                expect(item).to.deep.equal({})
            })
        })
    })
    describe('Function', function() {
        // `'name': function(){}`
        it('name: function', function() {
            var data = Mock.mock({
                prop: 'hello',
                name: function( /*root, path*/ ) {
                    return this.prop
                }
            })
            expect(data).to.have.property('name')
                .that.be.a('string').equal('hello')
        })

        // 无序的 function
        it('name: function', function() {
            var data = Mock.mock({
                name2: function() {
                    return this.prop * 2
                },
                prop: 1,
                name4: function() {
                    return this.prop * 4
                }
            })
            expect(data.name2).to.equal(2)
            expect(data.name4).to.equal(4)
        })

        // #25 改变了非函数属性的顺序，查找起来不方便
        it('name: function', function() {
            var data = Mock.mock({
                name: function() {},
                first: '',
                second: '',
                third: ''
            })
            var keys = _.keys(data)
            expect(keys[0]).equal('first')
            expect(keys[1]).equal('second')
            expect(keys[2]).equal('third')
            expect(keys[3]).equal('name')
        })
    })

    /*
        按照 http://www.regexr.com/ 的 Reference 设计测试用例。
        https://github.com/nuysoft/Mock/blob/7c1e3a686bcc515855f1f583d70ae0ee89acc65e/test/regexp.js#L120
     */
    describe('RegExp', function() {
        function validRegExp(regexp) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    validRegExp(arguments[i])
                }
            }

            it(regexp, function() {
                var data = Mock.mock(regexp)
                this.test.title += ' => ' + data
                expect(regexp.test(data)).to.be.true
            })
        }

        describe('Character Classes', function() {
            validRegExp(/./)
            validRegExp(
                /[a-z]/,
                /[A-Z]/,
                /[0-9]/
            )
            validRegExp(
                /\w/,
                /\W/,
                /\s/,
                /\S/,
                /\d/,
                /\D/
            )
            validRegExp(
                /[.]/,
                /[\w]/,
                /[\W]/,
                /[\s]/,
                /[\S]/,
                /[\d]/,
                /[\D]/
            )
            validRegExp(
                /[^.]/,
                /[^\w]/,
                /[^\W]/,
                /[^\s]/,
                /[^\S]/,
                /[^\d]/,
                /[^\D]/
            )
        })
        describe('Quantifiers', function() {
            validRegExp(
                /\d?/,
                /\d+/,
                /\d*/
            )

            // {n}, {n,}, {n,m}, {0,1} ?, {1,0} +, {0,} *
            validRegExp(
                /\d{5}/,
                /\d{5,}/,
                /\d{5,10}/,
                /\d{0,1}/,
                /\d{0,}/
            )

            validRegExp(/[\u4E00-\u9FA5]+/) // 汉字
        })
        describe('Anchors', function() {
            validRegExp(/^/)
            validRegExp(/$/)
            validRegExp(/^foo/)
            validRegExp(/foo$/)
            validRegExp(/\bfoo/)
            validRegExp(/\Bfoo/)
        })

        describe('Escaped Characters', function() {
            validRegExp(/\000/)
            validRegExp(/\xFF/)
            validRegExp(/\uFFFF/)
            validRegExp(/\cI/)
        })

        describe('Groups & Lookaround', function() {
            validRegExp(/(ABC)/)
            validRegExp(/(ABC)\1/)
            validRegExp(/(?:ABC)/)
            validRegExp(/(?=ABC)/)
            validRegExp(/(?!ABC)/)
                // validRegExp(/(?<=ABC)/)
                // validRegExp(/(?<!ABC)/)

            validRegExp(/(\d{5,10})|([a-zA-Z]{5,10})/)
            validRegExp(/(?:\d{5,10})|(?:[a-zA-Z]{5,10})/)
            validRegExp(/(.)(\w)(\W)(\s)(\S)(\d)(\D),\1\2\3\4\5\6\7,\1\2\3\4\5\6\7/)
        })

        describe('Quantifiers & Alternation', function() {
            validRegExp(/.+/)
            validRegExp(/.*/)
            validRegExp(/.{1,3}/)
            validRegExp(/.?/)
            validRegExp(/a|bc/)

            validRegExp(/\d{5,10}|[a-zA-Z]{5,10}/)
        })

        describe('Flags', function() {
            // ignoreCase
            // multiline
            // global
        })
    })

    describe('Complex', function() {
        var tpl = {
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
            'array4|1-10': [{
                'name|+1': ['Hello', 'Mock.js', '!']
            }],

            'function': function() {
                return this.title
            },

            'regexp1': /[a-z][A-Z][0-9]/,
            'regexp2': /\w\W\s\S\d\D/,
            'regexp3': /\d{5,10}/,

            'nested': {
                a: {
                    b: {
                        c: 'Mock.js'
                    }
                }
            },
            'absolutePath': '@/title @/nested/a/b/c',
            'relativePath': {
                a: {
                    b: {
                        c: '@../../../nested/a/b/c'
                    }
                }
            },
        }

        it('', function() {
            var data = Mock.mock(tpl)
            this.test.title += JSON.stringify(data /*, null, 4*/ )
            expect(data).to.be.a('object')
        })
    })
})