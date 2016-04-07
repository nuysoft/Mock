/* global console, require, chai, describe, before, it */
// 数据占位符定义（Data Placeholder Definition，DPD）
var expect = chai.expect
var Mock, $, _

describe('Request', function() {
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

    function stringify(json) {
        return JSON.stringify(json /*, null, 4*/ )
    }

    describe('jQuery.ajax()', function() {
        it('', function(done) {
            var that = this
            var url = Math.random()
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function( /*data, textStatus, jqXHR*/ ) {
                // 不会进入
            }).fail(function(jqXHR /*, textStatus, errorThrown*/ ) {
                // 浏览器 || PhantomJS
                expect([404, 0]).to.include(jqXHR.status)
                that.test.title += url + ' => ' + jqXHR.status
            }).always(function() {
                done()
            })
        })
    })
    describe('jQuery.getScript()', function() {
        it('', function(done) {
            var that = this
            var url = './materiels/noop.js'
            $.getScript(url, function(script, textStatus, jqXHR) {
                expect(script).to.be.ok
                that.test.title += url + ' => ' + jqXHR.status + ' ' + textStatus
                done()
            })
        })
    })
    describe('jQuery.load()', function() {
        it('', function(done) {
            var that = this
            var url = './materiels/noop.html'
            $('<div>').load(url, function(responseText /*, textStatus, jqXHR*/ ) {
                expect(responseText).to.be.ok
                that.test.title += url + ' => ' + responseText
                done()
            })
        })
    })
    describe('jQuery.ajax() XHR Fields', function() {
        it('', function(done) {
            var that = this
            var url = Math.random()
            var xhr
            $.ajax({
                xhr: function() {
                    xhr = $.ajaxSettings.xhr()
                    return xhr
                },
                url: url,
                dataType: 'json',
                xhrFields: {
                    timeout: 123,
                    withCredentials: true
                }
            }).done(function( /*data, textStatus, jqXHR*/ ) {
                // 不会进入
            }).fail(function(jqXHR /*, textStatus, errorThrown*/ ) {
                // 浏览器 || PhantomJS
                expect([404, 0]).to.include(jqXHR.status)
                that.test.title += url + ' => ' + jqXHR.status
                expect(xhr.timeout).to.be.equal(123)
                expect(xhr.withCredentials).to.be.equal(true)
            }).always(function() {
                done()
            })
        })
    })

    describe('Mock.mock( rurl, template )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_template.json'

            Mock.mock(/rurl_template.json/, {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            })

            Mock.setup({
                // timeout: 100,
                timeout: '10-50',
            })
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data /*, textStatus, jqXHR*/ ) {
                that.test.title += url + ' => ' + stringify(data)
                expect(data).to.have.property('list')
                    .that.be.an('array').with.length.within(1, 10)
                _.each(data.list, function(item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                })
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }).always(function() {
                done()
            })
        })
    })

    describe('Mock.mock( rurl, function(options) )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_function.json'

            Mock.mock(/rurl_function\.json/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(null)
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            })

            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += url + ' => ' + stringify(data)
                expect(data).to.have.property('list')
                    .that.be.an('array').with.length.within(1, 10)
                _.each(data.list, function(item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                })
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }).always(function() {
                done()
            })
        })
    })

    describe('Mock.mock( rurl, function(options) ) + GET + data', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_function.json'

            Mock.mock(/rurl_function\.json/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url + '?foo=1')
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(null)
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            })

            $.ajax({
                url: url,
                dataType: 'json',
                data: {
                    foo: 1
                }
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += url + ' => ' + stringify(data)
                expect(data).to.have.property('list')
                    .that.be.an('array').with.length.within(1, 10)
                _.each(data.list, function(item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                })
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }).always(function() {
                done()
            })
        })
    })

    describe('Mock.mock( rurl, function(options) ) + POST + data', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_function.json'

            Mock.mock(/rurl_function\.json/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(options.type).to.be.equal('POST')
                expect(options.body).to.be.equal('foo=1')
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            })

            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    foo: 1
                }
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += url + ' => ' + stringify(data)
                expect(data).to.have.property('list')
                    .that.be.an('array').with.length.within(1, 10)
                _.each(data.list, function(item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                })
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }).always(function() {
                done()
            })
        })
    })

    describe('Mock.mock( rurl, rtype, template )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_rtype_template.json'
            var count = 0

            Mock.mock(/rurl_rtype_template\.json/, 'get', {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL',
                    type: 'get'
                }]
            })
            Mock.mock(/rurl_rtype_template\.json/, 'post', {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL',
                    type: 'post'
                }]
            })

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json'
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'GET ' + url + ' => ' + stringify(data) + ' '
                expect(data).to.have.property('list')
                    .that.be.an('array').with.length.within(1, 10)
                _.each(data.list, function(item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    expect(item).to.have.property('type').equal('get')
                })
            }).done(success).always(complete)

            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json'
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'POST ' + url + ' => ' + stringify(data) + ' '
                expect(data).to.have.property('list')
                    .that.be.an('array').with.length.within(1, 10)
                _.each(data.list, function(item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    expect(item).to.have.property('type').equal('post')
                })
            }).done(success).always(complete)

            function success( /*data*/ ) {
                count++
            }

            function complete() {
                if (count === 2) done()
            }

        })
    })

    describe('Mock.mock( rurl, rtype, function(options) )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_rtype_function.json'
            var count = 0

            Mock.mock(/rurl_rtype_function\.json/, /get/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(null)
                return {
                    type: 'get'
                }
            })
            Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(['POST', 'PUT']).to.include(options.type)
                expect(options.body).to.be.equal(null)
                return {
                    type: options.type.toLowerCase()
                }
            })

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json'
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'GET ' + url + ' => ' + stringify(data)
                expect(data).to.have.property('type', 'get')
            }).done(success).always(complete)

            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json'
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'POST ' + url + ' => ' + stringify(data)
                expect(data).to.have.property('type', 'post')
            }).done(success).always(complete)

            $.ajax({
                url: url,
                type: 'put',
                dataType: 'json'
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'PUT ' + url + ' => ' + stringify(data)
                expect(data).to.have.property('type', 'put')
            }).done(success).always(complete)


            function success( /*data*/ ) {
                count++
            }

            function complete() {
                if (count === 3) done()
            }

        })
    })
    describe('Mock.mock( rurl, rtype, function(options) ) + data', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_rtype_function.json'
            var count = 0

            Mock.mock(/rurl_rtype_function\.json/, /get/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url + '?foo=1')
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(null)
                return {
                    type: 'get'
                }
            })
            Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(['POST', 'PUT']).to.include(options.type)
                expect(options.body).to.be.equal('foo=1')
                return {
                    type: options.type.toLowerCase()
                }
            })

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: {
                    foo: 1
                }
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'GET ' + url + ' => ' + stringify(data)
                expect(data).to.have.property('type', 'get')
            }).done(success).always(complete)

            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    foo: 1
                }
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'POST ' + url + ' => ' + stringify(data)
                expect(data).to.have.property('type', 'post')
            }).done(success).always(complete)

            $.ajax({
                url: url,
                type: 'put',
                dataType: 'json',
                data: {
                    foo: 1
                }
            }).done(function(data /*, status, jqXHR*/ ) {
                that.test.title += 'PUT ' + url + ' => ' + stringify(data)
                expect(data).to.have.property('type', 'put')
            }).done(success).always(complete)


            function success( /*data*/ ) {
                count++
            }

            function complete() {
                if (count === 3) done()
            }

        })
    })
    describe('#105 addEventListener', function() {
        it('addEventListene => addEventListener', function(done) {
            var xhr = new Mock.XHR()
            expect(xhr.addEventListener).to.not.equal(undefined)
            expect(xhr.addEventListene).to.equal(undefined)
            done()
        })
    })
})