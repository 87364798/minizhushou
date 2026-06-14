# 项目记忆档案 (memory.md)

> 项目类型：微信小程序
> 项目路径：`d:\document\_-560606841_6`
> 工作目录：`d:\document\_-560606841_6`
> GitHub 仓库：https://github.com/87364798/minizhushou.git
> 最近一次提交：`"围钻计算逻辑修复完成"`（2026-06-13）
> 记忆更新时间：2026-06-14（新增报价计算/赞赏/首页全面信息）

---

## 一、项目概述

这是一个**微信小程序**项目，主要功能是珠宝相关的计算工具：
- **围钻预算**（`pages/aroundDiamonds/`）— 核心交互页，含 Canvas 实时绘图
- **手寸转换**（`pages/transformation/`）— 港度/欧度/美度/日度/直径/周长互转
- **报价计算**（`pages/calculator/`）— 金料 + 主石/副石 + 附加费用汇总（2026-06-14 全面重写，**不再依赖远程 Parse 服务器**）
- **赞赏**（`pages/gratuity/`）— 支持自定义金额和预设金额（2026-06-14 移除 Parse 云函数依赖）
- 首页导航（`pages/index/`）— 4 宫格导航（报价计算 / 手寸转换 / 赞赏 / 围钻预算）
- 活动数据展示（`pages/web/`）
- 日志页（`pages/logs/`）

核心技术栈：WXML + WXSS + JavaScript，使用 Vant Weapp 组件库（`dist/vant/`）和 MinUI 组件库（`dist/minui/`）。

**重要设计原则（2026-06-14 确立）**：
- 所有页面**必须离线可用**（无网络时功能完整，不出现空白页）
- 对 Parse 远程服务器的依赖**降级为可选**（仅用于数据更新/配置拉取，静默失败）
- 所有输入/数据变更**必须通过 `setData` 触发视图更新**（禁止直接修改 `this.data.xxx`）

---

## 二、页面 / 模块清单

### 2.1 pages/aroundDiamonds — 围钻预算（核心交互）
- `index.js` — 逻辑（滑条、输入、计算、Canvas 绘图）
- `index.wxml` — 卡片 + 滑条 + 气泡 + 顶部 Canvas
- `index.wxss` — 橙色主题卡片样式
- `index.json` — 页面配置

### 2.2 pages/transformation — 手寸转换
- `index.js` — 页面入口，只做事件转发到 ringSize.js
- `index.wxml` — 顶部标题卡 + 6 张制式卡片（国旗/矢量图标）
- `index.wxss` — 橙色主题卡片样式、国旗与矢量图标样式
- `ringSize.js` — **核心转换逻辑**（本地离线数据源）
- `ringSizeData.js` — **戒指尺寸数据模块**（共享给 aroundDiamonds 等）
- `index.json` — 页面配置

### 2.3 pages/calculator — 报价计算（2026-06-14 全面重写）
- `index.js` — 主页面逻辑（金价展示、品名输入、子组件回调、汇总、复制）
- `index.wxml` — 顶部金价信息卡 + 金组件 + 钻石组件 × 2 + 附加组件 + 汇总卡 + 勾选复制
- `index.wxss` — 橙色主题卡片样式（2026-06-14 新增）
- `index.json` — 页面配置（注册 gold / diamond / additional 子组件）

**依赖的子组件**（位于 `dist/components/`）：
- `gold/index.js` / `index.wxml` / `index.wxss` — 金重/损耗/金价/配件/链重/胚底 6 项输入
- `diamond/index.js` / `index.wxml` / `index.wxss` — 主石/副石 同结构组件（mm/ct 切换 + 单粒/总价 切换 + 镶工费）
- `additional/index.js` / `index.wxml` / `index.wxss` — 附加费用列表（项名 + 金额，可增删）

