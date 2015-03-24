/* global require, chai, describe, before, it */
// 数据占位符定义（Data Placeholder Definition，DPD）
var expect = chai.expect
var Mock, $, _

describe('DPD', function() {
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
    describe('Reference', function() {
        it('@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.not.equal(this.test.title)
        })
    })
    describe('Priority', function() {
        it('@EMAIL', function() {
            var data = Mock.mock({
                email: 'nuysoft@gmail.com',
                name: '@EMAIL'
            })
            this.test.title += ' => ' + data.name
            expect(data.name).to.not.equal(data.email)
        })
        it('@email', function() {
            var data = Mock.mock({
                email: 'nuysoft@gmail.com',
                name: '@email'
            })
            this.test.title += ' => ' + data.name
            expect(data.name).to.equal(data.email)
        })
    })
    describe('Escape', function() {
        it('\@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            this.test.title += ' => ' + data
            expect(data).to.not.equal(this.test.title)
        })
        it('\\@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            this.test.title += ' => ' + data
            expect(data).to.not.equal(this.test.title)
        })
        it('\\\@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            this.test.title += ' => ' + data
            expect(data).to.not.equal(this.test.title)
        })
        it('\\\\@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            this.test.title += ' => ' + data
            expect(data).to.not.equal(this.test.title)
        })
    })
    describe('Path', function() {
        it('Absolute Path', function() {
            var data = Mock.mock({
                id: '@UUID',
                children: [{
                    parentId: '@/id'
                }],
                child: {
                    parentId: '@/id'
                }
            })
            expect(data.children[0]).to.have.property('parentId', data.id)
            expect(data.child).to.have.property('parentId', data.id)
        })
        it('Relative Path', function() {
            var data = Mock.mock({
                id: '@UUID',
                children: [{
                    parentId: '@../../id'
                }],
                child: {
                    parentId: '@../id'
                }
            })
            expect(data.children[0]).to.have.property('parentId', data.id)
            expect(data.child).to.have.property('parentId', data.id)
        })

    })
    describe('Complex', function() {
        var tpl = {
            basics: {
                boolean1: '@BOOLEAN',
                boolean2: '@BOOLEAN(1, 9, true)',

                natural1: '@NATURAL',
                natural2: '@NATURAL(10000)',
                natural3: '@NATURAL(60, 100)',

                integer1: '@INTEGER',
                integer2: '@INTEGER(10000)',
                integer3: '@INTEGER(60, 100)',

                float1: '@FLOAT',
                float2: '@FLOAT(0)',
                float3: '@FLOAT(60, 100)',
                float4: '@FLOAT(60, 100, 3)',
                float5: '@FLOAT(60, 100, 3, 5)',

                character1: '@CHARACTER',
                character2: '@CHARACTER("lower")',
                character3: '@CHARACTER("upper")',
                character4: '@CHARACTER("number")',
                character5: '@CHARACTER("symbol")',
                character6: '@CHARACTER("aeiou")',

                string1: '@STRING',
                string2: '@STRING(5)',
                string3: '@STRING("lower",5)',
                string4: '@STRING(7, 10)',
                string5: '@STRING("aeiou", 1, 3)',

                range1: '@RANGE(10)',
                range2: '@RANGE(3, 7)',
                range3: '@RANGE(1, 10, 2)',
                range4: '@RANGE(1, 10, 3)',

                date: '@DATE',
                time: '@TIME',

                datetime1: '@DATETIME',
                datetime2: '@DATETIME("yyyy-MM-dd A HH:mm:ss")',
                datetime3: '@DATETIME("yyyy-MM-dd a HH:mm:ss")',
                datetime4: '@DATETIME("yy-MM-dd HH:mm:ss")',
                datetime5: '@DATETIME("y-MM-dd HH:mm:ss")',
                datetime6: '@DATETIME("y-M-d H:m:s")',

                now: '@NOW',
                nowYear: '@NOW("year")',
                nowMonth: '@NOW("month")',
                nowDay: '@NOW("day")',
                nowHour: '@NOW("hour")',
                nowMinute: '@NOW("minute")',
                nowSecond: '@NOW("second")',
                nowWeek: '@NOW("week")',
                nowCustom: '@NOW("yyyy-MM-dd HH:mm:ss SS")'
            },
            image: {
                image1: '@IMAGE',
                image2: '@IMAGE("100x200", "#000")',
                image3: '@IMAGE("100x200", "#000", "hello")',
                image4: '@IMAGE("100x200", "#000", "#FFF", "hello")',
                image5: '@IMAGE("100x200", "#000", "#FFF", "png", "hello")',

                dataImage1: '@DATAIMAGE',
                dataImage2: '@DATAIMAGE("200x100")',
                dataImage3: '@DATAIMAGE("300x100", "Hello Mock.js!")'
            },
            color: {
                color: '@COLOR',
                render: function() {
                    $('.header').css('background', this.color)
                }
            },
            text: {
                title1: '@TITLE',
                title2: '@TITLE(5)',
                title3: '@TITLE(3, 5)',

                word1: '@WORD',
                word2: '@WORD(5)',
                word3: '@WORD(3, 5)',

                sentence1: '@SENTENCE',
                sentence2: '@SENTENCE(5)',
                sentence3: '@SENTENCE(3, 5)',

                paragraph1: '@PARAGRAPH',
                paragraph2: '@PARAGRAPH(2)',
                paragraph3: '@PARAGRAPH(1, 3)'
            },
            name: {
                first: '@FIRST',
                last: '@LAST',
                name1: '@NAME',
                name2: '@NAME(true)'
            },
            web: {
                url: '@URL',
                domain: '@DOMAIN',
                email: '@EMAIL',
                ip: '@IP',
                tld: '@TLD',
            },
            address: {
                region: '@REGION',
                province: '@PROVINCE',
                city: '@CITY',
                county: '@COUNTY'
            },
            miscellaneous: {
                guid: '@GUID',
                id: '@ID',
                'increment1|3': [
                    '@INCREMENT'
                ],
                'increment2|3': [
                    '@INCREMENT(10)'
                ]
            },
            helpers: {
                capitalize1: '@CAPITALIZE()',
                capitalize2: '@CAPITALIZE("hello")',

                upper1: '@UPPER',
                upper2: '@UPPER("hello")',

                lower1: '@LOWER',
                lower2: '@LOWER("HELLO")',

                pick1: '@PICK',
                pick2: '@PICK("abc")',
                pick3: '@PICK(["a", "b", "c"])',

                shuffle1: '@SHUFFLE',
                shuffle2: '@SHUFFLE(["a", "b", "c"])'
            }
        }
        it('', function() {
            var data = Mock.mock(tpl)
            // this.test.title += JSON.stringify(data, null, 4)
            expect(data).to.be.a('object')
        })
    })
})