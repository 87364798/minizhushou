Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = Component({
    behaviors: [],
    properties: {
        size: {
            type: String,
            value: "normal"
        },
        type: {
            type: String,
            value: ""
        },
        plain: {
            type: Boolean,
            value: !1
        },
        value: {
            type: String,
            value: ""
        },
        hoverClass: {
            type: String,
            value: "btn__hover"
        },
        loading: {
            type: Boolean,
            value: !1
        },
        btnStyle: {
            type: String,
            value: ""
        },
        openType: {
            type: String,
            value: ""
        },
        appParameter: {
            type: String,
            value: ""
        },
        hoverStopPropagation: {
            type: Boolean,
            value: !1
        },
        hoverStartTime: {
            type: [ Number, String ],
            value: 20
        },
        hoverStayTime: {
            type: [ Number, String ],
            value: 70
        },
        lang: {
            type: String,
            value: "en"
        },
        sessionFrom: {
            type: String,
            value: ""
        },
        sendMessageTitle: {
            type: String,
            value: ""
        },
        sendMessagePath: {
            type: String,
            value: ""
        },
        sendMessageImg: {
            type: String,
            value: ""
        },
        showMessageCard: {
            type: Boolean,
            value: !1
        }
    },
    data: {},
    methods: {
        onSubmit: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("submit", t, r);
        },
        btnClick: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("click", t, r);
        },
        getUserInfo: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("getuserinfo", t, r);
        },
        onContact: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("contact", t, r);
        },
        getPhoneNumber: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("getphonenumber", t, r);
        },
        onError: function(e) {
            var t = e.detail, r = {};
            this.triggerEvent("errror", t, r);
        }
    }
});