// 金组件：金重 / 损耗 / 金价 / 配件 / 链重 / 胚底
Component({
    properties: {},

    data: {
        weight: 0,
        loss: 0,
        price: 0,
        part: 0,
        chain: 0,
        laborCost: 0,
        items: [
            { key: "weight", title: "金重", placeholder: "克", value: "" },
            { key: "loss", title: "损耗", placeholder: "%", value: "" },
            { key: "price", title: "金价", placeholder: "元/克", value: "" },
            { key: "part", title: "配件", placeholder: "克", value: "" },
            { key: "chain", title: "链重", placeholder: "克", value: "" },
            { key: "laborCost", title: "胚底", placeholder: "元", value: "" }
        ],
        result: "",
        total: 0
    },

    lifetimes: {
        attached: function () {
            // 自动从本地 storage 获取金价并填入
            var cached = null;
            try {
                cached = wx.getStorageSync("goldPrice");
            } catch (e) {}
            if (cached && cached.AU9999 && !isNaN(Number(cached.AU9999))) {
                var p = Number(cached.AU9999);
                var items = this.data.items;
                items[2].value = p.toFixed(0);
                this.setData({ price: p, items: items });
                this.recalc();
            }
        }
    },

    methods: {
        bindKeyInput: function (e) {
            var idx = Number(e.currentTarget.dataset.idx);
            var raw = e.detail.value;
            var num = raw ? parseFloat(raw) : 0;
            if (isNaN(num)) num = 0;

            var items = this.data.items;
            items[idx].value = raw;
            var key = items[idx].key;

            var dataPatch = { items: items };
            dataPatch[key] = num;
            this.setData(dataPatch);
            this.recalc();
        },

        recalc: function () {
            var w = this.data.weight || 0;
            var loss = this.data.loss || 0;
            var price = this.data.price || 0;
            var part = this.data.part || 0;
            var chain = this.data.chain || 0;
            var labor = this.data.laborCost || 0;

            // (金重 + 配件 + 链重) * (1 + 损耗%) * 金价 + 胚底
            var total = (w + part + chain) * (1 + loss / 100) * price + labor;

            var items = this.data.items;
            var desc =
                "金\n金重：" + (items[0].value || "0") + "克" +
                "\n配件：" + (items[3].value || "0") + "克" +
                "\n链重：" + (items[4].value || "0") + "克" +
                "\n损耗：" + (items[1].value || "0") + "%" +
                "\n胚底：" + (items[5].value || "0") + "元" +
                "\n金工耗：" + total.toFixed(0) + "元";

            this.setData({
                result: desc,
                total: total
            });

            this.triggerEvent("goldSum", {
                goldValue: desc,
                sum: total,
                laborCost: labor
            });
        }
    }
});
