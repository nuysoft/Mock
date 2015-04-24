/* global define, module, window */
define(
    [
        'mock/handler',
        'mock/util',
        'mock/random/random',
        'mock/xhr/xhr',
        'mock/regexp/parser', 'mock/regexp/handler',
        'mock/schema/schema',
        'mock/valid/valid'
    ],
    function(
        Handler,
        Util,
        Random,
        XHR,
        RegExpParser, RegExpHandler,
        toJSONSchema,
        valid
    ) {

        /*!
            Mock - 模拟请求 & 模拟数据
            https://github.com/nuysoft/Mock
            墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
        */
        var Mock = {
            Handler: Handler,
            Util: Util,
            heredoc: Util.heredoc,
            Random: Random,
            XHR: XHR,
            RegExpParser: RegExpParser,
            RegExpHandler: RegExpHandler,
            toJSONSchema: toJSONSchema,
            valid: valid,
            _mocked: {},
            mockjax: function() {
                window.XMLHttpRequest = this.XHR
            }
        }

        // 避免循环依赖
        XHR.Mock = Mock

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
                return Handler.gen(rurl)
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

        // CommonJS
        if (typeof module === "object" && module.exports) {
            module.exports = Mock

        }

        // Browser globals
        this.Mock = Mock
        this.Random = Random

        return Mock
    }
)