### 2.4 pages/gratuity — 赞赏（2026-06-14 重写）
- `index.js` — 简化版，不再调用 Parse 云函数
- `index.wxml` — 标题 + 预设金额 6 宫格 + 自定义金额输入 + 按钮
- `index.json` — 页面配置

### 2.5 pages/index — 首页导航（2026-06-14 修复）
- `index.js` — 4 宫格导航入口，Parse 配置拉取降级为可选静默失败
- `index.wxml` — 轮播图 + 4 宫格 + 联系客服
- `index.json` — 页面配置

### 2.6 pages/web — 活动数据
### 2.7 pages/logs — 日志页

---

## 三、核心工具模块

### 3.1 ringSizeData.js（戒指尺寸数据）

**文件**：`pages/transformation/ringSizeData.js`

**数据来源**：项目根目录 `ringsize.csv`，已手工映射成 JS 数组。

**表结构**：`RING_SIZE_TABLE[]`，每行含 `{ hk, eu, us, jp, diameter, circumference }`
- 港度范围 1..30，对应直径约 12.0mm..22.5mm
- 美度 `us` 含 0.25 步长（半码）
- 日度 `jp` 有 1..29 整数映射（少数无对应行）

**对外接口**：
- `HK_MIN` / `HK_MAX` — 港度上下限（1/30）
- `getAll()` — 整张表
- `getByHongKong(hk)` — 按港度查行（精确匹配整数港度）
- `hkSizeToDiameter(hk)` — 核心函数，支持非整数港度线性插值，超出范围做边界截断
- `hkSizeToCircumference(hk)` — 港度 → 周长（基于直径 × π）
- `getByDiameter(d)` — 直径反查最接近一行
- `getByCircumference(c)` — 周长反查最接近一行
- `getByEurope(eu)` / `getByUS(us)` / `getByJapan(jp)` — 各制式精确查询

**典型用法**：
```javascript
var ringSizeData = require("../transformation/ringSizeData.js");
var diameter = ringSizeData.hkSizeToDiameter(15); // 约 17.4mm
```

### 3.2 dataer.js（金价获取）（2026-06-14 重写）

**文件**：`utils/dataer.js`

**设计原则**：**本地默认值优先，远程更新为增强**。

**工作流程**：
1. 有回调时立即执行 `callback()`（基于本地缓存 `goldPrice`）
2. 默认金价 `DEFAULT_GOLD_PRICE = 720`（元/克），无缓存时使用
3. 尝试请求 Parse 服务器的 `goldPrice` 表：
   - 成功 → 写入 `wx.setStorageSync("goldPrice", { AU9999: value })`，再次回调
   - 失败 → 静默忽略，不打扰用户
4. 整个流程使用 `try-catch` 包裹，无 Parse 环境也不报错

**调用方**：calculator 的 `onLoad` / `updateGoldPrice`

**Au750 计算**：`Au750 = Au9999 × 0.75`（在 calculator 页面 setData 时计算）

### 3.3 tool.js（工具函数）

**文件**：`utils/tool.js`

**已知函数**：
- `BinarySearch(arr, value, lastIndex?)` — 二分查找/最近邻查找
- `getDate()` — 返回当前日期字符串 `YYYY-MM-DD`（供 calculator 页面展示日期）

---

## 四、围钻预算页面 aroundDiamonds（核心交互）

### 4.1 核心逻辑（drawWithCurrentItems）

**数据流**：输入 → 求直径 → 计算副副间距 → 更新 UI → 绘制 Canvas

**花头模式**（radio === "1"）：
- `centerR = (主石 + 副石) / 2 + 主副距离`

**戒指模式**（radio === "2"）：
- 先将手寸（港度）转直径：`a = ringSizeData.hkSizeToDiameter(港度)`
- `centerR = a / 2 + 0.433 * 副石 + 与戒圈距离`

**通用公式**：
- `angDeg = 360 / 粒数`
- `chordLen = sqrt(2 * centerR^2 - 2 * centerR^2 * cos(angDeg))`
- `副副间距 = chordLen - 副石直径`，保留 2 位小数，负值夹到 0

