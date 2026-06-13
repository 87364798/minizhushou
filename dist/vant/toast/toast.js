function e(e) {
    return (0, n.isObj)(e) ? e : {
        message: e
    };
}

function t() {
    var e = getCurrentPages();
    return e[e.length - 1];
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var n = require("../common/utils"), o = {
    type: "text",
    mask: !1,
    message: "",
    show: !0,
    zIndex: 1e3,
    duration: 3e3,
    position: "middle",
    forbidClick: !1,
    loadingType: "circular",
    selector: "#van-toast"
}, r = [], i = Object.assign({}, o), s = function() {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, o = ((n = Object.assign({}, i, e(n))).context || t()).selectComponent(n.selector);
    if (o) return delete n.context, delete n.selector, r.push(o), o.set(n), clearTimeout(o.timer), 
    n.duration > 0 && (o.timer = setTimeout(function() {
        o.clear(), r = r.filter(function(e) {
            return e !== o;
        });
    }, n.duration)), o;
    console.warn("未找到 van-toast 节点，请确认 selector 及 context 是否正确");
}, c = function(t) {
    return function(n) {
        return s(Object.assign({
            type: t
        }, e(n)));
    };
};

[ "loading", "success", "fail" ].forEach(function(e) {
    s[e] = c(e);
}), s.clear = function() {
    r.forEach(function(e) {
        e.clear();
    }), r = [];
}, s.setDefaultOptions = function(e) {
    Object.assign(i, e);
}, s.resetDefaultOptions = function() {
    i = Object.assign({}, o);
}, exports.default = s;