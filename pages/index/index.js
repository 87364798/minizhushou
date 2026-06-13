getApp();

var t = require("../../utils/parse.js");

Page({
    data: {
        imgUrls: [ {
            imgUrl: "https://lg-9fe5hcjm-1255987146.cos.ap-shanghai.myqcloud.com/zssx.jpg",
            navUrl: "../web/index?url=https://www.jewelrytool.cn"
        } ],
        indicatorDots: !1,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        grids: [ {
            imgUrl: "../../images/calculator.png",
            title: "报价计算",
            navUrl: "../calculator/index"
        }, {
            imgUrl: "../../images/transformation.png",
            title: "手寸转换",
            navUrl: "../transformation/index"
        }, {
            imgUrl: "../../images/gratuity.png",
            title: "赞赏",
            navUrl: "../gratuity/index"
        }, {
            imgUrl: "../../images/around.png",
            title: "围钻预算",
            navUrl: "../aroundDiamonds/index"
        } ]
    },
    bindNavigatorToTools: function(t) {
        var navurl = t.currentTarget.dataset.navurl;
        if (navurl && navurl !== "") {
            wx.navigateTo({
                url: navurl
            });
        }
    },
    onLoad: function() {
        var a = this, i = t.Object.extend("setting"), r = new t.Query(i);
        r.equalTo("key", "index"), r.find({
            success: function(t) {
                if (t && t.length > 0) {
                    var i = t[0].get("value");
                    if (i) {
                        a.setData({
                            imgUrls: i.imgUrls || a.data.imgUrls,
                            indicatorDots: i.indicatorDots !== undefined ? i.indicatorDots : a.data.indicatorDots,
                            autoplay: i.autoplay !== undefined ? i.autoplay : a.data.autoplay,
                            duration: i.duration || a.data.duration,
                            grids: i.grids || a.data.grids
                        });
                    }
                }
            },
            error: function(t, a) {
                console.log("index.js: setting: query object fail: " + a.message);
            }
        });
    }
});