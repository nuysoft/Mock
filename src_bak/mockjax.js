var Mock = require('./mock');
var Util = require('./util')

// BEGIN(BROWSER)

function find(options) {

    for (var sUrlType in Mock._mocked) {
        var item = Mock._mocked[sUrlType]
        if (
            (!item.rurl || match(item.rurl, options.url)) &&
            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
        ) {
            // console.log('[mock]', options.url, '>', item.rurl)
            return item
        }
    }

    function match(expected, actual) {
        if (Util.type(expected) === 'string') {
            return expected === actual
        }
        if (Util.type(expected) === 'regexp') {
            return expected.test(actual)
        }
    }

}

function convert(item, options) {
    return Util.isFunction(item.template) ?
        item.template(options) : Mock.mock(item.template)
}

/*
    ### Mock.mockjax(library)

    覆盖（拦截） Ajax 请求，目前内置支持 jQuery、Zepto、KISSY。

*/
// for jQuery
Mock.mockjax = function mockjax(jQuery) {

    function mockxhr() {
        return {
            readyState: 4,
            status: 200,
            statusText: '',
            open: jQuery.noop,
            send: function() {
                if (this.onload) this.onload()
            },
            setRequestHeader: jQuery.noop,
            getAllResponseHeaders: jQuery.noop,
            getResponseHeader: jQuery.noop,
            statusCode: jQuery.noop,
            abort: jQuery.noop
        }
    }

    function prefilter(options, originalOptions, jqXHR) {
        var item = find(options)
        if (item) {
            options.dataFilter =
                options.converters['text json'] =
                options.converters['text jsonp'] =
                options.converters['text script'] =
                options.converters['script json'] = function() {
                    return convert(item, options)
            }
            options.xhr = mockxhr

            if (originalOptions.dataType !== 'script') return 'json'
        }
    }

    // #22 步加载js文件的时候发现问题
    // #23 Mock.mockjax 导致 $.getScript 不执行回调
    jQuery.ajaxPrefilter('json jsonp script', prefilter)

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
            statusText: 'success',
            timeoutTimer: null
        }

        Zepto.ajax = function(options) {
            var item = find(options)
            if (item) {
                var data = Mock.mock(item.template)
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

        // @白汀 提交：此对象用于模拟 KISSY.io 响应之后的传给 success 方法的 xhr 对象，只构造了部分属性，不包含实际 KISSY 中的完整对象。
        var xhr = {
            readyState: 4,
            responseText: '',
            responseXML: null,
            state: 2,
            status: 200,
            statusText: 'success',
            timeoutTimer: null
        };

        KISSY.io = function(options) {
            var item = find(options)
            if (item) {
                var data = Mock.mock(item.template)
                if (options.success) options.success(data, xhr, options)
                if (options.complete) options.complete(xhr.status, xhr, options)
                return xhr
            }
            return _original_ajax.apply(this, arguments)
        }

        // 还原 KISSY.io 上的属性
        for (var name in _original_ajax) {
            KISSY.io[name] = _original_ajax[name]
        }

    }
}
// END(BROWSER)