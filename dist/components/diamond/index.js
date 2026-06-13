function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

Component({
    properties: {
        title: {
            type: String,
            value: "钻石"
        },
        pickerIndex: {
            type: Number,
            value: 0
        }
    },
    data: {
        show: !1,
        disabled: !0,
        addNum: 1,
        radioLeft: [ {
            name: "mm",
            checked: !0
        }, {
            name: "ct",
            checked: !1
        } ],
        radioRight: [ {
            name: "单粒",
            checked: !1
        }, {
            name: "总数",
            checked: !1
        } ],
        diamondDataList: [ {
            size: "",
            piece: "",
            price: ""
        } ],
        picker: [ {
            id: 0,
            name: "手镶",
            wage: 10
        }, {
            id: 1,
            name: "微镶",
            wage: 4
        } ]
    },
    methods: {
        bindCheckTitle: function(a) {
            this.setData({
                show: !this.data.show
            }), this.sum();
        },
        bindRadioLeft: function(t) {
            var e = this.data.disabled;
            this.setData(a({
                disabled: !e
            }, "radioRight[0].checked", e)), this.sum();
        },
        bindRadioRight: function(a) {
            0 == a.detail.value ? (this.data.radioRight[0].checked = !0, this.data.radioRight[1].checked = !1) : (this.data.radioRight[0].checked = !1, 
            this.data.radioRight[1].checked = !0), this.sum();
        },
        bindDiamondAddAndDel: function(a) {
            var t = a.currentTarget.dataset.tag, e = this.data.diamondDataList;
            if ("add" == t) for (var i = this.data.addNum, d = 0; d < i; d++) {
                var s = new Object();
                s.size = "", s.piece = "", e.push(s);
            } else if ("del" == t) {
                var n = a.currentTarget.id;
                e.splice(n, 1);
            }
            this.setData({
                diamondDataList: e
            }), this.sum();
        },
        bindDataListInput: function(a) {
            var t = a.currentTarget.dataset, e = a.detail.value, i = a.currentTarget.id;
            switch (t.tag) {
              case "size":
                this.data.diamondDataList[i].size = e;
                break;

              case "piece":
                this.data.diamondDataList[i].piece = e;
                break;

              case "price":
                this.data.diamondDataList[i].price = e;
            }
            this.sum();
        },
        bindWegeInput: function(a) {
            var t = a.detail.value, e = parseFloat(t).toFixed(2);
            isNaN(e) && (e = 0), this.data.picker[this.data.pickerIndex].wage = e, this.sum();
        },
        bindAddNumInput: function(a) {
            var t = a.detail.value, e = Number(t);
            0 == e | isNaN(e) && (e = 1), this.data.addNum = e;
        },
        bindPickerChange: function(a) {
            var t = a.detail.value;
            this.data.wage = this.data.picker[t].wage, this.setData({
                pickerIndex: t
            });
        },
        sum: function() {
            for (var a = this.data.diamondDataList, t = 0, e = 0, i = 0, d = this.data.picker[this.data.pickerIndex].wage, s = 0; s < a.length; s++) if (!a[s].size | !a[s].piece) ; else {
                var n = parseFloat(a[s].piece);
                isNaN(n) && (n = 0);
                var r = 0;
                if (a[s].price) {
                    c = parseFloat(a[s].price);
                    isNaN(c) && (c = 0);
                } else var c = 0;
                r = this.data.disabled ? this.mmToCt(a[s].size) : parseFloat(a[s].size), this.data.radioRight[1].checked ? (i += r, 
                t = t + r * c + d * n) : (i += r * n, t = t + r * n * c + d * n), e += n;
            }
            if (a.length > 0) h = (h = (h = (h = (h = this.data.title + " \n 粒数：" + e.toFixed(0) + " \n ") + "镶工：" + e * d + " \n ") + "石重：" + i.toFixed(3) + " ct \n ") + "总石价：" + (t - e * d).toFixed(2) + " \n ") + "小计：" + t.toFixed(2) + "元"; else var h = "";
            var o = {
                diamondValue: h,
                sum: t,
                show: this.data.show,
                wage: e * d
            };
            this.setData({
                result: h
            }), this.triggerEvent("diamondSum", o);
        },
        mmToCt: function(a) {
            var t = parseFloat(a).toFixed(2);
            return (.61 * Math.pow(t, 3) * .0061).toFixed(3);
        }
    }
});