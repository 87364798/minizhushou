// 首页 - 功能导航入口
Page({
    data: {
        imgUrls: [
            { imgUrl: "https://placehold.co/1200x400/FF8A3D/ffffff?text=珠宝小助手" }
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        grids: [
            { imgUrl: "../../images/calculator.png", title: "报价计算", navUrl: "../calculator/index" },
            { imgUrl: "../../images/transformation.png", title: "手寸转换", navUrl: "../transformation/index" },
            { imgUrl: "../../images/gratuity.png", title: "赞赏", navUrl: "../gratuity/index" },
            { imgUrl: "../../images/around.png", title: "围钻预算", navUrl: "../aroundDiamonds/index" }
        ]
    },

    bindNavigatorToTools: function (e) {
        var navurl = e.currentTarget.dataset.navurl;
        if (!navurl) return;
        wx.navigateTo({
            url: navurl,
            fail: function () {
                wx.showToast({ title: "页面无法打开", icon: "none" });
            }
        });
    },

    onLoad: function () {
        // 尝试从远程 Parse 服务器拉取自定义配置（静默失败）
        try {
            var parse = require("../../utils/parse.js");
            if (parse && parse.Object && parse.Query) {
                var Setting = parse.Object.extend("setting");
                var query = new parse.Query(Setting);
                query.equalTo("key", "index");
                query.find({
                    success: function (results) {
                        if (results && results.length > 0) {
                            var val = results[0].get("value");
                            if (val) {
                                // 只更新非空字段，保持默认值兜底
                            }
                        }
                    },
                    error: function () {
                        // 静默失败，不影响用户使用
                    }
                });
            }
        } catch (err) {
            // 无 parse.js，使用默认配置即可
        }
    }
});
