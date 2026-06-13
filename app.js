require("utils/init.js").Data();

var n = require("utils/parse.js");

App({
    onLaunch: function() {
        this.upData(), this.login();
    },
    upData: function() {
        var n = wx.getUpdateManager();
        n.onCheckForUpdate(function(n) {}), n.onUpdateReady(function() {
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，请重启应用！",
                showCancel: !1,
                success: function(o) {
                    o.confirm && (wx.clearStorage(), n.applyUpdate());
                }
            });
        });
    },
    signUpOrlogIn: function(o, t, e) {
        n.Cloud.run(o, t).then(function(o) {
            if (o) {
                console.log("登录成功");
                n.User.become(o).then(function(n) {}, function(n) {});
            } else e();
        }, function(n) {
            console.log(n), console.log("登录失败");
        });
    },
    login: function() {
        var o = this;
        n.User.current() || (wx.clearStorage(), wx.login({
            success: function(n) {
                var t = {
                    _code: n.code
                };
                o.signUpOrlogIn("signUpOrLogin2", t, function() {});
            }
        }));
    }
});