/*! mockjs 0.2.0-alpha1 04-11-2014 11:25:24 *//*! src/fix/prefix-1.js */
(function(factory) {
    /*! src/fix/prefix-2.js */
    try {
        // for node
        window;
    } catch (error) {
        window = {};
    }
    expose("mockjs", [], factory, function() {
        // Browser globals
        window.Mock = factory();
        window.Random = Mock.Random;
    });
    /*! src/fix/expose.js */
    /*
        * expose(id, dependencies, factory, globals)
        * expose(id, factory, globals)
        * expose(dependencies, factory, globals)
        * expose(factory, globals)
        * expose(factory)
    
        模块化（Modular），适配主流加载器。

        https://gist.github.com/nuysoft/7974409
    */
    function expose(id, dependencies, factory, globals) {
        var argsLen = arguments.length;
        var args = [];
        switch (argsLen) {
          case 1:
            // expose(factory)
            factory = id;
            id = dependencies = globals = undefined;
            break;

          case 2:
            // expose(factory, globals)
            factory = id;
            globals = dependencies;
            id = dependencies = undefined;
            break;

          case 3:
            globals = factory;
            factory = dependencies;
            if (id instanceof Array) {
                // expose(dependencies, factory, globals)
                dependencies = id;
                id = undefined;
            } else {
                // expose(id, factory, globals)
                dependencies = undefined;
            }
            break;

          default:        }
        if (typeof module === "object" && module.exports) {
            // CommonJS
            module.exports = factory();
        } else if (typeof define === "function" && define.amd) {
            // AMD modules
            // define(id?, dependencies?, factory)
            // https://github.com/amdjs/amdjs-api/wiki/AMD
            if (id !== undefined) args.push(id);
            if (dependencies !== undefined) args.push(dependencies);
            args.push(factory);
            define.apply(window, args);
        } else if (typeof define === "function" && define.cmd) {
            // CMD modules
            // define(id?, deps?, factory)
            // https://github.com/seajs/seajs/issues/242
            if (id !== undefined) args.push(id);
            if (dependencies !== undefined) args.push(dependencies);
            args.push(factory);
            define.apply(window, args);
        } else if (typeof KISSY != "undefined") {
            // For KISSY 1.4
            // http://docs.kissyui.com/1.4/docs/html/guideline/kmd.html
            if (!window.define) {
                window.define = function define(id, dependencies, factory) {
                    // KISSY.add(name?, factory?, deps)
                    function proxy() {
                        var args = [].slice.call(arguments, 1, arguments.length);
                        return factory.apply(window, args);
                    }
                    switch (arguments.length) {
                      case 2:
                        // KISSY.add(factory, deps)
                        factory = dependencies;
                        dependencies = id;
                        KISSY.add(proxy, {
                            requires: dependencies.concat([ "node" ])
                        });
                        break;

                      case 3:
                        // KISSY.add(name?, factory, deps)
                        KISSY.add(id, proxy, {
                            requires: dependencies.concat([ "node" ])
                        });
                        break;
                    }
                };
                window.define.kmd = {};
            }
            define(id, dependencies, factory);
        } else {
            // Browser globals
            if (globals) globals();
        }
    }
})(function() {
    /*! src/util.js */
    /*
        Utilities
    */
    var Util = function() {
        var Util = {};
        Util.extend = function extend() {
            var target = arguments[0] || {}, i = 1, length = arguments.length, options, name, src, copy, clone;
            if (length === 1) {
                target = this;
                i = 0;
            }
            for (;i < length; i++) {
                options = arguments[i];
                if (!options) continue;
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) continue;
                    if (copy === undefined) continue;
                    if (Util.isArray(copy) || Util.isObject(copy)) {
                        if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : [];
                        if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {};
                        target[name] = Util.extend(clone, copy);
                    } else {
                        target[name] = copy;
                    }
                }
            }
            return target;
        };
        Util.each = function each(obj, iterator, context) {
            var i, key;
            if (this.type(obj) === "number") {
                for (i = 0; i < obj; i++) {
                    iterator(i, i);
                }
            } else if (obj.length === +obj.length) {
                for (i = 0; i < obj.length; i++) {
                    if (iterator.call(context, obj[i], i, obj) === false) break;
                }
            } else {
                for (key in obj) {
                    if (iterator.call(context, obj[key], key, obj) === false) break;
                }
            }
        };
        Util.type = function type(obj) {
            return obj === null || obj === undefined ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
        };
        Util.each("String Object Array RegExp Function".split(" "), function(value) {
            Util["is" + value] = function(obj) {
                return Util.type(obj) === value.toLowerCase();
            };
        });
        Util.isObjectOrArray = function(value) {
            return Util.isObject(value) || Util.isArray(value);
        };
        Util.isNumeric = function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        };
        Util.keys = function(obj) {
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) keys.push(key);
            }
            return keys;
        };
        Util.values = function(obj) {
            var values = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) values.push(obj[key]);
            }
            return values;
        };
        /*
            ### Mock.heredoc(fn)

            * Mock.mockjax(fn)

            以直观、安全的方式书写（多行）HTML 模板。

            **使用示例**如下所示：

                var tpl = Mock.heredoc(function() {
                    /*!
                {{email}}{{age}}
                <!-- Mock { 
                    email: '@EMAIL',
                    age: '@INT(1,100)'
                } -->
                    *\/
                })
            
            **相关阅读**
            * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)、
        */
        Util.heredoc = function heredoc(fn) {
            // 1. 移除起始的 function(){ /*!
            // 2. 移除末尾的 */ }
            // 3. 移除起始和末尾的空格
            return fn.toString().replace(/^[^\/]+\/\*!?/, "").replace(/\*\/[^\/]+$/, "").replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
        };
        Util.noop = function() {};
        return Util;
    }();
    /*! src/regexp_parser.js */
    // https://github.com/nuysoft/regexp
    // forked from https://github.com/ForbesLindesay/regexp
    function parse(n) {
        if ("string" != typeof n) {
            var l = new TypeError("The regexp to parse must be represented as a string.");
            throw l;
        }
        return index = 1, cgs = {}, parser.parse(n);
    }
    function Token(n) {
        this.type = n, this.offset = Token.offset(), this.text = Token.text();
    }
    function Alternate(n, l) {
        Token.call(this, "alternate"), this.left = n, this.right = l;
    }
    function Match(n) {
        Token.call(this, "match"), this.body = n.filter(Boolean);
    }
    function Group(n, l) {
        Token.call(this, n), this.body = l;
    }
    function CaptureGroup(n) {
        Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++), 
        this.body = n;
    }
    function Quantified(n, l) {
        Token.call(this, "quantified"), this.body = n, this.quantifier = l;
    }
    function Quantifier(n, l) {
        Token.call(this, "quantifier"), this.min = n, this.max = l, this.greedy = !0;
    }
    function CharSet(n, l) {
        Token.call(this, "charset"), this.invert = n, this.body = l;
    }
    function CharacterRange(n, l) {
        Token.call(this, "range"), this.start = n, this.end = l;
    }
    function Literal(n) {
        Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
    }
    function Unicode(n) {
        Token.call(this, "unicode"), this.code = n.toUpperCase();
    }
    function Hex(n) {
        Token.call(this, "hex"), this.code = n.toUpperCase();
    }
    function Octal(n) {
        Token.call(this, "octal"), this.code = n.toUpperCase();
    }
    function BackReference(n) {
        Token.call(this, "back-reference"), this.code = n.toUpperCase();
    }
    function ControlCharacter(n) {
        Token.call(this, "control-character"), this.code = n.toUpperCase();
    }
    var parser = function() {
        function n(n, l) {
            function u() {
                this.constructor = n;
            }
            u.prototype = l.prototype, n.prototype = new u();
        }
        function l(n, l, u, t, r) {
            function e(n, l) {
                function u(n) {
                    function l(n) {
                        return n.charCodeAt(0).toString(16).toUpperCase();
                    }
                    return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n) {
                        return "\\x0" + l(n);
                    }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n) {
                        return "\\x" + l(n);
                    }).replace(/[\u0180-\u0FFF]/g, function(n) {
                        return "\\u0" + l(n);
                    }).replace(/[\u1080-\uFFFF]/g, function(n) {
                        return "\\u" + l(n);
                    });
                }
                var t, r;
                switch (n.length) {
                  case 0:
                    t = "end of input";
                    break;

                  case 1:
                    t = n[0];
                    break;

                  default:
                    t = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
                }
                return r = l ? '"' + u(l) + '"' : "end of input", "Expected " + t + " but " + r + " found.";
            }
            this.expected = n, this.found = l, this.offset = u, this.line = t, this.column = r, 
            this.name = "SyntaxError", this.message = e(n, l);
        }
        function u(n) {
            function u() {
                return n.substring(Lt, qt);
            }
            function t() {
                return Lt;
            }
            function r(l) {
                function u(l, u, t) {
                    var r, e;
                    for (r = u; t > r; r++) e = n.charAt(r), "\n" === e ? (l.seenCR || l.line++, l.column = 1, 
                    l.seenCR = !1) : "\r" === e || "\u2028" === e || "\u2029" === e ? (l.line++, l.column = 1, 
                    l.seenCR = !0) : (l.column++, l.seenCR = !1);
                }
                return Mt !== l && (Mt > l && (Mt = 0, Dt = {
                    line: 1,
                    column: 1,
                    seenCR: !1
                }), u(Dt, Mt, l), Mt = l), Dt;
            }
            function e(n) {
                Ht > qt || (qt > Ht && (Ht = qt, Ot = []), Ot.push(n));
            }
            function o(n) {
                var l = 0;
                for (n.sort(); l < n.length; ) n[l - 1] === n[l] ? n.splice(l, 1) : l++;
            }
            function c() {
                var l, u, t, r, o;
                return l = qt, u = i(), null !== u ? (t = qt, 124 === n.charCodeAt(qt) ? (r = fl, 
                qt++) : (r = null, 0 === Wt && e(sl)), null !== r ? (o = c(), null !== o ? (r = [ r, o ], 
                t = r) : (qt = t, t = il)) : (qt = t, t = il), null === t && (t = al), null !== t ? (Lt = l, 
                u = hl(u, t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, 
                l = il), l;
            }
            function i() {
                var n, l, u, t, r;
                if (n = qt, l = f(), null === l && (l = al), null !== l) if (u = qt, Wt++, t = d(), 
                Wt--, null === t ? u = al : (qt = u, u = il), null !== u) {
                    for (t = [], r = h(), null === r && (r = a()); null !== r; ) t.push(r), r = h(), 
                    null === r && (r = a());
                    null !== t ? (r = s(), null === r && (r = al), null !== r ? (Lt = n, l = dl(l, t, r), 
                    null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il);
                } else qt = n, n = il; else qt = n, n = il;
                return n;
            }
            function a() {
                var n;
                return n = x(), null === n && (n = Q(), null === n && (n = B())), n;
            }
            function f() {
                var l, u;
                return l = qt, 94 === n.charCodeAt(qt) ? (u = pl, qt++) : (u = null, 0 === Wt && e(vl)), 
                null !== u && (Lt = l, u = wl()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function s() {
                var l, u;
                return l = qt, 36 === n.charCodeAt(qt) ? (u = Al, qt++) : (u = null, 0 === Wt && e(Cl)), 
                null !== u && (Lt = l, u = gl()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function h() {
                var n, l, u;
                return n = qt, l = a(), null !== l ? (u = d(), null !== u ? (Lt = n, l = bl(l, u), 
                null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), n;
            }
            function d() {
                var n, l, u;
                return Wt++, n = qt, l = p(), null !== l ? (u = k(), null === u && (u = al), null !== u ? (Lt = n, 
                l = Tl(l, u), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, 
                n = il), Wt--, null === n && (l = null, 0 === Wt && e(kl)), n;
            }
            function p() {
                var n;
                return n = v(), null === n && (n = w(), null === n && (n = A(), null === n && (n = C(), 
                null === n && (n = g(), null === n && (n = b()))))), n;
            }
            function v() {
                var l, u, t, r, o, c;
                return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
                null !== u ? (t = T(), null !== t ? (44 === n.charCodeAt(qt) ? (r = ml, qt++) : (r = null, 
                0 === Wt && e(Rl)), null !== r ? (o = T(), null !== o ? (125 === n.charCodeAt(qt) ? (c = Fl, 
                qt++) : (c = null, 0 === Wt && e(Ql)), null !== c ? (Lt = l, u = Sl(t, o), null === u ? (qt = l, 
                l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            function w() {
                var l, u, t, r;
                return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
                null !== u ? (t = T(), null !== t ? (n.substr(qt, 2) === Ul ? (r = Ul, qt += 2) : (r = null, 
                0 === Wt && e(El)), null !== r ? (Lt = l, u = Gl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
            }
            function A() {
                var l, u, t, r;
                return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
                null !== u ? (t = T(), null !== t ? (125 === n.charCodeAt(qt) ? (r = Fl, qt++) : (r = null, 
                0 === Wt && e(Ql)), null !== r ? (Lt = l, u = Bl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
            }
            function C() {
                var l, u;
                return l = qt, 43 === n.charCodeAt(qt) ? (u = jl, qt++) : (u = null, 0 === Wt && e($l)), 
                null !== u && (Lt = l, u = ql()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function g() {
                var l, u;
                return l = qt, 42 === n.charCodeAt(qt) ? (u = Ll, qt++) : (u = null, 0 === Wt && e(Ml)), 
                null !== u && (Lt = l, u = Dl()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function b() {
                var l, u;
                return l = qt, 63 === n.charCodeAt(qt) ? (u = Hl, qt++) : (u = null, 0 === Wt && e(Ol)), 
                null !== u && (Lt = l, u = Wl()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function k() {
                var l;
                return 63 === n.charCodeAt(qt) ? (l = Hl, qt++) : (l = null, 0 === Wt && e(Ol)), 
                l;
            }
            function T() {
                var l, u, t;
                if (l = qt, u = [], zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 
                0 === Wt && e(Il)), null !== t) for (;null !== t; ) u.push(t), zl.test(n.charAt(qt)) ? (t = n.charAt(qt), 
                qt++) : (t = null, 0 === Wt && e(Il)); else u = il;
                return null !== u && (Lt = l, u = Jl(u)), null === u ? (qt = l, l = u) : l = u, 
                l;
            }
            function x() {
                var l, u, t, r;
                return l = qt, 40 === n.charCodeAt(qt) ? (u = Kl, qt++) : (u = null, 0 === Wt && e(Nl)), 
                null !== u ? (t = R(), null === t && (t = F(), null === t && (t = m(), null === t && (t = y()))), 
                null !== t ? (41 === n.charCodeAt(qt) ? (r = Pl, qt++) : (r = null, 0 === Wt && e(Vl)), 
                null !== r ? (Lt = l, u = Xl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
            }
            function y() {
                var n, l;
                return n = qt, l = c(), null !== l && (Lt = n, l = Yl(l)), null === l ? (qt = n, 
                n = l) : n = l, n;
            }
            function m() {
                var l, u, t;
                return l = qt, n.substr(qt, 2) === Zl ? (u = Zl, qt += 2) : (u = null, 0 === Wt && e(_l)), 
                null !== u ? (t = c(), null !== t ? (Lt = l, u = nu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            function R() {
                var l, u, t;
                return l = qt, n.substr(qt, 2) === lu ? (u = lu, qt += 2) : (u = null, 0 === Wt && e(uu)), 
                null !== u ? (t = c(), null !== t ? (Lt = l, u = tu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            function F() {
                var l, u, t;
                return l = qt, n.substr(qt, 2) === ru ? (u = ru, qt += 2) : (u = null, 0 === Wt && e(eu)), 
                null !== u ? (t = c(), null !== t ? (Lt = l, u = ou(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            function Q() {
                var l, u, t, r, o;
                if (Wt++, l = qt, 91 === n.charCodeAt(qt) ? (u = iu, qt++) : (u = null, 0 === Wt && e(au)), 
                null !== u) if (94 === n.charCodeAt(qt) ? (t = pl, qt++) : (t = null, 0 === Wt && e(vl)), 
                null === t && (t = al), null !== t) {
                    for (r = [], o = S(), null === o && (o = U()); null !== o; ) r.push(o), o = S(), 
                    null === o && (o = U());
                    null !== r ? (93 === n.charCodeAt(qt) ? (o = fu, qt++) : (o = null, 0 === Wt && e(su)), 
                    null !== o ? (Lt = l, u = hu(t, r), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                    l = il)) : (qt = l, l = il);
                } else qt = l, l = il; else qt = l, l = il;
                return Wt--, null === l && (u = null, 0 === Wt && e(cu)), l;
            }
            function S() {
                var l, u, t, r;
                return Wt++, l = qt, u = U(), null !== u ? (45 === n.charCodeAt(qt) ? (t = pu, qt++) : (t = null, 
                0 === Wt && e(vu)), null !== t ? (r = U(), null !== r ? (Lt = l, u = wu(u, r), null === u ? (qt = l, 
                l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), Wt--, 
                null === l && (u = null, 0 === Wt && e(du)), l;
            }
            function U() {
                var n, l;
                return Wt++, n = G(), null === n && (n = E()), Wt--, null === n && (l = null, 0 === Wt && e(Au)), 
                n;
            }
            function E() {
                var l, u;
                return l = qt, Cu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 0 === Wt && e(gu)), 
                null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, l;
            }
            function G() {
                var n;
                return n = L(), null === n && (n = Y(), null === n && (n = H(), null === n && (n = O(), 
                null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), 
                null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), 
                null === n && (n = X(), null === n && (n = _(), null === n && (n = nl(), null === n && (n = ll(), 
                null === n && (n = ul(), null === n && (n = tl()))))))))))))))))), n;
            }
            function B() {
                var n;
                return n = j(), null === n && (n = q(), null === n && (n = $())), n;
            }
            function j() {
                var l, u;
                return l = qt, 46 === n.charCodeAt(qt) ? (u = ku, qt++) : (u = null, 0 === Wt && e(Tu)), 
                null !== u && (Lt = l, u = xu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function $() {
                var l, u;
                return Wt++, l = qt, mu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 
                0 === Wt && e(Ru)), null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, 
                Wt--, null === l && (u = null, 0 === Wt && e(yu)), l;
            }
            function q() {
                var n;
                return n = M(), null === n && (n = D(), null === n && (n = Y(), null === n && (n = H(), 
                null === n && (n = O(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), 
                null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), 
                null === n && (n = V(), null === n && (n = X(), null === n && (n = Z(), null === n && (n = _(), 
                null === n && (n = nl(), null === n && (n = ll(), null === n && (n = ul(), null === n && (n = tl()))))))))))))))))))), 
                n;
            }
            function L() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
                null !== u && (Lt = l, u = Su()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function M() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
                null !== u && (Lt = l, u = Uu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function D() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Eu ? (u = Eu, qt += 2) : (u = null, 0 === Wt && e(Gu)), 
                null !== u && (Lt = l, u = Bu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function H() {
                var l, u;
                return l = qt, n.substr(qt, 2) === ju ? (u = ju, qt += 2) : (u = null, 0 === Wt && e($u)), 
                null !== u && (Lt = l, u = qu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function O() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Lu ? (u = Lu, qt += 2) : (u = null, 0 === Wt && e(Mu)), 
                null !== u && (Lt = l, u = Du()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function W() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Hu ? (u = Hu, qt += 2) : (u = null, 0 === Wt && e(Ou)), 
                null !== u && (Lt = l, u = Wu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function z() {
                var l, u;
                return l = qt, n.substr(qt, 2) === zu ? (u = zu, qt += 2) : (u = null, 0 === Wt && e(Iu)), 
                null !== u && (Lt = l, u = Ju()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function I() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Ku ? (u = Ku, qt += 2) : (u = null, 0 === Wt && e(Nu)), 
                null !== u && (Lt = l, u = Pu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function J() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Vu ? (u = Vu, qt += 2) : (u = null, 0 === Wt && e(Xu)), 
                null !== u && (Lt = l, u = Yu()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function K() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Zu ? (u = Zu, qt += 2) : (u = null, 0 === Wt && e(_u)), 
                null !== u && (Lt = l, u = nt()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function N() {
                var l, u;
                return l = qt, n.substr(qt, 2) === lt ? (u = lt, qt += 2) : (u = null, 0 === Wt && e(ut)), 
                null !== u && (Lt = l, u = tt()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function P() {
                var l, u;
                return l = qt, n.substr(qt, 2) === rt ? (u = rt, qt += 2) : (u = null, 0 === Wt && e(et)), 
                null !== u && (Lt = l, u = ot()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function V() {
                var l, u;
                return l = qt, n.substr(qt, 2) === ct ? (u = ct, qt += 2) : (u = null, 0 === Wt && e(it)), 
                null !== u && (Lt = l, u = at()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function X() {
                var l, u;
                return l = qt, n.substr(qt, 2) === ft ? (u = ft, qt += 2) : (u = null, 0 === Wt && e(st)), 
                null !== u && (Lt = l, u = ht()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function Y() {
                var l, u, t;
                return l = qt, n.substr(qt, 2) === dt ? (u = dt, qt += 2) : (u = null, 0 === Wt && e(pt)), 
                null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
                null !== t ? (Lt = l, u = wt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            function Z() {
                var l, u, t;
                return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
                null !== u ? (gt.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(bt)), 
                null !== t ? (Lt = l, u = kt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            function _() {
                var l, u, t, r;
                if (l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
                null !== u) {
                    if (t = [], yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(mt)), 
                    null !== r) for (;null !== r; ) t.push(r), yt.test(n.charAt(qt)) ? (r = n.charAt(qt), 
                    qt++) : (r = null, 0 === Wt && e(mt)); else t = il;
                    null !== t ? (Lt = l, u = Rt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                    l = il);
                } else qt = l, l = il;
                return l;
            }
            function nl() {
                var l, u, t, r;
                if (l = qt, n.substr(qt, 2) === Ft ? (u = Ft, qt += 2) : (u = null, 0 === Wt && e(Qt)), 
                null !== u) {
                    if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
                    null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
                    qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
                    null !== t ? (Lt = l, u = Et(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                    l = il);
                } else qt = l, l = il;
                return l;
            }
            function ll() {
                var l, u, t, r;
                if (l = qt, n.substr(qt, 2) === Gt ? (u = Gt, qt += 2) : (u = null, 0 === Wt && e(Bt)), 
                null !== u) {
                    if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
                    null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
                    qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
                    null !== t ? (Lt = l, u = jt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                    l = il);
                } else qt = l, l = il;
                return l;
            }
            function ul() {
                var l, u;
                return l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
                null !== u && (Lt = l, u = $t()), null === u ? (qt = l, l = u) : l = u, l;
            }
            function tl() {
                var l, u, t;
                return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
                null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
                null !== t ? (Lt = l, u = bu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
                l = il)) : (qt = l, l = il), l;
            }
            var rl, el = arguments.length > 1 ? arguments[1] : {}, ol = {
                regexp: c
            }, cl = c, il = null, al = "", fl = "|", sl = '"|"', hl = function(n, l) {
                return l ? new Alternate(n, l[1]) : n;
            }, dl = function(n, l, u) {
                return new Match([ n ].concat(l).concat([ u ]));
            }, pl = "^", vl = '"^"', wl = function() {
                return new Token("start");
            }, Al = "$", Cl = '"$"', gl = function() {
                return new Token("end");
            }, bl = function(n, l) {
                return new Quantified(n, l);
            }, kl = "Quantifier", Tl = function(n, l) {
                return l && (n.greedy = !1), n;
            }, xl = "{", yl = '"{"', ml = ",", Rl = '","', Fl = "}", Ql = '"}"', Sl = function(n, l) {
                return new Quantifier(n, l);
            }, Ul = ",}", El = '",}"', Gl = function(n) {
                return new Quantifier(n, 1 / 0);
            }, Bl = function(n) {
                return new Quantifier(n, n);
            }, jl = "+", $l = '"+"', ql = function() {
                return new Quantifier(1, 1 / 0);
            }, Ll = "*", Ml = '"*"', Dl = function() {
                return new Quantifier(0, 1 / 0);
            }, Hl = "?", Ol = '"?"', Wl = function() {
                return new Quantifier(0, 1);
            }, zl = /^[0-9]/, Il = "[0-9]", Jl = function(n) {
                return +n.join("");
            }, Kl = "(", Nl = '"("', Pl = ")", Vl = '")"', Xl = function(n) {
                return n;
            }, Yl = function(n) {
                return new CaptureGroup(n);
            }, Zl = "?:", _l = '"?:"', nu = function(n) {
                return new Group("non-capture-group", n);
            }, lu = "?=", uu = '"?="', tu = function(n) {
                return new Group("positive-lookahead", n);
            }, ru = "?!", eu = '"?!"', ou = function(n) {
                return new Group("negative-lookahead", n);
            }, cu = "CharacterSet", iu = "[", au = '"["', fu = "]", su = '"]"', hu = function(n, l) {
                return new CharSet(!!n, l);
            }, du = "CharacterRange", pu = "-", vu = '"-"', wu = function(n, l) {
                return new CharacterRange(n, l);
            }, Au = "Character", Cu = /^[^\\\]]/, gu = "[^\\\\\\]]", bu = function(n) {
                return new Literal(n);
            }, ku = ".", Tu = '"."', xu = function() {
                return new Token("any-character");
            }, yu = "Literal", mu = /^[^|\\\/.[()?+*$\^]/, Ru = "[^|\\\\\\/.[()?+*$\\^]", Fu = "\\b", Qu = '"\\\\b"', Su = function() {
                return new Token("backspace");
            }, Uu = function() {
                return new Token("word-boundary");
            }, Eu = "\\B", Gu = '"\\\\B"', Bu = function() {
                return new Token("non-word-boundary");
            }, ju = "\\d", $u = '"\\\\d"', qu = function() {
                return new Token("digit");
            }, Lu = "\\D", Mu = '"\\\\D"', Du = function() {
                return new Token("non-digit");
            }, Hu = "\\f", Ou = '"\\\\f"', Wu = function() {
                return new Token("form-feed");
            }, zu = "\\n", Iu = '"\\\\n"', Ju = function() {
                return new Token("line-feed");
            }, Ku = "\\r", Nu = '"\\\\r"', Pu = function() {
                return new Token("carriage-return");
            }, Vu = "\\s", Xu = '"\\\\s"', Yu = function() {
                return new Token("white-space");
            }, Zu = "\\S", _u = '"\\\\S"', nt = function() {
                return new Token("non-white-space");
            }, lt = "\\t", ut = '"\\\\t"', tt = function() {
                return new Token("tab");
            }, rt = "\\v", et = '"\\\\v"', ot = function() {
                return new Token("vertical-tab");
            }, ct = "\\w", it = '"\\\\w"', at = function() {
                return new Token("word");
            }, ft = "\\W", st = '"\\\\W"', ht = function() {
                return new Token("non-word");
            }, dt = "\\c", pt = '"\\\\c"', vt = "any character", wt = function(n) {
                return new ControlCharacter(n);
            }, At = "\\", Ct = '"\\\\"', gt = /^[1-9]/, bt = "[1-9]", kt = function(n) {
                return new BackReference(n);
            }, Tt = "\\0", xt = '"\\\\0"', yt = /^[0-7]/, mt = "[0-7]", Rt = function(n) {
                return new Octal(n.join(""));
            }, Ft = "\\x", Qt = '"\\\\x"', St = /^[0-9a-fA-F]/, Ut = "[0-9a-fA-F]", Et = function(n) {
                return new Hex(n.join(""));
            }, Gt = "\\u", Bt = '"\\\\u"', jt = function(n) {
                return new Unicode(n.join(""));
            }, $t = function() {
                return new Token("null-character");
            }, qt = 0, Lt = 0, Mt = 0, Dt = {
                line: 1,
                column: 1,
                seenCR: !1
            }, Ht = 0, Ot = [], Wt = 0;
            if ("startRule" in el) {
                if (!(el.startRule in ol)) throw new Error("Can't start parsing from rule \"" + el.startRule + '".');
                cl = ol[el.startRule];
            }
            if (Token.offset = t, Token.text = u, rl = cl(), null !== rl && qt === n.length) return rl;
            throw o(Ot), Lt = Math.max(qt, Ht), new l(Ot, Lt < n.length ? n.charAt(Lt) : null, Lt, r(Lt).line, r(Lt).column);
        }
        return n(l, Error), {
            SyntaxError: l,
            parse: u
        };
    }(), index = 1, cgs = {};
    var RegExpParser = parser;
    /*! src/regexp_handler.js */
    /*
        https://github.com/ForbesLindesay/regexp
        https://github.com/dmajda/pegjs
        http://www.regexper.com/

        每个节点的结构
            {
                type: '',
                offset: number,
                text: '',
                body: {},
                escaped: true/false
            }

        type 可选值
            alternate             |         选择
            match                 匹配
            capture-group         ()        捕获组
            non-capture-group     (?:...)   非捕获组
            positive-lookahead    (?=p)     零宽正向先行断言
            negative-lookahead    (?!p)     零宽负向先行断言
            quantified            a*        重复节点
            quantifier            *         量词
            charset               []        字符集
            range                 {m, n}    范围
            literal               a         直接量字符
            unicode               \uxxxx    Unicode
            hex                   \x        十六进制
            octal                 八进制
            back-reference        \n        反向引用
            control-character     \cX       控制字符

            // Token
            start               ^       开头
            end                 $       结尾
            any-character       .       任意字符
            backspace           [\b]    退格直接量
            word-boundary       \b      单词边界
            non-word-boundary   \B      非单词边界
            digit               \d      ASCII 数字，[0-9]
            non-digit           \D      非 ASCII 数字，[^0-9]
            form-feed           \f      换页符
            line-feed           \n      换行符
            carriage-return     \r      回车符
            white-space         \s      空白符
            non-white-space     \S      非空白符
            tab                 \t      制表符
            vertical-tab        \v      垂直制表符
            word                \w      ASCII 字符，[a-zA-Z0-9]
            non-word            \W      非 ASCII 字符，[^a-zA-Z0-9]
            null-character      \o      NUL 字符
    */
    var RegExpHandler = function() {
        var Handle = {
            extend: Util.extend
        };
        // http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
        /*var ASCII_CONTROL_CODE_CHART = {
            '@': ['\u0000'],
            A: ['\u0001'],
            B: ['\u0002'],
            C: ['\u0003'],
            D: ['\u0004'],
            E: ['\u0005'],
            F: ['\u0006'],
            G: ['\u0007', '\a'],
            H: ['\u0008', '\b'],
            I: ['\u0009', '\t'],
            J: ['\u000A', '\n'],
            K: ['\u000B', '\v'],
            L: ['\u000C', '\f'],
            M: ['\u000D', '\r'],
            N: ['\u000E'],
            O: ['\u000F'],
            P: ['\u0010'],
            Q: ['\u0011'],
            R: ['\u0012'],
            S: ['\u0013'],
            T: ['\u0014'],
            U: ['\u0015'],
            V: ['\u0016'],
            W: ['\u0017'],
            X: ['\u0018'],
            Y: ['\u0019'],
            Z: ['\u001A'],
            '[': ['\u001B', '\e'],
            '\\': ['\u001C'],
            ']': ['\u001D'],
            '^': ['\u001E'],
            '_': ['\u001F']
        }*/
        // ASCII printable code chart
        // var LOWER = 'abcdefghijklmnopqrstuvwxyz'
        // var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        // var NUMBER = '0123456789'
        // var SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
        var LOWER = ascii(97, 122);
        var UPPER = ascii(65, 90);
        var NUMBER = ascii(48, 57);
        var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126);
        // 排除 95 _ ascii(91, 94) + ascii(96, 96)
        var PRINTABLE = ascii(32, 126);
        var SPACE = " \f\n\r	 \u2028\u2029";
        var CHARACTER_CLASSES = {
            "\\w": LOWER + UPPER + NUMBER + "_",
            // ascii(95, 95)
            "\\W": OTHER.replace("_", ""),
            "\\s": SPACE,
            "\\S": function() {
                var result = PRINTABLE;
                for (var i = 0; i < SPACE.length; i++) {
                    result = result.replace(SPACE[i], "");
                }
                return result;
            }(),
            "\\d": NUMBER,
            "\\D": LOWER + UPPER + OTHER
        };
        function ascii(from, to) {
            var result = "";
            for (var i = from; i <= to; i++) {
                result += String.fromCharCode(i);
            }
            return result;
        }
        // var ast = RegExpParser.parse(regexp.source)
        Handle.gen = function(node, result, cache) {
            cache = cache || {
                guid: 1
            };
            return Handle[node.type] ? Handle[node.type](node, result, cache) : Handle.token(node, result, cache);
        };
        Handle.extend({
            token: function(node, result, cache) {
                switch (node.type) {
                  case "start":
                  case "end":
                    return "";

                  case "any-character":
                    return Random.character();

                  case "backspace":
                    return "";

                  case "word-boundary":
                    // TODO
                    return "";

                  case "non-word-boundary":
                    // TODO
                    break;

                  case "digit":
                    return Random.pick(NUMBER.split(""));

                  case "non-digit":
                    return Random.pick((LOWER + UPPER + OTHER).split(""));

                  case "form-feed":
                    break;

                  case "line-feed":
                    return node.body || node.text;

                  case "carriage-return":
                    break;

                  case "white-space":
                    return Random.pick(SPACE.split(""));

                  case "non-white-space":
                    return Random.pick((LOWER + UPPER + NUMBER).split(""));

                  case "tab":
                    break;

                  case "vertical-tab":
                    break;

                  case "word":
                    // \w [a-zA-Z0-9]
                    return Random.pick((LOWER + UPPER + NUMBER).split(""));

                  case "non-word":
                    // \W [^a-zA-Z0-9]
                    return Random.pick(OTHER.replace("_", "").split(""));

                  case "null-character":
                    break;
                }
                return node.body || node.text;
            },
            /*
                {
                    type: 'alternate',
                    offset: 0,
                    text: '',
                    left: {
                        boyd: []
                    },
                    right: {
                        boyd: []
                    }
                }
            */
            alternate: function(node, result, cache) {
                // node.left/right {}
                return this.gen(Random.boolean() ? node.left : node.right, result, cache);
            },
            /*
                {
                    type: 'match',
                    offset: 0,
                    text: '',
                    body: []
                }
            */
            match: function(node, result, cache) {
                result = "";
                // node.body []
                for (var i = 0; i < node.body.length; i++) {
                    result += this.gen(node.body[i], result, cache);
                }
                return result;
            },
            // ()
            "capture-group": function(node, result, cache) {
                // node.body {}
                result = this.gen(node.body, result, cache);
                cache[cache.guid++] = result;
                return result;
            },
            // (?:...)
            "non-capture-group": function(node, result, cache) {
                // node.body {}
                return this.gen(node.body, result, cache);
            },
            // (?=p)
            "positive-lookahead": function(node, result, cache) {
                // node.body
                return this.gen(node.body, result, cache);
            },
            // (?!p)
            "negative-lookahead": function(node, result, cache) {
                // node.body
                return "";
            },
            /*
                {
                    type: 'quantified',
                    offset: 3,
                    text: 'c*',
                    body: {
                        type: 'literal',
                        offset: 3,
                        text: 'c',
                        body: 'c',
                        escaped: false
                    },
                    quantifier: {
                        type: 'quantifier',
                        offset: 4,
                        text: '*',
                        min: 0,
                        max: Infinity,
                        greedy: true
                    }
                }
            */
            quantified: function(node, result, cache) {
                result = "";
                // node.quantifier {}
                var count = this.quantifier(node.quantifier);
                // node.body {}
                for (var i = 0; i < count; i++) {
                    result += this.gen(node.body, result, cache);
                }
                return result;
            },
            /*
                quantifier: {
                    type: 'quantifier',
                    offset: 4,
                    text: '*',
                    min: 0,
                    max: Infinity,
                    greedy: true
                }
            */
            quantifier: function(node, result, cache) {
                var min = Math.max(node.min, 0);
                var max = isFinite(node.max) ? node.max : min + Random.integer(3, 7);
                return Random.integer(min, max);
            },
            /*
                
            */
            charset: function(node, result, cache) {
                // node.invert
                if (node.invert) return this["invert-charset"](node, result, cache);
                // node.body []
                var literal = Random.pick(node.body);
                return this.gen(literal, result, cache);
            },
            "invert-charset": function(node, result, cache) {
                var pool = PRINTABLE;
                for (var i = 0, item; i < node.body.length; i++) {
                    item = node.body[i];
                    switch (item.type) {
                      case "literal":
                        pool = pool.replace(item.body, "");
                        break;

                      case "range":
                        var min = this.gen(item.start, result, cache).charCodeAt();
                        var max = this.gen(item.end, result, cache).charCodeAt();
                        for (var ii = min; ii <= max; ii++) {
                            pool = pool.replace(String.fromCharCode(ii), "");
                        }

                      /* falls through */
                        default:
                        var characters = CHARACTER_CLASSES[item.text];
                        if (characters) {
                            for (var iii = 0; iii <= characters.length; iii++) {
                                pool = pool.replace(characters[iii], "");
                            }
                        }
                    }
                }
                return Random.pick(pool.split(""));
            },
            range: function(node, result, cache) {
                // node.start, node.end
                var min = this.gen(node.start, result, cache).charCodeAt();
                var max = this.gen(node.end, result, cache).charCodeAt();
                return String.fromCharCode(Random.integer(min, max));
            },
            literal: function(node, result, cache) {
                return node.escaped ? node.body : node.text;
            },
            // Unicode \u
            unicode: function(node, result, cache) {
                return String.fromCharCode(parseInt(node.code, 16));
            },
            // 十六进制 \xFF
            hex: function(node, result, cache) {
                return String.fromCharCode(parseInt(node.code, 16));
            },
            // 八进制 \0
            octal: function(node, result, cache) {
                return String.fromCharCode(parseInt(node.code, 8));
            },
            // 反向引用
            "back-reference": function(node, result, cache) {
                return cache[node.code] || "";
            },
            /*
                http://en.wikipedia.org/wiki/C0_and_C1_control_codes
            */
            CONTROL_CHARACTER_MAP: function() {
                var CONTROL_CHARACTER = "@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _".split(" ");
                var CONTROL_CHARACTER_UNICODE = "\x00        \b 	 \n  \f \r                  ".split(" ");
                var map = {};
                for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
                    map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i];
                }
                return map;
            }(),
            "control-character": function(node, result, cache) {
                return this.CONTROL_CHARACTER_MAP[node.code];
            }
        });
        return Handle;
    }();
    /*! src/random.js */
    /*
        ### Mock.Random
        
        Mock.Random 是一个工具类，用于生成各种随机数据。Mock.Random 的方法在数据模板中称为“占位符”，引用格式为 `@占位符(参数 [, 参数])` 。例如：

            var Random = Mock.Random;
            Random.email()
            // => "n.clark@miller.io"
            Mock.mock('@EMAIL')
            // => "y.lee@lewis.org"
            Mock.mock( { email: '@EMAIL' } )
            // => { email: "v.lewis@hall.gov" }

        可以在上面的例子中看到，直接调用 'Random.email()' 时方法名 `email()` 是小写的，而数据模板中的 `@EMAIL` 却是大写。这并对数据模板中的占位符做了特殊处理，也非强制的编写方式，事实上在数据模板中使用小写的 `@email` 也可以达到同样的效果。不过，这是建议的编码风格，以便在阅读时从视觉上提高占位符的识别率，快速识别占位符和普通字符。

        在浏览器中，为了减少需要拼写的字符，Mock.js 把 Mock.Random 暴露给了 window 对象，使之称为全局变量，从而可以直接访问 Random。因此上面例子中的 `var Random = Mock.Random;` 可以省略。在后面的例子中，也将做同样的处理。

        > 在 Node.js 中，仍然需要通过 `Mock.Random` 访问。

        Mock.Random 中的方法与数据模板的 `@占位符` 一一对应，在需要时可以为 Mock.Random 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：
        
            Random.extend({
                xzs: [], // 十二星座？程序员日历？
                xz: function(date){
                    return ''
                }
            })
            Random.xz()
            // => ""
            Mock.mock('@XZ')
            // => ""
            Mock.mock({ xz: '@XZ'})
            // => ""
        
        Mock.js 的 [在线编辑器](http://mockjs.com/mock.html) 演示了完整的语法规则和占位符。

        下面是 Mock.Random 内置支持的方法说明。

        （功能，方法签名，参数说明，示例）
    */
    var Random = function() {
        var Random = {
            extend: Util.extend
        };
        /*
            #### Basics
        */
        Random.extend({
            /*
                ##### Random.boolean(min, max, cur)

                返回一个随机的布尔值。

                * Random.boolean()
                * Random.boolean(min, max, cur)
                * Random.bool()
                * Random.bool(min, max, cur)

                `Random.bool(min, max, cur)` 是 `Random.boolean(min, max, cur)` 的简写。在数据模板中，即可以使用（推荐） `BOOLEAN(min, max, cur)`，也可以使用 `BOOL(min, max, cur)`。

                参数的含义和默认值如下所示：

                * 参数 min：可选。指示参数 cur 出现的概率。概率计算公式为 `min / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 cur。
                * 参数 max：可选。指示参数 cur 的相反值（!cur）出现的概率。概率计算公式为 `max / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 cur。
                * 参数 cur：可选。可选值为布尔值 true 或 false。如果未传入任何参数，则返回 true 和 false 的概率各为 50%。该参数没有默认值，在该方法的内部，依据原生方法 Math.random() 返回的（浮点）数来计算和返回布尔值，例如在最简单的情况下，返回值是表达式 `Math.random() >= 0.5` 的执行结果。

                使用示例如下所示：

                    var Random = Mock.Random;
                    Random.boolean()
                    // => true
                    Random.boolean(1, 9, true)
                    // => false
                    Random.bool()
                    // => false
                    Random.bool(1, 9, false)
                    // => true
                
                > 事实上，原生方法 Math.random() 返回的随机（浮点）数的分布并不均匀，是货真价实的伪随机数，将来会替换为基于 window.crytpo 来生成随机数。?? 对 Math.random() 的实现机制进行了分析和统计，并提供了随机数的参考实现，可以访问[这里](http://??)。
                TODO 统计

            */
            "boolean": function(min, max, cur) {
                if (cur !== undefined) {
                    min = typeof min !== "undefined" && !isNaN(min) ? parseInt(min, 10) : 1;
                    max = typeof max !== "undefined" && !isNaN(max) ? parseInt(max, 10) : 1;
                    return Math.random() > 1 / (min + max) * min ? !cur : cur;
                }
                return Math.random() >= .5;
            },
            bool: function(min, max, cur) {
                return this.boolean(min, max, cur);
            },
            /*
                ##### Random.natural(min, max)

                返回一个随机的自然数（大于等于 0 的整数）。
                
                * Random.natural()
                * Random.natural(min)
                * Random.natural(min, max)

                参数的含义和默认值如下所示：
                * 参数 min：可选。指示随机自然数的最小值。默认值为 0。
                * 参数 max：可选。指示随机自然数的最大值。默认值为 9007199254740992。

                使用示例如下所示：

                    var Random = Mock.Random;
                    Random.natural()
                    // => 1002794054057984
                    Random.natural(10000)
                    // => 71529071126209
                    Random.natural(60, 100)
                    // => 77
            */
            natural: function(min, max) {
                min = typeof min !== "undefined" ? parseInt(min, 10) : 0;
                max = typeof max !== "undefined" ? parseInt(max, 10) : 9007199254740992;
                // 2^53
                return Math.round(Math.random() * (max - min)) + min;
            },
            /*
                ##### Random.integer(min, max)

                返回一个随机的整数。

                * Random.integer()
                * Random.integer(min)
                * Random.integer(min, max)

                参数含义和默认值如下所示：
                * 参数 min：可选。指示随机整数的最小值。默认值为 -9007199254740992。
                * 参数 max：可选。指示随机整数的最大值。默认值为 9007199254740992。

                使用示例如下所示：
                Random.integer()
                // => -3815311811805184
                Random.integer(10000)
                // => 4303764511003750
                Random.integer(60,100)
                // => 96
            */
            integer: function(min, max) {
                min = typeof min !== "undefined" ? parseInt(min, 10) : -9007199254740992;
                max = typeof max !== "undefined" ? parseInt(max, 10) : 9007199254740992;
                // 2^53
                return Math.round(Math.random() * (max - min)) + min;
            },
            "int": function(min, max) {
                return this.integer(min, max);
            },
            /*
                ##### Random.float(min, max, dmin, dmax)
                返回一个随机的浮点数。

                * Random.float()
                * Random.float(min)
                * Random.float(min, max)
                * Random.float(min, max, dmin)
                * Random.float(min, max, dmin, dmax)
                * Random.float(minFloat, maxFloat)

                参数的含义和默认值如下所示：
                * min：可选。整数部分的最小值。默认值为 -9007199254740992。
                * max：可选。整数部分的最大值。默认值为 9007199254740992。
                * dmin：可选。小数部分位数的最小值。默认值为 0。
                * dmin：可选。小数部分位数的最大值。默认值为 17。

                使用示例如下所示：
                    Random.float()
                    // => -1766114241544192.8
                    Random.float(0)
                    // => 556530504040448.25
                    Random.float(60, 100)
                    // => 82.56779679549358
                    Random.float(60, 100, 3)
                    // => 61.718533677927894
                    Random.float(60, 100, 3, 5)
                    // => 70.6849
            */
            "float": function(min, max, dmin, dmax) {
                dmin = dmin === undefined ? 0 : dmin;
                dmin = Math.max(Math.min(dmin, 17), 0);
                dmax = dmax === undefined ? 17 : dmax;
                dmax = Math.max(Math.min(dmax, 17), 0);
                var ret = this.integer(min, max) + ".";
                for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
                    ret += // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                    i < dcount - 1 ? this.character("number") : this.character("123456789");
                }
                return parseFloat(ret, 10);
            },
            /*
                ##### Random.character(pool)

                返回一个随机字符。

                * Random.character()
                * Random.character('lower/upper/number/symbol')
                * Random.character(pool)

                参数的含义和默认值如下所示：
                * 参数 pool：可选。表示字符池，将从中选择一个字符返回。
                    * 如果传入 'lower'、'upper'、'number'、'symbol'，表示从内置的字符池从选取：
                    
                        {
                            lower: "abcdefghijklmnopqrstuvwxyz",
                            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                            number: "0123456789",
                            symbol: "!@#$%^&*()[]"
                        }

                    * 如果未传入该参数，则从 `'lower' + 'upper' + 'number' + 'symbol'` 中随机选取一个字符返回。
                
                使用示例如下所示：

                    Random.character()
                    // => "P"
                    Random.character('lower')
                    // => "y"
                    Random.character('upper')
                    // => "X"
                    Random.character('number')
                    // => "1"
                    Random.character('symbol')
                    // => "&"
                    Random.character('aeiou')
                    // => "u"
            */
            character: function(pool) {
                var pools = {
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    number: "0123456789",
                    symbol: "!@#$%^&*()[]"
                };
                pools.alpha = pools.lower + pools.upper;
                pools["undefined"] = pools.lower + pools.upper + pools.number + pools.symbol;
                pool = pools[("" + pool).toLowerCase()] || pool;
                return pool.charAt(Random.natural(0, pool.length - 1));
            },
            "char": function(pool) {
                return this.character(pool);
            },
            /*
                ##### Random.string(pool, min, max)

                返回一个随机字符串。

                * Random.string()
                * Random.string( length )
                * Random.string( pool, length )
                * Random.string( min, max )
                * Random.string( pool, min, max )
                
                参数的含义和默认如下所示：
                * 参数 pool：可选。表示字符池，将从中选择一个字符返回。
                    * 如果传入 'lower'、'upper'、'number'、'symbol'，表示从内置的字符池从选取：
                    
                        {
                            lower: "abcdefghijklmnopqrstuvwxyz",
                            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                            number: "0123456789",
                            symbol: "!@#$%^&*()[]"
                        }

                    * 如果未传入该参数，则从 `'lower' + 'upper' + 'number' + 'symbol'` 中随机选取一个字符返回。
                * 参数 min：可选。随机字符串的最小长度。默认值为 3。
                * 参数 max：可选。随机字符串的最大长度。默认值为 7。

                使用示例如下所示：

                    Random.string()
                    // => "pJjDUe"
                    Random.string( 5 )
                    // => "GaadY"
                    Random.string( 'lower', 5 )
                    // => "jseqj"
                    Random.string( 7, 10 )
                    // => "UuGQgSYk"
                    Random.string( 'aeiou', 1, 3 )
                    // => "ea"

                其他实现
                    // https://code.google.com/p/jslibs/wiki/JavascriptTips
                    Math.random().toString(36).substr(2) 
            */
            string: function(pool, min, max) {
                var length;
                // string( pool, min, max )
                if (arguments.length === 3) {
                    length = Random.natural(min, max);
                }
                if (arguments.length === 2) {
                    // string( pool, length )
                    if (typeof arguments[0] === "string") {
                        length = min;
                    } else {
                        // string( min, max )
                        length = Random.natural(pool, min);
                        pool = undefined;
                    }
                }
                // string( length )
                if (arguments.length === 1) {
                    length = pool;
                    pool = undefined;
                }
                // string()
                if (arguments.length === 0) {
                    length = Random.natural(3, 7);
                }
                var text = "";
                for (var i = 0; i < length; i++) {
                    text += Random.character(pool);
                }
                return text;
            },
            str: function(pool, min, max) {
                return this.string.apply(this, arguments);
            },
            /*
                ##### Random.range(start, stop, step)

                返回一个整型数组。

                * Random.range(stop)
                * Random.range(start, stop)
                * Random.range(start, stop, step)

                参数的含义和默认值如下所示：
                * 参数 start：必选。数组中整数的起始值。
                * 参数 stop：可选。数组中整数的结束值（不包含在返回值中）。
                * 参数 step：可选。数组中整数之间的步长。默认值为 1。

                使用示例如下所示：

                    Random.range(10)
                    // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                    Random.range(3, 7)
                    // => [3, 4, 5, 6]
                    Random.range(1, 10, 2)
                    // => [1, 3, 5, 7, 9]
                    Random.range(1, 10, 3)
                    // => [1, 4, 7]

                Generate an integer Array containing an arithmetic progression.
                http://underscorejs.org/#range
            */
            range: function(start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = arguments[2] || 1;
                start = +start, stop = +stop, step = +step;
                var len = Math.max(Math.ceil((stop - start) / step), 0);
                var idx = 0;
                var range = new Array(len);
                while (idx < len) {
                    range[idx++] = start;
                    start += step;
                }
                return range;
            }
        });
        /*
            #### Date
        */
        Random.extend({
            patternLetters: {
                yyyy: "getFullYear",
                yy: function(date) {
                    return ("" + date.getFullYear()).slice(2);
                },
                y: "yy",
                MM: function(date) {
                    var m = date.getMonth() + 1;
                    return m < 10 ? "0" + m : m;
                },
                M: function(date) {
                    return date.getMonth() + 1;
                },
                dd: function(date) {
                    var d = date.getDate();
                    return d < 10 ? "0" + d : d;
                },
                d: "getDate",
                HH: function(date) {
                    var h = date.getHours();
                    return h < 10 ? "0" + h : h;
                },
                H: "getHours",
                hh: function(date) {
                    var h = date.getHours() % 12;
                    return h < 10 ? "0" + h : h;
                },
                h: function(date) {
                    return date.getHours() % 12;
                },
                mm: function(date) {
                    var m = date.getMinutes();
                    return m < 10 ? "0" + m : m;
                },
                m: "getMinutes",
                ss: function(date) {
                    var s = date.getSeconds();
                    return s < 10 ? "0" + s : s;
                },
                s: "getSeconds",
                SS: function(date) {
                    var ms = date.getMilliseconds();
                    return ms < 10 && "00" + ms || ms < 100 && "0" + ms || ms;
                },
                S: "getMilliseconds",
                A: function(date) {
                    return date.getHours() < 12 ? "AM" : "PM";
                },
                a: function(date) {
                    return date.getHours() < 12 ? "am" : "pm";
                },
                T: "getTime"
            }
        });
        Random.extend({
            rformat: new RegExp(function() {
                var re = [];
                for (var i in Random.patternLetters) re.push(i);
                return "(" + re.join("|") + ")";
            }(), "g"),
            /*
                ##### Random.format(date, format)

                格式化日期。
            */
            format: function(date, format) {
                var patternLetters = Random.patternLetters, rformat = Random.rformat;
                return format.replace(rformat, function creatNewSubString($0, flag) {
                    return typeof patternLetters[flag] === "function" ? patternLetters[flag](date) : patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) : date[patternLetters[flag]]();
                });
            },
            /*
                ##### Random.format(date, format)

                生成一个随机的 Date 对象。
            */
            randomDate: function(min, max) {
                // min, max
                min = min === undefined ? new Date(0) : min;
                max = max === undefined ? new Date() : max;
                return new Date(Math.random() * (max.getTime() - min.getTime()));
            },
            /*
                ##### Random.date(format)

                返回一个随机的日期字符串。

                * Random.date()
                * Random.date(format)

                参数的含义和默认值如下所示：

                * 参数 format：可选。指示生成的日期字符串的格式。默认值为 `yyyy-MM-dd`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，如下所示：

                    Format  Description                                                 Example
                    ------- ----------------------------------------------------------- -------
                    yyyy    A full numeric representation of a year, 4 digits           1999 or 2003
                    yy      A two digit representation of a year                        99 or 03
                    y       A two digit representation of a year                        99 or 03
                    MM      Numeric representation of a month, with leading zeros       01 to 12
                    M       Numeric representation of a month, without leading zeros    1 to 12
                    dd      Day of the month, 2 digits with leading zeros               01 to 31
                    d       Day of the month without leading zeros                      1 to 31
                    HH      24-hour format of an hour with leading zeros                00 to 23
                    H       24-hour format of an hour without leading zeros             0 to 23
                    hh      12-hour format of an hour without leading zeros             1 to 12
                    h       12-hour format of an hour with leading zeros                01 to 12
                    mm      Minutes, with leading zeros                                 00 to 59
                    m       Minutes, without leading zeros                              0 to 59
                    ss      Seconds, with leading zeros                                 00 to 59
                    s       Seconds, without leading zeros                              0 to 59
                    SS      Milliseconds, with leading zeros                            000 to 999
                    S       Milliseconds, without leading zeros                         0 to 999
                    A       Uppercase Ante meridiem and Post meridiem                   AM or PM
                    a       Lowercase Ante meridiem and Post meridiem                   am or pm

                使用示例如下所示：
                    
                    Random.date()
                    // => "2002-10-23"
                    Random.date('yyyy-MM-dd')
                    // => "1983-01-29"
                    Random.date('yy-MM-dd')
                    // => "79-02-14"
                    Random.date('y-MM-dd')
                    // => "81-05-17"
                    Random.date('y-M-d')
                    // => "84-6-5"

            */
            date: function(format) {
                format = format || "yyyy-MM-dd";
                return this.format(this.randomDate(), format);
            },
            /*
                ##### Random.time(format)

                返回一个随机的时间字符串。

                * Random.time()
                * Random.time(format)

                参数的含义和默认值如下所示：

                * 参数 format：可选。指示生成的时间字符串的格式。默认值为 `HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#Random.date(format))。

                使用示例如下所示：
                    
                    Random.time()
                    // => "00:14:47"
                    Random.time('A HH:mm:ss')
                    // => "PM 20:47:37"
                    Random.time('a HH:mm:ss')
                    // => "pm 17:40:00"
                    Random.time('HH:mm:ss')
                    // => "03:57:53"
                    Random.time('H:m:s')
                    // => "3:5:13"
            */
            time: function(format) {
                format = format || "HH:mm:ss";
                return this.format(this.randomDate(), format);
            },
            /*
                ##### Random.datetime(format)

                返回一个随机的日期和时间字符串。

                * Random.datetime()
                * Random.datetime(format)

                参数的含义和默认值如下所示：

                * 参数 format：可选。指示生成的日期和时间字符串的格式。默认值为 `yyyy-MM-dd HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#Random.date(format))。

                使用示例如下所示：
                    
                    Random.datetime()
                    // => "1977-11-17 03:50:15"
                    Random.datetime('yyyy-MM-dd A HH:mm:ss')
                    // => "1976-04-24 AM 03:48:25"
                    Random.datetime('yy-MM-dd a HH:mm:ss')
                    // => "73-01-18 pm 22:12:32"
                    Random.datetime('y-MM-dd HH:mm:ss')
                    // => "79-06-24 04:45:16"
                    Random.datetime('y-M-d H:m:s')
                    // => "02-4-23 2:49:40"
            */
            datetime: function(format) {
                format = format || "yyyy-MM-dd HH:mm:ss";
                return this.format(this.randomDate(), format);
            },
            /*
                Ranndom.now(unit, format)
                Ranndom.now()
                Ranndom.now(unit)
                Ranndom.now(format)

                参考自 http://momentjs.cn/docs/#/manipulating/start-of/
            */
            now: function(unit, format) {
                if (arguments.length === 1) {
                    if (!/year|month|week|day|hour|minute|second|week/.test(unit)) {
                        format = unit;
                        unit = "";
                    }
                }
                unit = (unit || "").toLowerCase();
                format = format || "yyyy-MM-dd HH:mm:ss";
                var date = new Date();
                /* jshint -W086 */
                switch (unit) {
                  case "year":
                    date.setMonth(0);

                  case "month":
                    date.setDate(1);

                  case "week":
                  case "day":
                    date.setHours(0);

                  case "hour":
                    date.setMinutes(0);

                  case "minute":
                    date.setSeconds(0);

                  case "second":
                    date.setMilliseconds(0);
                }
                switch (unit) {
                  case "week":
                    date.setDate(date.getDate() - date.getDay());
                }
                return this.format(date, format);
            }
        });
        /*
            #### Image
        */
        Random.extend({
            ad_size: [ "300x250", "250x250", "240x400", "336x280", "180x150", "720x300", "468x60", "234x60", "88x31", "120x90", "120x60", "120x240", "125x125", "728x90", "160x600", "120x600", "300x600" ],
            screen_size: [ "320x200", "320x240", "640x480", "800x480", "800x480", "1024x600", "1024x768", "1280x800", "1440x900", "1920x1200", "2560x1600" ],
            video_size: [ "720x480", "768x576", "1280x720", "1920x1080" ],
            /*
                ##### Random.img(size, background, foreground, format, text)

                * Random.img()
                * Random.img(size)
                * Random.img(size, background)
                * Random.img(size, background, text)
                * Random.img(size, background, foreground, text)
                * Random.img(size, background, foreground, format, text)

                生成一个随机的图片地址。

                **参数的含义和默认值**如下所示：

                * 参数 size：可选。指示图片的宽高，格式为 `'宽x高'`。默认从下面的数组中随机读取一个：

                        [
                            '300x250', '250x250', '240x400', '336x280', 
                            '180x150', '720x300', '468x60', '234x60', 
                            '88x31', '120x90', '120x60', '120x240', 
                            '125x125', '728x90', '160x600', '120x600', 
                            '300x600'
                        ]

                * 参数 background：可选。指示图片的背景色。默认值为 '#000000'。
                * 参数 foreground：可选。指示图片的前景色（文件）。默认值为 '#FFFFFF'。
                * 参数 format：可选。指示图片的格式。默认值为 'png'，可选值包括：'png'、'gif'、'jpg'。
                * 参数 text：可选。指示图片上文字。默认为 ''。

                **使用示例**如下所示：
                    
                    Random.img()
                    // => "http://dummyimage.com/125x125"
                    Random.img('200x100')
                    // => "http://dummyimage.com/200x100"
                    Random.img('200x100', '#fb0a2a')
                    // => "http://dummyimage.com/200x100/fb0a2a"
                    Random.img('200x100', '#02adea', 'hello')
                    // => "http://dummyimage.com/200x100/02adea&text=hello"
                    Random.img('200x100', '#00405d', '#FFF', 'mock')
                    // => "http://dummyimage.com/200x100/00405d/FFF&text=mock"
                    Random.img('200x100', '#ffcc33', '#FFF', 'png', 'js')
                    // => "http://dummyimage.com/200x100/ffcc33/FFF.png&text=js"

                生成的路径所对应的图片如下所示：

                ![](http://dummyimage.com/125x125)
                ![](http://dummyimage.com/200x100)
                ![](http://dummyimage.com/200x100/fb0a2a)
                ![](http://dummyimage.com/200x100/02adea&text=hello)
                ![](http://dummyimage.com/200x100/00405d/FFF&text=mock)
                ![](http://dummyimage.com/200x100/ffcc33/FFF.png&text=js)

                替代图片源
                    http://fpoimg.com/
                参考自 
                    http://rensanning.iteye.com/blog/1933310
                    http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
                
            */
            image: function(size, background, foreground, format, text) {
                if (arguments.length === 4) {
                    text = format;
                    format = undefined;
                }
                if (arguments.length === 3) {
                    text = foreground;
                    foreground = undefined;
                }
                if (!size) size = this.pick(this.ad_size);
                if (background && ~background.indexOf("#")) background = background.slice(1);
                if (foreground && ~foreground.indexOf("#")) foreground = foreground.slice(1);
                // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
                return "http://dummyimage.com/" + size + (background ? "/" + background : "") + (foreground ? "/" + foreground : "") + (format ? "." + format : "") + (text ? "&text=" + text : "");
            },
            img: function() {
                return this.image.apply(this, arguments);
            }
        });
        Random.extend({
            /*
                BrandColors
                http://brandcolors.net/
                A collection of major brand color codes curated by Galen Gidman.
                大牌公司的颜色集合

                // 获取品牌和颜色
                $('h2').each(function(index, item){
                    item = $(item)
                    console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
                })
            */
            brandColors: {
                "4ormat": "#fb0a2a",
                "500px": "#02adea",
                "About.me (blue)": "#00405d",
                "About.me (yellow)": "#ffcc33",
                Addvocate: "#ff6138",
                Adobe: "#ff0000",
                Aim: "#fcd20b",
                Amazon: "#e47911",
                Android: "#a4c639",
                "Angie's List": "#7fbb00",
                AOL: "#0060a3",
                Atlassian: "#003366",
                Behance: "#053eff",
                "Big Cartel": "#97b538",
                bitly: "#ee6123",
                Blogger: "#fc4f08",
                Boeing: "#0039a6",
                "Booking.com": "#003580",
                Carbonmade: "#613854",
                Cheddar: "#ff7243",
                "Code School": "#3d4944",
                Delicious: "#205cc0",
                Dell: "#3287c1",
                Designmoo: "#e54a4f",
                Deviantart: "#4e6252",
                "Designer News": "#2d72da",
                Devour: "#fd0001",
                DEWALT: "#febd17",
                "Disqus (blue)": "#59a3fc",
                "Disqus (orange)": "#db7132",
                Dribbble: "#ea4c89",
                Dropbox: "#3d9ae8",
                Drupal: "#0c76ab",
                Dunked: "#2a323a",
                eBay: "#89c507",
                Ember: "#f05e1b",
                Engadget: "#00bdf6",
                Envato: "#528036",
                Etsy: "#eb6d20",
                Evernote: "#5ba525",
                "Fab.com": "#dd0017",
                Facebook: "#3b5998",
                Firefox: "#e66000",
                "Flickr (blue)": "#0063dc",
                "Flickr (pink)": "#ff0084",
                Forrst: "#5b9a68",
                Foursquare: "#25a0ca",
                Garmin: "#007cc3",
                GetGlue: "#2d75a2",
                Gimmebar: "#f70078",
                GitHub: "#171515",
                "Google Blue": "#0140ca",
                "Google Green": "#16a61e",
                "Google Red": "#dd1812",
                "Google Yellow": "#fcca03",
                "Google+": "#dd4b39",
                Grooveshark: "#f77f00",
                Groupon: "#82b548",
                "Hacker News": "#ff6600",
                HelloWallet: "#0085ca",
                "Heroku (light)": "#c7c5e6",
                "Heroku (dark)": "#6567a5",
                HootSuite: "#003366",
                Houzz: "#73ba37",
                HTML5: "#ec6231",
                IKEA: "#ffcc33",
                IMDb: "#f3ce13",
                Instagram: "#3f729b",
                Intel: "#0071c5",
                Intuit: "#365ebf",
                Kickstarter: "#76cc1e",
                kippt: "#e03500",
                Kodery: "#00af81",
                LastFM: "#c3000d",
                LinkedIn: "#0e76a8",
                Livestream: "#cf0005",
                Lumo: "#576396",
                Mixpanel: "#a086d3",
                Meetup: "#e51937",
                Nokia: "#183693",
                NVIDIA: "#76b900",
                Opera: "#cc0f16",
                Path: "#e41f11",
                "PayPal (dark)": "#1e477a",
                "PayPal (light)": "#3b7bbf",
                Pinboard: "#0000e6",
                Pinterest: "#c8232c",
                PlayStation: "#665cbe",
                Pocket: "#ee4056",
                Prezi: "#318bff",
                Pusha: "#0f71b4",
                Quora: "#a82400",
                "QUOTE.fm": "#66ceff",
                Rdio: "#008fd5",
                Readability: "#9c0000",
                "Red Hat": "#cc0000",
                Resource: "#7eb400",
                Rockpack: "#0ba6ab",
                Roon: "#62b0d9",
                RSS: "#ee802f",
                Salesforce: "#1798c1",
                Samsung: "#0c4da2",
                Shopify: "#96bf48",
                Skype: "#00aff0",
                Snagajob: "#f47a20",
                Softonic: "#008ace",
                SoundCloud: "#ff7700",
                "Space Box": "#f86960",
                Spotify: "#81b71a",
                Sprint: "#fee100",
                Squarespace: "#121212",
                StackOverflow: "#ef8236",
                Staples: "#cc0000",
                "Status Chart": "#d7584f",
                Stripe: "#008cdd",
                StudyBlue: "#00afe1",
                StumbleUpon: "#f74425",
                "T-Mobile": "#ea0a8e",
                Technorati: "#40a800",
                "The Next Web": "#ef4423",
                Treehouse: "#5cb868",
                Trulia: "#5eab1f",
                Tumblr: "#34526f",
                "Twitch.tv": "#6441a5",
                Twitter: "#00acee",
                TYPO3: "#ff8700",
                Ubuntu: "#dd4814",
                Ustream: "#3388ff",
                Verizon: "#ef1d1d",
                Vimeo: "#86c9ef",
                Vine: "#00a478",
                Virb: "#06afd8",
                "Virgin Media": "#cc0000",
                Wooga: "#5b009c",
                "WordPress (blue)": "#21759b",
                "WordPress (orange)": "#d54e21",
                "WordPress (grey)": "#464646",
                Wunderlist: "#2b88d9",
                XBOX: "#9bc848",
                XING: "#126567",
                "Yahoo!": "#720e9e",
                Yandex: "#ffcc00",
                Yelp: "#c41200",
                YouTube: "#c4302b",
                Zalongo: "#5498dc",
                Zendesk: "#78a300",
                Zerply: "#9dcc7a",
                Zootool: "#5e8b1d"
            },
            brands: function() {
                var brands = [];
                for (var b in this.brandColors) {
                    brands.push(b);
                }
                return brands;
            },
            /*
                https://github.com/imsky/holder
                Holder renders image placeholders entirely on the client side.

                dataImageHolder: function(size) {
                    return 'holder.js/' + size
                },
            */
            dataImage: function(size, text) {
                var canvas;
                if (typeof document !== "undefined") {
                    canvas = document.createElement("canvas");
                } else {
                    var Canvas = require("canvas");
                    canvas = new Canvas();
                }
                // canvas = (typeof document !== 'undefined') && document.createElement('canvas')
                var ctx = canvas && canvas.getContext && canvas.getContext("2d");
                if (!canvas || !ctx) return "";
                if (!size) size = this.pick(this.ad_size);
                text = text !== undefined ? text : size;
                size = size.split("x");
                var width = parseInt(size[0], 10), height = parseInt(size[1], 10), background = this.brandColors[this.pick(this.brands())], foreground = "#FFF", text_height = 14, font = "sans-serif";
                canvas.width = width;
                canvas.height = height;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = foreground;
                ctx.font = "bold " + text_height + "px " + font;
                ctx.fillText(text, width / 2, height / 2, width);
                return canvas.toDataURL("image/png");
            }
        });
        /*
            #### Color

            http://blog.csdn.net/idfaya/article/details/6770414
                颜色空间RGB与HSV(HSL)的转换

            http://llllll.li/randomColor/
                A color generator for JavaScript.
                randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.
            
            http://randomcolour.com/
                var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
                bg_colour = "#" + ("000000" + bg_colour).slice(-6);
                document.bgColor = bg_colour;
            
            http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
                Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
                https://github.com/devongovett/color-generator

            http://www.paulirish.com/2009/random-hex-color-code-snippets/
                Random Hex Color Code Generator in JavaScript

            http://chancejs.com/#color
                chance.color()
                // => '#79c157'
                chance.color({format: 'hex'})
                // => '#d67118'
                chance.color({format: 'shorthex'})
                // => '#60f'
                chance.color({format: 'rgb'})
                // => 'rgb(110,52,164)'

            http://clrs.cc/
                COLORS
                A nicer color palette for the web.
                Navy        #000080     #001F3F
                Blue        #0000ff     #0074D9
                Aqua        #00ffff     #7FDBFF
                Teal        #008080     #39CCCC
                Olive       #008000     #3D9970
                Green       #008000     #2ECC40
                Lime        #00ff00     #01FF70
                Yellow      #ffff00     #FFDC00
                Orange      #ffa500     #FF851B
                Red         #ff0000     #FF4136
                Maroon      #800000     #85144B
                Fuchsia     #ff00ff     #F012BE
                Purple      #800080     #B10DC9
                Silver      #c0c0c0     #DDDDDD
                Gray        #808080     #AAAAAA
                Black       #000000     #111111
                White       #FFFFFF     #FFFFFF

            http://tool.c7sky.com/webcolor
                网页设计常用色彩搭配表

            http://www.colorsontheweb.com/colorwheel.asp
                Color Wheel
            
            https://github.com/One-com/one-color
                An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.

            https://github.com/harthur/color
                JavaScript color conversion and manipulation library

            https://github.com/leaverou/css-colors
            http://leaverou.github.io/css-colors/#slategray
                Type a CSS color keyword, #hex, hsl(), rgba(), whatever:

            色调 hue
                http://baike.baidu.com/view/23368.htm
                色调指的是一幅画中画面色彩的总体倾向，是大的色彩效果。
            饱和度 saturation
                http://baike.baidu.com/view/189644.htm
                饱和度是指色彩的鲜艳程度，也称色彩的纯度。饱和度取决于该色中含色成分和消色成分（灰色）的比例。含色成分越大，饱和度越大；消色成分越大，饱和度越小。
            亮度 brightness
                http://baike.baidu.com/view/34773.htm
                亮度是指发光体（反光体）表面发光（反光）强弱的物理量。
            照度 luminosity
                物体被照亮的程度,采用单位面积所接受的光通量来表示,表示单位为勒[克斯](Lux,lx) ,即 1m / m2 。
        */
        // https://github.com/harthur/color-convert/blob/master/conversions.js
        var conversions = {
            rgb2hsl: function rgb2hsl(rgb) {
                var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min, h, s, l;
                if (max == min) h = 0; else if (r == max) h = (g - b) / delta; else if (g == max) h = 2 + (b - r) / delta; else if (b == max) h = 4 + (r - g) / delta;
                h = Math.min(h * 60, 360);
                if (h < 0) h += 360;
                l = (min + max) / 2;
                if (max == min) s = 0; else if (l <= .5) s = delta / (max + min); else s = delta / (2 - max - min);
                return [ h, s * 100, l * 100 ];
            },
            rgb2hsv: function rgb2hsv(rgb) {
                var r = rgb[0], g = rgb[1], b = rgb[2], min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min, h, s, v;
                if (max === 0) s = 0; else s = delta / max * 1e3 / 10;
                if (max == min) h = 0; else if (r == max) h = (g - b) / delta; else if (g == max) h = 2 + (b - r) / delta; else if (b == max) h = 4 + (r - g) / delta;
                h = Math.min(h * 60, 360);
                if (h < 0) h += 360;
                v = max / 255 * 1e3 / 10;
                return [ h, s, v ];
            },
            hsl2rgb: function hsl2rgb(hsl) {
                var h = hsl[0] / 360, s = hsl[1] / 100, l = hsl[2] / 100, t1, t2, t3, rgb, val;
                if (s === 0) {
                    val = l * 255;
                    return [ val, val, val ];
                }
                if (l < .5) t2 = l * (1 + s); else t2 = l + s - l * s;
                t1 = 2 * l - t2;
                rgb = [ 0, 0, 0 ];
                for (var i = 0; i < 3; i++) {
                    t3 = h + 1 / 3 * -(i - 1);
                    t3 < 0 && t3++;
                    t3 > 1 && t3--;
                    if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3; else if (2 * t3 < 1) val = t2; else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6; else val = t1;
                    rgb[i] = val * 255;
                }
                return rgb;
            },
            hsl2hsv: function hsl2hsv(hsl) {
                var h = hsl[0], s = hsl[1] / 100, l = hsl[2] / 100, sv, v;
                l *= 2;
                s *= l <= 1 ? l : 2 - l;
                v = (l + s) / 2;
                sv = 2 * s / (l + s);
                return [ h, sv * 100, v * 100 ];
            },
            hsv2rgb: function hsv2rgb(hsv) {
                var h = hsv[0] / 60;
                var s = hsv[1] / 100;
                var v = hsv[2] / 100;
                var hi = Math.floor(h) % 6;
                var f = h - Math.floor(h);
                var p = 255 * v * (1 - s);
                var q = 255 * v * (1 - s * f);
                var t = 255 * v * (1 - s * (1 - f));
                v = 255 * v;
                switch (hi) {
                  case 0:
                    return [ v, t, p ];

                  case 1:
                    return [ q, v, p ];

                  case 2:
                    return [ p, v, t ];

                  case 3:
                    return [ p, q, v ];

                  case 4:
                    return [ t, p, v ];

                  case 5:
                    return [ v, p, q ];
                }
            },
            hsv2hsl: function hsv2hsl(hsv) {
                var h = hsv[0], s = hsv[1] / 100, v = hsv[2] / 100, sl, l;
                l = (2 - s) * v;
                sl = s * v;
                sl /= l <= 1 ? l : 2 - l;
                l /= 2;
                return [ h, sl * 100, l * 100 ];
            }
        };
        Random.extend({
            colorConversions: conversions,
            /*
                ##### Random.color()

                随机生成一个<!--有吸引力的-->颜色，格式为 '#RRGGBB'。

                * Random.color()
                * Random.color(format)
                * Random.color(hue)
                * Random.color(format, hue)

                使用示例如下所示：

                    Random.color()
                    // => "#3538B2"
            */
            color: function() {
                // TODO
                // var formats = 'rgb hsl hsv'.split(' ')
                // var hues = 'navy blue aqua teal olive green lime yellow orange red maroon fuchsia purple silver gray black'.split(' ')
                // [Use ~~ and 0| instead of Math.floor for positive numbers](https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use--and-0-instead-of-mathfloor-for-positive-numbers)
                var color = Math.floor(Math.random() * (16 * 16 * 16 * 16 * 16 * 16 - 1)).toString(16);
                color = "#" + ("000000" + color).slice(-6);
                return color.toUpperCase();
            },
            // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
            // https://github.com/devongovett/color-generator/blob/master/index.js
            goldenRatioColor: function(saturation, value) {
                this._goldenRatio = .618033988749895;
                this._hue = this._hue || Math.random();
                this._hue += this._goldenRatio;
                this._hue %= 1;
                if (typeof saturation !== "number") saturation = .5;
                if (typeof value !== "number") value = .95;
                var hsv = [ this._hue * 360, saturation * 100, value * 100 ];
                var rgb = this.colorConversions.hsv2rgb(hsv);
                return "rgb(" + parseInt(rgb[0], 10) + ", " + parseInt(rgb[1], 10) + ", " + parseInt(rgb[2], 10) + ")";
            }
        });
        /*
            #### Helpers
        */
        Random.extend({
            /*
                ##### Random.capitalize(word)

                把字符串的第一个字母转换为大写。

                * Random.capitalize(word)

                使用示例如下所示：

                    Random.capitalize('hello')
                    // => "Hello"
            */
            capitalize: function(word) {
                return (word + "").charAt(0).toUpperCase() + (word + "").substr(1);
            },
            /*
                ##### Random.upper(str)

                把字符串转换为大写。

                * Random.upper(str)

                使用示例如下所示：

                    Random.upper('hello')
                    // => "HELLO"
            */
            upper: function(str) {
                return (str + "").toUpperCase();
            },
            /*
                ##### Random.lower(str)

                把字符串转换为小写。

                使用示例如下所示：

                    Random.lower('HELLO')
                    // => "hello"
            */
            lower: function(str) {
                return (str + "").toLowerCase();
            },
            /*
                ##### Random.pick(arr)

                从数组中随机选取一个元素，并返回。

                * Random.pick(arr)

                使用示例如下所示：

                    Random.pick(['a', 'e', 'i', 'o', 'u'])
                    // => "o"
            */
            pick: function pick(arr, min, max) {
                arr = arr || [];
                switch (arguments.length) {
                  case 1:
                    return arr[this.natural(0, arr.length - 1)];

                  case 2:
                    max = min;

                  /* falls through */
                    case 3:
                    return this.shuffle(arr, min, max);
                }
            },
            /*
                Given an array, scramble the order and return it.
                ##### Random.shuffle(arr)
                
                打乱数组中元素的顺序，并返回。

                * Random.shuffle(arr)

                使用示例如下所示：

                    Random.shuffle(['a', 'e', 'i', 'o', 'u'])
                    // => ["o", "u", "e", "i", "a"]

                其他的实现思路：
                    // https://code.google.com/p/jslibs/wiki/JavascriptTips
                    result = result.sort(function() {
                        return Math.random() - 0.5
                    })
            */
            shuffle: function shuffle(arr, min, max) {
                arr = arr || [];
                var old = arr.slice(0), result = [], index = 0, length = old.length;
                for (var i = 0; i < length; i++) {
                    index = this.natural(0, old.length - 1);
                    result.push(old[index]);
                    old.splice(index, 1);
                }
                switch (arguments.length) {
                  case 0:
                  case 1:
                    return result;

                  case 2:
                    max = min;

                  /* falls through */
                    case 3:
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    return result.slice(0, this.natural(min, max));
                }
            },
            /*
                * Random.order(item, item)
                * Random.order([item, item ...])

                顺序获取数组中的元素

                [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)

                貌似不应该暴漏在这里！因为没法单独调用啊！
            */
            order: function order(array) {
                order.cache = order.cache || {};
                if (arguments.length > 1) array = [].slice.call(arguments, 0);
                var options = order.options;
                // var path = options.context.path.join('.')
                var templatePath = options.context.templatePath.join(".");
                var cache = order.cache[templatePath] = order.cache[templatePath] || {
                    index: 0,
                    array: array
                };
                return cache.array[cache.index++ % cache.array.length];
            }
        });
        /*
            #### Text
        */
        Random.extend({
            /*
                ##### Random.paragraph(len)

                随机生成一段文本。

                * Random.paragraph()
                * Random.paragraph(len)
                * Random.paragraph(min, max)

                参数的含义和默认值如下所示：

                * 参数 len：可选。指示文本中句子的个数。默认值为 3 到 7 之间的随机数。
                * 参数 min：可选。指示文本中句子的最小个数。默认值为 3。
                * 参数 max：可选。指示文本中句子的最大个数。默认值为 7。

                使用示例如下所示：

                    Random.paragraph()
                    // => "Yohbjjz psxwibxd jijiccj kvemj eidnus disnrst rcconm bcjrof tpzhdo ncxc yjws jnmdmty. Dkmiwza ibudbufrnh ndmcpz tomdyh oqoonsn jhoy rueieihtt vsrjpudcm sotfqsfyv mjeat shnqmslfo oirnzu cru qmpt ggvgxwv jbu kjde. Kzegfq kigj dtzdd ngtytgm comwwoox fgtee ywdrnbam utu nyvlyiv tubouw lezpkmyq fkoa jlygdgf pgv gyerges wbykcxhwe bcpmt beqtkq. Mfxcqyh vhvpovktvl hrmsgfxnt jmnhyndk qohnlmgc sicmlnsq nwku dxtbmwrta omikpmajv qda qrn cwoyfaykxa xqnbv bwbnyov hbrskzt. Pdfqwzpb hypvtknt bovxx noramu xhzam kfb ympmebhqxw gbtaszonqo zmsdgcku mjkjc widrymjzj nytudruhfr uudsitbst cgmwewxpi bye. Eyseox wyef ikdnws weoyof dqecfwokkv svyjdyulk glusauosnu achmrakky kdcfp kujrqcq xojqbxrp mpfv vmw tahxtnw fhe lcitj."
                    Random.paragraph(2)
                    // => "Dlpec hnwvovvnq slfehkf zimy qpxqgy vwrbi mok wozddpol umkek nffjcmk gnqhhvm ztqkvjm kvukg dqubvqn xqbmoda. Vdkceijr fhhyemx hgkruvxuvr kuez wmkfv lusfksuj oewvvf cyw tfpo jswpseupm ypybap kwbofwg uuwn rvoxti ydpeeerf."
                    Random.paragraph(1, 3)
                    // => "Qdgfqm puhxle twi lbeqjqfi bcxeeecu pqeqr srsx tjlnew oqtqx zhxhkvq pnjns eblxhzzta hifj csvndh ylechtyu."
            */
            paragraph: function(min, max) {
                var len;
                if (arguments.length === 0) len = Random.natural(3, 7);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(Random.sentence());
                }
                return arr.join(" ");
            },
            /*
                ##### Random.sentence(len)

                随机生成一个句子，第一个的单词的首字母大写。

                * Random.sentence()
                * Random.sentence(len)
                * Random.sentence(min, max)

                参数的含义和默认值如下所示：

                * 参数 len：可选。指示句子中单词的个数。默认值为 12 到 18 之间的随机数。
                * 参数 min：可选。指示句子中单词的最小个数。默认值为 12。
                * 参数 max：可选。指示句子中单词的最大个数。默认值为 18。

                使用示例如下所示：

                    Random.sentence()
                    // => "Jovasojt qopupwh plciewh dryir zsqsvlkga yeam."
                    Random.sentence(5)
                    // => "Fwlymyyw htccsrgdk rgemfpyt cffydvvpc ycgvno."
                    Random.sentence(3, 5)
                    // => "Mgl qhrprwkhb etvwfbixm jbqmg."
            */
            sentence: function(min, max) {
                var len;
                if (arguments.length === 0) len = Random.natural(12, 18);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(Random.word());
                }
                return Random.capitalize(arr.join(" ")) + ".";
            },
            /*
                ##### Random.word(len)

                随机生成一个单词。

                * Random.word()
                * Random.word(len)
                * Random.word(min, max)

                参数的含义和默认值如下所示：

                * 参数 len：可选。指示单词中字符的个数。默认值为 3 到 10 之间的随机数。
                * 参数 min：可选。指示单词中字符的最小个数。默认值为 3。
                * 参数 max：可选。指示单词中字符的最大个数。默认值为 10。

                使用示例如下所示：

                    Random.word()
                    // => "fxpocl"
                    Random.word(5)
                    // => "xfqjb"
                    Random.word(3, 5)
                    // => "kemh"

                > 目前，单字中字符是随机的小写字母，未来会根据词法生成“可读”的单词。
            */
            word: function(min, max) {
                var len;
                if (arguments.length === 0) len = Random.natural(3, 10);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                var result = "";
                for (var i = 0; i < len; i++) {
                    result += Random.character("lower");
                }
                return result;
            },
            /*
                ##### Random.title(len)

                随机生成一句标题，其中每个单词的首字母大写。

                * Random.title()
                * Random.title(len)
                * Random.title(min, max)

                参数的含义和默认值如下所示：

                * 参数 len：可选。指示单词中字符的个数。默认值为 3 到 7 之间的随机数。
                * 参数 min：可选。指示单词中字符的最小个数。默认值为 3。
                * 参数 max：可选。指示单词中字符的最大个数。默认值为 7。

                使用示例如下所示：

                    Random.title()
                    // => "Rduqzr Muwlmmlg Siekwvo Ktn Nkl Orn"
                    Random.title(5)
                    // => "Ahknzf Btpehy Xmpc Gonehbnsm Mecfec"
                    Random.title(3, 5)
                    // => "Hvjexiondr Pyickubll Owlorjvzys Xfnfwbfk"
            */
            title: function(min, max) {
                var len, result = [];
                if (arguments.length === 0) len = Random.natural(3, 7);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                for (var i = 0; i < len; i++) {
                    result.push(this.capitalize(this.word()));
                }
                return result.join(" ");
            }
        });
        /*
            #### Name

            [Beyond the Top 1000 Names](http://www.ssa.gov/oact/babynames/limits.html)
        */
        Random.extend({
            /*
                ##### Random.first()

                随机生成一个常见的英文名。

                * Random.first()
                
                使用示例如下所示：

                    Random.first()
                    // => "Nancy"
            */
            first: function() {
                var names = [ // male
                "James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric" ].concat([ // female
                "Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica", "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna" ]);
                return this.pick(names);
            },
            /*
                ##### Random.last()

                随机生成一个常见的英文姓。

                * Random.last()
                
                使用示例如下所示：

                    Random.last()
                    // => "Martinez"
            */
            last: function() {
                var names = [ "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen" ];
                return this.pick(names);
            },
            /*
                ##### Random.name(middle)

                随机生成一个常见的英文姓名。
                
                * Random.name()
                * Random.name(middle)

                参数的含义和默认值如下所示：

                * 参数 middle：可选。布尔值。指示是否生成中间名。
                
                使用示例如下所示：

                    Random.name()
                    // => "Larry Wilson"
                    Random.name(true)
                    // => "Helen Carol Martinez"
            */
            name: function(middle) {
                return this.first() + " " + (middle ? this.first() + " " : "") + this.last();
            },
            /*
                * Random.cfirst()

                随机生成一个常见的中文姓。

                [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
                [玄派网 - 网络小说创作辅助平台](http://xuanpai.sinaapp.com/)
             */
            cfirst: function() {
                var names = ("王 李 张 刘 陈 杨 赵 黄 周 吴 " + "徐 孙 胡 朱 高 林 何 郭 马 罗 " + "梁 宋 郑 谢 韩 唐 冯 于 董 萧 " + "程 曹 袁 邓 许 傅 沈 曾 彭 吕 " + "苏 卢 蒋 蔡 贾 丁 魏 薛 叶 阎 " + "余 潘 杜 戴 夏 锺 汪 田 任 姜 " + "范 方 石 姚 谭 廖 邹 熊 金 陆 " + "郝 孔 白 崔 康 毛 邱 秦 江 史 " + "顾 侯 邵 孟 龙 万 段 雷 钱 汤 " + "尹 黎 易 常 武 乔 贺 赖 龚 文").split(" ");
                return this.pick(names);
            },
            /*
                * Random.clast()

                随机生成一个常见的中文名。

                [中国最常见名字前50名_三九算命网](http://www.name999.net/xingming/xingshi/20131004/48.html)
             */
            clast: function() {
                var names = ("伟 芳 娜 秀英 敏 静 丽 强 磊 军 " + "洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 " + "平 刚 桂英").split(" ");
                return this.pick(names);
            },
            /*
                随机生成一个常见的中文姓名。
            */
            cname: function() {
                return this.cfirst() + this.clast();
            }
        });
        /*
            #### Web
        */
        Random.extend({
            /*
                ##### Random.url()

                随机生成一个 URL。

                * Random.url()
                * Random.url(protocol, domain, port, path) TODO
                
                使用示例如下所示：

                    Random.url()
                    // => "http://vrcq.edu/ekqtyfi"

                [URL 规范](http://www.w3.org/Addressing/URL/url-spec.txt)
                    http                    Hypertext Transfer Protocol 
                    ftp                     File Transfer protocol 
                    gopher                  The Gopher protocol 
                    mailto                  Electronic mail address 
                    mid                     Message identifiers for electronic mail 
                    cid                     Content identifiers for MIME body part 
                    news                    Usenet news 
                    nntp                    Usenet news for local NNTP access only 
                    prospero                Access using the prospero protocols 
                    telnet rlogin tn3270    Reference to interactive sessions
                    wais                    Wide Area Information Servers 
            */
            url: function() {
                return this.protocol() + "://" + this.domain() + "/" + this.word();
            },
            // 协议簇
            protocols: "http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais".split(" "),
            protocol: function() {
                return this.pick(this.protocols);
            },
            /*
                ##### Random.domain()

                随机生成一个域名。

                * Random.domain()
                
                使用示例如下所示：

                    Random.domain()
                    // => "kozfnb.org"
            */
            domain: function(tld) {
                return this.word() + "." + (tld || this.tld());
            },
            /*
                国际顶级域名 international top-level domain-names, iTLDs
                国家顶级域名 national top-level domainnames, nTLDs
                [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
            */
            tlds: (// 域名后缀
            "com net org edu gov int mil cn " + // 国内域名
            "com.cn net.cn gov.cn org.cn " + // 中文国内域名
            "中国 中国互联.公司 中国互联.网络 " + // 新国际域名
            "tel biz cc tv info name hk mobi asia cd travel pro museum coop aero " + // 世界各国域名后缀
            "ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw").split(" "),
            /*
                ##### Random.tld()

                随机生成一个顶级域名。

                * Random.tld()
                
                使用示例如下所示：

                    Random.tld()
                    // => "io"
            */
            tld: function() {
                // Top Level Domain
                return this.pick(this.tlds);
            },
            /*
                ##### Random.email()

                随机生成一个邮件地址。

                * Random.email()
                
                使用示例如下所示：

                    Random.email()
                    // => "x.davis@jackson.edu"
            */
            email: function(domain) {
                return this.character("lower") + "." + this.word() + "@" + (domain || this.word() + "." + this.tld());
            },
            /*
                ##### Random.ip()

                随机生成一个 IP 地址。

                * Random.ip()
                
                使用示例如下所示：

                    Random.ip()
                    // => "34.206.109.169"
            */
            ip: function() {
                return this.natural(0, 255) + "." + this.natural(0, 255) + "." + this.natural(0, 255) + "." + this.natural(0, 255);
            }
        });
        /*
            #### Address
            TODO 
        */
        Random.extend({
            areas: [ "东北", "华北", "华东", "华中", "华南", "西南", "西北" ],
            /*
                ##### Random.area()

                随机生成一个大区。

                * Random.area()
                
                使用示例如下所示：

                    Random.area()
                    // => "华北"
            */
            area: function() {
                return this.pick(this.areas);
            },
            /*
                > 23 个省：
                '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
                > 4 个直辖市：
                '北京市', '天津市', '上海市', '重庆市',
                > 5 个自治区：
                '广西壮族自治区', '内蒙古自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
                > 2 个特别行政区：
                '香港特别行政区', '澳门特别行政区'
            */
            regions: [ "110000 北京市", "120000 天津市", "130000 河北省", "140000 山西省", "150000 内蒙古自治区", "210000 辽宁省", "220000 吉林省", "230000 黑龙江省", "310000 上海市", "320000 江苏省", "330000 浙江省", "340000 安徽省", "350000 福建省", "360000 江西省", "370000 山东省", "410000 河南省", "420000 湖北省", "430000 湖南省", "440000 广东省", "450000 广西壮族自治区", "460000 海南省", "500000 重庆市", "510000 四川省", "520000 贵州省", "530000 云南省", "540000 西藏自治区", "610000 陕西省", "620000 甘肃省", "630000 青海省", "640000 宁夏回族自治区", "650000 新疆维吾尔自治区", "650000 新疆维吾尔自治区", "710000 台湾省", "810000 香港特别行政区", "820000 澳门特别行政区" ],
            /*
                ##### Random.region()

                随机生成一个省（或直辖市、自治区、特别行政区）。

                * Random.region()
                
                使用示例如下所示：

                    Random.region()
                    // => "辽宁省"
            */
            region: function() {
                return this.pick(this.regions).split(" ")[1];
            },
            address: function() {},
            city: function() {},
            phone: function() {},
            areacode: function() {},
            street: function() {},
            street_suffixes: function() {},
            street_suffix: function() {},
            states: function() {},
            state: function() {},
            zip: function(len) {
                var zip = "";
                for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9);
                return zip;
            }
        });
        // TODO ...
        Random.extend({
            todo: function() {
                return "todo";
            }
        });
        /*
            #### Miscellaneous
        */
        Random.extend({
            // Dice
            d4: function() {
                return this.natural(1, 4);
            },
            d6: function() {
                return this.natural(1, 6);
            },
            d8: function() {
                return this.natural(1, 8);
            },
            d12: function() {
                return this.natural(1, 12);
            },
            d20: function() {
                return this.natural(1, 20);
            },
            d100: function() {
                return this.natural(1, 100);
            },
            /*
                http://www.broofa.com/2008/09/javascript-uuid-function/
                [UUID 规范](http://www.ietf.org/rfc/rfc4122.txt)
                    UUIDs (Universally Unique IDentifier)
                    GUIDs (Globally Unique IDentifier)
                    The formal definition of the UUID string representation is provided by the following ABNF [7]:
                        UUID                   = time-low "-" time-mid "-"
                                               time-high-and-version "-"
                                               clock-seq-and-reserved
                                               clock-seq-low "-" node
                        time-low               = 4hexOctet
                        time-mid               = 2hexOctet
                        time-high-and-version  = 2hexOctet
                        clock-seq-and-reserved = hexOctet
                        clock-seq-low          = hexOctet
                        node                   = 6hexOctet
                        hexOctet               = hexDigit hexDigit
                        hexDigit =
                            "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
                            "a" / "b" / "c" / "d" / "e" / "f" /
                            "A" / "B" / "C" / "D" / "E" / "F"
                
                https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349

                ##### Random.guid()

                随机生成一个 GUID。

                * Random.guid()
                
                使用示例如下所示：

                    Random.guid()
                    // => "662C63B4-FD43-66F4-3328-C54E3FF0D56E"
            */
            guid: function() {
                var pool = "abcdefABCDEF1234567890", guid = this.string(pool, 8) + "-" + this.string(pool, 4) + "-" + this.string(pool, 4) + "-" + this.string(pool, 4) + "-" + this.string(pool, 12);
                return guid;
            },
            uuid: function() {
                return this.guid();
            },
            /*
                [身份证](http://baike.baidu.com/view/1697.htm#4)
                    地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
                [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)

                ##### Random.id()

                随机生成一个 18 位身份证。

                * Random.id()
                
                使用示例如下所示：

                    Random.id()
                    // => "420000200710091854"
            */
            id: function() {
                var id, sum = 0, rank = [ "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2" ], last = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];
                id = this.pick(this.regions).split(" ")[0] + this.date("yyyyMMdd") + this.string("number", 3);
                for (var i = 0; i < id.length; i++) {
                    sum += id[i] * rank[i];
                }
                id += last[sum % 11];
                return id;
            },
            /*
                自增主键
                auto increment primary key

                ##### Random.increment()

                生成一个全局的自增整数。

                * Random.increment(step)

                参数的含义和默认值如下所示：
                * 参数 step：可选。整数自增的步长。默认值为 1。

                使用示例如下所示：

                    Random.increment()
                    // => 1
                    Random.increment(100)
                    // => 101
                    Random.increment(1000)
                    // => 1101
            */
            autoIncrementInteger: 0,
            increment: function(step) {
                return this.autoIncrementInteger += +step || 1;
            },
            inc: function(step) {
                return this.increment(step);
            }
        });
        return Random;
    }();
    /*! src/handle.js */
    var Handle = function() {
        var Handle = {
            extend: Util.extend
        };
        var guid = 1;
        /*
            RE_KEY
                name|+inc
                name|repeat
                name|min-max
                name|min-max.dmin-dmax
                name|int.dmin-dmax

                1 name, 2 inc, 3 range, 4 decimal

            RE_PLACEHOLDER
                placeholder(*)

            [正则查看工具](http://www.regexper.com/)

            #26 生成规则 支持 负数，例如 number|-100-100
        */
        var RE_KEY = /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/;
        var RE_RANGE = /([\+\-]?\d+)-?([\+\-]?\d+)?/;
        // var RE_PLACEHOLDER = /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
        var RE_PLACEHOLDER = /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g;
        Handle.RE_KEY = RE_KEY;
        Handle.RE_RANGE = RE_RANGE;
        Handle.RE_PLACEHOLDER = RE_PLACEHOLDER;
        Handle.rule = function(name) {
            /* jshint -W041 */
            name = name == undefined ? "" : name + "";
            var parameters = (name || "").match(RE_KEY);
            var range = parameters && parameters[3] && parameters[3].match(RE_RANGE);
            var min = range && range[1] && parseInt(range[1], 10);
            // || 1
            var max = range && range[2] && parseInt(range[2], 10);
            // || 1
            // repeat || min-max || 1
            // var count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1
            var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : null;
            var decimal = parameters && parameters[4] && parameters[4].match(RE_RANGE);
            var dmin = decimal && parseInt(decimal[1], 10);
            // || 0,
            var dmax = decimal && parseInt(decimal[2], 10);
            // || 0,
            // int || dmin-dmax || 0
            var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : null;
            var result = {
                // 1 name, 2 inc, 3 range, 4 decimal
                parameters: parameters,
                // 1 min, 2 max
                range: range,
                min: min,
                max: max,
                // min-max
                count: count,
                // 是否有 decimal
                decimal: decimal,
                dmin: dmin,
                dmax: dmax,
                // dmin-dimax
                dcount: dcount
            };
            for (var r in result) {
                if (result[r] != undefined) return result;
            }
            return {};
        };
        /*
            template        属性值（即数据模板）
            name            属性名
            context         数据上下文，生成后的数据
            templateContext 模板上下文，

            Handle.gen(template, name, options)
            context
                currentContext, templateCurrentContext, 
                path, templatePath
                root, templateRoot
        */
        Handle.gen = function(template, name, context) {
            name = name = (name || "") + "";
            context = context || {};
            context = {
                // 当前访问路径，只有属性名，不包括生成规则
                path: context.path || [ guid ],
                templatePath: context.templatePath || [ guid++ ],
                // 最终属性值的上下文
                currentContext: context.currentContext,
                // 属性值模板的上下文
                templateCurrentContext: context.templateCurrentContext || template,
                // 最终值的根
                root: context.root || context.currentContext,
                // 模板的根
                templateRoot: context.templateRoot || context.templateCurrentContext || template
            };
            // console.log('path:', context.path.join('.'), template)
            var rule = Handle.rule(name);
            var type = Util.type(template);
            var data;
            if (Handle[type]) {
                data = Handle[type]({
                    // 属性值类型
                    type: type,
                    // 属性值模板
                    template: template,
                    // 属性名 + 生成规则
                    name: name,
                    // 属性名
                    parsedName: name ? name.replace(RE_KEY, "$1") : name,
                    // 解析后的生成规则
                    rule: rule,
                    // 相关上下文
                    context: context
                });
                if (!context.root) context.root = data;
                return data;
            }
            return template;
        };
        Handle.extend({
            array: function(options) {
                var result = [], i, ii;
                // 'name|1': []
                // 'name|count': []
                // 'name|min-max': []
                if (options.template.length === 0) return result;
                // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
                if (!options.rule.parameters) {
                    for (i = 0; i < options.template.length; i++) {
                        options.context.path.push(i);
                        options.context.templatePath.push(i);
                        result.push(Handle.gen(options.template[i], i, {
                            path: options.context.path,
                            templatePath: options.context.templatePath,
                            currentContext: result,
                            templateCurrentContext: options.template,
                            root: options.context.root || result,
                            templateRoot: options.context.templateRoot || options.template
                        }));
                        options.context.path.pop();
                        options.context.templatePath.pop();
                    }
                } else {
                    // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
                    if (options.rule.min === 1 && options.rule.max === undefined) {
                        // fix #17
                        options.context.path.push(options.name), options.context.templatePath.push(options.name);
                        result = Random.pick(Handle.gen(options.template, undefined, {
                            path: options.context.path,
                            templatePath: options.context.templatePath,
                            currentContext: result,
                            templateCurrentContext: options.template,
                            root: options.context.root || result,
                            templateRoot: options.context.templateRoot || options.template
                        }));
                        options.context.path.pop();
                        options.context.templatePath.pop();
                    } else {
                        // 'data|+1': [{}, {}]
                        if (options.rule.parameters[2]) {
                            options.template.__order_index = options.template.__order_index || 0;
                            options.context.path.push(options.name), options.context.templatePath.push(options.name);
                            result = Handle.gen(options.template, undefined, {
                                path: options.context.path,
                                templatePath: options.context.templatePath,
                                currentContext: result,
                                templateCurrentContext: options.template,
                                root: options.context.root || result,
                                templateRoot: options.context.templateRoot || options.template
                            })[options.template.__order_index % options.template.length];
                            options.template.__order_index += +options.rule.parameters[2];
                            options.context.path.pop();
                            options.context.templatePath.pop();
                        } else {
                            // 'data|1-10': [{}]
                            for (i = 0; i < options.rule.count; i++) {
                                // 'data|1-10': [{}, {}]
                                for (ii = 0; ii < options.template.length; ii++) {
                                    options.context.path.push(result.length);
                                    options.context.templatePath.push(ii);
                                    result.push(Handle.gen(options.template[ii], result.length, {
                                        path: options.context.path,
                                        templatePath: options.context.templatePath,
                                        currentContext: result,
                                        templateCurrentContext: options.template,
                                        root: options.context.root || result,
                                        templateRoot: options.context.templateRoot || options.template
                                    }));
                                    options.context.path.pop();
                                    options.context.templatePath.pop();
                                }
                            }
                        }
                    }
                }
                return result;
            },
            object: function(options) {
                var result = {}, keys, fnKeys, key, parsedKey, inc, i;
                // 'obj|min-max': {}
                /* jshint -W041 */
                if (options.rule.min != undefined) {
                    keys = Util.keys(options.template);
                    keys = Random.shuffle(keys);
                    keys = keys.slice(0, options.rule.count);
                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        parsedKey = key.replace(RE_KEY, "$1");
                        options.context.path.push(parsedKey);
                        options.context.templatePath.push(key);
                        result[parsedKey] = Handle.gen(options.template[key], key, {
                            path: options.context.path,
                            templatePath: options.context.templatePath,
                            currentContext: result,
                            templateCurrentContext: options.template,
                            root: options.context.root || result,
                            templateRoot: options.context.templateRoot || options.template
                        });
                        options.context.path.pop();
                        options.context.templatePath.pop();
                    }
                } else {
                    // 'obj': {}
                    keys = [];
                    fnKeys = [];
                    // #25 改变了非函数属性的顺序，查找起来不方便
                    for (key in options.template) {
                        (typeof options.template[key] === "function" ? fnKeys : keys).push(key);
                    }
                    keys = keys.concat(fnKeys);
                    /*
                        会改变非函数属性的顺序
                        keys = Util.keys(options.template)
                        keys.sort(function(a, b) {
                            var afn = typeof options.template[a] === 'function'
                            var bfn = typeof options.template[b] === 'function'
                            if (afn === bfn) return 0
                            if (afn && !bfn) return 1
                            if (!afn && bfn) return -1
                        })
                    */
                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        parsedKey = key.replace(RE_KEY, "$1");
                        options.context.path.push(parsedKey);
                        options.context.templatePath.push(key);
                        result[parsedKey] = Handle.gen(options.template[key], key, {
                            path: options.context.path,
                            templatePath: options.context.templatePath,
                            currentContext: result,
                            templateCurrentContext: options.template,
                            root: options.context.root || result,
                            templateRoot: options.context.templateRoot || options.template
                        });
                        options.context.path.pop();
                        options.context.templatePath.pop();
                        // 'id|+1': 1
                        inc = key.match(RE_KEY);
                        if (inc && inc[2] && Util.type(options.template[key]) === "number") {
                            options.template[key] += parseInt(inc[2], 10);
                        }
                    }
                }
                return result;
            },
            number: function(options) {
                var result, parts;
                if (options.rule.decimal) {
                    // float
                    options.template += "";
                    parts = options.template.split(".");
                    // 'float1|.1-10': 10,
                    // 'float2|1-100.1-10': 1,
                    // 'float3|999.1-10': 1,
                    // 'float4|.3-10': 123.123,
                    parts[0] = options.rule.range ? options.rule.count : parts[0];
                    parts[1] = (parts[1] || "").slice(0, options.rule.dcount);
                    while (parts[1].length < options.rule.dcount) {
                        parts[1] += // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                        parts[1].length < options.rule.dcount - 1 ? Random.character("number") : Random.character("123456789");
                    }
                    result = parseFloat(parts.join("."), 10);
                } else {
                    // integer
                    // 'grade1|1-100': 1,
                    result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template;
                }
                return result;
            },
            "boolean": function(options) {
                var result;
                // 'prop|multiple': false, 当前值是相反值的概率倍数
                // 'prop|probability-probability': false, 当前值与相反值的概率
                result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template;
                return result;
            },
            string: function(options) {
                var result = "", i, placeholders, ph, phed;
                if (options.template.length) {
                    //  'foo': '★',
                    /* jshint -W041 */
                    if (options.rule.count == undefined) {
                        result += options.template;
                    }
                    // 'star|1-5': '★',
                    for (i = 0; i < options.rule.count; i++) {
                        result += options.template;
                    }
                    // 'email|1-10': '@EMAIL, ',
                    placeholders = result.match(RE_PLACEHOLDER) || [];
                    // A-Z_0-9 > \w_
                    for (i = 0; i < placeholders.length; i++) {
                        ph = placeholders[i];
                        // TODO 只有转义斜杠是偶数时，才不需要解析占位符？
                        if (/^\\/.test(ph)) {
                            placeholders.splice(i--, 1);
                            continue;
                        }
                        phed = Handle.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options);
                        // 只有一个占位符，并且没有其他字符
                        if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) {
                            // 
                            result = phed;
                            break;
                            if (Util.isNumeric(phed)) {
                                result = parseFloat(phed, 10);
                                break;
                            }
                            if (/^(true|false)$/.test(phed)) {
                                result = phed === "true" ? true : phed === "false" ? false : phed;
                                // 已经是布尔值
                                break;
                            }
                        }
                        result = result.replace(ph, phed);
                    }
                } else {
                    // 'ASCII|1-10': '',
                    // 'ASCII': '',
                    result = options.rule.range ? Random.string(options.rule.count) : options.template;
                }
                return result;
            },
            "function": function(options) {
                // TODO 参数该如何设计
                return options.template.call(options.context.currentContext, options);
            },
            regexp: function(options) {
                // regexp.source
                var source = options.template.source;
                // 'name|1-5': /regexp/,
                for (var i = 0; i < options.rule.count; i++) {
                    source += options.template.source;
                }
                return RegExpHandler.gen(RegExpParser.parse(source));
            }
        });
        Handle.extend({
            _all: function() {
                var re = {};
                for (var key in Random) re[key.toLowerCase()] = key;
                return re;
            },
            // 处理占位符，转换为最终值
            placeholder: function(placeholder, obj, templateContext, options) {
                // console.log(options.context.path)
                // 1 key, 2 params
                RE_PLACEHOLDER.exec("");
                var parts = RE_PLACEHOLDER.exec(placeholder), key = parts && parts[1], lkey = key && key.toLowerCase(), okey = this._all()[lkey], params = parts && parts[2] || "";
                var pathParts = this.splitPathToArray(key);
                // 解析占位符的参数
                try {
                    // 1. 尝试保持参数的类型
                    /*
                        #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
                        [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
                        应该属于 Window Firefox 30.0 的 BUG
                    */
                    /* jshint -W061 */
                    params = eval("(function(){ return [].splice.call(arguments, 0 ) })(" + params + ")");
                } catch (error) {
                    // 2. 如果失败，只能解析为字符串
                    // console.error(error)
                    // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
                    // else throw error
                    params = parts[2].split(/,\s*/);
                }
                // 占位符优先引用数据模板中的属性
                if (obj && key in obj) return obj[key];
                // 绝对路径 or 相对路径
                if (key.charAt(0) === "/" || pathParts.length > 1) return this.getValueByKeyPath(key, options);
                // 递归引用数据模板中的属性
                if (templateContext && typeof templateContext === "object" && key in templateContext && placeholder !== templateContext[key]) {
                    // 先计算被引用的属性值
                    templateContext[key] = Handle.gen(templateContext[key], key, {
                        currentContext: obj,
                        templateCurrentContext: templateContext
                    });
                    return templateContext[key];
                }
                // 如果未找到，则原样返回
                if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder;
                // 递归解析参数中的占位符
                for (var i = 0; i < params.length; i++) {
                    RE_PLACEHOLDER.exec("");
                    if (RE_PLACEHOLDER.test(params[i])) {
                        params[i] = Handle.placeholder(params[i], obj, templateContext, options);
                    }
                }
                var handle = Random[key] || Random[lkey] || Random[okey];
                switch (Util.type(handle)) {
                  // 自动从数组中取一个，例如 @areas
                    case "array":
                    return Random.pick(handle);

                  // 执行占位符方法（大多数情况）
                    case "function":
                    handle.options = options;
                    var re = handle.apply(Random, params);
                    if (re === undefined) re = "";
                    // 因为是在字符串中，所以默认为空字符串。
                    delete handle.options;
                    return re;
                }
            },
            getValueByKeyPath: function(key, options) {
                var originalKey = key;
                var keyPathParts = this.splitPathToArray(key);
                var absolutePathParts = [];
                // 绝对路径
                if (key.charAt(0) === "/") {
                    absolutePathParts = [ options.context.path[0] ].concat(this.normalizePath(keyPathParts));
                } else {
                    // 相对路径
                    if (keyPathParts.length > 1) {
                        absolutePathParts = options.context.path.slice(0);
                        absolutePathParts.pop();
                        absolutePathParts = this.normalizePath(absolutePathParts.concat(keyPathParts));
                    }
                }
                key = keyPathParts[keyPathParts.length - 1];
                var currentContext = options.context.root;
                var templateCurrentContext = options.context.templateRoot;
                for (var i = 1; i < absolutePathParts.length - 1; i++) {
                    currentContext = currentContext[absolutePathParts[i]];
                    templateCurrentContext = templateCurrentContext[absolutePathParts[i]];
                }
                // 引用的值已经计算好
                if (currentContext && key in currentContext) return currentContext[key];
                // 尚未计算，递归引用数据模板中的属性
                if (templateCurrentContext && typeof templateCurrentContext === "object" && key in templateCurrentContext && originalKey !== templateCurrentContext[key]) {
                    // 先计算被引用的属性值
                    templateCurrentContext[key] = Handle.gen(templateCurrentContext[key], key, {
                        currentContext: currentContext,
                        templateCurrentContext: templateCurrentContext
                    });
                    return templateCurrentContext[key];
                }
            },
            // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
            normalizePath: function(pathParts) {
                var newPathParts = [];
                for (var i = 0; i < pathParts.length; i++) {
                    switch (pathParts[i]) {
                      case "..":
                        newPathParts.pop();
                        break;

                      case ".":
                        break;

                      default:
                        newPathParts.push(pathParts[i]);
                    }
                }
                return newPathParts;
            },
            splitPathToArray: function(path) {
                var parts = path.split(/\/+/);
                if (!parts[parts.length - 1]) parts = parts.slice(0, -1);
                if (!parts[0]) parts = parts.slice(1);
                return parts;
            }
        });
        return Handle;
    }();
    /*! src/mock.js */
    /*!
        Mock - 模拟请求 & 模拟数据
        https://github.com/nuysoft/Mock
        墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
    */
    var Mock = function() {
        var Mock = {
            version: "0.2.0-alpha1",
            _mocked: {}
        };
        /*
            * Mock.mock( template )
            * Mock.mock( function() )
            * Mock.mock( rurl, template )
            * Mock.mock( rurl, function(options) )
            * Mock.mock( rurl, rtype, template )
            * Mock.mock( rurl, rtype, function(options) )

            根据数据模板生成模拟数据。
        */
        Mock.mock = function(rurl, rtype, template) {
            // Mock.mock(template)
            if (arguments.length === 1) {
                return Handle.gen(rurl);
            }
            // Mock.mock(rurl, template)
            if (arguments.length === 2) {
                template = rtype;
                rtype = undefined;
            }
            Mock._mocked[rurl + (rtype || "")] = {
                rurl: rurl,
                rtype: rtype,
                template: template
            };
            return Mock;
        };
        return Mock;
    }();
    /*! src/xhr.js */
    /*
        期望的功能：
        1. 完整地覆盖原生 XHR 的行为
        2. 完整地模拟原生 XHR 的行为
        3. 在发起请求时，自动检测是否需要拦截
        4. 如果不必拦截，则执行原生 XHR 的行为
        5. 如果需要拦截，则执行虚拟 XHR 的行为
        6. 兼容 XMLHttpRequest 和 ActiveXObject
            new window.XMLHttpRequest()
            new window.ActiveXObject("Microsoft.XMLHTTP")
        
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
        https://github.com/thx/RAP/blob/master/lab/rap.plugin.xinglie.js

        **需不需要全面重写 XMLHttpRequest？**
            http://xhr.spec.whatwg.org/#interface-xmlhttprequest
            关键属性 readyState、status、statusText、response、responseText、responseXML 是 readonly，所以，试图通过修改这些状态，来模拟响应是不可行的。
            唯一的办法，是模拟整个 XMLHttpRequest，就像 jQuery 对事件模型的封装一样。

        // Event handlers
        onloadstart         loadstart
        onprogress          progress
        onabort             abort
        onerror             error
        onload              load
        ontimeout           timeout
        onloadend           loadend
        onreadystatechange  readystatechange
    */
    // 备份原生 XMLHttpRequest
    window._XMLHttpRequest = window.XMLHttpRequest;
    window._ActiveXObject = window.ActiveXObject;
    /*
        PhantomJS
        TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')

        https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
        https://github.com/ariya/phantomjs/issues/11289
    */
    try {
        new window.Event("custom");
    } catch (exception) {
        window.Event = function(type, bubbles, cancelable, detail) {
            var event = document.createEvent("CustomEvent");
            // MUST be 'CustomEvent'
            event.initCustomEvent(type, bubbles, cancelable, detail);
            return event;
        };
    }
    var MockXMLHttpRequest = function() {
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
        };
        var XHR_EVENTS = "readystatechange loadstart progress abort error load timeout loadend".split(" ");
        var XHR_RESPONSE_PROPERTIES = "readyState responseURL status statusText responseType response responseText responseXML".split(" ");
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
        };
        /*
                MockXMLHttpRequest
            */
        function MockXMLHttpRequest() {
            // 初始化 custom 对象，用于存储自定义属性
            this.custom = {
                events: {},
                requestHeaders: {},
                responseHeaders: {}
            };
        }
        Util.extend(MockXMLHttpRequest, XHR_STATES);
        Util.extend(MockXMLHttpRequest.prototype, XHR_STATES);
        // 标记当前对象为 MockXMLHttpRequest
        MockXMLHttpRequest.prototype.mock = true;
        // 是否拦截 Ajax 请求
        MockXMLHttpRequest.prototype.match = false;
        // Request 相关的属性和方法
        Util.extend(MockXMLHttpRequest.prototype, {
            open: function open(method, url, async, username, password) {
                var that = this;
                Util.extend(this.custom, {
                    method: method,
                    url: url,
                    async: typeof async === "boolean" ? async : true,
                    username: username,
                    password: password,
                    options: {
                        url: url,
                        type: method
                    }
                });
                var item = find(this.custom.options);
                function handle(event) {
                    // 同步属性
                    for (var i = 0, len = XHR_RESPONSE_PROPERTIES.length; i < len; i++) {
                        try {
                            that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]];
                        } catch (e) {}
                    }
                    // 触发 MockXMLHttpRequest 上的同名事件
                    that.dispatchEvent(new Event(event.type, false, false, that));
                }
                // 原生 XHR
                if (!item) {
                    // 创建原生 XHR，open，监听事件
                    var xhr = createOriginalXMLHttpRequest();
                    this.custom.xhr = xhr;
                    // 初始化所有事件，用于监听原生 XHR 对象的事件
                    for (var i = 0; i < XHR_EVENTS.length; i++) {
                        xhr.addEventListener(XHR_EVENTS[i], handle);
                    }
                    // xhr.open()
                    if (username) xhr.open(method, url, async, username, password); else xhr.open(method, url, async);
                    return;
                }
                // 拦截 XHR
                this.match = true;
                this.custom.template = item;
                this.readyState = MockXMLHttpRequest.OPENED;
                this.dispatchEvent(new Event("readystatechange", false, false, this));
            },
            setRequestHeader: function setRequestHeader(name, value) {
                // 原生 XHR
                if (!this.match) {
                    this.custom.xhr.setRequestHeader(name, value);
                    return;
                }
                // 拦截 XHR
                var requestHeaders = this.custom.requestHeaders;
                if (requestHeaders[name]) requestHeaders[name] += "," + value; else requestHeaders[name] = value;
            },
            timeout: 0,
            withCredentials: false,
            upload: {},
            send: function send(data) {
                var that = this;
                // 原生 XHR
                if (!this.match) {
                    this.custom.xhr.send(data);
                    return;
                }
                // 拦截 XHR
                this.dispatchEvent(new Event("loadstart", false, false, this));
                if (this.custom.async) setTimeout(done, 100); else done();
                function done() {
                    that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;
                    that.dispatchEvent(new Event("readystatechange", false, false, that));
                    that.readyState = MockXMLHttpRequest.LOADING;
                    that.dispatchEvent(new Event("readystatechange", false, false, that));
                    that.status = 200;
                    that.statusText = HTTP_STATUS_CODES[200];
                    that.responseText = JSON.stringify(convert(that.custom.template, that.custom.options), null, 4);
                    that.readyState = MockXMLHttpRequest.DONE;
                    that.dispatchEvent(new Event("readystatechange", false, false, that));
                    that.dispatchEvent(new Event("load", false, false, that));
                    that.dispatchEvent(new Event("loadend", false, false, that));
                }
            },
            abort: function abort() {
                // 原生 XHR
                if (!this.match) {
                    this.custom.xhr.abort();
                    return;
                }
                // 拦截 XHR
                this.readyStateChange(MockXMLHttpRequest.DONE);
                this.dispatchEvent(new Event("abort", false, false, this));
                this.dispatchEvent(new Event("error", false, false, this));
            }
        });
        // Response 相关的属性和方法
        Util.extend(MockXMLHttpRequest.prototype, {
            responseURL: "",
            status: MockXMLHttpRequest.UNSENT,
            statusText: "",
            getResponseHeader: function getResponseHeader(name) {
                // 原生 XHR
                if (!this.match) {
                    return this.custom.xhr.getResponseHeader(name);
                }
                // 拦截 XHR
                return this.custom.responseHeaders[name.toLowerCase()];
            },
            getAllResponseHeaders: function getAllResponseHeaders() {
                // 原生 XHR
                if (!this.match) {
                    return this.custom.xhr.getAllResponseHeaders();
                }
                // 拦截 XHR
                var responseHeaders = this.custom.responseHeaders;
                var headers = "";
                for (var h in responseHeaders) {
                    if (!responseHeaders.hasOwnProperty(h)) continue;
                    headers += h + ": " + responseHeaders[h] + "\r\n";
                }
                return headers;
            },
            overrideMimeType: function overrideMimeType(mime) {},
            responseType: "",
            // '', 'text', 'arraybuffer', 'blob', 'document', 'json' 
            response: null,
            responseText: "",
            responseXML: null
        });
        // EventTarget
        Util.extend(MockXMLHttpRequest.prototype, {
            addEventListene: function addEventListene(type, handle) {
                var events = this.custom.events;
                if (!events[type]) events[type] = [];
                events[type].push(handle);
            },
            removeEventListener: function removeEventListener(type, handle) {
                var handles = this.custom.events[type] || [];
                for (var i = 0; i < handles.length; i++) {
                    if (handles[i] === handle) {
                        handles.splice(i--, 1);
                        return;
                    }
                }
            },
            dispatchEvent: function dispatchEvent(event) {
                var handles = this.custom.events[event.type] || [];
                for (var i = 0; i < handles.length; i++) {
                    handles[i].call(this, event);
                }
                var ontype = "on" + event.type;
                if (this[ontype]) this[ontype](event);
            }
        });
        return MockXMLHttpRequest;
        // Inspired by jQuery
        function createOriginalXMLHttpRequest() {
            var isLocal = function() {
                var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
                var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
                var ajaxLocation = location.href;
                var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
                return rlocalProtocol.test(ajaxLocParts[1]);
            }();
            return window.ActiveXObject ? !isLocal && createStandardXHR() || createActiveXHR() : createStandardXHR();
            function createStandardXHR() {
                try {
                    return new window._XMLHttpRequest();
                } catch (e) {}
            }
            function createActiveXHR() {
                try {
                    return new window._ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }
        /*
         
            */
        function find(options) {
            for (var sUrlType in Mock._mocked) {
                var item = Mock._mocked[sUrlType];
                if ((!item.rurl || match(item.rurl, options.url)) && (!item.rtype || match(item.rtype, options.type.toLowerCase()))) {
                    // console.log('[mock]', options.url, '>', item.rurl)
                    return item;
                }
            }
            function match(expected, actual) {
                if (Util.type(expected) === "string") {
                    return expected === actual;
                }
                if (Util.type(expected) === "regexp") {
                    return expected.test(actual);
                }
            }
        }
        function convert(item, options) {
            return Util.isFunction(item.template) ? item.template(options) : Mock.mock(item.template);
        }
    }();
    /*! src/schema.js */
    function toJSONSchema(template, name) {
        // type rule properties items
        var result = {
            name: typeof name === "string" ? name.replace(Handle.RE_KEY, "$1") : name,
            template: template,
            type: Util.type(template),
            // 可能不准确，例如 { 'name|1': [{}, {} ...] }
            rule: Handle.rule(name)
        };
        switch (result.type) {
          case "array":
            result.items = [];
            Util.each(template, function(value, index) {
                result.items.push(toJSONSchema(value, index));
            });
            break;

          case "object":
            result.properties = [];
            Util.each(template, function(value, name) {
                result.properties.push(toJSONSchema(value, name));
            });
            break;
        }
        return result;
    }
    /*! src/valid.js */
    /*
        * Mock.valid(template, data)

        校验真实数据 data 是否与数据模板 template 匹配。
        
        实现思路：
        1. 解析规则。
            先把数据模板 template 解析为更方便机器解析的 JSON-Schame
            name               属性名 
            type               属性值类型
            template           属性值模板
            properties         对象属性数组
            items              数组元素数组
            rule               属性值生成规则
        2. 递归验证规则。
            然后用 JSON-Schema 校验真实数据，校验项包括属性名、值类型、值、值生成规则。

        提示信息 https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
        [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
        [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
    */
    function valid(template, data) {
        var schema = toJSONSchema(template);
        var result = Diff.diff(schema, data);
        for (var i = 0; i < result.length; i++) {}
        return result;
    }
    /*
        ## name
            有生成规则：比较解析后的 name
            无生成规则：直接比较
        ## type
            无类型转换：直接比较
            有类型转换：先试着解析 template，然后再检查？
        ## value vs. template
            基本类型
                无生成规则：直接比较
                有生成规则：
                    number
                        min-max.dmin-dmax
                        min-max.dcount
                        count.dmin-dmax
                        count.dcount
                        +step
                        整数部分
                        小数部分
                    boolean 
                    string  
                        min-max
                        count
        ## properties
            对象
                有生成规则：检测期望的属性个数，继续递归
                无生成规则：检测全部的属性个数，继续递归
        ## items
            数组
                有生成规则：
                    `'name|1': [{}, {} ...]`            其中之一，继续递归
                    `'name|+1': [{}, {} ...]`           顺序检测，继续递归
                    `'name|min-max': [{}, {} ...]`      检测个数，继续递归
                    `'name|count': [{}, {} ...]`        检测个数，继续递归
                无生成规则：检测全部的元素个数，继续递归
    */
    var Diff = {
        diff: function diff(schema, data, name) {
            var result = [];
            // 先检测名称 name 和类型 type，如果匹配，才有必要继续检测
            if (this.name(schema, data, name, result) && this.type(schema, data, name, result)) {
                this.value(schema, data, name, result);
                this.properties(schema, data, name, result);
                this.items(schema, data, name, result);
            }
            return result;
        },
        name: function(schema, data, name, result) {
            var length = result.length;
            Assert.equal("name", name, name + "", schema.name + "", result);
            if (result.length !== length) return false;
            return true;
        },
        type: function(schema, data, name, result) {
            var length = result.length;
            Assert.equal("type", name, Util.type(data), schema.type, result);
            if (result.length !== length) return false;
            return true;
        },
        value: function(schema, data, name, result) {
            var length = result.length;
            var rule = schema.rule;
            var templateType = Util.type(schema.template);
            if (templateType === "object" || templateType === "array") return;
            // 无生成规则
            if (!schema.rule.parameters) {
                Assert.equal("value", name, data, schema.template, result);
                return;
            }
            // 有生成规则
            switch (templateType) {
              case "number":
                var parts = (data + "").split(".");
                parts[0] = +parts[0];
                // 整数部分
                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo("value", name, parts[0], rule.min, result, "numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})");
                    Assert.lessThanOrEqualTo("value", name, parts[0], rule.max, result);
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal("value", name, parts[0], rule.min, result, "[value] " + name);
                }
                // 小数部分
                if (rule.decimal) {
                    // |dmin-dmax
                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
                        Assert.greaterThanOrEqualTo("value", name, parts[1].length, rule.dmin, result);
                        Assert.lessThanOrEqualTo("value", name, parts[1].length, rule.dmax, result);
                    }
                    // |dcount
                    if (rule.dmin !== undefined && rule.dmax === undefined) {
                        Assert.equal("value", name, parts[1].length, rule.dmin, result);
                    }
                }
                break;

              case "boolean":
                break;

              case "string":
                // 'aaa'.match(/a/g)
                var actualRepeatCount = data.match(new RegExp(schema.template, "g"));
                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : actualRepeatCount;
                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo("value", name, actualRepeatCount, rule.min, result);
                    Assert.lessThanOrEqualTo("value", name, actualRepeatCount, rule.max, result);
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal("value", name, actualRepeatCount, rule.min, result);
                }
                break;
            }
            if (result.length !== length) return false;
            return true;
        },
        properties: function(schema, data, name, result) {
            var length = result.length;
            var rule = schema.rule;
            var keys = Util.keys(data);
            if (!schema.properties) return;
            // 无生成规则
            if (!schema.rule.parameters) {
                Assert.equal("properties length", name, keys.length, schema.properties.length, result);
            } else {
                // 有生成规则
                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo("properties length", name, keys.length, rule.min, result);
                    Assert.lessThanOrEqualTo("properties length", name, keys.length, rule.max, result);
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal("properties length", name, keys.length, rule.min, result);
                }
            }
            if (result.length !== length) return false;
            for (var i = 0; i < keys.length; i++) {
                result.push.apply(result, this.diff(schema.properties[i], data[keys[i]], keys[i]));
            }
            if (result.length !== length) return false;
            return true;
        },
        items: function(schema, data, name, result) {
            var length = result.length;
            if (!schema.items) return;
            var rule = schema.rule;
            // 无生成规则
            if (!schema.rule.parameters) {
                Assert.equal("items length", name, data.length, schema.items.length, result);
            } else {
                // 有生成规则
                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo("items", name, data.length, rule.min * schema.items.length, result, "[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements");
                    Assert.lessThanOrEqualTo("items", name, data.length, rule.max * schema.items.length, result, "[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements");
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal("items length", name, data.length, rule.min * schema.items.length, result);
                }
            }
            if (result.length !== length) return false;
            for (var i = 0; i < data.length; i++) {
                result.push.apply(result, this.diff(schema.items[i % schema.items.length], data[i], i % schema.items.length));
            }
            if (result.length !== length) return false;
            return true;
        }
    };
    // TODO 完善、友好的提示信息
    /*
        Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
        路径 验证类型 描述 

        Expect path.name is less than or equal to expected, but path.name is actual.

        Expect path.name is less than or equal to expected, but path.name is actual.
        Expect path.name is greater than or equal to expected, but path.name is actual.

    */
    var Assert = {
        message: function(item) {
            return "[{utype}] Expect {path}'{ltype} is {action} {expected}, but is {actual}".replace("{utype}", item.type.toUpperCase()).replace("{ltype}", item.type.toLowerCase()).replace("{path}", item.path).replace("{action}", item.action).replace("{expected}", item.expected).replace("{actual}", item.actual);
        },
        equal: function(type, path, actual, expected, result, message) {
            if (actual === expected) return true;
            result.push({
                path: path,
                type: type,
                actual: actual,
                expected: expected,
                action: "equal to"
            });
            return false;
        },
        notEqual: function(type, path, actual, expected, result, message) {
            if (actual !== expected) return true;
            result.push({
                path: path,
                type: type,
                actual: actual,
                expected: expected,
                action: "not equal to",
                message: message
            });
            return false;
        },
        greaterThan: function(type, path, actual, expected, result, message) {
            if (actual > expected) return true;
            result.push({
                path: path,
                type: type,
                actual: actual,
                expected: expected,
                action: "greater than",
                message: message
            });
            return false;
        },
        lessThan: function(type, path, actual, expected, result, message) {
            if (actual < expected) return true;
            result.push({
                path: path,
                type: type,
                actual: actual,
                expected: expected,
                action: "less to",
                message: message
            });
            return false;
        },
        greaterThanOrEqualTo: function(type, path, actual, expected, result, message) {
            if (actual >= expected) return true;
            result.push({
                path: path,
                type: type,
                actual: actual,
                expected: expected,
                action: "greater than or equal to",
                message: message
            });
            return false;
        },
        lessThanOrEqualTo: function(type, path, actual, expected, result, message) {
            if (actual <= expected) return true;
            result.push({
                path: path,
                type: type,
                actual: actual,
                expected: expected,
                action: "less than or equal to",
                message: message
            });
            return false;
        }
    };
    valid.Diff = Diff;
    valid.Assert = Assert;
    /*! src/fix/suffix.js */
    Mock.Util = Util;
    Mock.heredoc = Util.heredoc;
    Mock.extend = Util.extend;
    Mock.Random = Random;
    Mock.Handle = Handle;
    Mock.MockXMLHttpRequest = MockXMLHttpRequest;
    Mock.RegExpParser = parser;
    Mock.RegExpHandler = RegExpHandler;
    Mock.toJSONSchema = toJSONSchema;
    Mock.valid = valid;
    return Mock;
});