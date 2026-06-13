# 项目记忆档案 (memory.md)

> 项目类型：微信小程序
> 项目路径：`d:\document\_-560606841_6`
> 工作目录：`d:\document\_-560606841_6`
> GitHub 仓库：https://github.com/87364798/minizhushou.git

---

## 一、项目概述

这是一个**微信小程序**项目，主要功能是珠宝相关的计算工具，包括：
- **围钻预算**（aroundDiamonds）
- **手寸转换**（transformation / ringSize）
- **价格计算器**（calculator）
- **金工计**（gratuity）
- 首页导航（index）
- 活动数据展示（web）

核心技术栈：WXML + WXSS + JavaScript，使用 Vant Weapp 组件库（`vant`）和 MinUI 组件库（`minui`）。

---

## 二、已完成的修复与优化

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
- 为以下字段添加滑条：手寸、副石、粒数、副副间距、与戒圈距离
- 在 [index.js](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.js) 的 `items` 数据中添加：
  - `min`：滑条最小值
  - `max`：滑条最大值
  - `step`：滑条步长
  - `unit`：单位（如"粒"、"mm"）
  - `bubbleLeft`：气泡标签位置（百分比）
- 实现事件：
  - `bindSliderChange`：滑条拖动结束时更新数据
  - `bindSliderChanging`：滑条拖动过程中**实时**更新气泡位置和数值

#### 2.4.3 输入框与滑条双向同步
- 在 `bindInput` 中：输入框值改变时同步更新 `items[index].value`，同时更新气泡位置 `bubbleLeft`
- 在 `bindSliderChange` 中：滑条值改变时同步更新 `items[index].value`
- 非数字输入时处理为 `""`

#### 2.4.4 气泡标签实时跟随滑条
- 移除原生 `show-value`
- 在 WXML 中添加自定义 `.slider-thumb-bubble` 元素，显示数值和单位
- 通过 `bubbleLeft` 百分比动态定位在滑动圆圈上方
- 使用 `bindchanging`（而非仅 `bindchange`）实现拖动过程中气泡**实时同步移动**，不延迟

#### 2.4.5 粒数单位明确为"粒"
- 在 items 中粒数的 `unit` 字段设置为 `"粒"`
- WXML 中使用 `{{item.unit}}` 取代硬编码

#### 2.4.6 Canvas 绘图颜色区分
- 文件：[index.js](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.js) 的 `flower` 和 `ring` 函数
- **主石**：红色 `#FF0000`
- **戒圈**：蓝色 `#0000FF`
- **副石**：黄橙色 `#FF9900`

#### 2.4.7 Canvas 被遮挡问题修复
- 调整 canvas 高度为 **300px**
- 使用 `cover-view` 或合适的容器包裹 canvas（注意：微信小程序中 canvas 是原生组件，z-index 有限制）
- 调整 `page-wrap` 的 padding 为 0，使 canvas 全宽显示
- 为其他卡片元素添加左右 margin
- 修正绘制中心点偏移问题

#### 2.4.8 美感设计优化
- 卡片式布局（圆角、阴影、渐变背景）
- 标题使用深色加粗字体
- 输入框使用浅色背景，聚焦时有轻微反馈
- 滑条激活颜色 `#FF9900`（黄橙色主题）
- 按钮使用渐变背景和阴影
- 气泡标签使用渐变背景 + 圆角 + 阴影

### 2.5 Git 版本控制
- 文件：[.gitignore](file:///d:/document/_-560606841_6/.gitignore) — 添加 `project.private.config.json`
- 初始化仓库、配置身份（name: 87364798，email: 873645798@qq.com）
- 首次提交信息：`"组件库更新，围钻页面修复完成"`
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
    var i = this.data.items;
    var range = i[index].max - i[index].min;
    var pct = range > 0 ? ((val - i[index].min) / range * 100) : 0;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    i[index].bubbleLeft = pct + "%";
    if (index === "2") {
        i[2].value = val;
    } else {
        i[index].value = parseFloat(val.toFixed(2));
    }
    this.setData({ items: i });
},
```

### 3.3 aroundDiamonds / index.js — flower 函数（颜色区分）
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
```

