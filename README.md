# MindType

> 🌐 在线体验：https://liuchenwei285.github.io/mindtype-mbti/

一个现代、响应式的 MBTI 性格测试 Web App。用户完成 48 道原创情境题后，网站会按 E/I、S/N、T/F、J/P 四个维度实时计算倾向，并展示对应的 16 型人格报告、四维度百分比和可下载的分享卡片。

> MBTI 测试结果仅用于自我探索与娱乐参考，不代表严格的心理学诊断。

## 功能

- 48 道原创题目：每个维度 12 题，正向与反向表述各 6 题
- 7 级同意度量表：非常不同意 → 非常同意
- 上一题、答题卡跳转、答案修改
- 浏览器刷新后自动恢复进度和答案
- 四维度独立计分与百分比展示
- 完整覆盖 INTJ、INFP、ENFP、ESTJ 等 16 种类型
- 独立的人格数据：概述、优势、挑战、学习、工作、人际、压力和成长方向
- 分享结果、复制结果、下载 PNG 结果卡片
- 响应式布局，重点优化移动端
- localStorage 本地存储，无后端、无账号
- prefers-reduced-motion 适配

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Vitest
- Playwright Core（使用本机 Chrome 做端到端测试，不下载浏览器）

## 运行项目

```bash
npm install
npm run dev
```

打开终端中提示的本地地址，通常是 `http://localhost:5173`。

> 不要直接双击项目根目录的 `index.html`。它是 Vite 的开发入口，里面引用的是 React/TypeScript 源码，浏览器无法直接运行它，所以会显示白屏。

### 生产构建

```bash
npm run build
npm run preview
```

### 直接双击打开的单文件版

```bash
npm run build:standalone
```

构建完成后，双击下面的文件即可离线运行，不需要服务器：

```text
outputs/MindType-standalone.html
```

单文件版会把 JavaScript 和 CSS 内联进同一个 HTML 文件中，答题进度和结果仍然保存在浏览器本地。

### 旧浏览器兼容

构建过程会自动展平 Tailwind v4 的 CSS @layer 层。这样旧版荣耀浏览器、旧 Chromium 内核和其他不完全支持 CSS 级联层的浏览器也能正常显示样式。

## 测试

### 单元测试

```bash
npm test
```

覆盖题目数量与维度分布、正反向题比例、16 型数据完整性、未完成测试处理、四维计算、百分比加总、反向题方向，以及 16 种人格是否都能产生。

### 端到端测试

请先确保本机安装了 Google Chrome。测试会自动尝试启动 `vite preview`，也可以先手动运行 `npm run preview`。

```bash
npm run test:e2e
```

可通过环境变量覆盖默认路径：

```powershell
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$env:BASE_URL = "http://127.0.0.1:4173"
npm run test:e2e
```

端到端测试覆盖完整答题流程、返回修改、刷新恢复、结果计算、复制结果、生成分享卡片、重新测试，以及 390px 手机端横向溢出检查。

## 项目结构

```text
src/
├── components/            可复用 UI 组件
│   ├── AnimatedNumber.tsx  百分比数字动画
│   ├── AxisBar.tsx         单个 MBTI 维度进度条
│   ├── Button.tsx          按钮变体
│   ├── ChoiceScale.tsx     7 级答案选择器
│   ├── Logo.tsx            品牌标识
│   ├── ProgressBar.tsx     测试进度条
│   └── ShareCard.tsx       网页内结果卡片预览
├── data/
│   ├── questions.ts        48 道原创题与答案选项
│   └── personalities.ts    16 型人格完整内容
├── hooks/
│   ├── useHashRoute.ts     轻量哈希路由
│   ├── useLocalStorageState.ts
│   └── useTestSession.ts   测试进度与答案状态
├── pages/
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   └── ResultPage.tsx
├── types/
│   └── mbti.ts             全局 TypeScript 类型
├── utils/
│   ├── mbtiCalculator.ts   MBTI 计分算法
│   ├── result.ts           结果格式化与 Canvas 分享图
│   └── mbtiCalculator.test.ts
├── App.tsx
├── index.css
└── main.tsx
```

## MBTI 计算逻辑

每道题带有 `dimension`、`direction` 和可选 `weight` 字段：

- `dimension`：`EI`、`SN`、`TF`、`JP`
- `direction: 1`：同意时偏向该维度的第一个字母
- `direction: -1`：同意时偏向该维度的第二个字母
- `weight`：题目权重，默认 1，后续可以在不改算法的情况下调整题目重要性

用户的 7 级答案会转为 `-3` 到 `+3`：

```text
非常不同意 -3
不同意     -2
有点不同意 -1
中立        0
有点同意   +1
同意       +2
非常同意   +3
```

算法先计算每道题对维度两侧的绝对贡献，再比较两侧总分：

```text
firstPercent  = firstScore / (firstScore + secondScore) * 100
secondPercent = 100 - firstPercent
```

如果总数是 0，则显示 50% / 50%，并按维度第一个字母作为确定性平局结果。结果页会提示相近维度，建议把百分比理解为“本次作答中更常使用哪一侧”，而不是能力评分。

## 数据存储

localStorage 键名：

- `mindtype.session.v1`：当前答案和题目位置
- `mindtype.result.v1`：最近一次完成的结果答案

重新测试会清空这两项数据。

## 已知说明

- 项目没有后端和账号系统，结果只保存在当前浏览器。
- 分享卡片通过浏览器 Canvas 本地生成，不需要上传图片。
- 端到端测试使用本机 Chrome；其他浏览器可通过 `CHROME_PATH` 指定 Chromium 内核浏览器路径。
- 测试结果是自评倾向，不应作为医学、心理或职业诊断依据。



