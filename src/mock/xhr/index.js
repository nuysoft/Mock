// 在 fetch 的代理中只需要进行 fetch 的数据代理即可
//
import { mockFetch } from './fetch/fetch.js';
typeof globalThis.window !== 'undefined' && mockFetch(); // 浏览器直接使用即可
import { MockXMLHttpRequest } from './XMLHttpRequest/xhr.js';
export const XHR = function () {
    return new MockXMLHttpRequest(...arguments)
}
export { MockXMLHttpRequest } 
