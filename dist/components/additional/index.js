Component({
    properties: {},
    data: {
        title: "附加",
        show: !1,
        items: [ {
            name: "",
            total: ""
        } ]
    },
    methods: {
        bindCheckTitle: function(t) {
            this.setData({
                show: !this.data.show
            }), this.sum();
        },
        bindAddAndDel: function(t) {
            var a = t.currentTarget.dataset.tag, e = this.data.items;
            if ("add" == a) {
                var s = new Object();
                s.name = "", s.total = "", e.push(s);
            } else if ("del" == a) {
                var i = t.currentTarget.id;
                e.splice(i, 1);
            }
            this.setData({
                items: e
            }), this.sum();
        },
        bindDataListInput: function(t) {
            var a = t.currentTarget.dataset, e = t.detail.value, s = t.currentTarget.id;
            switch (a.tag) {
              case "name":
                this.data.items[s].name = e;
                break;

              case "total":
                this.data.items[s].total = e;
            }
            this.sum();
        },
        sum: function() {
            for (var t = this.data.items, a = 0, e = "", s = 0; s < t.length; s++) {
                var i = parseFloat(t[s].total);
                isNaN(i) && (i = 0), a += i, e = e + t[s].name + "：" + t[s].total + " \n ";
            }
            var n = {
                addValue: e,
                sum: a,
                show: this.data.show
            };
            this.triggerEvent("addSum", n);
        }
    }
});