### 4.2 items 数组含义

`items[index]` 为：

| index | 花头（radio=1） | 戒指（radio=2） | 只读 |
|---|---|---|---|
| 0 | 主石直径 mm | 手寸（港度 1..30） | 否 |
| 1 | 副石直径 mm | 副石直径 mm | 否 |
| 2 | 粒数 | 粒数 | 否 |
| 3 | 副副间距（自动计算） | 副副间距（自动计算） | 是 |
| 4 | 主副距离 mm | 与戒圈距离 mm | 否 |

### 4.3 实时绘制（无"开始计算"按钮）

- `scheduleDraw()` — 80ms 节流，避免滑条拖动过快频繁重绘
- `drawWithCurrentItems()` — 每次输入/滑条变化都调用
- 触发点：`bindInput` / `bindSliderChange` / `bindSliderChanging` / `onRadioChange` / `onLoad`

### 4.4 气泡（bubble）实时跟随滑条

- 使用 `bindchanging` 事件（拖动过程中持续触发）而非仅 `bindchange`
- JS 中计算 `bubbleLeft = (value - min) / (max - min) * 100%`，限制在 **6%..94%** 避免两端被遮挡
- 父容器 `.slider-wrap` / `.param-cell` 的 `overflow: visible`，并加 padding 预留气泡空间
- CSS 中气泡 `position:absolute; top:-4rpx; transform:translateX(-50%);`

### 4.5 Canvas 绘制颜色

- **主石** 红色 `#FF0000`（stroke）
- **戒圈** 蓝色 `#0000FF`（stroke）
- **副石** 黄橙色 `#FF9900`（stroke）
- Canvas 尺寸 100% × 300px，位于页面顶部

### 4.6 默认值（进入页面立即有图案）

- 花头：主石 6mm，副石 1.5mm，粒数 8，主副距离 0.5mm
- 戒指：港度 15（直径 ≈17.4mm），副石 1.5mm，粒数 8，与戒圈距离 0.3mm

### 4.7 戒指模式手寸提示行

在手寸卡片下方新增 `.hk-hint` 提示行，展示：`直径 XX.XX mm · 周长 YY.YY mm`（由港度实时换算）

---

## 五、手寸转换页面 transformation（2026-06-13 完整重写）

### 5.1 问题根因（旧版）

- 旧版完全依赖远程 Parse 服务器 `https://psdb.jewelrytool.cn/parse` 拉取 `ringSize` / `ringSizeView` 数据
- 无网络 / 服务器不可用时，`wx.getStorageSync("ringSize")` 为空 → `grids = []` → 页面**空白**
- 旧版 pickerTransformation / inputTransformation 含 NaN 判断与索引越界隐患

### 5.2 重构方案（当前版）

改为 100% 本地离线数据源，**不依赖网络**。

### 5.3 页面结构

- **顶部标题卡**：橙色渐变背景，展示「手寸换算 · 任意输入一项，其他自动换算」
- **6 张制式卡片**（每张 = 图标 + 标题 + 输入框/单位 + 滑条 + 范围提示）：
  1. 港度 (HK) — 国旗 PNG `/images/hk.png`
  2. 欧度 (EU) — 国旗 PNG `/images/eu.png`
  3. 美度 (US) — 国旗 PNG `/images/us.png`
  4. 日度 (JP) — 国旗 PNG `/images/jp.png`
  5. 直径 (mm) — CSS 矢量图标（圆 + 横向虚线 + Ø 标签）
  6. 周长 (mm) — CSS 矢量图标（圆 + 3/4 圆环箭头 + C 标签）

### 5.4 VIEW_CONFIG 字段

