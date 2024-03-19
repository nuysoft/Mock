/* global require, chai, describe, before, it */
// 数据占位符定义（Data Placeholder Definition，DPD）
import { it, describe, expect, before } from 'vitest'
import Mock from '../src/mock'
import { each } from 'lodash-es'
describe('Mock.mock', function () {

    describe('Mock.mock( String )', function () {
        it('@EMAIL', function () {
            const title = "@EMAIL"
            var data = Mock.mock(title)
            expect(data).to.not.equal(title)
        })
    })
    describe('Mock.mock( {} )', function () {
        it('', function () {
            var tpl = {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            }
            var data = Mock.mock(tpl)
            expect(data).to.have.property('list')
                .that.be.an('array').with.length.within(1, 10)
            each(data.list, function (item, index, list) {
                if (index > 0) expect(item.id).to.equal(list[index - 1].id + 1)
            })
        })
    })
    describe('Mock.mock( function() )', function () {
        it('', function () {
            var fn = function () {
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            }
            var data = Mock.mock(fn)
            // this.test.title = fn.toString() + ' => ' + JSON.stringify(data /*, null, 4*/)
            expect(data).to.have.property('list')
                .that.be.an('array').with.length.within(1, 10)
            each(data.list, function (item, index, list) {
                if (index > 0) expect(item.id).to.equal(list[index - 1].id + 1)
            })
        })
    })
})