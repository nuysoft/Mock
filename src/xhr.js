// var Mock = require('./mock')
// var Util = require('./util')

var Util = Mock.Util

// BEGIN(BROWSER)

/*
    期望的功能：
    1. 完整覆盖原生 XHR 的行为
    2. 完整模拟原生 XHR 的行为
    3. 在发起请求时，检测是否需要拦截
    4. 如果不必拦截，则执行原生 XHR 的行为
    5. 如果需要拦截，则执行虚拟 XHR 的行为
    
    关键方法的逻辑：

    * new   此时尚无法确定是否需要拦截，所以创建原生 XHR 对象是必须的。
    * open  此时可以取到 URL，可以决定是否进行拦截。
    * send  此时已经确定了请求方式。

    规范
    http://xhr.spec.whatwg.org/
    http://www.w3.org/TR/XMLHttpRequest2/
    
    参考实现
    https://github.com/philikon/MockHttpRequest/blob/master/lib/mock.js
    https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js
    https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
    https://github.com/firebug/firebug-lite/blob/master/content/lite/xhr.js

    **需不需要全面重写 XMLHttpRequest？**
        http://xhr.spec.whatwg.org/#interface-xmlhttprequest
        关键属性 readyState、status、statusText、response、responseText、responseXML 是 readonly，所以，试图通过修改这些状态，来模拟响应是不可行的。
        唯一的办法，是模拟整个 XMLHttpRequest，就像 jQuery 对事件模型的封装一样。

    // Event handlers
    event handler       event handler event type
    onloadstart         loadstart
    onprogress          progress
    onabort             abort
    onerror             error
    onload              load
    ontimeout           timeout
    onloadend           loadend
    onreadystatechange  readystatechange
    
    **兼容 XMLHttpRequest 和 ActiveXObject**
    
    new window.XMLHttpRequest()
    new window.ActiveXObject("Microsoft.XMLHTTP")

*/

/*
    var Transports = {
        XMLHttpRequest: {},
        FakeXMLHttpRequest: {
            send: function() {},
            open: function() {},
            abort: function() {}
        }
    }
*/