每张卡片配置：
- `key` — 标识（hk/eu/us/jp/diameter/circumference）
- `title` / `hint` — 中文字段
- `min` / `max` / `step` — 滑条/输入范围
- `unit` — 显示单位（"号" 或 "mm"）
- `iconType` — `"flag"`（国旗 PNG）或 `"vector-diameter"` / `"vector-circumference"`（CSS 矢量）
- `iconUrl` — 国旗 PNG 绝对路径（小程序以 `/images/xxx.png` 指向项目根目录 images 文件夹）

### 5.5 统一换算算法（computeFrom）

```
输入（sourceKey, numValue）
  → 先换算成"直径"
     · hk → hkSizeToDiameter(numValue)
     · eu/us/jp → getByXxx(numValue).diameter
     · diameter → 直接使用
     · circumference → numValue / Math.PI
  → 用直径反查最接近一行（getByDiameter）
  → 填充全部 6 个字段（hk/eu/us/jp/diameter/circumference）
  → sourceKey 字段保留用户原始输入值（不被反查覆盖）
```

初始化默认值：`hk = 15`（直径 ≈17.4mm，周长 ≈54.7mm）。

### 5.6 国旗透明通道处理

**问题现象**：用户要求"国旗显示时只显示有图案部分，透明部分不显示"。

**分析**：二进制解析 PNG 发现 `hk/eu/us/jp.png` 都是 `colorType=6`（RGBA），四角像素 `alpha=0`（完全透明）。图片本身带透明通道，不是带白色背景的位图。

**解决方案**（WXSS 调整）：
- `.logo-circle` — 不设固定宽高，不加 `border-radius:50%`，不加背景色/边框
- `.logo-flag` — `background: transparent; border: none; box-shadow: none;`
- `.logo-img` — 60rpx × 60rpx，`mode="aspectFit"`，完全交由 PNG 透明通道控制显示区域
- **效果**：国旗按原始形状呈现，透明部分完全不显示，背景透出页面色

**矢量图标保持圆形外观不变**（CSS 绘制，不存在透明通道问题）。

---

## 六、报价计算页面 calculator（2026-06-14 全面重写）

### 6.1 问题根因（旧版）

1. **`this.data.xxx = value` 直接赋值**：gold/diamond/additional 子组件和 calculator 主页面都存在此问题，小程序不会触发视图更新，导致输入后界面不变、总价不刷新。
2. **完全依赖远程 Parse 获取金价**：无网络时 `goldPrice` 为空 → 页面显示 "0 元/克"，金价输入框也无法正常工作。
3. **diamond 组件逻辑隐患**：sum() 函数中 `if (a.length > 0) h = ...` 的 `h` 未声明（污染全局），radioLeft/radioRight 处理有越界隐患。
4. **复制功能与品名联动缺失**：只勾选"总价"时品名被完全忽略，用户感知品名输入无效果。
5. **视觉设计缺失**：没有独立 WXSS，依赖第三方组件默认样式，卡片风格与围钻页不一致。

### 6.2 重构方案（当前版）

**原则**：所有页面**离线可用 + 正确的 setData 更新 + 一致的橙色主题卡片设计**。

### 6.3 页面结构（自上而下）

1. **顶部信息卡**（橙色渐变 `#FF8A3D → #FF6B00`）
   - 标题 "珠宝报价" + 当前日期（`tool.getDate()`）
   - 足金 Au9999 价格 + 18K金 Au750 价格（0.75 × Au9999）
   - 品名输入（半透明风格，与卡上其他信息融为一体）

2. **金 组件**（`gold`）：6 项输入 → 自动计算金工耗
   - 金重（g）、损耗（%）、金价（元/克，自动填充）、配件（g）、链重（g）、胚底（元）
   - 公式：`(金重 + 配件 + 链重) × (1 + 损耗/100) × 金价 + 胚底`
   - 自动从 `wx.getStorageSync("goldPrice")` 读取金价填入金价项

