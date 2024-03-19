// global require, module, window
import Handler from './mock/handler';
import * as Util from './mock/util';
import Random from './mock/random';
import * as RE from './mock/regexp/index';
import { toJSONSchema } from './mock/schema/index';
import { valid } from './mock/valid/index';
import { _mocked } from './mock/_mocked';
import { XHR } from './mock/xhr/index';
import { mock } from './mock/mock';
import { registerAll } from './registerAll';
registerAll();
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
    setup: function (settings: unknown) {
        return XHR.setup(settings);
    },
    _mocked,
    mock,
    version: '2.0.0',
};

export default Mock;
export { registerRandom } from './mock/random';
export * from 'game-random';
