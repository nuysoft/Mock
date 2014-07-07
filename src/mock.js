"use strict";

/* global window    */
/* global expose    */
/* global Random    */
/* global Handle      */

(function(factory) {

    expose(['random', 'handle'], factory, function() {
        window.Mock = factory(Random, Handle)
    })

}(function(Random, Handle) {

    // BEGIN(BROWSER)

    /*!
        Mock - 模拟请求 & 模拟数据
        https://github.com/nuysoft/Mock
        墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
    */
    var Mock = function() {

        var Mock = {
            version: '0.2.0-alpha1',
            _mocked: {}
        }

        /*
            * Mock.mock( template )
            * Mock.mock( function() )
            * Mock.mock( rurl, template )
            * Mock.mock( rurl, function(options) )
            * Mock.mock( rurl, rtype, template )
            * Mock.mock( rurl, rtype, function(options) )

            根据数据模板生成模拟数据。
        */
        Mock.mock = function(rurl, rtype, template) {
            // Mock.mock(template)
            if (arguments.length === 1) {
                return Handle.gen(rurl)
            }
            // Mock.mock(rurl, template)
            if (arguments.length === 2) {
                template = rtype
                rtype = undefined
            }
            Mock._mocked[rurl + (rtype || '')] = {
                rurl: rurl,
                rtype: rtype,
                template: template
            }
            return Mock
        }

        return Mock

    }();

    // END(BROWSER)

    return Mock

}));