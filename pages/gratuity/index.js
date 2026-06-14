// 赞赏页面 - 简化版，不再依赖远程 Parse 服务器
Page({
    data: {
        logo: "../../images/logo.png",
        title: "珠宝小助手",
        prices: [1, 5, 18, 48, 98, 188],
        selected: 0,
        iputValue: ""
    },

    bindInput: function (e) {
        var v = parseFloat(e.detail.value);
        if (isNaN(v)) v = 0;
        this.setData({ selected: 0, iputValue: e.detail.value, _inputAmount: v });
    },

    selectItem: function (e) {
        var item = Number(e.currentTarget.dataset.item);
        this.setData({ selected: item, iputValue: String(item), _inputAmount: item });
    },

    bindGratuity: function () {
        var amount = this.data._inputAmount || 0;
        if (amount <= 0) {
            wx.showToast({ title: "请选择或输入金额", icon: "none" });
            return;
        }
        // 微信支付需要后端配合申请商户号，此处只做本地提示
        wx.showModal({
            title: "感谢支持",
            content: "感谢您愿意支持我们，打赏 " + amount + " 元！\n\n（实际支付需接入微信商户号）",
            confirmText: "好的",
            showCancel: false
        });
    }
});
