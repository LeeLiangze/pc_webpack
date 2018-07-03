define(function () {
    var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", t = function () {
        return e()
    }, e = function () {
        return {
            encode: function (t) {
                var e, o, a, c, h, C, d, f = "", i = 0;
                for (t = n(t); i < t.length;)e = t.charCodeAt(i++), o = t.charCodeAt(i++), a = t.charCodeAt(i++), c = e >> 2, h = (3 & e) << 4 | o >> 4, C = (15 & o) << 2 | a >> 6, d = 63 & a, isNaN(o) ? C = d = 64 : isNaN(a) && (d = 64), f = f + r.charAt(c) + r.charAt(h) + r.charAt(C) + r.charAt(d);
                return f
            }, decode: function (t) {
                var e, n, a, c, h, C, d, f = "", i = 0;
                for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); i < t.length;)c = r.indexOf(t.charAt(i++)), h = r.indexOf(t.charAt(i++)), C = r.indexOf(t.charAt(i++)), d = r.indexOf(t.charAt(i++)), e = c << 2 | h >> 4, n = (15 & h) << 4 | C >> 2, a = (3 & C) << 6 | d, f += String.fromCharCode(e), 64 != C && (f += String.fromCharCode(n)), 64 != d && (f += String.fromCharCode(a));
                return f = o(f)
            }
        }
    }, n = function (r) {
        r = r.replace(/\r\n/g, "\n");
        for (var t = "", e = 0; e < r.length; e++) {
            var n = r.charCodeAt(e);
            n < 128 ? t += String.fromCharCode(n) : n > 127 && n < 2048 ? (t += String.fromCharCode(n >> 6 | 192), t += String.fromCharCode(63 & n | 128)) : (t += String.fromCharCode(n >> 12 | 224), t += String.fromCharCode(n >> 6 & 63 | 128), t += String.fromCharCode(63 & n | 128))
        }
        return t
    }, o = function (r) {
        for (var t = "", e = 0, n = c1 = c2 = 0; e < r.length;)n = r.charCodeAt(e), n < 128 ? (t += String.fromCharCode(n), e++) : n > 191 && n < 224 ? (c2 = r.charCodeAt(e + 1), t += String.fromCharCode((31 & n) << 6 | 63 & c2), e += 2) : (c2 = r.charCodeAt(e + 1), c3 = r.charCodeAt(e + 2), t += String.fromCharCode((15 & n) << 12 | (63 & c2) << 6 | 63 & c3), e += 3);
        return t
    };
    return t
});