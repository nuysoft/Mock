/* global require, module, window */
import Handler from "./mock/handler.js";
import * as Util from "./mock/util.js";
import * as Random from "./mock/random/index.js";
import * as RE from "./mock/regexp/index.js";
import { toJSONSchema } from "./mock/schema/index.js";
import { valid } from "./mock/valid/index.js";

import { MockXMLHttpRequest } from "./mock/xhr/index.js";

var XHR;
if (typeof window !== "undefined") XHR = MockXMLHttpRequest;

/*!
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
var Mock = {
    Handler,
    Random,
    Util,
    XHR,
    RE,
    toJSONSchema,
    valid,
    heredoc: Util.heredoc,
    setup: function (settings) {
        return XHR.setup(settings);
    },
    _mocked: {},
};

Mock.version = "1.0.1-beta3";

// 避免循环依赖
if (XHR) XHR.Mock = Mock;

/*
    * Mock.mock( template )
    * Mock.mock( function() )
    * Mock.mock( rurl, template )
    * Mock.mock( rurl, function(options) )
    * Mock.mock( rurl, rtype, template )
    * Mock.mock( rurl, rtype, function(options) )

    根据数据模板生成模拟数据。
*/
Mock.mock = function (rurl, rtype, template) {
    // Mock.mock(template)
    if (arguments.length === 1) {
        return Handler.gen(rurl);
    }
    // Mock.mock(rurl, template)
    if (arguments.length === 2) {
        template = rtype;
        rtype = undefined;
    }
    // 拦截 XHR
    if (XHR) window.XMLHttpRequest = XHR;
    Mock._mocked[rurl + (rtype || "")] = {
        rurl: rurl,
        rtype: rtype,
        template: template,
    };
    return Mock;
};

export default Mock;