3. **钻石 组件 × 2**（`diamond`，实例化 2 次，`title` 属性分别为 "主石" 和 "副石"）
   - 顶部：展开/收起（checkbox 样式标题），收起时不计入总价
   - 尺寸单位切换：mm / ct（radio 组）
   - 计价方式切换：单粒 / 总数（radio 组）
   - 镶工费 + 增加行数（picker + input + 按钮）
   - 每行数据：尺寸 / 粒数 / 单价 → 小计
   - 可删除行 / 添加行
   - mm 转 ct 使用公式：`0.61 × (mm^3) × 0.0061`

4. **附加 组件**（`additional`）
   - 可增删的"项名 + 金额"列表
   - 展开/收起控制是否计入总价

5. **汇总卡**（白底，圆角 + 阴影）
   - 分项明细（文本展示各项的描述）
   - 总价 = 金 + 勾选的主石 + 勾选的副石 + 勾选的附加

6. **勾选复制区**
   - 5 个 checkbox：金 / 主石 / 副石 / 附加 / 总价（对应 footer[0..4]）
   - 主石/副石/附加 勾选与"是否展开"联动（未展开的不可勾选，因为没有数据）
   - "复制报价"按钮 → `wx.setClipboardData`

### 6.4 复制逻辑（copyData）

- **只勾选总价**：复制格式 `"品名：XXX元"`（有品名带品名，没有则纯金额）
- **勾选了其他项**：复制完整格式 — 日期 + 品名 + 金明细 + 石明细 + 附加明细 + 汇总造价
- 每次复制后 toast "复制成功"

### 6.5 data 结构

```javascript
{
  Au9999: "720",        // 今日足金价（字符串，便于显示）
  Au750: "540",         // 今日18K金价格
  date: "2026-06-14",   // 日期
  name: "",             // 品名，bindInputName 输入
  sumMary: {            // 汇总展示
    sumMoney: "0",      // 总价金额（字符串）
    str: "等待输入..."  // 分项明细文本
  },
  footer: [             // 勾选复制状态
    { name: "金",   checked: true,  disabled: false },
    { name: "主石", checked: false, disabled: true  },
    { name: "副石", checked: false, disabled: true  },
    { name: "附加", checked: false, disabled: true  },
    { name: "总价", checked: true,  disabled: false }
  ],
  _gold:       { sum, laborCost, goldValue },   // 金组件回传值
  _diamond0:   { show, sum, diamondValue, wage },  // 主石组件回传值
  _diamond1:   { show, sum, diamondValue, wage },  // 副石组件回传值
  _add:        { show, sum, addValue }            // 附加组件回传值
}
```

### 6.6 子组件之间的通信机制

- 父页面（calculator/index.js）通过 `bind:goldSum` / `bind:diamondSum` / `bind:addSum` 监听子组件事件
- 子组件每次用户输入变化后：
  1. 计算内部小计、生成描述文本
  2. 调用 `this.triggerEvent("xxxSum", { ...payload })` 把最新状态发给父页
  3. 父页 `sum()` 重新汇总并 setData 更新总价展示
- **收起子组件时**：子组件发送 `show:false, sum:0` 事件，父页从总价中排除

### 6.7 关键代码约定（防错规范）

- **禁止**：`this.data.name = xxx; this.data.items[i].value = xxx;`
- **必须**：`this.setData({ name: xxx })` 或 `this.setData({ "items[2].value": xxx })`
- **必须**：组件内部列表修改后 `items = this.data.items.slice()` 先复制再操作
- **必须**：parseFloat 后做 isNaN 判断并提供默认值（避免 NaN 污染总价）

---

## 七、赞赏页面 gratuity（2026-06-14 简化）

### 7.1 旧版问题

- 调用 `e.Cloud.run("wxPay", {...})` 触发微信支付（需后端云函数）
- `e.User.current()` 检查登录状态（Parse 依赖）
- 无网络时页面完全不可用

### 7.2 当前版逻辑

