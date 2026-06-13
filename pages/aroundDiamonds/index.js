function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var t, e = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}(require("../../dist/vant/notify/notify.js"));

Page({
    data: {
        items: [ {
            title: "主石",
            value: "",
            placeholder: "直径",
            unit: "mm",
            bubbleLeft: "0%",
            min: 5,
            max: 30,
            step: 0.1
        }, {
            title: "副石",
            value: "",
            placeholder: "",
            unit: "mm",
            bubbleLeft: "0%",
            min: 0.1,
            max: 5,
            step: 0.01
        }, {
            title: "粒数",
            value: "",
            placeholder: "",
            unit: "粒",
            bubbleLeft: "0%",
            min: 3,
            max: 50,
            step: 1
        }, {
            title: "副副间距",
            value: "0.1",
            placeholder: "",
            unit: "mm",
            bubbleLeft: "5%",
            min: 0,
            max: 2,
            step: 0.01
        }, {
            title: "主副间距",
            value: "0",
            placeholder: "",
            unit: "mm",
            bubbleLeft: "0%",
            min: 0,
            max: 3,
            step: 0.01
        } ],
        radio: "1"
    },
    onChange: function(t) {
        var e = t.detail, r = this.data.items;
        if ("1" === e) {
            r[0].title = "主石";
            r[1].title = "副石";
            r[4].title = "主副距离";
        } else if ("2" === e) {
            r[0].title = "手寸";
            r[1].title = "副石";
            r[4].title = "与戒圈距离";
        }
        this.setData({
            items: r,
            radio: e
        });
    },
    bindInput: function(a) {
        var raw = a.detail.value;
        var t = parseFloat(raw);
        var e = this.data.items;
        switch (a.currentTarget.id) {
          case "0":
            e[0].value = isNaN(t) ? "" : t;
            break;

          case "1":
            e[1].value = isNaN(t) ? "" : t;
            break;

          case "2":
            t = parseInt(raw);
            e[2].value = isNaN(t) ? "" : t;
            break;

          case "3":
            e[3].value = isNaN(t) ? "" : t;
            break;

          case "4":
            e[4].value = isNaN(t) ? "" : t;
        }
        for (var i = 0; i < e.length; i++) {
            var item = e[i];
            var val = item.value === "" ? item.min : parseFloat(item.value);
            var range = item.max - item.min;
            var pct = range > 0 ? ((val - item.min) / range * 100) : 0;
            if (pct < 0) pct = 0;
            if (pct > 100) pct = 100;
            item.bubbleLeft = pct + "%";
        }
        this.setData({ items: e });
    },
    bindSliderChange: function(a) {
        var index = a.currentTarget.id;
        var val = a.detail.value;
        var i = this.data.items;
        if (index === "2") {
            i[2].value = val;
        } else {
            i[index].value = parseFloat(val.toFixed(2));
        }
        var range = i[index].max - i[index].min;
        var pct = range > 0 ? ((val - i[index].min) / range * 100) : 0;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;
        i[index].bubbleLeft = pct + "%";
        this.setData({ items: i });
    },
    bindSliderChanging: function(a) {
        var index = a.currentTarget.id;
        var val = a.detail.value;
        var i = this.data.items;
        var range = i[index].max - i[index].min;
        var pct = range > 0 ? ((val - i[index].min) / range * 100) : 0;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;
        i[index].bubbleLeft = pct + "%";
        if (index === "2") {
            i[2].value = val;
        } else {
            i[index].value = parseFloat(val.toFixed(2));
        }
        this.setData({ items: i });
    },
    onClick: function() {
        var a = parseFloat(this.data.items[0].value);
        var t1 = parseFloat(this.data.items[1].value);
        var i = parseInt(this.data.items[2].value);
        var l = parseFloat(this.data.items[3].value);
        var r = parseFloat(this.data.items[4].value);
        var s = 0;

        if (isNaN(a) || a <= 0) {
            wx.showToast({ title: "主石不能为空", icon: "none" });
            return;
        }
        if (isNaN(i) || i <= 2) {
            wx.showToast({ title: "粒数需大于2", icon: "none" });
            return;
        }
        if (isNaN(t1) || t1 <= 0) {
            if (isNaN(l)) l = 0.1;
            if (isNaN(r)) r = 0;
            s = 0;
            this.calculator(a, 0, i, l, r, s);
            return;
        }
        if (isNaN(l)) l = 0.1;
        if (isNaN(r)) r = 0;
        s = 1;
        this.calculator(a, t1, i, l, r, s);
    },
    drawDiamond: function(a, t, e) {
        var i = .162 * t, r = .55 * t, l = .433 * t, s = .115 * t, o = .21 * t;
        a.moveTo(0 - t / 2, 0 - e), a.lineTo(0 - r / 2, 0 - i - e), a.lineTo(r / 2, 0 - i - e), 
        a.lineTo(t / 2, 0 - e), a.lineTo(0, l - e), a.lineTo(0 - t / 2, 0 - e), a.lineTo(t / 2, 0 - e), 
        a.moveTo(0 - s, 0 - i - e), a.lineTo(0 - o, 0 - e), a.lineTo(0, l - e), a.lineTo(o, 0 - e), 
        a.lineTo(s, 0 - i - e), a.stroke();
    },
    draw: function(a, e, i, r, l) {
        if (!t || !t.windowWidth) {
            wx.showToast({ title: "系统信息加载中，请稍后重试", icon: "none" });
            return;
        }
        var s = t.windowWidth, o = this.data.radio, n = 1;
        if ("2" === o) {
            n = 0.595;
        }
        var u;
        if (s < 300) {
            u = s / (a + 2 * (e * n + l)) * 0.9;
        } else {
            u = 300 / (a + 2 * (e * n + l)) * 0.9;
        }
        var c = wx.createCanvasContext("myCanvas");
        c.translate(s / 2, 150);
        switch (o) {
          case "1":
            this.flower(c, a, e, i, l, u);
            break;
          case "2":
            this.ring(c, a, e, i, l, u);
            break;
        }
    },
    flower: function(a, t, e, i, r, l) {
        var s = t * l / 2, o = e * l / 2, n = r * l;
        a.setStrokeStyle("#FF0000");
        a.arc(0, 0, s, 0, 2 * Math.PI), a.stroke(), a.beginPath();
        a.setStrokeStyle("#FF9900");
        for (var u = 0; u < i; u++) u > 0 && a.rotate(2 * Math.PI / i), a.arc(o + s + n, 0, o, 0, 2 * Math.PI), 
        a.stroke();
        a.draw();
    },
    ring: function(a, t, e, i, r, l) {
        var s = t * l, o = e * l, n = s / 2 + .433 * o + r * l;
        a.setStrokeStyle("#0000FF");
        a.arc(0, 0, s / 2, 0, 2 * Math.PI), a.stroke(), a.beginPath();
        a.setStrokeStyle("#FF9900");
        for (var u = 0; u < i; u++) u > 0 && a.rotate(2 * Math.PI / i), this.drawDiamond(a, o, n), 
        a.stroke();
        a.draw();
    },
    calculator: function(a, t, e, i, r, l) {
        var s = 0, o = 360 / e;
        if (l === 1) {
            i = 0;
        }
        var n = t + i, u = 0;
        if (this.data.radio === "2") {
            u = 0.067;
        }
        if (l === 2) {
            s = a / 2 + t / 2 + i + r - t * u;
            var cosVal = (s * s + s * s - n * n) / (2 * s * s);
            o = Math.acos(cosVal) / (Math.PI / 180);
            e = parseInt(360 / o);
            o = 360 / e;
        }
        var c = a, d = 0, h = 0, prev;
        do {
            prev = c;
            if (h > 0) {
                c = c + d / 2;
            }
            s = (a + c) / 2 + r - c * u;
            n = Math.sqrt(2 * s * s - 2 * s * s * Math.cos(o * Math.PI / 180));
            n = parseFloat(n.toFixed(2));
            d = n - c;
            if (Math.abs(d) < 0.001) {
                n = c;
            }
            h++;
        } while (n !== prev && h < 100);

        var v = this.data.items;
        var sideStone, spacing;

        switch (l) {
          case 0:
            sideStone = (c - i).toFixed(2);
            v[1].value = sideStone;
            spacing = (c - parseFloat(sideStone)).toFixed(2);
            break;
          case 1:
            spacing = (c - t).toFixed(2);
            break;
          case 2:
            v[2].value = e;
            spacing = (c - t).toFixed(2);
            break;
          default:
            spacing = (c - t).toFixed(2);
        }

        v[3].value = parseFloat(spacing);

        var drawA, drawT;
        if (l === 0) {
            drawA = a;
            drawT = parseFloat(sideStone);
        } else {
            drawA = a;
            drawT = t;
        }
        this.draw(drawA, drawT, e, 0, r);
        this.setData({
            items: v
        });
    },
    onLoad: function(a) {
        wx.getSystemInfo({
            success: function(a) {
                t = a;
            }
        });
        var e = this.data.items;
        for (var i = 0; i < e.length; i++) {
            var item = e[i];
            var val = item.value === "" ? item.min : parseFloat(item.value);
            var range = item.max - item.min;
            var pct = range > 0 ? ((val - item.min) / range * 100) : 0;
            if (pct < 0) pct = 0;
            if (pct > 100) pct = 100;
            item.bubbleLeft = pct + "%";
        }
        this.setData({ items: e });
    }
});