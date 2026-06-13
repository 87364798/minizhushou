Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    _timer: null,
    behaviors: [],
    properties: {
        isShow: {
            type: Boolean,
            value: !1,
            observer: function(e) {
                if (e) {
                    getApp().globalData || Object.assign(getApp(), {
                        globalData: {}
                    });
                    var t = getApp().globalData, i = (t._zIndex || 1e3) + 1;
                    t._zIndex = i, this.setData({
                        zIndex: i
                    });
                }
            }
        },
        type: {
            type: String,
            value: "mgj"
        },
        image: {
            type: String,
            value: ""
        },
        slip: {
            type: String,
            value: ""
        }
    },
    data: {
        zIndex: 1e3
    },
    methods: {
        show: function() {
            var e = this;
            this._timer && clearTimeout(this._timer), this._timer = setTimeout(function() {
                e._timer = null, e.setData({
                    isShow: !0
                });
            }, 500);
        },
        hide: function() {
            this._timer && (clearTimeout(this._timer), this._timer = null), this.setData({
                isShow: !1
            });
        }
    }
});