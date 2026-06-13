function e(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

function t(e) {
    return (0, l.isDef)(e) && !isNaN(new Date(e).getTime());
}

function n(e, t, n) {
    return Math.min(Math.max(e, t), n);
}

function a(e) {
    return ("00" + e).slice(-2);
}

function r(e, t) {
    for (var n = -1, a = Array(e); ++n < e; ) a[n] = t(n);
    return a;
}

function u(e) {
    if (e) {
        for (;isNaN(parseInt(e, 10)); ) e = e.slice(1);
        return parseInt(e, 10);
    }
}

function i(e, t) {
    return 32 - new Date(e, t - 1, 32).getDate();
}

var o = function() {
    function e(e, t) {
        var n = [], a = !0, r = !1, u = void 0;
        try {
            for (var i, o = e[Symbol.iterator](); !(a = (i = o.next()).done) && (n.push(i.value), 
            !t || n.length !== t); a = !0) ;
        } catch (e) {
            r = !0, u = e;
        } finally {
            try {
                !a && o.return && o.return();
            } finally {
                if (r) throw u;
            }
        }
        return n;
    }
    return function(t, n) {
        if (Array.isArray(t)) return t;
        if (Symbol.iterator in Object(t)) return e(t, n);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), m = require("../common/component"), l = require("../common/utils"), s = new Date().getFullYear();

(0, m.VantComponent)({
    props: {
        value: null,
        title: String,
        loading: Boolean,
        itemHeight: {
            type: Number,
            value: 44
        },
        visibleItemCount: {
            type: Number,
            value: 5
        },
        confirmButtonText: {
            type: String,
            value: "确认"
        },
        cancelButtonText: {
            type: String,
            value: "取消"
        },
        type: {
            type: String,
            value: "datetime"
        },
        showToolbar: {
            type: Boolean,
            value: !0
        },
        minDate: {
            type: Number,
            value: new Date(s - 10, 0, 1).getTime()
        },
        maxDate: {
            type: Number,
            value: new Date(s + 10, 11, 31).getTime()
        },
        minHour: {
            type: Number,
            value: 0
        },
        maxHour: {
            type: Number,
            value: 23
        },
        minMinute: {
            type: Number,
            value: 0
        },
        maxMinute: {
            type: Number,
            value: 59
        }
    },
    data: {
        innerValue: Date.now(),
        columns: []
    },
    watch: {
        value: function(e) {
            var t = this, n = this.data;
            (e = this.correctValue(e)) === n.innerValue || this.updateColumnValue(e).then(function() {
                t.$emit("input", e);
            });
        },
        type: "updateColumns",
        minHour: "updateColumns",
        maxHour: "updateColumns",
        minMinute: "updateColumns",
        maxMinute: "updateColumns"
    },
    methods: {
        getPicker: function() {
            if (null == this.picker) {
                var e = this.picker = this.selectComponent(".van-datetime-picker"), t = e.setColumnValues;
                e.setColumnValues = function() {
                    for (var n = arguments.length, a = Array(n), r = 0; r < n; r++) a[r] = arguments[r];
                    return t.apply(e, [].concat(a, [ !1 ]));
                };
            }
            return this.picker;
        },
        updateColumns: function() {
            var e = this.getRanges().map(function(e, t) {
                var n = e.type, u = e.range;
                return {
                    values: r(u[1] - u[0] + 1, function(e) {
                        var t = u[0] + e;
                        return t = "year" === n ? "" + t : a(t);
                    })
                };
            });
            return this.set({
                columns: e
            });
        },
        getRanges: function() {
            var e = this.data;
            if ("time" === e.type) return [ {
                type: "hour",
                range: [ e.minHour, e.maxHour ]
            }, {
                type: "minute",
                range: [ e.minMinute, e.maxMinute ]
            } ];
            var t = this.getBoundary("max", e.innerValue), n = t.maxYear, a = t.maxDate, r = t.maxMonth, u = t.maxHour, i = t.maxMinute, o = this.getBoundary("min", e.innerValue), m = o.minYear, l = o.minDate, s = [ {
                type: "year",
                range: [ m, n ]
            }, {
                type: "month",
                range: [ o.minMonth, r ]
            }, {
                type: "day",
                range: [ l, a ]
            }, {
                type: "hour",
                range: [ o.minHour, u ]
            }, {
                type: "minute",
                range: [ o.minMinute, i ]
            } ];
            return "date" === e.type && s.splice(3, 2), "year-month" === e.type && s.splice(2, 3), 
            s;
        },
        correctValue: function(e) {
            var r = this.data, u = "time" !== r.type;
            if (u && !t(e) ? e = r.minDate : u || e || (e = a(r.minHour) + ":00"), !u) {
                var i = e.split(":"), m = o(i, 2), l = m[0], s = m[1];
                return l = a(n(l, r.minHour, r.maxHour)), s = a(n(s, r.minMinute, r.maxMinute)), 
                l + ":" + s;
            }
            return e = Math.max(e, r.minDate), e = Math.min(e, r.maxDate);
        },
        getBoundary: function(t, n) {
            var a, r = new Date(n), u = new Date(this.data[t + "Date"]), o = u.getFullYear(), m = 1, l = 1, s = 0, c = 0;
            return "max" === t && (m = 12, l = i(r.getFullYear(), r.getMonth() + 1), s = 23, 
            c = 59), r.getFullYear() === o && (m = u.getMonth() + 1, r.getMonth() + 1 === m && (l = u.getDate(), 
            r.getDate() === l && (s = u.getHours(), r.getHours() === s && (c = u.getMinutes())))), 
            a = {}, e(a, t + "Year", o), e(a, t + "Month", m), e(a, t + "Date", l), e(a, t + "Hour", s), 
            e(a, t + "Minute", c), a;
        },
        onCancel: function() {
            this.$emit("cancel");
        },
        onConfirm: function() {
            this.$emit("confirm", this.data.innerValue);
        },
        onChange: function() {
            var e = this, t = this.data, n = void 0, a = this.getPicker();
            if ("time" === t.type) {
                var r = a.getIndexes();
                n = r[0] + t.minHour + ":" + (r[1] + t.minMinute);
            } else {
                var o = a.getValues(), m = u(o[0]), l = u(o[1]), s = i(m, l), c = u(o[2]);
                "year-month" === t.type && (c = 1), c = c > s ? s : c;
                var p = 0, h = 0;
                "datetime" === t.type && (p = u(o[3]), h = u(o[4])), n = new Date(m, l - 1, c, p, h);
            }
            n = this.correctValue(n), this.updateColumnValue(n).then(function() {
                e.$emit("input", n), e.$emit("change", a);
            });
        },
        updateColumnValue: function(e) {
            var t = this, n = [], r = this.data, u = this.getPicker();
            if ("time" === r.type) {
                var i = e.split(":");
                n = [ i[0], i[1] ];
            } else {
                var o = new Date(e);
                n = [ "" + o.getFullYear(), a(o.getMonth() + 1) ], "date" === r.type && n.push(a(o.getDate())), 
                "datetime" === r.type && n.push(a(o.getDate()), a(o.getHours()), a(o.getMinutes()));
            }
            return this.set({
                innerValue: e
            }).then(function() {
                return t.updateColumns();
            }).then(function() {
                return u.setValues(n);
            });
        }
    },
    created: function() {
        var e = this, t = this.correctValue(this.data.value);
        this.updateColumnValue(t).then(function() {
            e.$emit("input", t);
        });
    }
});