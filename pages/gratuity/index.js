var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = require("../../utils/parse.js"), n = 0;

Page({
    data: {
        logo: "../../images/logo.png",
        title: "珠宝小助手",
        prices: [ 1, 5, 18, 48, 98, 188 ]
    },
    bindInput: function(t) {
        this.setData({
            selected: ""
        }), n = Number(t.detail.value);
    },
    bindGratuity: function() {
        this.pay();
    },
    selectItem: function(t) {
        var e = t.currentTarget.dataset.item;
        n = e, this.setData({
            selected: e,
            iputValue: e
        });
    },
    pay: function() {
        if (n <= 0) {
            wx.showToast({ title: "请选择或输入金额", icon: "none" });
            return;
        }
        var o = e.User.current();
        if (o) {
            var a = {
                openid: o.get("wxapp0penId"),
                body: "赞赏珠宝小助手",
                total_fee: 100 * n
            };
            e.Cloud.run("wxPay", a).then(function(e) {
                var n = {}, o = e;
                if ("object" != (void 0 === (o = o.replace(" ", "")) ? "undefined" : t(o)) && (o = o.replace(/\ufeff/g, ""), 
                n = JSON.parse(o)), "100" == n.status) {
                    var a = n;
                    wx.requestPayment({
                        timeStamp: a.timestamp,
                        nonceStr: a.nonceStr,
                        package: a.package,
                        signType: "MD5",
                        paySign: a.paySign,
                        success: function(t) {
                            wx.showToast({
                                title: "支付成功",
                                icon: "success",
                                duration: 2e3
                            });
                        },
                        fail: function(t) {
                            console.log("支付失败");
                        }
                    });
                } else {
                    wx.showToast({ title: "支付请求失败", icon: "none" });
                }
            }, function(t) {
                wx.showToast({ title: "发送失败(" + t + ")", icon: "none" });
            });
        } else {
            wx.showToast({ title: "请先登录", icon: "none" });
        }
    }
});