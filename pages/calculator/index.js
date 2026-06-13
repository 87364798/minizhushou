function d(d, a, t) {
    return a in d ? Object.defineProperty(d, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : d[a] = t, d;
}

var a = function(d) {
    return d && d.__esModule ? d : {
        default: d
    };
}(require("../../dist/vant/toast/toast")), t = require("../../utils/tool.js"), e = require("../../utils/dataer.js");

getApp();

Page({
    _gold: {
        sum: 0,
        laborCost: 0,
        goldValue: ""
    },
    _diamond0: {
        show: !1,
        sum: 0,
        diamondValue: ""
    },
    _diamond1: {
        show: !1,
        sum: 0,
        diamondValue: ""
    },
    _add: {
        show: !1,
        sum: 0,
        addValue: ""
    },
    data: {
        Au9999: "0",
        Au750: "0",
        date: "0-0-0",
        name: "",
        sumMary: {
            sumMoney: "",
            str: ""
        },
        footer: [ {
            name: "金",
            checked: !0,
            disabled: !1
        }, {
            name: "主石",
            checked: !1,
            disabled: !0
        }, {
            name: "副石",
            checked: !1,
            disabled: !0
        }, {
            name: "附加",
            checked: !1,
            disabled: !0
        }, {
            name: "总价",
            checked: !0,
            disabled: !1
        } ]
    },
    bindInputName: function(d) {
        this.data.name = d.detail.value;
    },
    bindgoldSum: function(d) {
        this._gold = d.detail, this.sum();
    },
    bindDiamondSum0: function(a) {
        var t;
        this._diamond0 = a.detail;
        this.setData((t = {}, d(t, "footer[1].checked", this._diamond0.show), d(t, "footer[1].disabled", !this._diamond0.show), 
        t)), this.sum();
    },
    bindDiamondSum1: function(a) {
        var t;
        this._diamond1 = a.detail;
        this.setData((t = {}, d(t, "footer[2].checked", this._diamond1.show), d(t, "footer[2].disabled", !this._diamond1.show), 
        t)), this.sum();
    },
    bindaddSum: function(a) {
        var t;
        this._add = a.detail;
        this.setData((t = {}, d(t, "footer[3].checked", this._add.show), d(t, "footer[3].disabled", !this._add.show), 
        t)), this.sum();
    },
    sum: function() {
        this.data.footer;
        var d = this._gold.sum, a = "工费：" + this._gold.laborCost + " \n ";
        a = a + "金总价：" + (this._gold.sum - this._gold.laborCost).toFixed(0) + " \n ", this._diamond0.show && (d += this._diamond0.sum, 
        a = (a = a + "主石价：" + (this._diamond0.sum - this._diamond0.wage).toFixed(0) + " \n ") + "主镶工：" + this._diamond0.wage + " \n "), 
        this._diamond1.show && (d += this._diamond1.sum, a = (a = a + "副石价：" + (this._diamond1.sum - this._diamond1.wage).toFixed(0) + " \n ") + "副镶工：" + this._diamond1.wage + " \n "), 
        this._add.show && (d += this._add.sum, a = a + this._add.addValue + " \n ");
        var t = this.data.sumMary;
        t.sumMoney = d.toFixed(0), t.str = a, this.setData({
            sumMary: t
        });
    },
    bindCheckCopy: function(d) {
        for (var a = d.detail.value, t = this.data.footer, e = 0; e < t.length; e++) {
            t[e].checked = !1;
            for (var i = 0; i < a.length; i++) if (e == a[i]) {
                t[e].checked = !0;
                break;
            }
        }
        this.data.footer = t;
    },
    copyData: function() {
        var d = this.data.footer, t = this.data.date + " \n 品名：" + this.data.name + " \n \n ";
        d[0].checked && (t = t + this._gold.goldValue + " \n \n "), d[1].checked && (t = t + this._diamond0.diamondValue + " \n \n "), 
        d[2].checked && (t = t + this._diamond1.diamondValue + " \n \n "), d[3].checked && (t = t + this._add.addValue + " \n "), 
        d[4].checked && (t = (t = t + "以下为各项合计 \n " + this.data.sumMary.str) + "造价：" + this.data.sumMary.sumMoney + "元"), 
        wx.setClipboardData({
            data: t,
            success: function(d) {
                wx.hideToast(), a.default.success("复制成功");
            },
            fail: function(d) {
                wx.hideToast(), a.default.fail("复制失败");
            }
        });
    },
    onLoad: function(d) {
        var a = this;
        e.getGoldPrice(function() {
            a.updateGoldPrice();
        });
    },
    onReady: function() {
        this.updateGoldPrice();
    },
    updateGoldPrice: function() {
        var d = wx.getStorageSync("goldPrice");
        if (d && d.AU9999) {
            this.setData({
                Au9999: d.AU9999,
                Au750: (.75 * d.AU9999).toFixed(2),
                date: t.getDate()
            });
        }
    }
});