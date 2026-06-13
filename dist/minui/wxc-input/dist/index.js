Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        title: {
            type: String,
            value: ""
        },
        src: {
            type: String,
            value: ""
        },
        icon: {
            type: String,
            value: ""
        },
        iconColor: {
            type: String,
            value: ""
        },
        mode: {
            type: String,
            value: "normal"
        },
        right: {
            type: Boolean,
            value: !1
        },
        error: {
            type: Boolean,
            value: !1
        },
        value: {
            type: String,
            value: ""
        },
        type: {
            type: String,
            value: "text"
        },
        password: {
            type: Boolean,
            value: !1
        },
        placeholder: {
            type: String,
            value: ""
        },
        placeholderStyle: {
            type: String,
            value: ""
        },
        disabled: {
            type: Boolean,
            value: !1
        },
        maxlength: {
            type: [ Number, String ],
            value: 140
        },
        cursorSpacing: {
            type: [ Number, String ],
            value: 0
        },
        focus: {
            type: Boolean,
            value: !1
        },
        confirmType: {
            type: String,
            value: "done"
        },
        confirmHold: {
            type: Boolean,
            value: !1
        },
        cursor: {
            type: [ Number, String ],
            value: 0
        },
        selectionStart: {
            type: [ Number, String ],
            value: -1
        },
        selectionEnd: {
            type: [ Number, String ],
            value: -1
        },
        adjustPosition: {
            type: Boolean,
            value: !0
        }
    },
    data: {},
    methods: {
        onInput: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("input", t, r);
        },
        onFocus: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("focus", t, r);
        },
        onBlur: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("blur", t, r);
        },
        onConfirm: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("confirm", t, r);
        }
    }
});