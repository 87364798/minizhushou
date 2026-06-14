// 附加费用组件
Component({
    properties: {},

    data: {
        title: "附加",
        show: false,
        items: [
            { name: "", total: "" }
        ],
        result: "",
        total: 0
    },

    methods: {
        bindCheckTitle: function () {
            var newShow = !this.data.show;
            this.setData({ show: newShow });
            if (newShow) {
                this.recalc();
            } else {
                // 收起时也触发一次父页面重新计算，通知父级不显示状态改变
                this.setData({ result: "", total: 0 });
                this.triggerEvent("addSum", {
                    addValue: "",
                    sum: 0,
                    show: false
                });
            }
        },

        bindAddAndDel: function (e) {
            var tag = e.currentTarget.dataset.tag;
            var items = this.data.items.slice();
            if (tag === "add") {
                items.push({ name: "", total: "" });
            } else if (tag === "del") {
                var idx = Number(e.currentTarget.dataset.idx);
                if (items.length > 1) {
                    items.splice(idx, 1);
                }
            }
            this.setData({ items: items });
            this.recalc();
        },

        bindDataListInput: function (e) {
            var tag = e.currentTarget.dataset.tag;
            var idx = Number(e.currentTarget.dataset.idx);
            var value = e.detail.value;
            var items = this.data.items.slice();
            items[idx] = Object.assign({}, items[idx]);
            items[idx][tag] = value;
            this.setData({ items: items });
            this.recalc();
        },

        recalc: function () {
            var items = this.data.items;
            var total = 0;
            var lines = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var val = parseFloat(item.total);
                if (isNaN(val)) val = 0;
                total += val;
                if (item.name || item.total) {
                    lines.push((item.name || ("项" + (i + 1))) + "：" + (item.total || "0") + "元");
                }
            }
            var desc = lines.length > 0 ? lines.join("\n") : "";
            this.setData({ result: desc, total: total });
            this.triggerEvent("addSum", {
                addValue: desc,
                sum: total,
                show: this.data.show
            });
        }
    }
});
