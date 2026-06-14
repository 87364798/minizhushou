# 项目记忆档案 (memory.md)

> 项目类型：微信小程序
> 项目路径：`d:\document\_-560606841_6`
> 工作目录：`d:\document\_-560606841_6`
> GitHub 仓库：https://github.com/87364798/minizhushou.git
> 最近一次提交：`"围钻计算逻辑修复完成"`（2026-06-13）

---

## 一、项目概述

这是一个**微信小程序**项目，主要功能是珠宝相关的计算工具：
- **围钻预算**（`pages/aroundDiamonds/`）— 核心交互页，含 Canvas 实时绘图
- **手寸转换**（`pages/transformation/`）— 港度/欧度/美度/日度/直径/周长互转
- **价格计算器**（`pages/calculator/`）
- **金工计**（`pages/gratuity/`）
- 首页导航（`pages/index/`）
- 活动数据展示（`pages/web/`）
- 日志页（`pages/logs/`）

核心技术栈：WXML + WXSS + JavaScript，使用 Vant Weapp 组件库（`dist/vant/`）和 MinUI 组件库（`dist/minui/`）。

---

## 二、页面 / 模块清单

### 2.1 pages/aroundDiamonds — 围钻预算
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

### 2.3 pages/calculator — 价格计算器
### 2.4 pages/gratuity — 金工计
### 2.5 pages/index — 首页导航
### 2.6 pages/web — 活动数据
### 2.7 pages/logs — 日志页

---

## 三、核心数据模块 ringSizeData.js

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
- JS 中计算 `bubbleLeft = (value - min) / (max - min) * 100%`，限制在 6%..94% 避免两端被遮挡
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

## 六、版本控制与提交

- 仓库：`https://github.com/87364798/minizhushou.git`
- 分支：`master`
- 身份：`name: 87364798`，`email: 873645798@qq.com`
- 已知提交：
  1. `"组件库更新，围钻页面修复完成"`
  2. `"添加memory.md"`
  3. `"围钻计算逻辑修复完成"`（2026-06-13，含副副间距只读、港度转换、实时重绘、取消按钮、气泡修复、transformation 重写、国旗/矢量图标）
- `.gitignore` 新增：`project.private.config.json`（避免私有配置入库）

---

## 七、设计规范

- 主题色：黄橙色 `#FF9900` → 深橙 `#FF6B00`（渐变）
- 卡片：圆角 + 阴影 + 浅色背景
- 滑条：激活色 `#FF9900`，背景 `#f0e6d8`，滑块 16..20rpx
- 文字：标题深色加粗，正文正常，提示/标签色 `#aa7b4a` 或 `#FF9900`
- 只读卡片：虚线边框 + 浅灰渐变背景（用于副副间距等只读项）
- 页面宽度：手机竖屏单屏可完整呈现，不依赖下拉滚动

---

## 八、关键文件索引

| 文件 | 作用 |
|---|---|
| `pages/aroundDiamonds/index.js` | 围钻预算逻辑 + 滑条/气泡/计算/Canvas |
| `pages/aroundDiamonds/index.wxml` | 围钻预算布局 |
| `pages/aroundDiamonds/index.wxss` | 围钻预算样式（气泡/卡片/Canvas） |
| `pages/transformation/index.js` | 手寸转换页面入口（薄封装） |
| `pages/transformation/index.wxml` | 手寸转换布局（国旗/矢量图标卡片） |
| `pages/transformation/index.wxss` | 手寸转换样式（橙色卡片风格） |
| `pages/transformation/ringSize.js` | 手寸转换核心逻辑（VIEW_CONFIG / computeFrom） |
| `pages/transformation/ringSizeData.js` | 戒指尺寸数据模块（**可在任意页面复用**） |
| `app.json` | 页面注册 + 全局导航样式 |
| `project.config.json` | `libVersion: 3.16.0` |
| `ringsize.csv` | 原始尺寸对照数据（仅供参考，非运行期读取） |
| `images/hk.png / eu.png / us.png / jp.png` | 国旗 PNG（带透明通道） |

---

## 九、后续可扩展方向

1. `ringSizeData.js` 增加 `diameterToHk(diameter)` 反向插值函数（当前只有 getByDiameter 精确匹配行）
2. `transformation/index.wxml` 可以给直径/周长两张卡片增加"快捷常用值"按钮
3. calculator / gratuity 页面如存在远程 Parse 依赖，可按 transformation 相同模式改为本地数据
4. 考虑把 `pages/transformation/ringSizeData.js` 移到 `utils/` 下（更通用），当前保留原路径是为了就近关联 transformation 业务
