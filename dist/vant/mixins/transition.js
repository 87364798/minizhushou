Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.transition = void 0;

var e = require("../common/utils"), t = function(e) {
    return {
        enter: "van-" + e + "-enter van-" + e + "-enter-active enter-class enter-active-class",
        "enter-to": "van-" + e + "-enter-to van-" + e + "-enter-active enter-to-class enter-active-class",
        leave: "van-" + e + "-leave van-" + e + "-leave-active leave-class leave-active-class",
        "leave-to": "van-" + e + "-leave-to van-" + e + "-leave-active leave-to-class leave-active-class"
    };
}, s = function(e) {
    return setTimeout(e, 1e3 / 60);
};

exports.transition = function(a) {
    return Behavior({
        properties: {
            customStyle: String,
            show: {
                type: Boolean,
                value: a,
                observer: "observeShow"
            },
            duration: {
                type: [ Number, Object ],
                value: 300,
                observer: "observeDuration"
            },
            name: {
                type: String,
                value: "fade",
                observer: "updateClasses"
            }
        },
        data: {
            type: "",
            inited: !1,
            display: !1,
            classNames: t("fade")
        },
        attached: function() {
            this.data.show && this.show();
        },
        methods: {
            observeShow: function(e) {
                e ? this.show() : this.leave();
            },
            updateClasses: function(e) {
                this.set({
                    classNames: t(e)
                });
            },
            show: function() {
                var t = this, a = this.data, n = a.classNames, i = a.duration;
                this.set({
                    inited: !0,
                    display: !0,
                    classes: n.enter,
                    currentDuration: (0, e.isObj)(i) ? i.enter : i
                }).then(function() {
                    s(function() {
                        t.set({
                            classes: n["enter-to"]
                        });
                    });
                });
            },
            leave: function() {
                var t = this, a = this.data, n = a.classNames, i = a.duration;
                this.set({
                    classes: n.leave,
                    currentDuration: (0, e.isObj)(i) ? i.leave : i
                }).then(function() {
                    s(function() {
                        t.set({
                            classes: n["leave-to"]
                        });
                    });
                });
            },
            onTransitionEnd: function() {
                this.data.show || this.set({
                    display: !1
                });
            }
        }
    });
};