### 3.4 aroundDiamonds / index.js — ring 函数（颜色区分）
```javascript
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

### 3.5 aroundDiamonds / index.wxml — 滑条 + 气泡
```xml
<view class="slider-row-wrapper">
    <view class="slider-thumb-bubble" style="left: {{item.bubbleLeft}};">
        <text class="bubble-num">{{item.value === '' ? item.min : item.value}}</text>
        <text class="bubble-unit">{{item.unit}}</text>
    </view>
    <view class="slider-row">
        <slider bindchange="bindSliderChange" bindchanging="bindSliderChanging" id="{{index}}" class="field-slider" min="{{item.min}}" max="{{item.max}}" step="{{item.step}}" value="{{item.value === '' ? item.min : item.value}}" block-size="22" activeColor="#FF9900" backgroundColor="#f0e6d8" block-color="#FF9900"></slider>
    </view>
</view>
```

### 3.6 aroundDiamonds / index.wxss — 气泡标签样式
```css
.slider-thumb-bubble {
    position: absolute;
    top: 4rpx;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #FF9900 0%, #FF6B00 100%);
    color: #ffffff;
    padding: 6rpx 12rpx;
    border-radius: 8rpx;
    font-size: 22rpx;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4rpx 10rpx rgba(255, 153, 0, 0.35);
}
.preview-canvas {
    width: 100%;
    height: 300px;
    display: block;
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
- 范围保护：pct 必须夹在 0-100 之间

### 4.6 Git 推送鉴权
- 非交互式终端（如 IDE 内的命令行）可能无法弹出 GitHub 登录对话框
- 建议在本机独立终端（如 PowerShell、Git Bash）执行 `git push -u origin master`
- 或使用 SSH Key / Personal Access Token 方式鉴权

### 4.7 本地数据持久化（经验教训）
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
| [pages/aroundDiamonds/index.js](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.js) | 围钻预算页面逻辑 |
| [pages/aroundDiamonds/index.wxml](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.wxml) | 围钻预算页面结构 |
| [pages/aroundDiamonds/index.wxss](file:///d:/document/_-560606841_6/pages/aroundDiamonds/index.wxss) | 围钻预算页面样式 |
| [pages/transformation/ringSize.js](file:///d:/document/_-560606841_6/pages/transformation/ringSize.js) | 手寸转换核心逻辑 |
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

---

## 六、设计规范 / 视觉约定

后续新增页面或修改样式时，建议遵循以下已确立的规范：

- **主题色**：黄橙色 `#FF9900`（副石/滑条激活色），橙色 `#FF6B00`
- **强调色**：红色 `#FF0000`（主石），蓝色 `#0000FF`（戒圈）
- **卡片**：圆角 + 阴影 + 渐变背景
- **按钮**：渐变背景（135deg）+ 圆角 + 阴影
- **输入框**：浅色背景 `#f0e6d8`，聚焦时轻微边框变化
- **滑条**：`activeColor="#FF9900"`, `backgroundColor="#f0e6d8"`, `block-color="#FF9900"`, `block-size="22"`
- **气泡标签**：渐变背景（135deg，`#FF9900 → #FF6B00`），绝对定位在滑条上方，跟随滑条实时移动

---

## 七、下一步可考虑的方向

1. **活动数据本地持久化**：若 web 页面重新编译后数据丢失，需将 mock 数据从内存数组改为 `wx.setStorageSync / wx.getStorageSync` 持久化
2. **输入校验加强**：在 calculator、gratuity 等页面增加类似 aroundDiamonds 的输入校验和滑条功能
3. **页面美感统一**：将其他页面（calculator、gratuity、transformation）的样式升级为与 aroundDiamonds 一致的卡片式设计
4. **错误页面/空状态**：各页面添加加载中和空数据的视觉反馈
5. **更严格的 lint/type 检查**：运行项目特定 lint 命令检查潜在问题

---

## 八、Git 常用命令备忘

```bash
# 查看当前状态
git status
git branch -vv
git remote show origin

# 提交新修改
git add .
git commit -m "描述本次修改"
git push origin master

# 拉取最新
git pull origin master
```

---

> 此档案用于新开对话时快速回顾项目现状，避免重复询问已确认的信息。所有修改均已记录并推送到 GitHub 仓库 master 分支。
