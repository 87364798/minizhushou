// pages/transformation/index.js
// 手寸转换 —— 多制式（港度/欧度/美度/日度/直径/周长）互转
// 数据完全来自本地 ringSizeData.js，不依赖网络。

var i = require("./ringSize.js");

Page({
    data: {
        grids: [],         // 每一项：{ key, title, hint, unit, min, max, step, value }
        activeIndex: 0     // 当前正在编辑的输入项索引（用于视觉高亮，可选）
    },

    onLoad: function() {
        i.init(this);
        i.setViewData(this);
    },

    onShow: function() {
        // 每次回到页面时刷新一次，保证数据最新
        i.setViewData(this);
    },

    // 输入框变化
    bindKeyInput: function(e) {
        i.inputTransformation(this, e);
    },

    // 滑条拖动结束时触发
    bindSliderChange: function(e) {
        i.pickerTransformation(this, e);
    },

    // 滑条拖动中实时触发（更流畅的体验）
    bindSliderChanging: function(e) {
        i.pickerTransformation(this, e);
    }
});
