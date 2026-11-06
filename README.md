# 智育成长画像平台

面向师范生的**过程性成长记录与质性反馈**平台。三端角色：学生端、教师管理端、院校管理端。

纯静态单页应用，零依赖、零构建，托管在 GitHub Pages。

> 项目代号「智育」仅内部使用。对外正式名称：**师范生创新成长记录与反馈中心**。
> 原因：「智育」在教研语境中特指五育之一，与本平台的「创新能力」语义不符，正式场合易被误解。

## 在线访问

```
https://tidalstarnan.github.io/Growth-Portrait/
```

| 入口 | 完整地址 |
|---|---|
| 启动页 | `https://tidalstarnan.github.io/Growth-Portrait/` |
| 页面导航（推荐先看） | `https://tidalstarnan.github.io/Growth-Portrait/#/preview` |
| 学生端 | `https://tidalstarnan.github.io/Growth-Portrait/#/student/home` |
| 教师端 | `https://tidalstarnan.github.io/Growth-Portrait/#/teacher/home` |
| 院校端 | `https://tidalstarnan.github.io/Growth-Portrait/#/admin/home` |

> 本项目用 hash 路由，`#/` 之后的路径由浏览器处理，不发给服务器。访问子页面时 `#` 不能省略，否则会被当成真实路径而 404。

## 本地运行

clone 下来后直接双击 `index.html` 即可，不需要安装依赖、不需要起服务。

## 三条产品红线

1. **不打分** —— 全系统不设分数字段、不录入量化分数、不做单一综合评分。
2. **不排名** —— 不展示学生个人排名，群体统计只做班级/全院聚合分析。
3. **不对接综测** —— 档案材料仅作育人参考，不自动计入综测加分，评奖评优沿用学校原有制度。

## 页面

共 22 个页面，覆盖三端：

| 端 | 页面 |
|---|---|
| 公共 | 启动页、身份选择、小程序码、页面导航 |
| 学生端 | 首页、档案袋、材料详情、创新能力画像、我的反馈、发展资源、资源详情、自我反思、我的 |
| 教师端 | 工作台、材料查阅与标签辅助、研判工作台、多元研判与反馈输出、学生成长画像、群体情况统计 |
| 院校端 | 管理台、指标库配置、规则管理、群体质量报告 |

完整路由表：

| 路由 | 页面 | 端 |
|---|---|---|
| `/` | 启动欢迎页 | 公共 |
| `/login` | 身份选择 | 公共 |
| `/qr` | 小程序码 | 公共 |
| `/preview` | 页面导航 | 工具 |
| `/student/home` | 学生首页 | 学生 |
| `/student/portfolio` | 成长材料档案袋 | 学生 |
| `/student/material` | 材料详情（`?id=m1`） | 学生 |
| `/student/portrait` | 创新能力画像 | 学生 |
| `/student/feedback` | 我的反馈 | 学生 |
| `/student/resources` | 发展资源推送 | 学生 |
| `/student/resource` | 资源详情（`?id=rs1`） | 学生 |
| `/student/reflection` | 自我反思 | 学生 |
| `/student/me` | 我的 | 学生 |
| `/teacher/home` | 教师工作台 | 教师 |
| `/teacher/materials` | 材料查阅与标签辅助 | 教师 |
| `/teacher/workbench` | 研判工作台（`?id=m1`） | 教师 |
| `/teacher/review` | 多元研判与反馈输出（`?sid=s1`） | 教师 |
| `/teacher/portrait` | 学生成长画像（`?sid=s1`） | 教师 |
| `/teacher/stats` | 群体情况统计 | 教师 |
| `/admin/home` | 院校管理台 | 院校 |
| `/admin/tags` | 指标库模板配置 | 院校 |
| `/admin/rules` | 规则管理 | 院校 |
| `/admin/report` | 群体质量报告输出 | 院校 |

## 技术特点

- **单页 hash 路由**：切换只替换 `#app` 内容，不整页重载，无白屏闪烁
- **零外部依赖**：无 ECharts、无图标库、无 CDN、无 webfont，断网可用
- **手写 SVG 图表**：雷达、条形、堆叠条、折线、环形全部自绘
- **数据为前端 mock**：刷新即恢复初始演示状态，无后端

视觉沿用 Apple HIG 的设计语言（大圆角、胶囊控件、毛玻璃导航、轻阴影），
配色为校园蓝 + 米白（`#3e6ba6` / `#faf7f1`），标题宋体、正文系统黑体。

## 目录结构

```
Growth-Portrait/
├── index.html            唯一入口（应用壳，只有 #app 容器）
├── README.md
└── assets/
    ├── css/style.css     设计令牌 + 全部组件样式
    └── js/
        ├── data.js       mock 数据（学生 / 材料 / 标签 / 研判 / 资源）
        ├── views.js      23 个视图模板 + 路由表
        ├── ui.js         图标、导航、组件、手写 SVG 图表、hash 路由
        └── pages.js      各页面渲染逻辑与交互
```

改内容去哪：静态结构 → `views.js`；数据 → `data.js`；交互 → `pages.js`；样式 → `style.css`。

> `views.js` 是紧凑的单行 JSON 模板，大改页面结构前建议先在编辑器里格式化。

## 部署

已配置为 GitHub Pages：

- 分支：`main`
- 目录：`/ (root)`
- 入口：`index.html`
- 不需要构建步骤

仓库 **Settings → Pages** 中来源选择 `Deploy from a branch` → `main` → `/ (root)` 即可。

注意事项：

- **公开仓库**才能使用免费 Pages；私有仓库需要 GitHub Pro 或以上
- 站点发布后**始终公开可访问**，即使仓库设为私有
- GitHub Pages 运行在 Linux 上，**路径大小写敏感**，新增文件时引用要与文件名大小写一致
- 更新后 CDN 可能有约 10 分钟缓存，刚推的改动不必立刻验收

## 演示要点

1. 从 `#/preview` 进入，22 个页面一目了然。
2. 学生端画像页是核心：**雷达图上没有任何数字**，讲的是「证据充分程度」而不是「分数」。
3. 教师端「多元研判与反馈输出」页是「禁止量化」的落地证据 —— 两个文本框，零个数字输入框。
4. 群体统计页切到 2 班（6 人）会触发「样本量不足」提示，这是隐私设计的直接证据。
