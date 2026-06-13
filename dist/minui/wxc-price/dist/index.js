function t(t, e, a) {
    if (!t || !e) return !1;
    if (a = a || "f", t = parseFloat(t, 10), e = parseInt(e, 10), "f" === a) {
        var i = t.toString().split(".")[0], r = t.toString().split(".")[1] || "00";
        return r.length < 2 && (r += "0"), i + "." + r.substring(0, e);
    }
    return t.toFixed(e);
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        symbol: {
            type: String,
            value: "￥"
        },
        value: {
            type: [ Number, String ],
            value: ""
        },
        icon: {
            type: [ String ],
            value: ""
        },
        status: {
            type: String,
            value: ""
        },
        delColor: {
            type: String,
            value: "#999"
        },
        decimal: {
            type: String,
            value: "2"
        },
        decimalNum: {
            type: [ Number, String ],
            value: ""
        }
    },
    data: {},
    methods: {},
    attached: function() {
        if (this.data.value) {
            var e = this.data.value;
            switch (this.data.decimal) {
              case "1":
                e = t(this.data.value, 1);
                break;

              case "none":
                e = parseInt(this.data.value);
                break;

              case "small":
                e = parseInt(this.data.value).toString().trim(), this.setData({
                    decimalNum: (this.data.value.toString().split(".")[1] || "00").trim()
                });
                break;

              default:
                e = t(this.data.value, 2);
            }
            this.setData({
                value: e
            });
        }
    }
});