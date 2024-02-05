import Handler from './handler';
import { _mocked } from './_mocked';
import { XHR } from './xhr/index';

function mock(url: string, type: string, template: any): void;
function mock(url: string, template: any): void;
function mock<T>(template: any): T;
function mock(...args: any[]) {
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
            XHR.mock();
            [rurl, template] = args;
            break;
        case 3:
            XHR.mock();
            // Mock.mock(rurl, rtype, template)
            [rurl, rtype, template] = args;
            break;
    }

    _mocked.$set({
        rurl,
        rtype,
        template,
    });
    return null;
}
export { mock };
