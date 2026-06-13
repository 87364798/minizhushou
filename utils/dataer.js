var e = require("parse.js");

module.exports.getGoldPrice = function(r) {
    var o = e.Object.extend("goldPrice");
    new e.Query(o).find({
        success: function(e) {
            if (e && e.length > 0) {
                void 0 !== r && r(), wx.setStorageSync("goldPrice", e[0]);
            } else {
                console.log("dataer.js: goldPrice 查询结果为空");
            }
        },
        error: function(e, o) {
            console.log("dataer.js: goldPrice (18) query object fail: " + o.message);
            if (void 0 !== r) {
                r(null, o);
            }
        }
    });
};