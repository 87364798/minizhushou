// 珠宝报价计算主页面
var tool = require("../../utils/tool.js");
var dataer = require("../../utils/dataer.js");

Page({
    data: {
        Au9999: "720",
        Au750: "540",
        date: "0-0-0",
        name: "",
        sumMary: {
            sumMoney: "0",
            str: "等待输入..."
        },
        footer: [
            { name: "金", checked: true, disabled: false },
            { name: "主石", checked: false, disabled: true },
            { name: "副石", checked: false, disabled: true },
            { name: "附加", checked: false, disabled: true },
            { name: "总价", checked: true, disabled: false }
        ],
        _gold: {
            sum: 0,
            laborCost: 0,
            goldValue: ""
        },
        _diamond0: {
            show: false,
            sum: 0,
            diamondValue: "",
            wage: 0
        },
        _diamond1: {
            show: false,
            sum: 0,
            diamondValue: "",
            wage: 0
        },
        _add: {
            show: false,
            sum: 0,
            addValue: ""
        }
    },

    /**
     * 输入品名
     */
    bindInputName: function (e) {
        this.setData({ name: e.detail.value });
    },

    /**
     * 子组件（金）回调：金重/损耗/金价等输入改变
     */
    bindgoldSum: function (e) {
        this.data._gold = e.detail;
        this.sum();
    },

    /**
     * 子组件（主石）回调
     */
    bindDiamondSum0: function (e) {
        this.data._diamond0 = e.detail;
        var footer = this.data.footer;
        footer[1].checked = e.detail.show;
        footer[1].disabled = !e.detail.show;
        this.setData({ footer: footer });
        this.sum();
    },

    /**
     * 子组件（副石）回调
     */
    bindDiamondSum1: function (e) {
        this.data._diamond1 = e.detail;
        var footer = this.data.footer;
        footer[2].checked = e.detail.show;
        footer[2].disabled = !e.detail.show;
        this.setData({ footer: footer });
        this.sum();
    },

    /**
     * 子组件（附加）回调
     */
    bindaddSum: function (e) {
        this.data._add = e.detail;
        var footer = this.data.footer;
        footer[3].checked = e.detail.show;
        footer[3].disabled = !e.detail.show;
        this.setData({ footer: footer });
        this.sum();
    },

    /**
     * 汇总计算并更新页面显示
     */
    sum: function () {
        var gold = this.data._gold;
        var d0 = this.data._diamond0;
        var d1 = this.data._diamond1;
        var add = this.data._add;

        // 基础金额：金价小计
        var total = gold.sum || 0;

        // 组装汇总说明文字
        var lines = [];
        if (gold.goldValue) lines.push(gold.goldValue);
        if (d0.show && d0.diamondValue) lines.push(d0.diamondValue);
        if (d1.show && d1.diamondValue) lines.push(d1.diamondValue);
        if (add.show && add.addValue) lines.push(add.addValue);

        // 累加其他部分金额
        if (d0.show) total += d0.sum || 0;
        if (d1.show) total += d1.sum || 0;
        if (add.show) total += add.sum || 0;

        this.setData({
            sumMary: {
                sumMoney: total.toFixed(0),
                str: lines.length > 0 ? lines.join("\n") : "等待输入..."
            }
        });
    },

    /**
     * 勾选需要复制的项
     */
    bindCheckCopy: function (e) {
        var values = e.detail.value || [];
        var footer = this.data.footer;
        for (var i = 0; i < footer.length; i++) {
            if (footer[i].disabled) {
                // 禁用的保持原状态
                continue;
            }
            var checked = false;
            for (var j = 0; j < values.length; j++) {
                if (values[j] == i) {
                    checked = true;
                    break;
                }
            }
            footer[i].checked = checked;
        }
        this.setData({ footer: footer });
    },

    /**
     * 复制结果到剪贴板
     * - 只勾选"总价"时，复制「品名 + 总价金额
     * - 勾选了其他项时，复制完整明细
     */
    copyData: function () {
        var footer = this.data.footer;
        var gold = this.data._gold;
        var d0 = this.data._diamond0;
        var d1 = this.data._diamond1;
        var add = this.data._add;

        // 检查除"总价"外是否有其他勾选
        var hasOtherChecked =
            (footer[0].checked && gold.goldValue) ||
            (footer[1].checked && d0.show && d0.diamondValue) ||
            (footer[2].checked && d1.show && d1.diamondValue) ||
            (footer[3].checked && add.show && add.addValue);

        var text;

        if (footer[4].checked && !hasOtherChecked) {
            // 只勾选了总价 → 简洁版：品名 + 总价
            text = (this.data.name ? (this.data.name + "：") : "") + this.data.sumMary.sumMoney + "元";
        } else {
            // 有其他勾选，或总价未勾选 → 完整明细
            text = this.data.date + "\n品名：" + this.data.name + "\n\n";
            if (footer[0].checked && gold.goldValue) text += gold.goldValue + "\n\n";
            if (footer[1].checked && d0.show && d0.diamondValue) text += d0.diamondValue + "\n\n";
            if (footer[2].checked && d1.show && d1.diamondValue) text += d1.diamondValue + "\n\n";
            if (footer[3].checked && add.show && add.addValue) text += add.addValue + "\n";
            if (footer[4].checked) {
                text += "以下为各项合计\n" + this.data.sumMary.str + "\n造价：" + this.data.sumMary.sumMoney + "元";
            }
        }

        wx.setClipboardData({
            data: text,
            success: function () {
                wx.showToast({ title: "复制成功", icon: "success" });
            },
            fail: function () {
                wx.showToast({ title: "复制失败", icon: "none" });
            }
        });
    },

    onLoad: function () {
        this.updateGoldPrice();
        var that = this;
        dataer.getGoldPrice(function () {
            that.updateGoldPrice();
        });
    },

    onReady: function () {
        this.updateGoldPrice();
    },

    updateGoldPrice: function () {
        var goldPrice = null;
        try {
            goldPrice = wx.getStorageSync("goldPrice");
        } catch (e) {}

        var au9999 = 720;
        if (goldPrice && goldPrice.AU9999) {
            au9999 = Number(goldPrice.AU9999);
            if (isNaN(au9999) || au9999 <= 0) au9999 = 720;
        }

        this.setData({
            Au9999: au9999.toFixed(0),
            Au750: (0.75 * au9999).toFixed(0),
            date: tool.getDate()
        });

        // 同时把金价传给金组件（通过 event channel 无法直接传，
        // 这里通过全局方式让金组件在需要时自行读取 storage）
    }
});
