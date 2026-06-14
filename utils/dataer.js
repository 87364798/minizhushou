// 本地默认金价（单位：元/克），当无法从服务器获取时使用
var DEFAULT_GOLD_PRICE = 720;

/**
 * 获取金价
 * 优先级：本地缓存 > 远程服务器 > 本地默认值
 * @param {Function} callback 回调函数（可选），无论是否联网都会执行
 */
module.exports.getGoldPrice = function (callback) {
    // 首先尝试读取本地缓存
    var cached = null;
    try {
        cached = wx.getStorageSync("goldPrice");
    } catch (e) {
        cached = null;
    }

    // 如果本地没有缓存，设置默认值
    if (!cached || !cached.AU9999) {
        cached = { AU9999: DEFAULT_GOLD_PRICE };
        try {
            wx.setStorageSync("goldPrice", cached);
        } catch (e) {}
    }

    // 有回调就先回调（使用已有/默认值），让页面立即显示
    if (typeof callback === "function") {
        callback(cached);
    }

    // 尝试从远程更新（静默失败，不影响页面显示）
    try {
        var parse = require("parse.js");
        if (parse && parse.Object && parse.Query) {
            var GoldPrice = parse.Object.extend("goldPrice");
            new parse.Query(GoldPrice).find({
                success: function (results) {
                    if (results && results.length > 0) {
                        var latest = results[0];
                        // 兼容两种获取方式
                        var auValue = typeof latest.get === "function"
                            ? latest.get("AU9999")
                            : latest.AU9999;
                        if (auValue && !isNaN(Number(auValue))) {
                            var newData = { AU9999: Number(auValue) };
                            try {
                                wx.setStorageSync("goldPrice", newData);
                            } catch (e) {}
                            if (typeof callback === "function") {
                                callback(newData);
                            }
                        }
                    }
                },
                error: function () {
                    // 服务器查询失败，静默使用本地值，不打扰用户
                }
            });
        }
    } catch (e) {
        // 无 parse.js 或运行异常，静默使用本地值
    }
};
