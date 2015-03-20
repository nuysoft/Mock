(function() {
	if (this.define) return

	var CACHE = {}

	this.define = function(id, dependencies, factory) {
		CACHE[id] = factory
		for (var i = 0; i < dependencies.length; i++) {
			if (dependencies[i][0] === '.') {
				dependencies[i] = dirname(id) + dependencies[i]
				dependencies[i] = realpath(dependencies[i])
			}
			dependencies[i] = CACHE[dependencies[i]]
		}
		CACHE[id] = factory.apply(this, dependencies)
	}

	this.require = function(id) {
		return CACHE[id]
	}

	this.define.umd = true

	// https://github.com/seajs/seajs/blob/master/dist/sea-debug.js

	var DIRNAME_RE = /[^?#]*\//
	var DOT_RE = /\/\.\//g
	var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//
	var MULTI_SLASH_RE = /([^:/])\/+\//g

	function dirname(path) {
		return path.match(DIRNAME_RE)[0]
	}

	function realpath(path) {
		path = path.replace(DOT_RE, "/")
		path = path.replace(MULTI_SLASH_RE, "$1/")
		while (path.match(DOUBLE_DOT_RE)) {
			path = path.replace(DOUBLE_DOT_RE, "/")
		}

		return path
	}

})();