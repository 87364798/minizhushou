function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

// 戒指尺寸统一数据源（港度 / 欧度 / 美度 / 日度 / 直径 / 周长）
// 数据来源于项目根目录 ringsize.csv。需要增加尺寸相关功能时，
// 统一在 ringSizeData.js 中扩展接口即可，其他 require 该文件的页面自动可用。
// 气泡位置范围（相对父容器）。滑条轨道本身在卡片内左右两侧均有留白，
// 气泡以 translateX(-50%) 居中对齐，数值过小时气泡左半会被截；过高则右半被截。
// 限死一个安全范围（6%..94%）后，气泡不会被卡片的圆角 / overflow 裁掉。
var BUBBLE_LEFT_MIN = 6;
var BUBBLE_LEFT_MAX = 94;

var ringSizeData = require("../transformation/ringSizeData.js");

var t, e = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}(require("../../dist/vant/notify/notify.js"));

Page({
    data: {
        ringDiameter: "17.40",
        ringCircumference: "54.66",
        items: [ {
            title: "主石",
            value: "10",
            placeholder: "直径",
            unit: "mm",
            bubbleLeft: "20%",
            min: 5,
            max: 30,
            step: 0.1
        }, {
            title: "副石",
            value: "1.5",
            placeholder: "",
            unit: "mm",
            bubbleLeft: "28%",
            min: 0.1,
            max: 5,
            step: 0.01
        }, {
            title: "粒数",
            value: "12",
            placeholder: "",
            unit: "粒",
            bubbleLeft: "19%",
            min: 3,
            max: 50,
            step: 1
        }, {
            title: "副副间距",
            value: "0.1",
            placeholder: "",
            unit: "mm",
            bubbleLeft: "10%",
            min: 0,
            max: 2,
            step: 0.01
        }, {
            title: "主副间距",
            value: "0.5",
            placeholder: "",
            unit: "mm",
            bubbleLeft: "17%",
            min: 0,
            max: 3,
            step: 0.01
        } ],
        radio: "1"
    },
    onChange: function(t) {
        var e = t.detail, r = this.data.items;
        if ("1" === e) {
            // 花头模式：主石10mm + 副石1.5mm + 12粒
            r[0].title = "主石";
            r[0].value = "10";
            r[0].unit = "mm";
            r[0].min = 5;
            r[0].max = 30;
            r[0].step = 0.1;
            r[0].bubbleLeft = "20%";
            r[1].title = "副石";
            r[1].value = "1.5";
            r[1].bubbleLeft = "28%";
            r[2].value = "12";
            r[2].bubbleLeft = "19%";
            r[3].value = "0.1";
            r[3].bubbleLeft = "10%";
            r[4].title = "主副距离";
            r[4].value = "0.5";
            r[4].bubbleLeft = "17%";
        } else if ("2" === e) {
            // 戒指模式：港度 1-30（默认港度15=直径17.4mm）+ 副石1.0mm + 20粒
            r[0].title = "手寸";
            r[0].value = "15";
            r[0].unit = "港度";
            r[0].min = ringSizeData.HK_MIN;
            r[0].max = ringSizeData.HK_MAX;
            r[0].step = 1;
            r[0].bubbleLeft = "50%";
            r[1].title = "副石";
            r[1].value = "1.0";
            r[1].bubbleLeft = "18%";
            r[2].value = "20";
            r[2].bubbleLeft = "36%";
            r[3].value = "0.2";
            r[3].bubbleLeft = "10%";
            r[4].title = "与戒圈距离";
            r[4].value = "0.3";
            r[4].bubbleLeft = "10%";
        }
        this.setData({
            items: r,
            radio: e
        });
        // 切换模式后立即根据默认值重新绘制
        this.drawWithCurrentItems();
    },
    // 从当前 items 读取数值并绘制，副副间距由其他值反算（只读）
    // items 顺序：[0]主石/手寸, [1]副石, [2]粒数, [3]副副间距(只读), [4]主副距离/与戒圈距离
    drawWithCurrentItems: function() {
        var r = this.data.items;
        var aRaw = parseFloat(r[0].value);
        // 戒指模式：港度 → 直径 mm；花头模式：直接就是 mm
        var a = this.data.radio === "2" ? ringSizeData.hkSizeToDiameter(aRaw) : aRaw;
        var e = parseFloat(r[1].value);
        var i = parseInt(r[2].value);
        var spacing = parseFloat(r[4].value); // 主副距离 / 与戒圈距离
        if (isNaN(a) || a <= 0) return;
        if (isNaN(i) || i <= 2) return;
        if (isNaN(e) || e <= 0) e = 0.1;
        if (isNaN(spacing) || spacing < 0) spacing = 0;

        // 根据主石/手寸、副石、粒数、主副距离 反算副副间距（弦长 - 副石直径）
        var s;
        if (this.data.radio === "2") {
            // 戒指：中心半径 = 手寸半径 + 0.433*副石 + 与戒圈距离
            s = a / 2 + 0.433 * e + spacing;
        } else {
            // 花头：中心半径 = (主石 + 副石) / 2 + 主副距离
            s = (a + e) / 2 + spacing;
        }
        var angDeg = 360 / i;
        var chordLen = Math.sqrt(2 * s * s - 2 * s * s * Math.cos(angDeg * Math.PI / 180));
        var calcSpacing = parseFloat((chordLen - e).toFixed(2));
        if (calcSpacing < 0) calcSpacing = 0;

        // 更新副副间距的显示值（只读），并同步气泡位置
        var items = this.data.items;
        var itemsChanged = false;
        if (items[3] && items[3].value !== calcSpacing) {
            items[3].value = calcSpacing;
            var range = items[3].max - items[3].min;
            var pct = range > 0 ? ((calcSpacing - items[3].min) / range * 100) : 0;
            if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
            if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
            items[3].bubbleLeft = pct + "%";
            itemsChanged = true;
        }
        var updatePayload = { items: items };
        if (this.data.radio === "2") {
            updatePayload.ringDiameter = a.toFixed(2);
            updatePayload.ringCircumference = (Math.PI * a).toFixed(2);
        }
        this.setData(updatePayload);
        // draw 参数：draw(a, 副石, 粒数, <未使用>, 主副距离/与戒圈距离)
        this.draw(a, e, i, 0, spacing);
    },
    bindInput: function(a) {
        var id = a.currentTarget.id;
        // 副副间距（index 3）由系统自动计算，不允许用户修改
        if (id === "3") return;
        var raw = a.detail.value;
        var t = parseFloat(raw);
        var e = this.data.items;
        switch (id) {
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

          case "4":
            e[4].value = isNaN(t) ? "" : t;
        }
        for (var i = 0; i < e.length; i++) {
            var item = e[i];
            var val = item.value === "" ? item.min : parseFloat(item.value);
            var range = item.max - item.min;
            var pct = range > 0 ? ((val - item.min) / range * 100) : 0;
            if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
            if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
            item.bubbleLeft = pct + "%";
        }
        this.setData({ items: e });
        this.scheduleDraw();
    },
    bindSliderChange: function(a) {
        var index = a.currentTarget.id;
        if (index === "3") return; // 副副间距只读
        var val = a.detail.value;
        var i = this.data.items;
        if (index === "2") {
            i[2].value = val;
        } else {
            i[index].value = parseFloat(val.toFixed(2));
        }
        var range = i[index].max - i[index].min;
        var pct = range > 0 ? ((val - i[index].min) / range * 100) : 0;
        if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
        if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
        i[index].bubbleLeft = pct + "%";
        this.setData({ items: i });
        this.scheduleDraw();
    },
    bindSliderChanging: function(a) {
        var index = a.currentTarget.id;
        if (index === "3") return; // 副副间距只读
        var val = a.detail.value;
        var i = this.data.items;
        var range = i[index].max - i[index].min;
        var pct = range > 0 ? ((val - i[index].min) / range * 100) : 0;
        if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
        if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
        i[index].bubbleLeft = pct + "%";
        if (index === "2") {
            i[2].value = val;
        } else {
            i[index].value = parseFloat(val.toFixed(2));
        }
        this.setData({ items: i });
        this.scheduleDraw();
    },
    // 节流：限制最多 80ms 一次重绘，避免滑条拖动过快刷屏
    scheduleDraw: function() {
        if (this._drawTimer) return;
        var self = this;
        this._drawTimer = setTimeout(function() {
            self._drawTimer = null;
            self.drawWithCurrentItems();
        }, 80);
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
        var o = this.data.radio, n = 1;
        if ("2" === o) {
            n = 0.595;
        }
        // 使用 canvas 实际像素尺寸居中绘制
        var cw = this.data.canvasW || 260;
        var ch = this.data.canvasH || 260;
        var halfW = cw / 2;
        var halfH = ch / 2;
        var maxHalf = halfW < halfH ? halfW : halfH;
        var u = maxHalf / (a / 2 + e * n + l + 1) * 0.85;
        var c = wx.createCanvasContext("myCanvas");
        c.translate(halfW, halfH);
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
        var self = this;
        wx.getSystemInfo({
            success: function(info) {
                t = info;
                var canvasW = Math.floor(info.windowWidth * 0.48);
                var canvasH = Math.floor(info.windowHeight - 32 - 40 - 16 - 60 - 32 - 32);
                if (canvasH < 180) canvasH = 180;
                if (canvasW > canvasH) canvasW = canvasH;
                self.setData({
                    canvasW: canvasW,
                    canvasH: canvasH
                }, function() {
                    // setData 渲染完成后，根据当前默认值绘制预览
                    self.drawWithCurrentItems();
                });
            }
        });
        var e = this.data.items;
        for (var i = 0; i < e.length; i++) {
            var item = e[i];
            var val = item.value === "" ? item.min : parseFloat(item.value);
            var range = item.max - item.min;
            var pct = range > 0 ? ((val - item.min) / range * 100) : 0;
            if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
            if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
            item.bubbleLeft = pct + "%";
        }
        this.setData({ items: e });
    }
});