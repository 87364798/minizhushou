Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        showIcon: {
            type: Boolean,
            value: !0
        },
        iconColor: {
            type: String,
            value: "#bbb"
        },
        phColor: {
            type: String,
            value: "#bbb"
        },
        bgColor: {
            type: String,
            value: "#f6f6f6"
        },
        align: {
            type: String,
            value: "left"
        },
        color: {
            type: String,
            value: "#333"
        },
        radius: {
            type: [ Number, String ],
            value: 6
        },
        placeholder: {
            type: String,
            value: "搜索"
        },
        mode: {
            type: String,
            value: "normal"
        },
        showClear: {
            type: Boolean,
            value: !0
        },
        button: {
            type: String,
            value: ""
        },
        btnColor: {
            type: String,
            value: "#333"
        }
    },
    data: {
        _showClear: !1,
        value: ""
    },
    methods: {
        onInput: function(e) {
            var t = e.detail.value, a = t && this.data.showClear;
            this.setData({
                value: t,
                _showClear: a
            });
            var l = e.detail || {}, o = {};
            this.triggerEvent("input", l, o);
        },
        onConfirm: function(e) {
            var t = e.detail || {}, a = {};
            t.value = this.data.value, this.triggerEvent("confirm", t, a);
        },
        onSubmit: function(e) {
            var t = e.detail || {}, a = {};
            t.value = this.data.value, this.triggerEvent("submit", t, a);
        },
        onClear: function() {
            this.setData({
                value: "",
                _showClear: !1
            });
        }
    }
});