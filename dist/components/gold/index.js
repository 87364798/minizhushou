Component({
    properties: {},
    data: {
        weight: 0,
        loss: 0,
        price: 0,
        part: 0,
        chain: 0,
        laborCost: 0,
        gold: [ {
            title: "金重",
            placeholder: "克",
            value: ""
        }, {
            title: "损耗",
            placeholder: "%",
            value: ""
        }, {
            title: "金价",
            placeholder: "元/克",
            value: ""
        }, {
            title: "配件",
            placeholder: "克",
            value: ""
        }, {
            title: "链重",
            placeholder: "克",
            value: ""
        }, {
            title: "胚底",
            placeholder: "元",
            value: ""
        } ],
        result: ""
    },
    methods: {
        bindKeyInput: function(a) {
            var t = a.target.id;
            if (a.detail.value) e = parseFloat(a.detail.value); else var e = 0;
            switch (t) {
              case "0":
                this.data.weight = e;
                break;

              case "1":
                this.data.loss = e;
                break;

              case "2":
                this.data.price = e;
                break;

              case "3":
                this.data.part = e;
                break;

              case "4":
                this.data.chain = e;
                break;

              case "5":
                this.data.laborCost = e;
            }
            this.data.gold[t].value = e;
            var l = this.data.weight, i = this.data.loss, s = this.data.price, r = this.data.part, d = this.data.chain, h = this.data.laborCost, o = (l + r + d) * (1 + i / 100) * s + h, c = this.data.gold, u = "金 \n " + c[0].title + "：" + (c[0].value + c[3].value + c[4].value) + c[0].placeholder + " \n ", p = {
                goldValue: u = (u = (u = u + c[1].title + "：" + c[1].value + c[1].placeholder + " \n ") + c[5].title + "：" + c[5].value + c[5].placeholder + " \n ") + "金工耗：" + o.toFixed(0) + "元",
                sum: o,
                laborCost: h
            };
            this.setData({
                result: u
            }), this.triggerEvent("goldSum", p);
        }
    }
});