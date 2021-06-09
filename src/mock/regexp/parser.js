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
            return new Quantifier(n, 1/0);
        }, Bl = function(n) {
            return new Quantifier(n, n);
        }, jl = "+", $l = '"+"', ql = function() {
            return new Quantifier(1, 1/0);
        }, Ll = "*", Ml = '"*"', Dl = function() {
            return new Quantifier(0, 1/0);
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

module.exports = parser