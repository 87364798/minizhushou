var e = require("./parse.js");

e.initialize("zbxzs"), e.serverURL = "https://psdb.jewelrytool.cn/parse", function(n) {
    function i(e) {
        "" != c ? (e.get("app") > c.app && (wx.clearStorage(), t()), e.get("ringSize") > c.ringSize && o(), 
        e.get("ringSizeView") > c.ringSizeView && r(), e.get("diamondSize") > c.diamondSize && s()) : t(), 
        wx.setStorageSync("Versions", e);
    }
    function t() {
        console.log("upAllData"), o(), r(), s();
    }
    function o() {
        a("ringSize");
    }
    function r() {
        a("ringSizeView");
    }
    function s() {
        a("diamondSize");
    }
    function a(n) {
        var i = e.Object.extend(n), t = new e.Query(i);
        t.limit(1e3), t.find({
            success: function(e) {
                if (wx.setStorageSync(n, e), "ringSize" == n) {
                    for (var i = wx.getStorageSync("ringSize"), t = [], o = 0; o < i.length; o++) t[i[o].index] = i[o];
                    wx.setStorageSync(n, t);
                }
            },
            error: function(e) {
                console.log("init.js: queryFind: 查询失败 : " + e.code + " " + e.message);
            }
        });
    }
    var c = null, g = {};
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = g), 
    exports.Init = g) : n.Init = g, g.Data = function() {
        c = wx.getStorageSync("Versions");
        var n = e.Object.extend("Versions");
        new e.Query(n).find({
            success: function(e) {
                i(e[0]);
            },
            error: function(e, n) {
                console.log("init.js: Versions: Init.Data: query object fail: " + n.message);
                wx.getUpdateManager();
                wx.clearStorage();
                // 显示错误提示
                wx.showToast({
                    title: "数据加载失败，请重试",
                    icon: "none",
                    duration: 2000
                });
            }
        });
    };
}.call(void 0);