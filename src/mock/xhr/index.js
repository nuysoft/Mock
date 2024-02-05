// 在 fetch 的代理中只需要进行 fetch 的数据代理即可
//
import { mockFetch } from './fetch/fetch.js';

import { MockXMLHttpRequest } from './XMLHttpRequest/xhr.js';
export const XHR = Object.assign(
    function () {
        return new MockXMLHttpRequest(...arguments);
    },
    {
        setup(config) {
            // TODO
        },
        mock() {
            typeof globalThis.window !== 'undefined' && mockFetch(); // 浏览器直接使用即可
            const window = globalThis.window || {};
            // 拦截 XHR
            if (window.XMLHttpRequest !== XHR) {
                console.log('XHR 拦截');
                window.XMLHttpRequest = XHR;
            }
        },
    },
);
export { MockXMLHttpRequest };
