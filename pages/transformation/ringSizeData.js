// ringSizeData.js
// 戒指尺寸对照表 —— 数据来源于项目根目录 ringsize.csv。
// 每一条包含：港度(hk)、欧度(eu)、美度(us)、日度(jp)、直径 mm(diameter)、周长 mm(circumference)。
// 对外提供统一的查询函数，其他页面直接 require 本文件即可使用。

var RING_SIZE_TABLE = [
    { hk: 1,  eu: 41, us: 1,    jp: null, diameter: 12.0,  circumference: 37.70 },
    { hk: 2,  eu: 42, us: 1.25, jp: null, diameter: 12.5,  circumference: 39.27 },
    { hk: 3,  eu: 43, us: 1.75, jp: 1,    diameter: 12.9,  circumference: 40.53 },
    { hk: 4,  eu: 44, us: 2,    jp: 2,    diameter: 13.3,  circumference: 41.78 },
    { hk: 5,  eu: 45, us: 2.5,  jp: 3,    diameter: 13.6,  circumference: 42.73 },
    { hk: 6,  eu: 46, us: 3,    jp: 4,    diameter: 14.25, circumference: 44.77 },
    { hk: 7,  eu: 47, us: 3.25, jp: 5,    diameter: 15.6,  circumference: 49.01 },
    { hk: 8,  eu: 48, us: 3.75, jp: 6,    diameter: 14.9,  circumference: 46.81 },
    { hk: 9,  eu: 49, us: 4.25, jp: 7,    diameter: 15.3,  circumference: 48.07 },
    { hk: 10, eu: 50, us: 4.75, jp: 9,    diameter: 15.65, circumference: 49.17 },
    { hk: 11, eu: 51, us: 5,    jp: 10,   diameter: 16.0,  circumference: 50.27 },
    { hk: 12, eu: 52, us: 5.5,  jp: 11,   diameter: 16.3,  circumference: 51.21 },
    { hk: 13, eu: 53, us: 6,    jp: 12,   diameter: 16.6,  circumference: 52.15 },
    { hk: 14, eu: 54, us: 6.25, jp: 13,   diameter: 17.0,  circumference: 53.41 },
    { hk: 15, eu: 55, us: 6.75, jp: 14,   diameter: 17.4,  circumference: 54.66 },
    { hk: 16, eu: 56, us: 7,    jp: 15,   diameter: 17.7,  circumference: 55.61 },
    { hk: 17, eu: 57, us: 7.5,  jp: 16,   diameter: 18.1,  circumference: 56.86 },
    { hk: 18, eu: 58, us: 8,    jp: 17,   diameter: 18.4,  circumference: 57.81 },
    { hk: 19, eu: 59, us: 8.5,  jp: 18,   diameter: 18.8,  circumference: 59.06 },
    { hk: 20, eu: 60, us: 9,    jp: 19,   diameter: 19.15, circumference: 60.16 },
    { hk: 21, eu: 61, us: 9.25, jp: 20,   diameter: 19.5,  circumference: 61.26 },
    { hk: 22, eu: 62, us: 9.75, jp: 21,   diameter: 19.85, circumference: 62.36 },
    { hk: 23, eu: 63, us: 10.25,jp: 22,   diameter: 20.15, circumference: 63.30 },
    { hk: 24, eu: 64, us: 10.5, jp: 23,   diameter: 20.55, circumference: 64.56 },
    { hk: 25, eu: 65, us: 11,   jp: 24,   diameter: 20.9,  circumference: 65.66 },
    { hk: 26, eu: 66, us: 11.5, jp: 25,   diameter: 21.25, circumference: 66.76 },
    { hk: 27, eu: 67, us: 11.75,jp: 26,   diameter: 21.6,  circumference: 67.86 },
    { hk: 28, eu: 68, us: 12.25,jp: 27,   diameter: 21.9,  circumference: 68.80 },
    { hk: 29, eu: 69, us: 12.5, jp: 28,   diameter: 22.2,  circumference: 69.74 },
    { hk: 30, eu: 70, us: 13,   jp: 29,   diameter: 22.5,  circumference: 70.69 }
];

// 港度范围（便于其他页面给滑条设置上下限）
var HK_MIN = 1;
var HK_MAX = 30;

/**
 * 返回完整数据表。
 * @returns {Array<{hk:number,eu:number,us:number,jp:number|null,diameter:number,circumference:number}>}
 */
function getAll() {
    return RING_SIZE_TABLE;
}

/**
 * 按港度精确查找。
 * @param {number} hk 1..30 的整数
 * @returns {object|null}
 */
