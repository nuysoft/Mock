/* global require, chai, describe, before, it */
/* global window */
// 数据占位符定义（Data Placeholder Definition，DPD）
var expect = chai.expect
var Mock, $, _

describe('Schema', function() {
    before(function(done) {
        require(['mock', 'underscore', 'jquery'], function() {
            Mock = arguments[0]
            window.XMLHttpRequest = Mock.XHR
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

    function doit(template, validator) {
        it('', function() {
            var schema = Mock.toJSONSchema(template)
            this.test.title = (stringify(template) || template.toString()) + ' => ' + stringify(schema)
            validator(schema)
        })
    }

    describe('Type', function() {
        doit(1, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'number')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit(true, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'boolean')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit('', function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'string')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit(function() {}, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'function')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit(/\d/, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'regexp')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit([], function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'array')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
            expect(schema).to.have.property('items').with.length(0)
        })
        doit({}, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'object')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
            expect(schema).to.have.property('properties').with.length(0)
        })

    })

    describe('Object', function() {
        doit({
            a: {
                b: {
                    c: {
                        d: {}
                    }
                }
            }
        }, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'object')

            var properties;

            // root.properties
            properties = schema.properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'a')
            expect(properties[0]).to.have.property('type', 'object')

            // root.a.properties
            properties = properties[0].properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'b')
            expect(properties[0]).to.have.property('type', 'object')

            // root.a.b.properties
            properties = properties[0].properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'c')
            expect(properties[0]).to.have.property('type', 'object')

            // root.a.b.c.properties
            properties = properties[0].properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'd')
            expect(properties[0]).to.have.property('type', 'object')

            // root.a.b.c.d.properties
            properties = properties[0].properties
            expect(properties).to.with.length(0)
        })

    })

    describe('Array', function() {
        doit([
            [
                ['foo', 'bar']
            ]
        ], function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'array')

            var items;

            // root.items
            items = schema.items
            expect(items).to.with.length(1)
            expect(items[0]).to.have.property('type', 'array')

            // root[0].items
            items = items[0].items
            expect(items).to.with.length(1)
            expect(items[0]).to.have.property('type', 'array')

            // root[0][0].items
            items = items[0].items
            expect(items).to.with.length(2)
            expect(items[0]).to.have.property('type', 'string')
            expect(items[1]).to.have.property('type', 'string')
        })
    })

    describe('String Rule', function() {
        doit({
            'string|1-10': '★'
        }, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'object')

            var properties;
            // root.properties
            properties = schema.properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('type', 'string')
            expect(properties[0].rule).to.have.property('min', 1)
            expect(properties[0].rule).to.have.property('max', 10)
        })
        doit({
            'string|3': 'value',
        }, function(schema) {
            expect(schema.name).to.be.an('undefined')
                // expect(schema).to.not.have.property('name')
            expect(schema).to.have.property('type', 'object')

            var properties;
            // root.properties
            properties = schema.properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('type', 'string')
            expect(properties[0].rule).to.have.property('min', 3)
            expect(properties[0].rule.max).to.be.an('undefined')
        })
    })

})