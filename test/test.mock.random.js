/* global require, chai, describe, before, it */
/* global window */
// 数据占位符定义（Data Placeholder Definition，DPD）
var expect = chai.expect
var Mock, Random, $, _, Random

/* jshint -W061 */
describe('Random', function() {
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

    function doit(expression, validator) {
        it('', function() {
            // for (var i = 0; i < 1; i++) {}
            var data = eval(expression)
            validator(data)
            this.test.title = stringify(expression) + ' => ' + stringify(data)
        })
    }

    describe('Basic', function() {
        doit('Random.boolean()', function(data) {
            expect(data).to.be.a('boolean')
        })

        doit('Random.natural()', function(data) {
            expect(data).to.be.a('number').within(0, 9007199254740992)
        })
        doit('Random.natural(1, 3)', function(data) {
            expect(data).to.be.a('number').within(1, 3)
        })
        doit('Random.natural(1)', function(data) {
            expect(data).to.be.a('number').least(1)
        })

        doit('Random.integer()', function(data) {
            expect(data).to.be.a('number').within(-9007199254740992, 9007199254740992)
        })
        doit('Random.integer(-10, 10)', function(data) {
            expect(data).to.be.a('number').within(-10, 10)
        })

        // 1 整数部分 2 小数部分
        var RE_FLOAT = /(\-?\d+)\.?(\d+)?/

        function validFloat(float, min, max, dmin, dmax) {
            RE_FLOAT.lastIndex = 0
            var parts = RE_FLOAT.exec(float + '')

            expect(+parts[1]).to.be.a('number').within(min, max)

            /* jshint -W041 */
            if (parts[2] != undefined) {
                expect(parts[2]).to.have.length.within(dmin, dmax)
            }
        }

        doit('Random.float()', function(data) {
            validFloat(data, -9007199254740992, 9007199254740992, 0, 17)
        })
        doit('Random.float(0)', function(data) {
            validFloat(data, 0, 9007199254740992, 0, 17)
        })
        doit('Random.float(60, 100)', function(data) {
            validFloat(data, 60, 100, 0, 17)
        })
        doit('Random.float(60, 100, 3)', function(data) {
            validFloat(data, 60, 100, 3, 17)
        })
        doit('Random.float(60, 100, 3, 5)', function(data) {
            validFloat(data, 60, 100, 3, 5)
        })

        var CHARACTER_LOWER = 'abcdefghijklmnopqrstuvwxyz'
        var CHARACTER_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var CHARACTER_NUMBER = '0123456789'
        var CHARACTER_SYMBOL = '!@#$%^&*()[]'
        doit('Random.character()', function(data) {
            expect(data).to.be.a('string').with.length(1)
            expect(
                CHARACTER_LOWER +
                CHARACTER_UPPER +
                CHARACTER_NUMBER +
                CHARACTER_SYMBOL
            ).to.include(data)
        })
        doit('Random.character("lower")', function(data) {
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_LOWER).to.include(data)
        })
        doit('Random.character("upper")', function(data) {
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_UPPER).to.include(data)
        })
        doit('Random.character("number")', function(data) {
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_NUMBER).to.include(data)
        })
        doit('Random.character("symbol")', function(data) {
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_SYMBOL).to.include(data)
        })
        doit('Random.character("aeiou")', function(data) {
            expect(data).to.be.a('string').with.length(1)
            expect('aeiou').to.include(data)
        })

        doit('Random.string()', function(data) {
            expect(data).to.be.a('string').with.length.within(3, 7)
        })
        doit('Random.string(5)', function(data) {
            expect(data).to.be.a('string').with.length(5)
        })
        doit('Random.string("lower", 5)', function(data) {
            expect(data).to.be.a('string').with.length(5)
            for (var i = 0; i < data.length; i++) {
                expect(CHARACTER_LOWER).to.include(data[i])
            }
        })
        doit('Random.string(7, 10)', function(data) {
            expect(data).to.be.a('string').with.length.within(7, 10)
        })
        doit('Random.string("aeiou", 1, 3)', function(data) {
            expect(data).to.be.a('string').with.length.within(1, 3)
            for (var i = 0; i < data.length; i++) {
                expect('aeiou').to.include(data[i])
            }
        })

        doit('Random.range(10)', function(data) {
            expect(data).to.be.an('array').with.length(10)
        })
        doit('Random.range(3, 7)', function(data) {
            expect(data).to.be.an('array').deep.equal([3, 4, 5, 6])
        })
        doit('Random.range(1, 10, 2)', function(data) {
            expect(data).to.be.an('array').deep.equal([1, 3, 5, 7, 9])
        })
        doit('Random.range(1, 10, 3)', function(data) {
            expect(data).to.be.an('array').deep.equal([1, 4, 7])
        })

        var RE_DATE = /\d{4}-\d{2}-\d{2}/
        var RE_TIME = /\d{2}:\d{2}:\d{2}/
        var RE_DATETIME = new RegExp(RE_DATE.source + ' ' + RE_TIME.source)

        doit('Random.date()', function(data) {
            expect(RE_DATE.test(data)).to.be.true
        })

        doit('Random.time()', function(data) {
            expect(RE_TIME.test(data)).to.be.true
        })

        doit('Random.datetime()', function(data) {
            expect(RE_DATETIME.test(data)).to.be.true
        })
        doit('Random.datetime("yyyy-MM-dd A HH:mm:ss")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.datetime("yyyy-MM-dd a HH:mm:ss")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.datetime("yy-MM-dd HH:mm:ss")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.datetime("y-MM-dd HH:mm:ss")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.datetime("y-M-d H:m:s")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")', function(data) {
            expect(data).to.be.ok
        })

        doit('Random.now()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("year")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("month")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("day")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("hour")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("minute")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("second")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("week")', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.now("yyyy-MM-dd HH:mm:ss SS")', function(data) {
            expect(data).to.be.ok
        })
    })

    describe('Image', function() {
        doit('Random.image()', function(data) {
            expect(data).to.be.ok
        })
        it('Random.dataImage()', function() {
            var data = eval(this.test.title)
            expect(data).to.be.ok
            this.test.title = stringify(this.test.title) + ' => '
        })
        it('Random.dataImage("200x100")', function() {
            var data = eval(this.test.title)
            expect(data).to.be.ok
            this.test.title = stringify(this.test.title) + ' => '
        })
        it('Random.dataImage("200x100", "Hello Mock.js!")', function() {
            var data = eval(this.test.title)
            expect(data).to.be.ok
            this.test.title = stringify(this.test.title) + ' => '
        })
    })

    var RE_COLOR = /^#[0-9a-fA-F]{6}$/
    var RE_COLOR_RGB = /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/
    var RE_COLOR_RGBA = /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, 0\.\d{1,2}\)$/
    var RE_COLOR_HSL = /^hsl\(\d{1,3}, \d{1,3}, \d{1,3}\)$/
    describe('Color', function() {
        doit('Random.color()', function(data) {
            expect(RE_COLOR.test(data)).to.true
        })
        doit('Random.hex()', function(data) {
            expect(RE_COLOR.test(data)).to.true
        })
        doit('Random.rgb()', function(data) {
            expect(RE_COLOR_RGB.test(data)).to.true
        })
        doit('Random.rgba()', function(data) {
            expect(RE_COLOR_RGBA.test(data)).to.true
        })
        doit('Random.hsl()', function(data) {
            expect(RE_COLOR_HSL.test(data)).to.true
        })
    })

    describe('Text', function() {
        doit('Random.paragraph()', function(data) {
            expect(data.split('.').length - 1).to.within(3, 7)
        })
        doit('Random.paragraph(2)', function(data) {
            expect(data.split('.').length - 1).to.equal(2)
        })
        doit('Random.paragraph(1, 3)', function(data) {
            expect(data.split('.').length - 1).to.within(1, 3)
        })

        doit('Random.sentence()', function(data) {
            expect(data[0]).to.equal(data.toUpperCase()[0])
            expect(data.split(' ').length).to.within(12, 18)
        })
        doit('Random.sentence(4)', function(data) {
            expect(data[0]).to.equal(data.toUpperCase()[0])
            expect(data.split(' ').length).to.equal(4)
        })
        doit('Random.sentence(3, 5)', function(data) {
            expect(data[0]).to.equal(data.toUpperCase()[0])
            expect(data.split(' ').length).to.within(3, 5)
        })

        doit('Random.word()', function(data) {
            expect(data).to.have.length.within(3, 10)
        })
        doit('Random.word(4)', function(data) {
            expect(data).to.have.length(4)
        })
        doit('Random.word(3, 5)', function(data) {
            expect(data).to.have.length.within(3, 5)
        })

        doit('Random.title()', function(data) {
            var words = data.split(' ')
            _.each(words, function(word) {
                expect(word[0]).to.equal(word[0].toUpperCase())
            })
            expect(words).to.have.length.within(3, 7)
        })
        doit('Random.title(4)', function(data) {
            var words = data.split(' ')
            _.each(words, function(word) {
                expect(word[0]).to.equal(word[0].toUpperCase())
            })
            expect(words).to.have.length(4)
        })
        doit('Random.title(3, 5)', function(data) {
            var words = data.split(' ')
            _.each(words, function(word) {
                expect(word[0]).to.equal(word[0].toUpperCase())
            })
            expect(words).to.have.length.within(3, 5)
        })
    })

    describe('Name', function() {
        doit('Random.first()', function(data) {
            expect(data[0]).to.equal(data[0].toUpperCase())
        })
        doit('Random.last()', function(data) {
            expect(data[0]).to.equal(data[0].toUpperCase())
        })
        doit('Random.name()', function(data) {
            var words = data.split(' ')
            expect(words).to.have.length(2)
            expect(words[0][0]).to.equal(words[0][0].toUpperCase())
            expect(words[1][0]).to.equal(words[1][0].toUpperCase())
        })
        doit('Random.name(true)', function(data) {
            var words = data.split(' ')
            expect(words).to.have.length(3)
            expect(words[0][0]).to.equal(words[0][0].toUpperCase())
            expect(words[1][0]).to.equal(words[1][0].toUpperCase())
            expect(words[2][0]).to.equal(words[2][0].toUpperCase())
        })

        doit('Random.cfirst()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.clast()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.cname()', function(data) {
            expect(data).to.be.ok
        })
    })

    var RE_URL = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
    var RE_IP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
    describe('Web', function() {
        doit('Random.url()', function(data) {
            expect(RE_URL.test(data)).to.be.true
        })
        doit('Random.domain()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.domain("com")', function(data) {
            expect(data).to.include('.com')
        })
        doit('Random.tld()', function(data) {
            expect(data).to.be.ok
        })

        doit('Random.email()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.email("nuysoft.com")', function(data) {
            expect(data).to.include('@nuysoft.com')
        })
        doit('Random.ip()', function(data) {
            expect(RE_IP.test(data)).to.be.true
        })
    })
    describe('Address', function() {
        doit('Random.region()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.province()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.city()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.city(true)', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.county()', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.county(true)', function(data) {
            expect(data).to.be.ok
        })
        doit('Random.zip()', function(data) {
            expect(data).to.be.ok
        })
    })
    describe('Helpers', function() {
        doit('Random.capitalize()', function(data) {
            expect(data).to.equal('Undefined')
        })
        doit('Random.capitalize("hello")', function(data) {
            expect(data).to.equal('Hello')
        })

        doit('Random.upper()', function(data) {
            expect(data).to.equal('UNDEFINED')
        })
        doit('Random.upper("hello")', function(data) {
            expect(data).to.equal('HELLO')
        })

        doit('Random.lower()', function(data) {
            expect(data).to.equal('undefined')
        })
        doit('Random.lower("HELLO")', function(data) {
            expect(data).to.equal('hello')
        })

        doit('Random.pick()', function(data) {
            expect(data).to.be.undefined
        })
        doit('Random.pick(["a", "e", "i", "o", "u"])', function(data) {
            expect(["a", "e", "i", "o", "u"]).to.include(data)
        })
        doit('Random.pick(["a", "e", "i", "o", "u"], 3)', function(data) {
            expect(data).to.be.an('array').with.length(3)
        })
        doit('Random.pick(["a", "e", "i", "o", "u"], 1, 5)', function(data) {
            expect(data).to.be.an('array').with.length.within(1, 5)
        })

        doit('Random.shuffle()', function(data) {
            expect(data).to.deep.equal([])
        })
        doit('Random.shuffle(["a", "e", "i", "o", "u"])', function(data) {
            expect(data.join('')).to.not.equal('aeiou')
            expect(data.sort().join('')).to.equal('aeiou')
        })
        doit('Random.shuffle(["a", "e", "i", "o", "u"], 3)', function(data) {
            expect(data).to.be.an('array').with.length(3)
        })
        doit('Random.shuffle(["a", "e", "i", "o", "u"], 1, 5)', function(data) {
            expect(data).to.be.an('array').with.length.within(1, 5)
        })
    })

    var RE_GUID = /[a-fA-F0-9]{8}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{12}/
    describe('Miscellaneous', function() {
        doit('Random.guid()', function(data) {
            expect(data).to.be.a('string').with.length(36)
            expect(RE_GUID.test(data)).to.be.true
        })
        doit('Random.id()', function(data) {
            expect(data).to.be.a('string').with.length(18)
        })
    })
})