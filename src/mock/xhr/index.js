// 在 fetch 的代理中只需要进行 fetch 的数据代理即可
//
import { mockFetch } from "./fetch/fetch.js";
typeof window !== "undefined" && mockFetch(); // 浏览器直接使用即可

export { MockXMLHttpRequest } from "./xhr.js";
