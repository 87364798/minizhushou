function e(e, r, n) {
    return r in e ? Object.defineProperty(e, r, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = n, e;
}

function r() {
    i = wx.getStorageSync("ringSizeView");
    o = wx.getStorageSync("ringSize");
    
    if (!i || !o || i.length === 0 || o.length === 0) {
        console.log("数据未加载，请检查本地存储");
        return false;
    }

    for (var e = 0; e < o.length; e++) {
        c[o[e].index] = o[e].circumference;
        s[o[e].index] = o[e].diameter;
    }
    return true;
}

function n(e) {
    var r;
    r = e ? "数据加载失败，请检查网络后重新进入" : "数据更新失败，转换时可能会出现错误", wx.showModal({
        content: r,
        showCancel: !1,
        success: function(r) {
            r.confirm && (console.log("用户点击确定"), e && wx.navigateBack({
                delta: 1
            }));
        }
    });
}

function t(r, n, t, a) {
    if (!o || o.length === 0) {
        console.log("t: 数据未初始化");
        return;
    }
    if (-1 !== n && n < o.length) l = o[n]; else var l = o[0];
    if (!i || i.length === 0) {
        console.log("t: 视图数据未初始化");
        return;
    }
    for (var c = 0; c < i.length; c++) {
        var s = "grids[" + c + "].size", u = i[c].type;
        if (c == t) l[u] = a; else if (-1 === n) if (0 == t && 1 == c) {
            g = parseFloat(a);
            l[u] = (g / 3.14).toFixed(2);
        } else if (1 == t && 0 == c) {
            var g = parseFloat(a);
            l[u] = (3.14 * g).toFixed(2);
        } else l[u] = "—";
        r.setData(e({}, s, l[u]));
    }
}

var a, i, o, l = require("../../utils/tool.js"), c = new Array(), s = new Array();

module.exports.queryFindAll = function(e, r) {
    wx.getNetworkType({
        success: function(r) {
            var t = r.networkType;
            "none" === t | "unknown" === t && n(e);
        }
    });
}, module.exports.setViewData = function() {
    if (!r()) {
        console.log("setViewData: 数据加载失败");
        return false;
    }
    for (var e = new Array(), n = 0; n < i.length; n++) {
        var t = i[n];
        t.flag, e[t.sort] = t;
    }
    i = e, a.setData({
        grids: e
    });
    return true;
}, module.exports.pickerTransformation = function(e, r) {
    (!i || i.length === 0) && (i = wx.getStorageSync("ringSizeView"));
    if (!i || i.length === 0) {
        wx.showToast({ title: "数据加载中，请稍后", icon: "none" });
        return;
    }
    var n = r.currentTarget.id, a = new Array();
    a = r.detail.value;
    var l, c = 0;
    l = i[n];
    if (!l) {
        console.log("pickerTransformation: 无效的索引");
        return;
    }
    (!o || o.length === 0) && (o = wx.getStorageSync("ringSize"));
    var s = 1;
    if (l.multiArray && l.multiArray.length > 1) s = l.multiArray[1].length;
    c = a.length > 1 ? a[0] * s + a[1] : a[0];
    if (!l.indexes || c >= l.indexes.length) {
        console.log("pickerTransformation: 索引越界");
        return;
    }
    t(e, l.indexes[c], -1);
}, module.exports.init = function(e) {
    a = e;
}, module.exports.inputTransformation = function(e, r) {
    var n = r.detail.value, a = parseFloat(n);
    if (!isNaN(a)) {
        if (!c || c.length === 0 || !s || s.length === 0) {
            // 尝试重新加载数据
            var d = wx.getStorageSync("ringSize");
            if (d && d.length > 0) {
                for (var h = 0; h < d.length; h++) {
                    c[d[h].index] = d[h].circumference;
                    s[d[h].index] = d[h].diameter;
                }
            } else {
                wx.showToast({ title: "数据加载中，请稍后", icon: "none" });
                return;
            }
        }
        var i = r.currentTarget.id, o = -1;
        0 == i ? a > c[0] && a < c[c.length - 1] && (o = l.BinarySearch(c, a)) : 1 == i && a > s[0] && a < s[s.length - 1] && (o = l.BinarySearch(s, a)), 
        t(e, o, i, n);
    }
};