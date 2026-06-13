Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        items: {
            type: Array,
            value: []
        },
        checked: {
            type: [ String, Number ],
            value: ""
        },
        color: {
            type: String,
            value: "#ff5777"
        }
    },
    data: {},
    methods: {
        radioChange: function(e) {
            this.setData({
                checked: e.detail.value
            });
            var t = e.detail || {}, a = {};
            this.triggerEvent("change", t, a);
        }
    }
});