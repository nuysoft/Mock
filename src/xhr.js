var Util = require('./util')

// BEGIN(BROWSER)

function open() {

}

function send() {

}

// END(BROWSER)


/*
    from https://github.com/firebug/firebug-lite/blob/master/content/lite/xhr.js
    http://xhr.spec.whatwg.org/
    https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js

    **需不需要全面重写 XMLHttpRequest？**
		
	直接修改 xhr.readyState 不生效，所以必须要全面重写 XMLHttpRequest！

    ```javascript
    readonly attribute unsigned short readyState;
    ```

    // Event handlers
    event handler   event handler event type
    onloadstart     loadstart
    onprogress      progress
    onabort         abort
    onerror         error
    onload          load
    ontimeout       timeout
    onloadend       loadend
    onreadystatechange  readystatechange

    new window.XMLHttpRequest()
    new window.ActiveXObject("Microsoft.XMLHTTP")

*/

var FakeXMLHttpRequest = (function() {

	var STATES = {
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

	function FakeXMLHttpRequest() {
		this.readyState = 0

		this.timeout = 0

		this.status = 0
		this.statusText = ""
		this.responseType = ""
		this.response = ""
		this.responseText = ""
		this.responseXML = null
	}

	Util.extend(FakeXMLHttpRequest, STATES)
	Util.extend(FakeXMLHttpRequest.prototype, STATES)

	// Request
	Util.extend(FakeXMLHttpRequest.prototype, {
		open: function open(method, url, async, username, password) {

		},
		setRequestHeader: function setRequestHeader(name, value) {

		},
		timeout: 0,
		withCredentials: false,
		upload: {},
		send: send(data),
		abort: abort()
	})

	// Response
	Util.extend(FakeXMLHttpRequest.prototype, {
		responseURL: '',
		status: '',
		statusText: '',
		getResponseHeader: function getResponseHeader(name) {

		},
		getAllResponseHeaders: function getAllResponseHeaders() {},
		overrideMimeType: function overrideMimeType(mime) {},
		responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json' 
		response: undefined,
		responseText: '',
		responseXML: ''
	})

	// EventTarget
	Util.extend(FakeXMLHttpRequest.prototype, {
		addEventListene: function addEventListene() {},
		removeEventListener: function removeEventListener() {},
		dispatchEvent: function dispatchEvent() {}
	})

	return FakeXMLHttpRequest

})()
