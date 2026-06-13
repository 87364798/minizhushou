// ringSize.js —— 手寸转换工具模块
// 使用本地 ringSizeData.js 作为离线数据源，不再依赖远程 Parse 服务器。
// 对外提供 init / setViewData 等接口，兼容原 index.js 的调用方式。

var ringSizeData = require("./ringSizeData.js");

// 视图配置：每一条代表一个"输入框 + 说明"项。
// key 字段用来区分输入类型：hk / eu / us / jp / diameter / circumference。
// iconType: "flag" 表示使用国旗 PNG，"vector" 表示使用 CSS 绘制的矢量图标。
// iconUrl:  flag 类型时对应的 PNG 路径（相对于小程序根目录，用 /images 绝对路径）。
var VIEW_CONFIG = [
    {
        key: "hk",
        title: "港度 (HK)",
        hint: "常用港度 1 - 30",
        min: ringSizeData.HK_MIN,
        max: ringSizeData.HK_MAX,
        step: 1,
        unit: "号",
        iconType: "flag",
        iconUrl: "/images/hk.png"
    },
    {
        key: "eu",
        title: "欧度 (EU)",
        hint: "欧度 41 - 70",
        min: 41,
        max: 70,
        step: 1,
        unit: "号",
        iconType: "flag",
        iconUrl: "/images/eu.png"
    },
    {
        key: "us",
        title: "美度 (US)",
        hint: "美度 1 - 13（含半码）",
        min: 1,
        max: 13,
        step: 0.25,
        unit: "号",
        iconType: "flag",
        iconUrl: "/images/us.png"
    },
    {
        key: "jp",
        title: "日度 (JP)",
        hint: "日度 1 - 29",
        min: 1,
        max: 29,
        step: 1,
        unit: "号",
        iconType: "flag",
        iconUrl: "/images/jp.png"
    },
    {
        key: "diameter",
        title: "直径",
        hint: "戒指内直径（毫米）",
        min: 12.0,
        max: 22.5,
        step: 0.1,
        unit: "mm",
        iconType: "vector-diameter"
    },
    {
        key: "circumference",
        title: "周长",
        hint: "戒指内周长（毫米）",
        min: 37.7,
        max: 70.7,
        step: 0.1,
        unit: "mm",
        iconType: "vector-circumference"
    }
];

// 内部状态：保存当前各个字段的值（字符串形式，便于双向绑定）
var _values = {
    hk: "",
    eu: "",
    us: "",
    jp: "",
    diameter: "",
    circumference: ""
};

/**
 * 根据"源字段 + 数值"，推算并填充其他字段的值。
 * @param {string} sourceKey  hk / eu / us / jp / diameter / circumference
 * @param {number} numValue   已经解析过的数字
 * @returns {object} 填充好的 values 对象
 */
function computeFrom(sourceKey, numValue) {
    var result = {
        hk: "", eu: "", us: "", jp: "",
        diameter: "", circumference: ""
    };
    if (numValue === null || numValue === undefined || isNaN(numValue) || numValue <= 0) {
        return result;
    }

    // 先把直径 diameter 求出来（统一的中间量）
    var diameter = null;
    var row = null;

    switch (sourceKey) {
        case "hk":
            diameter = ringSizeData.hkSizeToDiameter(numValue);
            break;
        case "eu":
            row = ringSizeData.getByEurope(numValue);
            if (row) diameter = row.diameter;
            break;
        case "us":
            row = ringSizeData.getByUS(numValue);
            if (row) diameter = row.diameter;
            break;
        case "jp":
            row = ringSizeData.getByJapan(numValue);
            if (row) diameter = row.diameter;
            break;
        case "diameter":
            diameter = numValue;
            break;
        case "circumference":
            diameter = numValue / Math.PI;
            break;
    }

    if (diameter === null || isNaN(diameter) || diameter <= 0) {
        return result;
    }

    // 用直径反查最接近的一条完整记录
    var best = ringSizeData.getByDiameter(diameter);
    var circ = Math.PI * diameter;

    result.hk = best ? (best.hk) : "";
    result.eu = best && best.eu ? (best.eu) : "";
    result.us = best && best.us ? (best.us) : "";
    result.jp = best && best.jp ? (best.jp) : "";
    result.diameter = parseFloat(diameter.toFixed(2));
    result.circumference = parseFloat(circ.toFixed(2));

    // 源字段要使用用户输入的原始值，不被反查覆盖
    result[sourceKey] = numValue;
    return result;
}

/**
 * 把内部 values 同步到 Page 的 data.grids。
 * @param {object} pageCtx 小程序页面对象（this）
 */
function syncToPage(pageCtx) {
    var grids = [];
    for (var i = 0; i < VIEW_CONFIG.length; i++) {
        var cfg = VIEW_CONFIG[i];
        grids.push({
            key: cfg.key,
            title: cfg.title,
            hint: cfg.hint,
            unit: cfg.unit,
            min: cfg.min,
            max: cfg.max,
            step: cfg.step,
            iconType: cfg.iconType,
            iconUrl: cfg.iconUrl || "",
            value: _values[cfg.key] === "" ? "" : String(_values[cfg.key])
        });
    }
    pageCtx.setData({ grids: grids });
}

// ====== 对外接口（保持与 index.js 调用兼容）======

module.exports.init = function(pageCtx) {
    // 初始化：默认给港度一个中值，其他字段自动计算
    var defaultHK = 15;
    _values = computeFrom("hk", defaultHK);
    syncToPage(pageCtx);
};

module.exports.setViewData = function(pageCtx) {
    // 兼容旧接口：没有参数时使用上次保存的 page 引用
    if (pageCtx && pageCtx.setData) {
        syncToPage(pageCtx);
    }
    return true;
};

/**
 * 处理输入框变化：输入字符串 -> 尝试解析为数字 -> 重算所有字段 -> 同步到页面
 * @param {object} pageCtx
 * @param {object} event    bindinput 事件对象
 */
module.exports.inputTransformation = function(pageCtx, event) {
    var key = event.currentTarget && event.currentTarget.id;
    if (!key) return;
    var raw = event.detail && event.detail.value;
    if (raw === "" || raw === null || raw === undefined) {
        _values[key] = "";
        syncToPage(pageCtx);
        return;
    }
    var num = parseFloat(raw);
    if (isNaN(num) || num <= 0) {
        _values[key] = raw; // 保留用户正在输入的内容，但不触发重算
        syncToPage(pageCtx);
        return;
    }
    _values = computeFrom(key, num);
    syncToPage(pageCtx);
};

/**
 * 处理滑条变化。
 * @param {object} pageCtx
 * @param {object} event    bindchange / bindchanging 事件对象
 */
module.exports.pickerTransformation = function(pageCtx, event) {
    var key = event.currentTarget && event.currentTarget.id;
    if (!key) return;
    var num;
    if (event.detail && typeof event.detail.value === "number") {
        num = event.detail.value;
    } else {
        num = parseFloat(event.detail && event.detail.value);
    }
    if (isNaN(num) || num <= 0) return;
    _values = computeFrom(key, num);
    syncToPage(pageCtx);
};
