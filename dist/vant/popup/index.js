var e = require("../common/component"), s = require("../mixins/transition"), t = require("../mixins/iphonex");

(0, e.VantComponent)({
    classes: [ "enter-class", "enter-active-class", "enter-to-class", "leave-class", "leave-active-class", "leave-to-class" ],
    mixins: [ (0, s.transition)(!1), t.iphonex ],
    props: {
        transition: {
            type: String,
            observer: "observeClass"
        },
        customStyle: String,
        overlayStyle: String,
        zIndex: {
            type: Number,
            value: 100
        },
        overlay: {
            type: Boolean,
            value: !0
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: !0
        },
        position: {
            type: String,
            value: "center",
            observer: "observeClass"
        }
    },
    created: function() {
        this.observeClass();
    },
    methods: {
        onClickOverlay: function() {
            this.$emit("click-overlay"), this.data.closeOnClickOverlay && this.$emit("close");
        },
        observeClass: function() {
            var e = this.data, s = e.transition, t = e.position;
            this.updateClasses(s || t);
        }
    }
});