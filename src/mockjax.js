var Mock = require('./mock');

// BEGIN(BROWSER)
/*
    ### Mock.mockjax(library)

    覆盖（拦截） Ajax 请求，目前内置支持 jQuery、KISSY。

    对 jQuery Ajax 请求的拦截和响应，通过覆盖前置过滤器、选项 dataFilter 以及数据转换器实现，实现代码请问[这里]()。

    对 KISSY Ajax 请求的拦截和响应，则通过粗鲁地覆盖 KISSY.io(options) 实现，实现代码请问[这里]()。

    因为第三库 Ajax 的实现方式不尽相同，故目前只内置支持了实际开发中（本人和本人所服务的阿里） 常用的 jQuery 和 KISSY。如果需要拦截其他第三方库的 Ajax 请求，可参考对 jQuery 和 KISSY 的实现，覆盖 Mock.mockjax(library)。

    通过方法 Mock.mock(rurl, template) 设置的 URL 和数据模板的映射，均记录在属性 Mock._mocked 中，扩展时可从中获取 URL 对应的数据模板，进而生成和响应模拟数据。Mock._mocked 的数据结构为：
    
        {
            rurl.toString(): {
                rurl: rurl,
                template: template
            },
            ...
        }

    如果业务和场景需要，可以联系 [@墨智]()、[nuysoft](nuysoft@gmail.com) 提供对特定库的内置支持，不过最酷的做法是开发人员能够为 Mock.js 贡献代码。
*/
// for jQuery
Mock.mockjax = function mockjax(jQuery) {

    function mockxhr() {
        return {
            open: jQuery.noop,
            send: jQuery.noop,
            getAllResponseHeaders: jQuery.noop,
            readyState: 4,
            status: 200
        }
    }

    function convert(mock) {
        return function() {
            return Mock.mock(
                jQuery.isFunction(mock.template) ? mock.template() : mock.template
            )
        }
    }

    function prefilter(options) {
        for (var surl in Mock._mocked) {
            var mock = Mock._mocked[surl]

            if (jQuery.type(mock.rurl) === 'string') {
                if (mock.rurl !== options.url) continue
            }
            if (jQuery.type(mock.rurl) === 'regexp') {
                if (!mock.rurl.test(options.url)) continue
            }

            options.dataFilter = convert(mock)
            options.converters['text json'] = convert(mock)
            options.xhr = mockxhr
            break
        }
    }

    jQuery.ajaxPrefilter("*", prefilter)
    jQuery.ajaxPrefilter("json", prefilter)
    jQuery.ajaxPrefilter("jsonp", prefilter)

    return Mock
}

if (typeof jQuery != 'undefined') Mock.mockjax(jQuery)

// for KISSY
if (typeof KISSY != 'undefined' && KISSY.add) {
    Mock.mockjax = function mockjax(KISSY) {
        var _original_ajax = KISSY.io;

        // @白汀 提交：次对象用于模拟kissy的io响应之后的传给success方法的xhr对象，只构造了部分属性，不包含实际KISSY中的完整对象。
        var xhr = {
            readyState: 4,
            responseText: '',
            responseXML: null,
            state: 2,
            status: 200,
            statusText: "success",
            timeoutTimer: null
        };
        KISSY.io = function(options) {
            // if (options.dataType === 'json') {
            for (var surl in Mock._mocked) {
                var mock = Mock._mocked[surl];

                if (KISSY.type(mock.rurl) === 'string') {
                    if (mock.rurl !== options.url) continue
                }
                if (KISSY.type(mock.rurl) === 'regexp') {
                    if (!mock.rurl.test(options.url)) continue
                }

                console.log('[mock]', options.url, '>', mock.rurl)
                var data = Mock.mock(mock.template)
                console.log('[mock]', data)
                if (options.success) options.success(data, 'success', xhr)
                if (options.complete) options.complete(data, 'success', xhr)
                return KISSY
            }
            // }
            return _original_ajax.apply(this, arguments)
        }

        // 还原 KISSY.io 上的属性
        for(var name in _original_ajax) {
            KISSY.io[name] = _original_ajax[name]
        }
    }
}
// END(BROWSER)