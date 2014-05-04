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
    function prefilter(options) {
        var mock = Mock.mockjax.match(options)

        if (!mock) {
            return
        }

        options.xhr                     = Mock.mockjax.xhr
        options.dataFilter              = Mock.mockjax.convert(mock)
        options.converters['text json'] = Mock.mockjax.convert(mock)
    }

    jQuery.ajaxPrefilter("*"     , prefilter)
    jQuery.ajaxPrefilter("json"  , prefilter)
    jQuery.ajaxPrefilter("jsonp" , prefilter)

    return Mock
}

if (typeof jQuery != 'undefined') Mock.mockjax(jQuery)


// for Zepto
// 因为 Zepto 并没有实现类似 jQuery.ajaxPrefilter 等预处理函数
// 所以将和 KISSY 类似直接粗暴处理
if (typeof Zepto != 'undefined') {
    Mock.mockjax = function(Zepto) {
        var __original_ajax = Zepto.ajax

        /**
         * @param options
         * return xhr
         */
        Zepto.ajax = function(options) {
            var mock = Mock.mockjax.match(options)

            if (!mock) {
                return __original_ajax.apply(Zepto, arguments)
            }

            var xhr = Mock.mockjax.xhr()
            var data = Mock.mockjax.convert(mock)()

            console.log('[mock]', options.url, '>', mock.rurl)
            console.log('[mock]', data)

            if (options.success) options.success(data, xhr.status, xhr)
            if (options.complete) options.complete(xhr, xhr.status)

            return xhr
        }
    }

    Mock.mockjax(Zepto)
}

// for KISSY
if (typeof KISSY != 'undefined' && KISSY.add) {
    Mock.mockjax = function mockjax(KISSY) {
        var _original_ajax = KISSY.io

        KISSY.io = function(options) {
            var mock = Mock.mockjax.match(options)

            if (!mock) {
                return _original_ajax.apply(this, arguments)
            }

            var xhr = Mock.mockjax.xhr()
            var data = Mock.mockjax.convert(mock)()

            console.log('[mock]', options.url, '>', mock.rurl)
            console.log('[mock]', data)

            if (options.success) options.success(data, 'success', xhr)
            if (options.complete) options.complete(data, 'success', xhr)

            return KISSY
        }

        // 还原 KISSY.io 上的属性
        for(var name in _original_ajax) {
            KISSY.io[name] = _original_ajax[name]
        }
    }
}


// 公共流程部件

/**
 * 合并了 jQuery 和 KISSY 的 xhr 属性
 * @白汀 提交：次对象用于模拟kissy的io响应之后的传给success方法
 * 的xhr对象，只构造了部分属性，不包含实际KISSY中的完整对象。
 */
Mock.mockjax.xhr = function() {
    return {
        statusText: "success",
        responseText: '',
        responseXML: null,
        timeoutTimer: null,
        open: Mock.Util.noop,
        send: Mock.Util.noop,
        getAllResponseHeaders: Mock.Util.noop,
        state: 2,
        readyState: 4,
        status: 200
    }
}

/**
 * @param {Object} mock Mock._mocked 对象
 * return Function
 */
Mock.mockjax.convert = function(mock) {
    return function() {
        return Mock.mock(
            Mock.Util.isFunction(mock.template) ? mock.template() : mock.template
        )
    }
}

/**
 * @param {Object} options  Ajax options    调用 ajax 时的参数
 * return Object | Null 返回找到的匹配对象
 */
Mock.mockjax.match = function(options) {
    for (var surl in Mock._mocked) {
        var mock = Mock._mocked[surl]

        if (Mock.Util.type(mock.rurl) === 'string' &&
            mock.rurl !== options.url) {
                continue
        }

        if (Mock.Util.type(mock.rurl) === 'regexp' &&
            !mock.rurl.test(options.url)) {
                continue
        }

        return mock
    }

    return null
}

// END(BROWSER)
