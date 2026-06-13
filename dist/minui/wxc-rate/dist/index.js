Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        value: {
            type: Number,
            value: 0
        },
        count: {
            type: Number,
            value: 5
        },
        size: {
            type: [ String, Number ],
            value: 44
        },
        color: {
            type: String,
            value: "#e5e5e5"
        },
        activeColor: {
            type: String,
            value: "#fdb757"
        },
        readonly: {
            type: Boolean,
            value: !1
        },
        padding: {
            type: Number,
            value: 20
        }
    },
    data: {},
    methods: {
        handlerRate: function(e) {
            if (!this.data.readonly) {
                var t = e.target.dataset.score;
                if (t) {
                    this.setData({
                        value: t
                    });
                    var a = e.detail;
                    a.value = t;
                    var r = {};
                    this.triggerEvent("rate", a, r);
                }
            }
        }
    }
});