- 6 个预设金额：1 / 5 / 18 / 48 / 98 / 188 元
- 可自定义金额（数字输入框）
- 点击"赞赏作者"弹出 `wx.showModal` 显示感谢语（未接入真实微信支付，需要商户号时再补）
- **完全离线可用**

---

## 八、首页 index（2026-06-14 修复）

### 8.1 4 宫格导航

| 图标 | 标题 | 跳转路径 |
|---|---|---|
| `../../images/calculator.png` | 报价计算 | `../calculator/index` |
| `../../images/transformation.png` | 手寸转换 | `../transformation/index` |
| `../../images/gratuity.png` | 赞赏 | `../gratuity/index` |
| `../../images/around.png` | 围钻预算 | `../aroundDiamonds/index` |

### 8.2 Parse 依赖降级

- onLoad 中尝试查询 `setting` 表 `key=index` 的配置
- 成功 → 可更新 imgUrls / indicatorDots / autoplay / duration / grids（当前未启用动态更新，使用默认）
- 失败 → **静默忽略**，默认 4 宫格 + 默认横幅图正常展示

---

## 九、版本控制与提交

- 仓库：`https://github.com/87364798/minizhushou.git`
- 分支：`master`
- 身份：`name: 87364798`，`email: 873645798@qq.com`
- 已知提交：
  1. `"组件库更新，围钻页面修复完成"`
  2. `"添加memory.md"`
  3. `"围钻计算逻辑修复完成"`（2026-06-13，含副副间距只读、港度转换、实时重绘、取消按钮、气泡修复、transformation 重写、国旗/矢量图标）
- `.gitignore` 新增：`project.private.config.json`（避免私有配置入库）
- **2026-06-14 有未提交改动**：calculator 全面重写 + dataer.js 重写 + index/gratuity 修复 + 各子组件重写 + calculator/index.wxss / gold/index.wxss / diamond/index.wxss / additional/index.wxss 新增

---

## 十、设计规范（2026-06-14 扩展）

- **主题色**：黄橙色 `#FF9900` → 深橙 `#FF6B00`（渐变），顶卡使用 `linear-gradient(135deg, #FF8A3D 0%, #FF6B00 100%)`
- **子组件配色策略**：每个子组件用一个专属色调，整体统一为浅暖色系
  - 金组件 → 金色 `#FFD700 → #FFA500`（金色渐变图标）
  - 钻石组件 → 紫色 `#b983ff → #7c3aed`（钻石色）
  - 附加组件 → 蓝色 `#5dade2 → #2e86de`（蓝色）
- **卡片基础**：圆角 24rpx（大卡）/ 14rpx（内部输入框），柔和阴影 `0 4rpx 16rpx rgba(0,0,0,0.06)`，浅色背景
- **输入框**：半透明风格位于橙色卡上，白底或深背景风格位于白色卡上，使用 `type="digit"` 或 `type="number"`
- **滑条**：激活色 `#FF9900`，背景 `#f0e6d8`，滑块 16..20rpx
- **气泡**：`position:absolute; top:-4rpx; transform:translateX(-50%);`，位置限制 6%..94%
- **文字**：标题深色加粗，正文正常，提示/标签色 `#aa7b4a` 或 `#FF9900`
- **只读卡片**：虚线边框 + 浅灰渐变背景（用于副副间距等只读项）
- **页面布局**：手机竖屏单屏可完整呈现，内容多时允许滚动（报价计算因组件较多需滚动，这是正常的）
- **分隔线**：虚线 `border-bottom: 2rpx dashed #ffcc99`（橙色页内）或对应主色的浅色（子组件页内）

---

## 十一、关键文件索引

