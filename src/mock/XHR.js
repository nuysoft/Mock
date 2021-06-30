import { MockXMLHttpRequest } from './mock/xhr/index.js';
let XHR;
if (typeof window !== 'undefined') XHR = MockXMLHttpRequest;
export { XHR };
