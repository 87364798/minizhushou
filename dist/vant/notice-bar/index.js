var t = function() {
    function t(t, i) {
        var e = [], n = !0, r = !1, a = void 0;
        try {
            for (var o, l = t[Symbol.iterator](); !(n = (o = l.next()).done) && (e.push(o.value), 
            !i || e.length !== i); n = !0) ;
        } catch (t) {
            r = !0, a = t;
        } finally {
            try {
                !n && l.return && l.return();
            } finally {
                if (r) throw a;
            }
        }
        return e;
    }
    return function(i, e) {
        if (Array.isArray(i)) return i;
        if (Symbol.iterator in Object(i)) return t(i, e);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}();

(0, require("../common/component").VantComponent)({
    props: {
        text: {
            type: String,
            value: ""
        },
        mode: {
            type: String,
            value: ""
        },
        url: {
            type: String,
            value: ""
        },
        openType: {
            type: String,
            value: "navigate"
        },
        delay: {
            type: Number,
            value: 0
        },
        speed: {
            type: Number,
            value: 50
        },
        scrollable: {
            type: Boolean,
            value: !0
        },
        leftIcon: {
            type: String,
            value: ""
        },
        color: {
            type: String,
            value: "#ed6a0c"
        },
        backgroundColor: {
            type: String,
            value: "#fffbe8"
        }
    },
    data: {
        show: !0,
        hasRightIcon: !1
    },
    watch: {
        text: function() {
            this.set({}, this.init);
        }
    },
    created: function() {
        this.data.mode && this.set({
            hasRightIcon: !0
        }), this.resetAnimation = wx.createAnimation({
            duration: 0,
            timingFunction: "linear"
        });
    },
    destroyed: function() {
        this.timer && clearTimeout(this.timer);
    },
    methods: {
        init: function() {
            var i = this;
            Promise.all([ this.getRect(".van-notice-bar__content"), this.getRect(".van-notice-bar__content-wrap") ]).then(function(e) {
                var n = t(e, 2), r = n[0], a = n[1];
                if (null != r && null != a && r.width && a.width) {
                    var o = i.data, l = o.speed, s = o.scrollable, c = o.delay;
                    if (s && a.width < r.width) {
                        var u = r.width / l * 1e3;
                        i.wrapWidth = a.width, i.contentWidth = r.width, i.duration = u, i.animation = wx.createAnimation({
                            duration: u,
                            timingFunction: "linear",
                            delay: c
                        }), i.scroll();
                    }
                }
            });
        },
        scroll: function() {
            var t = this;
            this.timer && clearTimeout(this.timer), this.timer = null, this.set({
                animationData: this.resetAnimation.translateX(this.wrapWidth).step().export()
            }), setTimeout(function() {
                t.set({
                    animationData: t.animation.translateX(-t.contentWidth).step().export()
                });
            }, 20), this.timer = setTimeout(function() {
                t.scroll();
            }, this.duration);
        },
        onClickIcon: function() {
            this.timer && clearTimeout(this.timer), this.timer = null, this.set({
                show: !1
            });
        },
        onClick: function(t) {
            this.$emit("click", t);
        }
    }
});