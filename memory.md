# 项目记忆档案 (memory.md)

> 项目类型：微信小程序
> 项目路径：`d:\document\_-560606841_6`
> 工作目录：`d:\document\_-560606841_6`
> GitHub 仓库：https://github.com/87364798/minizhushou.git
> 最近一次提交：`"围钻计算逻辑修复完成"`（2026-06-13 前后）

---

## 一、项目概述

这是一个**微信小程序**项目，主要功能是珠宝相关的计算工具，包括：
- **围钻预算**（aroundDiamonds）— 核心交互页
- **手寸转换**（transformation / ringSize）
- **价格计算器**（calculator）
- **金工计**（gratuity）
- 首页导航（index）
- 活动数据展示（web）

核心技术栈：WXML + WXSS + JavaScript，使用 Vant Weapp 组件库（`vant`）和 MinUI 组件库（`minui`）。

---

## 二、已完成的修复与优化（按时间线）

### 2.1 基础库版本升级
- 文件：[project.config.json](file:///d:/document/_-560606841_6/project.config.json)
- 修改：`libVersion` 从 **2.31.0** 升级到 **3.16.0**

### 2.2 ringSize.js 逻辑错误修复
- 文件：[pages/transformation/ringSize.js](file:///d:/document/_-560606841_6/pages/transformation/ringSize.js)
- 修复内容：
  - `if (NaN !== a)` → `if (!isNaN(a))`（NaN 比较永远为 true）
  - `"" === i` → `if (!i || i.length === 0)`（数组空判断错误）
  - 完善数据初始化函数 `r()`，增加 `return true/false` 返回值
  - 优化 `setViewData` 函数错误处理

### 2.3 其他文件的逻辑与错误处理完善
- [utils/dataer.js](file:///d:/document/_-560606841_6/utils/dataer.js)
- [utils/init.js](file:///d:/document/_-560606841_6/utils/init.js)
- 修复了类似的 NaN 判断、空数组判断、数据初始化等问题

### 2.4 围钻预算页面（aroundDiamonds）完整重做

#### 2.4.1 页面显示不正常修复
- **根因**：WXML 缺少 `wx:for` 循环导致只显示一个输入框；缺少样式文件导致布局错乱
- **修复**：在 [index.wxml](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.wxml) 中添加 `wx:for="{{items}}"` 循环；创建 [index.wxss](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.wxss) 定义样式

#### 2.4.2 滑条（slider）取值功能
- 为以下字段添加滑条：主石/手寸、副石、粒数、主副距离/与戒圈距离
- **副副间距** 改为**只读**（由其他参数反算，不再允许用户输入）
- 在 [index.js](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.js) 的 `items` 数据中添加：
  - `min`：滑条最小值
  - `max`：滑条最大值
  - `step`：滑条步长
  - `unit`：单位（如`"粒"`、`"mm"`）
  - `bubbleLeft`：气泡标签位置（百分比）
- 实现事件：
  - `bindSliderChange`：滑条拖动结束时更新数据
  - `bindSliderChanging`：滑条拖动过程中**实时**更新气泡位置和数值
- **取消"开始计算"按钮**：改由滑条/输入框变化实时触发重绘

#### 2.4.3 输入框与滑条双向同步
- 在 `bindInput` 中：输入框值改变时同步更新 `items[index].value`，同时更新气泡位置 `bubbleLeft`
- 在 `bindSliderChange` 中：滑条值改变时同步更新 `items[index].value`
- 非数字输入时处理为 `""`

#### 2.4.4 气泡标签实时跟随滑条
- 移除原生 `show-value`
- 在 WXML 中添加自定义 `.bubble` 元素，显示数值和单位
- 通过 `bubbleLeft` 百分比动态定位在滑动圆圈上方
- 使用 `bindchanging`（而非仅 `bindchange`）实现拖动过程中气泡**实时同步移动**，不延迟
- **左右两端被遮挡修复**：父容器 `.slider-wrap` / `.param-cell` 全部改为 `overflow: visible`，JS 中 `bubbleLeft` 限制在 **6%..94%** 安全范围内，并给 `.slider-wrap` 加左右 padding 预留空间

#### 2.4.5 粒数单位明确为"粒"
- 在 items 中粒数的 `unit` 字段设置为 `"粒"`
- WXML 中使用 `{{item.unit}}` 取代硬编码

#### 2.4.6 Canvas 绘图颜色区分
- 文件：[index.js](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.js) 的 `flower` 和 `ring` 函数
- **主石**：红色 `#FF0000`
- **戒圈**：蓝色 `#0000FF`
- **副石**：黄橙色 `#FF9900`

#### 2.4.7 Canvas 被遮挡问题修复
- 调整 canvas 高度为 **300px**，宽度 100%
- 页面 `page-wrap` 的 padding 为 0，使 canvas 全宽显示
- 为其他卡片元素添加左右 margin 留出空间
- 修正绘制中心点偏移问题
- **最新状态**：canvas 位于页面顶部，参数卡片在下方，整体不滚动

#### 2.4.8 美感设计优化
- 卡片式布局（圆角 + 阴影 + 浅色渐变背景）
- 标题使用深色加粗字体
- 输入框使用浅色背景
- 滑条激活颜色 `#FF9900`（黄橙色主题）
- 气泡标签使用渐变背景 + 圆角 + 阴影
- 副副间距卡片使用**虚线边框 + 浅色背景**标记为只读
- 戒指模式下，手寸卡片下方额外展示 **直径 / 周长** 提示行
- **整页单屏显示**：压缩卡片 padding 与字体，确保手机竖屏时所有内容无需下拉滚动即可完整呈现

#### 2.4.9 花头 / 戒指模式默认值（进入页面即有图案）
- **花头模式**（radio === "1"）默认：主石 6mm，副石 1.5mm，粒数 8，主副距离 0.5mm
- **戒指模式**（radio === "2"）默认：港度 15（约直径 17.4mm，周长 54.7mm），副石 1.5mm，粒数 8，与戒圈距离 0.3mm
- `onLoad` 中根据 `radio` 初始化 `items` 并立即调用 `drawWithCurrentItems()`

#### 2.4.10 Canvas 跟随数值变化实时重绘（无"开始计算"按钮）
- 新增 `drawWithCurrentItems()`：从 `items` 读数 → 校验 → 计算副副间距 → 更新 UI → 调用 `draw()`
- 新增 `scheduleDraw()`：80ms 节流，避免滑条拖动过快时频繁重绘
- `bindInput`、`bindSliderChange`、`bindSliderChanging`、`onRadioChange`、`onLoad` 均触发 `scheduleDraw()`
- **彻底删除 `onClick` 方法** 和底部"开始计算"按钮（WXML / WXSS / JS 三处清理）

#### 2.4.11 副副间距改为只读（由其他参数反算）
- 公式：
  - **花头**：`centerR = (主石 + 副石) / 2 + 主副距离`
  - **戒指**：`centerR = 手寸半径 + 0.433 * 副石 + 与戒圈距离`
  - `angleDeg = 360 / 粒数`
  - `chordLen = sqrt(2 * centerR^2 - 2 * centerR^2 * cos(angleDeg))`
  - `副副间距 = chordLen - 副石直径`，保留 2 位小数，负值夹到 0
- UI：该卡片用虚线边框 + 只读文字 `param-input-readonly` 展示，下方附"由其他参数自动计算得出"提示
- 交互：仅 items[4]（主副距离/与戒圈距离）作为 spacing 参与计算，**items[3] 不再读入，只显示**

#### 2.4.12 主副距离 / 与戒圈距离参数调整失效修复
- **根因**：`drawWithCurrentItems` 中把 items[3]（副副间距）误当作 spacing 传入，而 items[4]（真正的 spacing）被忽略
- **修复**：统一从 `items[4]` 读取 `spacing`，并作为 `draw(a, e, i, 0, spacing)` 的第 5 个参数传入

#### 2.4.13 手寸采用港度，戒指直径参与计算
- **戒指模式** items[0].title = "手寸"，单位 "港度"，范围 1..30
- 参与计算时：`直径 = ringSizeData.hkSizeToDiameter(港度)`
- 在手寸卡片下方额外行显示：`直径 XX.XX mm · 周长 YY.YY mm`

#### 2.4.14 戒指尺寸数据独立模块化（ringSizeData.js）
- 新增文件：[pages/transformation/ringSizeData.js](file:///d:/document/_-560606841_6/pages/transformation/ringSizeData.js)
- 数据来源：项目根目录 `ringsize.csv`
- `RING_SIZE_TABLE` 数组字段：`hk`（港度）、`eu`（欧度）、`us`（美度）、`jp`（日度）、`diameter`（直径 mm）、`circumference`（周长 mm）
- 提供的接口：
  - `HK_MIN` / `HK_MAX`
  - `getAll()` → 返回整张表
  - `getByHongKong(hk)` → 按港度查行
  - `hkSizeToDiameter(hk)` → 港度转直径（支持非整数线性插值，范围外做边界截断）
  - `hkSizeToCircumference(hk)` → 港度转周长
  - `getByDiameter(d)`、`getByCircumference(c)`、`getByEurope(eu)`、`getByUS(us)`、`getByJapan(jp)`
- **用法**：
  ```javascript
  var ringSizeData = require("../transformation/ringSizeData.js");
  var diameter = ringSizeData.hkSizeToDiameter(15); // 约 17.4mm
  ```
- 后续若要增加尺寸相关业务，统一扩展该文件即可，其他页面直接 `require` 复用

### 2.5 Git 版本控制
- 文件：[.gitignore](file:///d:/document/_-560606841_6/.gitignore) — 添加 `project.private.config.json`
- 初始化仓库、配置身份（name: 87364798，email: 873645798@qq.com）
- 提交历史：
  - `"组件库更新，围钻页面修复完成"` — 首次提交
  - `"添加memory.md"` — 新增记忆档案
  - `"围钻计算逻辑修复完成"` — 本次提交（副副间距只读、港度转换、实时重绘、取消按钮、气泡修复等）
- 远程仓库：`https://github.com/87364798/minizhushou.git`
- 推送分支：`master`

---

## 三、关键代码参考（供后续复用时直接对照）

### 3.1 ringSize.js 数据初始化函数
```javascript
function r() {
    i = wx.getStorageSync("ringSizeView");
    o = wx.getStorageSync("ringSize");

    if (!i || !o || i.length === 0 || o.length === 0) {
        console.log("数据未加载，请检查本地存储");
        return false;
    }

    for (var e = 0; e < o.length; e++) {
        c[o[e].index] = o[e].circumference;
        s[o[e].index] = o[e].diameter;
    }
    return true;
}
```

### 3.2 aroundDiamonds / index.js — bindSliderChanging（实时气泡）
```javascript
bindSliderChanging: function(a) {
    var index = a.currentTarget.id;
    var val = a.detail.value;
    var items = this.data.items;
    var range = items[index].max - items[index].min;
    var pct = range > 0 ? ((val - items[index].min) / range * 100) : 0;
    if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
    if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
    items[index].bubbleLeft = pct + "%";
    if (index === "2") {
        items[2].value = val;
    } else {
        items[index].value = parseFloat(val.toFixed(2));
    }
    this.setData({ items: items });
    this.scheduleDraw();
},
```

### 3.3 aroundDiamonds / index.js — drawWithCurrentItems（核心实时计算）
```javascript
var BUBBLE_LEFT_MIN = 6;
var BUBBLE_LEFT_MAX = 94;
var ringSizeData = require("../transformation/ringSizeData.js");

drawWithCurrentItems: function() {
    var r = this.data.items;
    var aRaw = parseFloat(r[0].value);
    // 戒指模式：港度 → 直径 mm；花头模式：直接就是 mm
    var a = this.data.radio === "2" ? ringSizeData.hkSizeToDiameter(aRaw) : aRaw;
    var e = parseFloat(r[1].value);
    var i = parseInt(r[2].value);
    // items[3] 是副副间距，只读，不再读入；items[4] 是主副距离/与戒圈距离
    var spacing = parseFloat(r[4].value);
    if (isNaN(a) || a <= 0) return;
    if (isNaN(i) || i <= 2) return;
    if (isNaN(e) || e <= 0) e = 0.1;
    if (isNaN(spacing) || spacing < 0) spacing = 0;

    // 反算副副间距（弦长 - 副石直径）
    var centerR;
    if (this.data.radio === "2") {
        centerR = a / 2 + 0.433 * e + spacing;
    } else {
        centerR = (a + e) / 2 + spacing;
    }
    var angDeg = 360 / i;
    var chordLen = Math.sqrt(2 * centerR * centerR - 2 * centerR * centerR * Math.cos(angDeg * Math.PI / 180));
    var calcSpacing = parseFloat((chordLen - e).toFixed(2));
    if (calcSpacing < 0) calcSpacing = 0;

    var items = this.data.items;
    if (items[3] && items[3].value !== calcSpacing) {
        items[3].value = calcSpacing;
        var range = items[3].max - items[3].min;
        var pct = range > 0 ? ((calcSpacing - items[3].min) / range * 100) : 0;
        if (pct < BUBBLE_LEFT_MIN) pct = BUBBLE_LEFT_MIN;
        if (pct > BUBBLE_LEFT_MAX) pct = BUBBLE_LEFT_MAX;
        items[3].bubbleLeft = pct + "%";
    }
    var updatePayload = { items: items };
    if (this.data.radio === "2") {
        updatePayload.ringDiameter = a.toFixed(2);
        updatePayload.ringCircumference = (Math.PI * a).toFixed(2);
    }
    this.setData(updatePayload);
    // draw(a, 副石, 粒数, <未使用>, 主副距离/与戒圈距离)
    this.draw(a, e, i, 0, spacing);
},

scheduleDraw: function() {
    if (this._drawTimer) return;
    var self = this;
    this._drawTimer = setTimeout(function() {
        self._drawTimer = null;
        self.drawWithCurrentItems();
    }, 80);
}
```

### 3.4 aroundDiamonds / index.js — flower / ring 函数（颜色区分）
```javascript
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
}
```

### 3.5 aroundDiamonds / index.wxml — 卡片 + 滑条 + 气泡 + 副副间距只读
```xml
<view class="param-cell {{index === 3 ? 'param-cell-readonly' : ''}}" wx:for="{{items}}" wx:key="index">
    <view class="param-head">
        <text class="param-title">{{item.title}}</text>
        <view class="param-input-box">
            <input wx:if="{{index !== 3}}" bindinput="bindInput" class="param-input" id="{{index}}" type="digit" value="{{item.value}}"></input>
            <text wx:if="{{index === 3}}" class="param-input param-input-readonly">{{item.value}}</text>
            <text class="param-unit">{{item.unit}}</text>
        </view>
    </view>
    <!-- 戒指模式下，手寸卡片下方展示实际直径与周长 -->
    <view class="hk-hint" wx:if="{{index === 0 && radio === '2'}}">
        <text>直径 {{ringDiameter}} mm · 周长 {{ringCircumference}} mm</text>
    </view>
    <view class="slider-wrap" wx:if="{{index !== 3}}">
        <view class="bubble" style="left: {{item.bubbleLeft}};">
            <text>{{item.value === '' ? item.min : item.value}}{{item.unit}}</text>
        </view>
        <slider bindchange="bindSliderChange" bindchanging="bindSliderChanging" id="{{index}}" class="param-slider" min="{{item.min}}" max="{{item.max}}" step="{{item.step}}" value="{{item.value === '' ? item.min : item.value}}" block-size="16" activeColor="#FF9900" backgroundColor="#f0e6d8" block-color="#FF9900"></slider>
    </view>
    <view class="result-line" wx:if="{{index === 3}}">
        <text class="result-label">由其他参数自动计算得出</text>
    </view>
    <view class="range-line" wx:if="{{index !== 3}}">
        <text>{{item.min}}</text>
        <text>{{item.max}}</text>
    </view>
</view>
```

### 3.6 aroundDiamonds / index.wxss — 气泡 + 卡片 + 只读副副间距
```css
.slider-wrap {
    position: relative;
    padding: 6rpx 16rpx 4rpx;
    flex-shrink: 0;
    overflow: visible;
}

.bubble {
    position: absolute;
    top: -4rpx;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #FF9900 0%, #FF6B00 100%);
    color: #fff;
    padding: 2rpx 12rpx;
    border-radius: 8rpx;
    font-size: 18rpx;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 2rpx 6rpx rgba(255, 153, 0, 0.3);
    z-index: 10;
}

.preview-canvas {
    width: 100%;
    height: 300px;
    display: block;
}

.param-cell-readonly {
    background: linear-gradient(135deg, #fafafa 0%, #f4f4f4 100%);
    border: 2rpx dashed #dcdcdc;
}

.hk-hint {
    padding: 4rpx 8rpx 6rpx;
    text-align: center;
    font-size: 16rpx;
    color: #FF9900;
    background: #fff5e6;
    border-radius: 8rpx;
    margin-top: 4rpx;
    flex-shrink: 0;
}
```

### 3.7 ringSizeData.js — 港度 → 直径插值
```javascript
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
```

---

## 四、常见问题的调试经验（Lessons Learned）

### 4.1 判断 NaN
- ❌ 错误：`if (NaN !== a)`（永远为 true）
- ✅ 正确：`if (!isNaN(a))`

### 4.2 判断数组为空
- ❌ 错误：`"" === i`（对数组做字符串比较）
- ✅ 正确：`if (!i || i.length === 0)`

### 4.3 Canvas 原生组件层级问题
- 微信小程序的 canvas 是原生组件，z-index 在某些场景下无效
- 解决：使用合适的容器包裹 canvas，调整页面 padding/margin，使 canvas 在正确的位置全宽显示

### 4.4 滑条实时更新
- ❌ 仅使用 `bindchange`：气泡更新滞后，用户体验差
- ✅ 使用 `bindchanging`：拖动过程中实时更新气泡位置和数值

### 4.5 气泡位置计算
- 公式：`pct = (val - min) / (max - min) * 100`
- `bubbleLeft = pct + "%"`
- **范围保护**：必须夹在 **6%..94%**（配合父容器 `overflow: visible` 和左右 padding，避免气泡在两端被裁掉）

### 4.6 参数索引错位（花头 vs 戒指）
- ❌ 错误：把 items[3]（副副间距）当作 spacing 传入 draw
- ✅ 正确：items[4] 才是"主副距离/与戒圈距离"，items[3] 只读，由其他值反算

### 4.7 Git 推送鉴权
- 非交互式终端（如 IDE 内的命令行）可能无法弹出 GitHub 登录对话框
- 建议在本机独立终端（如 PowerShell、Git Bash）执行 `git push -u origin master`
- 或使用 SSH Key / Personal Access Token 方式鉴权
- Windows PowerShell 下**不要用 `&&`** 串联命令（语法不识别），应分条单命令执行

### 4.8 本地数据持久化（经验教训）
- 在后续任务中如遇到"重新编译后活动数据丢失"：
  - 数据存在内存数组中 → 重新编译会重置模块作用域
  - 需要改为：从 `wx.getStorageSync` 读取，写入时 `wx.setStorageSync` 保存
  - 读取失败时回退空数组，避免解析异常

---

## 五、关键文件索引

| 文件 | 作用 |
|------|------|
| [project.config.json](file:///d:/document/_-560606841_6/project.config.json) | 小程序项目配置（基础库版本 3.16.0） |
| [app.js](file:///d:/document/_-560606841_6/app.js) | 小程序入口 |
| [app.json](file:///d:/document/_-560606841_6/app.json) | 页面路由、全局配置 |
| [app.wxss](file:///d:/document/_-560606841_6/app.wxss) | 全局样式 |
| [pages/aroundDiamonds/index.js](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.js) | 围钻预算页面逻辑（实时绘制核心） |
| [pages/aroundDiamonds/index.wxml](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.wxml) | 围钻预算页面结构 |
| [pages/aroundDiamonds/index.wxss](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.wxss) | 围钻预算页面样式 |
| [pages/aroundDiamonds/index.json](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.json) | 围钻预算页面配置 |
| [pages/transformation/ringSize.js](file:///d:/document/_-560606841_6/pages/transformation/ringSize.js) | 手寸转换核心逻辑 |
| [pages/transformation/ringSizeData.js](file:///d:/document/_-560606841_6/pages/transformation/ringSizeData.js) | **戒指尺寸统一数据源**（港度/欧度/美度/日度/直径/周长） |
| [pages/transformation/index.js](file:///d:/document/_-560606841_6/pages/transformation/index.js) | 手寸转换页面 |
| [pages/calculator/index.js](file:///d:/document/_-560606841_6/pages/calculator/index.js) | 价格计算器页面 |
| [pages/gratuity/index.js](file:///d:/document/_-560606841_6/pages/gratuity/index.js) | 金工计页面 |
| [pages/web/index.js](file:///d:/document/_-560606841_6/pages/web/index.js) | 活动数据页面 |
| [pages/index/index.js](file:///d:/document/_-560606841_6/pages/index/index.js) | 首页 |
| [utils/dataer.js](file:///d:/document/_-560606841_6/utils/dataer.js) | 数据工具 |
| [utils/init.js](file:///d:/document/_-560606841_6/utils/init.js) | 初始化工具 |
| [utils/tool.js](file:///d:/document/_-560606841_6/utils/tool.js) | 工具函数 |
| [utils/util.js](file:///d:/document/_-560606841_6/utils/util.js) | 工具函数 |
| [utils/parse.js](file:///d:/document/_-560606841_6/utils/parse.js) | 解析工具 |
| [.gitignore](file:///d:/document/_-560606841_6/.gitignore) | Git 忽略文件（含 project.private.config.json） |
| [memory.md](file:///d:/document/_-560606841_6/memory.md) | 本档案 — 新开对话时快速回顾 |

---

## 六、设计规范 / 视觉约定

后续新增页面或修改样式时，建议遵循以下已确立的规范：

- **主题色**：黄橙色 `#FF9900`（副石 / 滑条激活色），橙色 `#FF6B00`
- **强调色**：红色 `#FF0000`（主石），蓝色 `#0000FF`（戒圈）
- **卡片**：圆角 + 阴影 + 浅色渐变背景；只读卡片使用虚线边框 + 更浅背景
- **输入框**：浅色背景 `#f0e6d8`
- **滑条**：`activeColor="#FF9900"`, `backgroundColor="#f0e6d8"`, `block-color="#FF9900"`, `block-size="16"`
- **气泡标签**：渐变背景（135deg，`#FF9900 → #FF6B00`），绝对定位在滑条上方，`bubbleLeft` 限制 6%..94%
- **单屏布局目标**：手机竖屏时所有内容（canvas + 卡片 + 模式切换）无需下拉滚动
- **交互习惯**：无"开始计算"按钮，滑条 / 输入框变化实时驱动计算与绘图

---

## 七、下一步可考虑的方向

1. **活动数据本地持久化**：若 web 页面重新编译后数据丢失，需将 mock 数据从内存数组改为 `wx.setStorageSync / wx.getStorageSync` 持久化
2. **输入校验加强**：在 calculator、gratuity 等页面增加类似 aroundDiamonds 的输入校验和滑条功能
3. **页面美感统一**：将其他页面（calculator、gratuity、transformation）的样式升级为与 aroundDiamonds 一致的卡片式设计
4. **戒指尺寸数据反查接口扩展**：`ringSizeData.js` 中已预备 `getByDiameter/getByEurope/getByUS/getByJapan`，可用于 transformation 页面的双向转换
5. **更严格的 lint/type 检查**：运行项目特定 lint 命令检查潜在问题

---

## 八、Git 常用命令备忘

```bash
# 查看当前状态
git status
git branch -vv
git remote show origin

# 提交新修改（本次提交流程）
git add memory.md
git commit -m "围钻计算逻辑修复完成"
git push origin master

# 拉取最新
git pull origin master
```

---

> 此档案用于新开对话时快速回顾项目现状，避免重复询问已确认的信息。所有修改均已记录并推送到 GitHub 仓库 master 分支。
