/* global require, chai, describe, before, it */
// 数据占位符定义（Data Placeholder Definition，DPD）
var expect = chai.expect
var Mock, $, _

describe('Mock.mock', function() {
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

    describe('Mock.mock( String )', function() {
        it('@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.not.equal(this.test.title)
            this.test.title += ' => ' + data
        })
    })
    describe('Mock.mock( {} )', function() {
        it('', function() {
            var tpl = {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            }
            var data = Mock.mock(tpl)
            this.test.title = JSON.stringify(tpl /*, null, 4*/ ) + ' => ' + JSON.stringify(data /*, null, 4*/ )
            expect(data).to.have.property('list')
                .that.be.an('array').with.length.within(1, 10)
            _.each(data.list, function(item, index, list) {
                if (index > 0) expect(item.id).to.equal(list[index - 1].id + 1)
            })
        })
    })
    describe('Mock.mock( function() )', function() {
        it('', function() {
            var fn = function() {
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            }
            var data = Mock.mock(fn)
            this.test.title = fn.toString() + ' => ' + JSON.stringify(data /*, null, 4*/ )
            expect(data).to.have.property('list')
                .that.be.an('array').with.length.within(1, 10)
            _.each(data.list, function(item, index, list) {
                if (index > 0) expect(item.id).to.equal(list[index - 1].id + 1)
            })
        })
    })
})