var FakeXMLHttpRequest = (function() {

    var XHR_STATES = {
        // The object has been constructed.
        UNSENT: 0,
        // The open() method has been successfully invoked.
        OPENED: 1,
        // All redirects (if any) have been followed and all HTTP headers of the response have been received.
        HEADERS_RECEIVED: 2,
        // The response's body is being received.
        LOADING: 3,
        // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
        DONE: 4
    }

    var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ')

    var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ')

    // https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js#L32
    var HTTP_STATUS_CODES = {
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        300: "Multiple Choice",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported"
    }

    // Inspired by jQuery
    function createOriginalXMLHttpRequest() {
        var isLocal = function() {
            var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
            var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
            var ajaxLocation = location.href
            var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
            return rlocalProtocol.test(ajaxLocParts[1])
        }()

        return window.ActiveXObject ?
            (!isLocal && createStandardXHR() || createActiveXHR()) : createStandardXHR()

        function createStandardXHR() {
            try {
                return new window.XMLHttpRequest();
            } catch (e) {}
        }

        function createActiveXHR() {
            try {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    /*
     
     */
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
        FakeXMLHttpRequest
    */

    function FakeXMLHttpRequest() {
        // 冒牌 XHR 对象
        var fake = this

        // 创建原生 XHR 对象
        var xhr = createOriginalXMLHttpRequest()

        // 初始化 custom 对象，用于存储自定义属性
        fake.custom = {
            xhr: xhr,
            events: {},
            requestHeaders: {}
        }

        // 初始化所有事件，用于监听原生 XHR 对象的事件
        for (var i = 0; i < XHR_EVENTS.length; i++) {
            xhr.addEventListener(XHR_EVENTS[i], handle)
            xhr['on' + XHR_EVENTS[i]] = onhandle

            fake['on' + XHR_EVENTS[i]] = function(event) {
                console.log('[EVENT]   ', event.type, fake.readyState)
            }
        }

        function handle(event) {
            console.log('[EVENT]   ', event.type, xhr.readyState)

            syncProperties()

            var handles = fake.custom.events[event.type] || []
            for (var i = 0; i < handles.length; i++) {
                if (typeof handles[i] !== "function") continue
                handles[i].call(fake, event)
            }
        }

        function onhandle(event) {
            // console.log('[ON_EVENT]', event.type, xhr.readyState)

            syncProperties()

            var ontype = 'on' + event.type
            if (fake[ontype]) fake[ontype].call(fake, event)
        }

        function syncProperties() {
            for (var i = 0, l = XHR_RESPONSE_PROPERTIES.length; i < l; i++) {
                fake[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
            }
        }
    }

    Util.extend(FakeXMLHttpRequest, XHR_STATES)
    Util.extend(FakeXMLHttpRequest.prototype, XHR_STATES)

    // 标记运行模式为 Mock 模式
    FakeXMLHttpRequest.prototype.mock = false
    // 标记当前对象为 FakeXMLHttpRequest
    FakeXMLHttpRequest.prototype.fake = true

    // Request 相关的属性和方法
    Util.extend(FakeXMLHttpRequest.prototype, {
        open: function open(method, url, async, username, password) {
            Util.extend(this.custom, {
                method: method,
                url: url,
                async: typeof async === "boolean" ? async : true,
                username: username,
                password: password
            })

            var options = {
                url: url,
                type: method
            }
            var item = find(options)

            if (!item) {
                var xhr = this.custom.xhr
                if (username) xhr.open(method, url, async, username, password)
                else xhr.open(method, url, async)
            }

            this.mock = true

            debugger

            // readyStateChange(this, FakeXMLHttpRequest.OPENED)
        },
        setRequestHeader: function setRequestHeader(name, value) {
            this.custom.xhr.setRequestHeader(name, value)
            /*var requestHeaders = this.custom.requestHeaders
            if (requestHeaders[name]) requestHeaders[name] += "," + value;
            else requestHeaders[name] = value;*/
        },
        timeout: 0,
        withCredentials: false,
        upload: {},
        send: function send(data) {
            var options = {
                url: this.custom.url,
                type: this.custom.method
            }
            var item = find(options)

            if (!item) {
                var xhr = this.custom.xhr
                xhr.send(data)
                return
            }

            this.mock = true

            this.dispatchEvent(new Event("loadstart", false, false, this))
            this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED)
            this.readyStateChange(FakeXMLHttpRequest.LOADING)

            this.responseText = JSON.stringify(convert(item, options), null, 4)

            this.readyStateChange(FakeXMLHttpRequest.DONE)
        },
        abort: function abort() {
            var xhr = this.custom.xhr
            xhr.abort()
            /*
            readyStateChange(this, FakeXMLHttpRequest.DONE)
            this.readyState = FakeXMLHttpRequest.UNSENT
            this.dispatchEvent(new Event("abort", false, false, this));
            if (typeof this.onabort === "function") {
                this.onerror()
            }
            if (typeof this.onerror === "function") {
                this.onerror()
            }
            */
        }
    })

    // Response 相关的属性和方法
    Util.extend(FakeXMLHttpRequest.prototype, {
        responseURL: '',
        status: FakeXMLHttpRequest.UNSENT,
        statusText: '',
        getResponseHeader: function getResponseHeader(name) {
            return this.custom.xhr.getResponseHeader(name)

            /*if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) return null

            header = header.toLowerCase()

            for (var h in this.responseHeaders) {
                if (h.toLowerCase() === header) {
                    return this.responseHeaders[h]
                }
            }

            return null*/
        },
        getAllResponseHeaders: function getAllResponseHeaders() {
            return this.custom.xhr.getAllResponseHeaders()

            /*if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                return ""
            }

            var headers = "";
            for (var h in this.responseHeaders) {
                if (!this.responseHeaders.hasOwnProperty(h)) continue
                headers += h + ": " + this.responseHeaders[header] + "\r\n"
            }

            return headers;*/
        },
        overrideMimeType: function overrideMimeType(mime) {},
        responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json' 
        response: null,
        responseText: '',
        responseXML: null
    })

    // EventTarget
    Util.extend(FakeXMLHttpRequest.prototype, {
        addEventListene: function addEventListene(type, handle) {
            if (!this.custom.events[type]) this.custom.events[type] = []

            var handles = this.custom.events[type]
            handles.push(handle)
        },
        removeEventListener: function removeEventListener(type, handle) {
            var handles = this.custom.events[type] || []
            for (var i = 0, l = handles.length; i < l; ++i) {
                if (handles[i] === handle) {
                    return handles.splice(i, 1);
                }
            }
        },
        dispatchEvent: function dispatchEvent(event) {
            var type = event.type
            var handles = this.custom.events[type] || []
            for (var i = 0; i < handles.length; i++) {
                if (typeof handles[i] !== "function") continue
                handles[i].call(this, event)
            }

            var ontype = 'on' + event.type
            if (this[ontype]) this[ontype](event)
        },
        readyStateChange: function readyStateChange(state) {
            this.readyState = state;

            if (typeof this.onreadystatechange == "function") {
                this.onreadystatechange({
                    type: 'readystatechange'
                })
            }

            this.dispatchEvent(new Event("readystatechange"));

            if (this.readyState == FakeXMLHttpRequest.DONE) {
                this.dispatchEvent(new Event("load", false, false, this));
                this.dispatchEvent(new Event("loadend", false, false, this));
            }
        }
    })

    return FakeXMLHttpRequest

})()

// END(BROWSER)