// 钻石组件：支持 mm / ct 两种尺寸，以及单项价 / 总价两种计价方式
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
        show: false,
        isMm: true,        // 默认为 mm 模式
        isSinglePrice: true, // 默认为单粒价
        addNum: 1,
        diamondDataList: [
            { size: "", piece: "", price: "" }
        ],
        picker: [
            { id: 0, name: "手镶", wage: 10 },
            { id: 1, name: "微镶", wage: 4 }
        ],
        wage: 10,
        result: "",
        total: 0,
        totalPiece: 0,
        totalWeight: 0
    },

    methods: {
        bindCheckTitle: function () {
            var newShow = !this.data.show;
            this.setData({ show: newShow });
            if (newShow) {
                this.recalc();
            } else {
                // 收起时通知父页面，不再计入总价
                this.setData({ result: "", total: 0 });
                this.triggerEvent("diamondSum", {
                    diamondValue: "",
                    sum: 0,
                    show: false,
                    wage: 0
                });
            }
        },

        bindRadioLeft: function (e) {
            // 切换 mm / ct
            var value = Number(e.detail.value);
            this.setData({ isMm: value === 0 });
            this.recalc();
        },

        bindRadioRight: function (e) {
            // 切换单粒 / 总价
            var value = Number(e.detail.value);
            this.setData({ isSinglePrice: value === 0 });
            this.recalc();
        },

        bindAddAndDel: function (e) {
            var tag = e.currentTarget.dataset.tag;
            var list = this.data.diamondDataList.slice();
            if (tag === "add") {
                var n = Number(this.data.addNum) || 1;
                for (var i = 0; i < n; i++) {
                    list.push({ size: "", piece: "", price: "" });
                }
            } else if (tag === "del") {
                var idx = Number(e.currentTarget.dataset.idx);
                if (list.length > 1) {
                    list.splice(idx, 1);
                }
            }
            this.setData({ diamondDataList: list });
            this.recalc();
        },

        bindDataListInput: function (e) {
            var tag = e.currentTarget.dataset.tag;
            var idx = Number(e.currentTarget.dataset.idx);
            var value = e.detail.value;

            var list = this.data.diamondDataList.slice();
            list[idx] = Object.assign({}, list[idx]);
            list[idx][tag] = value;
            this.setData({ diamondDataList: list });
            this.recalc();
        },

        bindWageInput: function (e) {
            var val = parseFloat(e.detail.value);
            if (isNaN(val)) val = 0;
            var picker = this.data.picker.slice();
            picker[this.data.pickerIndex] = Object.assign({}, picker[this.data.pickerIndex]);
            picker[this.data.pickerIndex].wage = val;
            this.setData({ picker: picker, wage: val });
            this.recalc();
        },

        bindAddNumInput: function (e) {
            var val = Number(e.detail.value);
            if (!val || isNaN(val) || val < 1) val = 1;
            this.setData({ addNum: val });
        },

        bindPickerChange: function (e) {
            var idx = Number(e.detail.value);
            this.setData({ pickerIndex: idx, wage: this.data.picker[idx].wage });
            this.recalc();
        },

        mmToCt: function (mm) {
            var m = parseFloat(mm);
            if (isNaN(m) || m <= 0) return 0;
            // 经验公式：直径(mm) -> ct
            return (0.61 * Math.pow(m, 3) * 0.0061);
        },

        recalc: function () {
            var list = this.data.diamondDataList;
            var wage = Number(this.data.wage) || 0;
            var totalCt = 0;
            var totalPiece = 0;
            var totalMoney = 0;

            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (!item.size && !item.piece) continue;

                var piece = parseFloat(item.piece);
                if (isNaN(piece) || piece <= 0) piece = 0;
                var price = parseFloat(item.price);
                if (isNaN(price)) price = 0;

                var ct;
                if (this.data.isMm) {
                    ct = this.mmToCt(item.size);
                } else {
                    ct = parseFloat(item.size);
                    if (isNaN(ct) || ct < 0) ct = 0;
                }

                // 计算此项的重量与金额
                var itemCt;
                var itemMoney;
                if (this.data.isSinglePrice) {
                    // 单粒价：总石价 = ct * 单价 * 粒数
                    itemCt = ct * piece;
                    itemMoney = ct * price * piece + wage * piece;
                } else {
                    // 总价模式：总石价直接 = price（表示该项整项总金额）
                    itemCt = ct * piece;
                    itemMoney = price + wage * piece;
                }

                totalCt += itemCt;
                totalPiece += piece;
                totalMoney += itemMoney;
            }

            var desc = "";
            if (totalPiece > 0 || totalCt > 0 || totalMoney > 0) {
                desc =
                    this.data.title +
                    "\n粒数：" + totalPiece.toFixed(0) +
                    "\n镶工：" + (totalPiece * wage).toFixed(0) + "元" +
                    "\n石重：" + totalCt.toFixed(3) + " ct" +
                    "\n总石价：" + (totalMoney - totalPiece * wage).toFixed(0) + "元" +
                    "\n小计：" + totalMoney.toFixed(0) + "元";
            }

            this.setData({
                result: desc,
                total: totalMoney,
                totalPiece: totalPiece,
                totalWeight: totalCt
            });

            this.triggerEvent("diamondSum", {
                diamondValue: desc,
                sum: totalMoney,
                show: this.data.show,
                wage: totalPiece * wage
            });
        }
    }
});
