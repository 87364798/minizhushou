module.exports.BinarySearch = function(t, e, l) {
    for (var a = 0, n = t.length - 1, r = Math.floor((a + n) / 2), o = t[a] <= t[n]; a < n && t[r] !== e; ) t[r] > e ? (o && (n = r - 1), 
    !o && (a = r + 1)) : (!o && (n = r - 1), o && (a = r + 1)), r = Math.floor((a + n) / 2);
    if (t[r] != e && t.length > 1) {
        var u = null, h = null, g = null;
        h = Math.abs(t[r] - e), 0 != r && (u = Math.abs(t[r - 1] - e)), r != t.length - 1 && (g = Math.abs(t[r + 1] - e)), 
        null == u && h > g ? r += 1 : null == g && u < h ? r -= 1 : u == h ? (0 == l | void 0 === l | isNaN(l) | null == l && (l = -1), 
        r += l) : u < h && h < g ? r -= 1 : u > h && h > g && (r += 1);
    }
    return r;
}, module.exports.getDate = function() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1) + "-" + (t.getDate() < 10 ? "0" + t.getDate() : t.getDate());
};