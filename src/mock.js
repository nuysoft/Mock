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
    
    此版本为 esm 版本 
    KonghaYao 修改于 2021/6/11
    https://github.com/KonghaYao
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

Mock.version = "1.1.1-es6";

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
Mock.mock = function (...args) {
    let rurl,
        rtype = "",
        template;

    switch (args.length) {
        case 1:
            // Mock.mock(template)
            [template] = args;
            return Handler.gen(template);
        // 2 和 3 switch 穿透
        case 2:
            // Mock.mock(rurl, template)
            [rurl, template] = args;
        case 3:
        default:
            // 拦截 XHR
            if (XHR) window.XMLHttpRequest = XHR;
            Mock._mocked[rurl + rtype] = {
                rurl,
                rtype,
                template,
            };
            return Mock;
    }
};

export default Mock;
