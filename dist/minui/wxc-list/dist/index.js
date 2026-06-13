Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        title: {
            type: String,
            value: ""
        },
        detail: {
            type: String,
            value: ""
        },
        desc: {
            type: String,
            value: ""
        },
        icon: {
            type: String,
            value: ""
        },
        iconColor: {
            type: String,
            value: "#ff5077"
        },
        src: {
            type: String,
            value: ""
        },
        dot: {
            type: Boolean,
            value: !1
        },
        dotColor: {
            type: String,
            value: "#f5123e"
        },
        arrow: {
            type: Boolean,
            value: !0
        },
        mode: {
            type: String,
            value: "normal"
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