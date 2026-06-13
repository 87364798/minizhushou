var t = require("../../utils/parse.js"), i = require("ringSize.js");

Page({
    data: {
        grids: [],
        list: []
    },
    bindListClick: function(t) {
        var i = t.currentTarget.dataset.navurl;
        if (i) {
            wx.navigateTo({
                url: i
            });
        } else {
            console.log('导航路径无效');
        }
    },
    bindMultiPickerChange: function(t) {
        i.pickerTransformation(this, t);
    },
    bindKeyInput: function(t) {
        i.inputTransformation(this, t);
    },
    onLoad: function(n) {
        i.init(this);
        i.setViewData(); // 确保调用以填充数据
        var r = this,
            a = t.Object.extend("setting"),
            e = new t.Query(a);
        e.equalTo("key", "transformation"),
        e.find({
            success: function(t) {
                var i = t[0].get("array");
                if (i) {
                    r.setData({
                        list: i
                    });
                } else {
                    console.log("未找到转换数据");
                }
            },
            error: function(t, i) {
                console.log("transformation.js: transformation: query object fail");
                // 这里可以添加默认值或其他处理逻辑
            }
        });
    }
});