function getByHongKong(hk) {
    var n = Number(hk);
    if (isNaN(n)) return null;
    for (var i = 0; i < RING_SIZE_TABLE.length; i++) {
        if (RING_SIZE_TABLE[i].hk === n) return RING_SIZE_TABLE[i];
    }
    return null;
}

/**
 * 按港度返回直径 mm。非整数港度做与相邻两个港度的线性插值。
 * 不在 1..30 范围内时做边界截断。
 * @param {number} hk
 * @returns {number}
 */
function hkSizeToDiameter(hk) {
    if (hk === null || hk === undefined || isNaN(Number(hk))) {
        return RING_SIZE_TABLE[0].diameter;
    }
    var n = Number(hk);
    if (n <= HK_MIN) return RING_SIZE_TABLE[0].diameter;
    if (n >= HK_MAX) return RING_SIZE_TABLE[RING_SIZE_TABLE.length - 1].diameter;
    var lo = Math.floor(n);
    var hi = lo + 1;
    if (lo === n) {
        var exact = getByHongKong(lo);
        return exact ? exact.diameter : RING_SIZE_TABLE[lo - 1].diameter;
    }
    var loRow = getByHongKong(lo);
    var hiRow = getByHongKong(hi);
    if (!loRow || !hiRow) return RING_SIZE_TABLE[Math.round(n) - 1].diameter;
    var frac = n - lo;
    return loRow.diameter * (1 - frac) + hiRow.diameter * frac;
}

/**
 * 按港度返回周长 mm（线性插值，直径 * PI）。
 * @param {number} hk
 * @returns {number}
 */
function hkSizeToCircumference(hk) {
    return Math.PI * hkSizeToDiameter(hk);
}

/**
 * 按直径 mm 返回最接近的一条记录（返回完整对象，包含港度等）。
 * @param {number} diameter
 * @returns {object|null}
 */
function getByDiameter(diameter) {
    var n = Number(diameter);
    if (isNaN(n) || n <= 0) return null;
    var best = null;
    var bestDiff = Infinity;
    for (var i = 0; i < RING_SIZE_TABLE.length; i++) {
        var diff = Math.abs(RING_SIZE_TABLE[i].diameter - n);
        if (diff < bestDiff) {
            bestDiff = diff;
            best = RING_SIZE_TABLE[i];
        }
    }
    return best;
}

/**
 * 按周长 mm 返回最接近的一条记录。
 * @param {number} circumference
 * @returns {object|null}
 */
function getByCircumference(circumference) {
    var n = Number(circumference);
    if (isNaN(n) || n <= 0) return null;
    var best = null;
    var bestDiff = Infinity;
    for (var i = 0; i < RING_SIZE_TABLE.length; i++) {
        var diff = Math.abs(RING_SIZE_TABLE[i].circumference - n);
        if (diff < bestDiff) {
            bestDiff = diff;
            best = RING_SIZE_TABLE[i];
        }
    }
    return best;
}

/**
 * 按欧度精确匹配。
 * @param {number} eu
 * @returns {object|null}
 */
function getByEurope(eu) {
    var n = Number(eu);
    if (isNaN(n)) return null;
    for (var i = 0; i < RING_SIZE_TABLE.length; i++) {
        if (RING_SIZE_TABLE[i].eu === n) return RING_SIZE_TABLE[i];
    }
    return null;
}

/**
 * 按美度精确匹配（1.25 / 1.75 这类半码也支持）。
 * @param {number} us
 * @returns {object|null}
 */
function getByUS(us) {
    var n = Number(us);
    if (isNaN(n)) return null;
    for (var i = 0; i < RING_SIZE_TABLE.length; i++) {
        if (Math.abs(RING_SIZE_TABLE[i].us - n) < 0.01) return RING_SIZE_TABLE[i];
    }
    return null;
}

/**
 * 按日度精确匹配。csv 中日度存在两条空值（港度 1、2），此时返回 null。
 * @param {number} jp
 * @returns {object|null}
 */
function getByJapan(jp) {
    var n = Number(jp);
    if (isNaN(n)) return null;
    for (var i = 0; i < RING_SIZE_TABLE.length; i++) {
        if (RING_SIZE_TABLE[i].jp === n) return RING_SIZE_TABLE[i];
    }
    return null;
}

module.exports = {
    HK_MIN: HK_MIN,
    HK_MAX: HK_MAX,
    getAll: getAll,
    getByHongKong: getByHongKong,
    hkSizeToDiameter: hkSizeToDiameter,
    hkSizeToCircumference: hkSizeToCircumference,
    getByDiameter: getByDiameter,
    getByCircumference: getByCircumference,
    getByEurope: getByEurope,
    getByUS: getByUS,
    getByJapan: getByJapan
};
