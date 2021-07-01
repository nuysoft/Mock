import Handler from './handler.js';
import { _mocked } from './_mocked.js';
import { XHR } from './xhr/index.js';

const window = globalThis.window || {};

export function mock(...args) {
    let rurl;
    let rtype = 'get';
    let template;

    switch (args.length) {
        case 1:
            // Mock.mock(template)
            [template] = args;
            return Handler.gen(template);
        // 2 和 3 switch 穿透
        case 2:
            // Mock.mock(rurl, template)
            [rurl, template] = args;
            break;
        case 3:
            // Mock.mock(rurl,rtype, template)
            [rurl, rtype, template] = args;
            break;
    }

    // 拦截 XHR
    if (window.XMLHttpRequest !== XHR) window.XMLHttpRequest = XHR;

    _mocked.$set({
        rurl,
        rtype,
        template,
    });
    return null;
}
