var Mock = require('./mock');

// BEGIN(BROWSER)
/*
    mock ajax
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
            return Mock.mock(mock.template)
        }
    }

    jQuery.ajaxPrefilter("*", function(options) {
        for (var surl in Mock._mocked) {
            var mock = Mock._mocked[surl]

            if (jQuery.type(mock.rurl) === 'string') {
                if (mock.rurl !== options.url) continue
            }
            if (jQuery.type(mock.rurl) === 'regexp') {
                if (!mock.rurl.test(options.url)) continue
            }

            options.converters['text json'] = convert(mock)
            options.xhr = mockxhr
            break
        }
    })

    return Mock
}

if (typeof jQuery != 'undefined') Mock.mockjax(jQuery)

// for KISSY
if (typeof KISSY != 'undefined' && KISSY.add) {
    Mock.mockjax = function mockjax(KISSY) {
        var _original_ajax = KISSY.io;
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
                if (options.success) options.success(data)
                if (options.complete) options.complete(data)
                return KISSY
            }
            // }
            return _original_ajax.apply(this, arguments)
        }
    }
}
// END(BROWSER)