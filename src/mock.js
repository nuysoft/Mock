// global require, module, window
import Handler from './mock/handler.js';
import * as Util from './mock/util.js';
import * as Random from './mock/random/index.js';
import * as RE from './mock/regexp/index.js';
import { toJSONSchema } from './mock/schema/index.js';
import { valid } from './mock/valid/index.js';
import { _mocked } from './mock/_mocked.js';
import { XHR } from './mock/xhr/index.js';
import { mock } from './mock/mock';

/* !
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com

    此版本为 esm 版本
    KonghaYao 修改于 2021/6/11
    https://github.com/KonghaYao/
*/

const Mock = {
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
    _mocked,
    mock,
};

Mock.version = '1.1.1-es6';

/*
    * Mock.mock( template )
    * Mock.mock( function() )
    * Mock.mock( rurl, template )
    * Mock.mock( rurl, function(options) )
    * Mock.mock( rurl, rtype, template )
    * Mock.mock( rurl, rtype, function(options) )

    根据数据模板生成模拟数据。
*/

export default Mock;
