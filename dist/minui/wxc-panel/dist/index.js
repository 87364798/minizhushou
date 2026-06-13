Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        title: {
            type: String,
            value: ""
        },
        margin: {
            type: Boolean,
            value: !0
        },
        border: {
            type: Boolean,
            value: !0
        }
    },
    data: {},
    methods: {
        onClick: function(e) {
            var t = e.detail, o = {};
            this.triggerEvent("click", t, o);
        }
    }
});