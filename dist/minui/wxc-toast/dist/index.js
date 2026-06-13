Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        isShow: {
            type: Boolean,
            value: !1,
            observer: function(t) {
                if (t) {
                    getApp().globalData || Object.assign(getApp(), {
                        globalData: {}
                    });
                    var e = getApp().globalData, i = (e._zIndex || 1e3) + 1;
                    e._zIndex = i, this.setData({
                        zIndex: i
                    });
                }
            }
        },
        text: {
            type: String,
            value: ""
        },
        icon: {
            type: String,
            value: ""
        },
        iconColor: {
            type: String,
            value: ""
        },
        src: {
            type: String,
            value: ""
        },
        duration: {
            type: Number,
            value: 2e3
        }
    },
    data: {
        zIndex: 1e3
    },
    methods: {
        show: function(t) {
            var e = this, i = this.data.text;
            t && "string" == typeof t && (i = t);
            var a = this.data.duration;
            clearTimeout(this._timer), this.setData({
                text: i,
                isShow: !0
            }), a > 0 && a !== 1 / 0 && (this._timer = setTimeout(function() {
                e.hide(), e.triggerEvent("success", {}, {});
            }, a));
        },
        hide: function() {
            this._timer = clearTimeout(this._timer), this.setData({
                isShow: !1
            });
        }
    }
});