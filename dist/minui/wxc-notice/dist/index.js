Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        scroll: {
            type: Boolean,
            value: !1
        },
        isShow: {
            type: Boolean,
            value: !0
        },
        notice: {
            type: String,
            value: ""
        },
        bgColor: {
            type: String,
            value: "#ff5777"
        },
        color: {
            type: String,
            value: "#fff"
        },
        showIcon: {
            type: Boolean,
            value: !1
        },
        iconColor: {
            type: String,
            value: "#fff"
        },
        close: {
            type: Boolean,
            value: !1
        },
        bgRgba: {
            type: String,
            value: "rgba(255, 85, 119, 0)"
        }
    },
    data: {},
    methods: {
        onDismissNotice: function(e) {
            this.setData({
                isShow: !1
            });
            var o = e.detail, t = {};
            this.triggerEvent("close", o, t);
        }
    }
});