| 文件 | 作用 | 上次修改 |
|---|---|---|
| `pages/aroundDiamonds/index.js` | 围钻预算逻辑 + 滑条/气泡/计算/Canvas | 2026-06-13 |
| `pages/aroundDiamonds/index.wxml` | 围钻预算布局 | 2026-06-13 |
| `pages/aroundDiamonds/index.wxss` | 围钻预算样式（气泡/卡片/Canvas） | 2026-06-13 |
| `pages/transformation/index.js` | 手寸转换页面入口（薄封装） | 2026-06-13 |
| `pages/transformation/index.wxml` | 手寸转换布局（国旗/矢量图标卡片） | 2026-06-13 |
| `pages/transformation/index.wxss` | 手寸转换样式（橙色卡片风格） | 2026-06-13 |
| `pages/transformation/ringSize.js` | 手寸转换核心逻辑（VIEW_CONFIG / computeFrom） | 2026-06-13 |
| `pages/transformation/ringSizeData.js` | 戒指尺寸数据模块（**可在任意页面复用**） | 2026-06-13 |
| `pages/calculator/index.js` | 报价计算主页（金价/汇总/复制） | 2026-06-14 重写 |
| `pages/calculator/index.wxml` | 报价计算布局（信息卡 + 3 类组件 + 汇总 + 勾选复制） | 2026-06-14 重写 |
| `pages/calculator/index.wxss` | 报价计算样式（橙色卡主题） | 2026-06-14 **新增** |
| `dist/components/gold/index.{js,wxml,wxss,json}` | 金组件（6 项输入 + 工耗计算） | 2026-06-14 重写 |
| `dist/components/diamond/index.{js,wxml,wxss,json}` | 钻石组件（mm/ct + 单粒/总数 + 镶工费 + 行列表） | 2026-06-14 重写 |
| `dist/components/additional/index.{js,wxml,wxss,json}` | 附加组件（项名+金额可增删列表） | 2026-06-14 重写 |
| `pages/gratuity/index.js` | 赞赏页面（简化版，无云函数依赖） | 2026-06-14 重写 |
| `pages/index/index.js` | 首页导航（Parse 依赖降级为可选） | 2026-06-14 修复 |
| `utils/dataer.js` | 金价获取（本地默认值 + 远程更新静默失败） | 2026-06-14 重写 |
| `utils/tool.js` | 工具函数（二分查找 + getDate） | 原版 |
| `utils/parse.js` | Parse SDK 客户端（目前仅 dataer.js / index.onLoad 可选使用） | 原版 |
| `app.json` | 页面注册 + 全局导航样式（navigationBarBackgroundColor: #2F67DE） | 原版 |
| `project.config.json` | `libVersion: 3.16.0` | 已更新 |
| `ringsize.csv` | 原始尺寸对照数据（仅供参考，非运行期读取） | 数据来源 |
| `images/hk.png / eu.png / us.png / jp.png` | 国旗 PNG（带透明通道，RGBA colorType=6） | 资源 |
| `images/calculator.png / transformation.png / gratuity.png / around.png` | 首页 4 宫格图标 | 资源 |

---

## 十二、后续可扩展方向

1. `ringSizeData.js` 增加 `diameterToHk(diameter)` 反向插值函数（当前只有 getByDiameter 精确匹配行）
2. `transformation/index.wxml` 可以给直径/周长两张卡片增加"快捷常用值"按钮
3. calculator 页面的 `_gold.laborCost` / `_diamond0.wage` 可以在汇总时做更精细的展示（区分工费与料钱）
4. diamond 组件可考虑加入"石价/粒"的反向计算（给定总价反推单价）
5. 考虑把 `pages/transformation/ringSizeData.js` 移到 `utils/` 下（更通用），当前保留原路径是为了就近关联 transformation 业务
6. 赞赏页面：如果接入真实微信支付，需要申请微信支付商户号并在 `utils/parse.js` 或独立云函数中实现 `wxPay`
7. calculator 的品名输入可以加"常用品名快捷按钮"（如"钻戒 / 项链 / 耳环 / 吊坠"）
8. dataer.js 的金价缓存可以加时间戳（如 `{ AU9999, updatedAt }`），超过 1 天才再次请求云端更新
