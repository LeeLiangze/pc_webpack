define(["jquery"], function () {
    var e;
    if ("undefined" != typeof requireConfig && requireConfig.paths && requireConfig.paths.event) {
        require(["event"], function (o) {
            e = o.ajaxCallback
        })
    }
    var o = function (o, t, a, f, p, r) {
        var i = "html" == f;
        $.ajax({
            url: o,
            type: t,
            data: a,
            cache: i,
            dataType: f,
            async: !r,
            timeout: n.TIME_OUT,
            beforeSend: function (e) {
                e.overrideMimeType("text/plain; charset=utf-8")
            },
            success: function (o) {
                if (o) {
                    if ("html" == f)return void p(o, !0);
                    if ("function" == typeof e && e(o, !1), p && o) {
                        var t = o.returnCode == n.reqCode.SUCC;
                        p(o || {}, t)
                    }
                }
            },
            error: function (o) {
                var t = {};
                t.returnCode = "404", t.returnMessage = "网络异常或超时，请稍候再试！", "function" == typeof e && e(t, !1), p(t, !1)
            },
            complete: function () {
            }
        })
    }, t = function (o, t, a, f, p) {
        return o && "" !== o ? f && "" !== f ? (a && "" !== a || console.log("warn! your passed null or empty to cmd param, are you suer?"), void $.ajax({
            url: o,
            type: t,
            data: a,
            jsonpCallback: "jsonCallback",
            contentType: "application/json",
            dataType: "jsonp",
            async: !p,
            timeout: n.TIME_OUT,
            beforeSend: function (e) {
                e.overrideMimeType("text/plain; charset=utf-8")
            },
            success: function (o) {
                if (o && ("function" == typeof e && e(o, !1), f && o)) {
                    var t = o.returnCode == n.reqCode.SUCC;
                    f(o || {}, t)
                }
            },
            error: function () {
                var o = {};
                o.returnCode = "404", o.returnMessage = "网络异常或超时，请稍候再试！", "function" == typeof e && e(o, !1), f(o, !1)
            },
            complete: function () {
            }
        })) : (console.log("you missed callback, it must be a function"), !1) : (console.log("the url of param cann't equals null or empty of string"), !1)
    }, n = {
        reqCode: {SUCC: 0},
        dataType: {HTML: "html", JSON: "json", TEXT: "text"},
        TIME_OUT: 6e4,
        SHOW_SUCC_INFO: !1,
        SHOW_ERROR_INFO: !1
    }, a = {
        getJson: function (e, t, a, f) {
            f && "boolean" == typeof f ? f = f : a ? "function" == typeof a ? a = a : "boolean" == typeof a && (f = a, a = "") : t ? "object" == typeof t || "string" == typeof t ? t = t : "function" == typeof t ? (a = t, t = "") : "boolean" == typeof t && (f = t, t = "", a = "") : (t = "", a = "", f = ""), f ? o(e, "GET", t, n.dataType.JSON, a, !0) : o(e, "GET", t, n.dataType.JSON, a)
        }, postJson: function (e, t, a, f) {
            f && "boolean" == typeof f ? f = f : a ? "function" == typeof a ? a = a : "boolean" == typeof a && (f = a, a = "") : t ? "object" == typeof t || "string" == typeof t ? t = t : "function" == typeof t ? (a = t, t = "") : "boolean" == typeof t && (f = t, t = "", a = "") : (t = "", a = "", f = ""), f ? o(e, "POST", t, n.dataType.JSON, a, !0) : o(e, "POST", t, n.dataType.JSON, a)
        }, putJson: function (e, t, a, f) {
            f && "boolean" == typeof f ? f = f : a ? "function" == typeof a ? a = a : "boolean" == typeof a && (f = a, a = "") : t ? "object" == typeof t || "string" == typeof t ? t = t : "function" == typeof t ? (a = t, t = "") : "boolean" == typeof t && (f = t, t = "", a = "") : (t = "", a = "", f = ""), f ? o(e, "PUT", t, n.dataType.JSON, a, !0) : o(e, "PUT", t, n.dataType.JSON, a)
        }, deleteJson: function (e, t, a, f) {
            f && "boolean" == typeof f ? f = f : a ? "function" == typeof a ? a = a : "boolean" == typeof a && (f = a, a = "") : t ? "object" == typeof t || "string" == typeof t ? t = t : "function" == typeof t ? (a = t, t = "") : "boolean" == typeof t && (f = t, t = "", a = "") : (t = "", a = "", f = ""), f ? o(e, "DELETE", t, n.dataType.JSON, a, !0) : o(e, "DELETE", t, n.dataType.JSON, a)
        }, getJsonp: function (e, o, n, a) {
            t(e, "GET", o, n, a)
        }, ajax: function (e) {
            var o = $.extend({
                type: "post", dataType: "json", timeout: 3e4, beforeSend: function (e) {
                    e.overrideMimeType("text/plain; charset=utf-8")
                }
            }, e);
            $.ajax(o)
        }
    };
    return a
});