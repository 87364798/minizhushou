(0, require("../common/component").VantComponent)({
    field: !0,
    classes: [ "icon-class" ],
    props: {
        readonly: Boolean,
        disabled: Boolean,
        size: {
            type: Number,
            value: 20
        },
        icon: {
            type: String,
            value: "star"
        },
        voidIcon: {
            type: String,
            value: "star-o"
        },
        color: {
            type: String,
            value: "#ffd21e"
        },
        voidColor: {
            type: String,
            value: "#c7c7c7"
        },
        disabledColor: {
            type: String,
            value: "#bdbdbd"
        },
        count: {
            type: Number,
            value: 5
        },
        value: {
            type: Number,
            value: 0
        }
    },
    data: {
        innerValue: 0
    },
    watch: {
        value: function(e) {
            e !== this.data.innerValue && this.set({
                innerValue: e
            });
        }
    },
    computed: {
        list: function() {
            var e = this.data, t = e.count, n = e.innerValue;
            return Array.from({
                length: t
            }, function(e, t) {
                return t < n;
            });
        }
    },
    methods: {
        onSelect: function(e) {
            var t = this.data, n = e.currentTarget.dataset.index;
            t.disabled || t.readonly || (this.set({
                innerValue: n + 1
            }), this.$emit("input", n + 1), this.$emit("change", n + 1));
        },
        onTouchMove: function(e) {
            var t = this, n = e.touches[0], a = n.clientX, i = n.clientY;
            this.getRect(".van-rate__item", !0).then(function(n) {
                var o = n.find(function(e) {
                    return a >= e.left && a <= e.right && i >= e.top && i <= e.bottom;
                });
                null != o && t.onSelect(Object.assign({}, e, {
                    currentTarget: o
                }));
            });
        }
    }
});