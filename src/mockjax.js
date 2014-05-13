var Mock = require('./mock');

// BEGIN(BROWSER)
/*
    ### Mock.mockjax(library)

    覆盖（拦截） Ajax 请求，目前内置支持 jQuery、Zepto、KISSY。

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

    function convert(item, options) {
        return function() {
            return jQuery.isFunction(item.template) ?
                item.template(options) : Mock.mock(item.template)
        }
    }

    function prefilter(options, originalOptions, jqXHR) {

        function match(expected, actual) {
            if (jQuery.type(expected) === 'string') {
                return expected === actual
            }
            if (jQuery.type(expected) === 'regexp') {
                return expected.test(actual)
            }
        }

        for (var sUrlType in Mock._mocked) {
            var item = Mock._mocked[sUrlType]
            if (
                (!item.rurl || match(item.rurl, options.url)) &&
                (!item.rtype || match(item.rtype, options.type.toLowerCase()))
            ) {
                options.dataFilter = convert(item, options)
                options.converters['text json'] = convert(item, options)
                options.converters['text jsonp'] = convert(item, options)
                options.xhr = mockxhr
                break
            }
        }
    }

    jQuery.ajaxPrefilter("json", prefilter)
    jQuery.ajaxPrefilter("jsonp", prefilter)

    return Mock
}

if (typeof jQuery != 'undefined') Mock.mockjax(jQuery)

/*
    for Zepto
    因为 Zepto 并没有实现类似 jQuery.ajaxPrefilter 等预处理函数，所以将和 KISSY 类似直接粗暴处理。
*/
if (typeof Zepto != 'undefined') {
    Mock.mockjax = function(Zepto) {
        var __original_ajax = Zepto.ajax
        var xhr = {
            readyState: 4,
            responseText: '',
            responseXML: null,
            state: 2,
            status: 200,
            statusText: "success",
            timeoutTimer: null
        }

        /**
         * @param options
         * return xhr
         */
        Zepto.ajax = function(options) {
            for (var surl in Mock._mocked) {
                var mock = Mock._mocked[surl]

                if (Zepto.type(mock.rurl) === 'string') {
                    if (mock.rurl !== options.url) continue
                }
                if (Zepto.type(mock.rurl) === 'regexp') {
                    if (!mock.rurl.test(options.url)) continue
                }

                console.log('[mock]', options.url, '>', mock.rurl)
                var data = Mock.mock(mock.template)
                console.log('[mock]', data)
                if (options.success) options.success(data, xhr, options)
                if (options.complete) options.complete(xhr.status, xhr, options)
                return xhr
            }

            return __original_ajax.call(Zepto, options)
        }
    }

    Mock.mockjax(Zepto)
}

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
        for (var name in _original_ajax) {
            KISSY.io[name] = _original_ajax[name]
        }
    }
}
// END(BROWSER)