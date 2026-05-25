<div align="center">

# mighta

### _你没活过的那些人生。_

**一个由群体 LLM agent 驱动的反事实人生模拟器。**

你给它几个真实的人生岔路 —— 那些你选了 A 但本可以选 B 的时刻。一群 agent 会孵化出 6 个走了另一条路的"你",让他们慢慢老去,然后告诉你他们后来怎么样了。

[**中文**](#中文) · [**English**](./README.md) · [在线 Demo](#) · [截图](#截图)

![dark](./docs/hero-dark.png)

</div>

---

## 中文

### 这是什么

`mighta` 是一个开源的、纯浏览器端运行的**反事实人生模拟器**。

你给它你人生中真实的岔路 —— 那些你做了 A 但本可能做 B 的时刻。模型会孵化出六个走了另一条路的"你",让他们沿着自己的轨迹老去,然后告诉你每一个最后变成了什么样。

这是"你,在另一种人生里" —— 但具体、克制、文学。不是星座算命,不是聊天机器人。是对"没走的那条路"的安静凝视,可视化。

> _选一个岔路。一千个走了另一条的你,在那里慢慢老去。看他们后来怎么样了。_

### 特性

| 特性 | 说明 |
|---|---|
| 🌀 **分叉孵化** | 从你人生的任何一个真实时刻,生成 6 条平行人生 |
| 📜 **残章还原** | _(即将到来)_ 还原失落的结局、沦陷之城、被涂黑的档案 |
| 🌳 **分支时间轴** | git-graph 风的 SVG 可视化,悬停查看节点 + 展开 fork 详情 |
| 🌐 **自带模型** | Anthropic Claude · OpenAI · Gemini · DeepSeek · 通义 · Kimi · GLM · 豆包 |
| 🌍 **8 种语言** | English · 简体中文 · 繁體中文 · 日本語 · 한국어 · Español · Français · Deutsch |
| ☀️ **明暗主题** | 暖深 cinematic · 暖米 parchment · 跟随系统 |
| 📥 **导入任意文本** | 拖入 `.txt`/`.md`(或粘贴),agent 自动提取人生岔路 |
| ⏱ **细颗粒度时间** | "我 22 岁那个秋天" / "上周" — 不只是年龄数字 |
| 🔒 **隐私优先** | 密钥只留在你浏览器。没有服务器、没有埋点、不需要账号 |

### 快速开始

```bash
git clone https://github.com/YunyueLi/mighta.git
cd mighta
npm install
npm run dev
# 打开 http://localhost:5173
```

然后:

1. 点右上角的**设置**齿轮
2. 选一个**模型提供商**(国内推荐 DeepSeek / 通义 / Kimi / GLM / 豆包)
3. 粘贴你的 **API 密钥**
4. 选一个**模型**(Haiku 4.5 便宜快,Sonnet 4.6 更深思)
5. 进入"**如果**"页,试一下 **史蒂夫·乔布斯** 预设,或者贴你自己的故事,点 **看看本可能的样子**

### 隐私

API 密钥只存在你浏览器的 `localStorage` 里。**浏览器 → 模型提供商,直连。**
没有服务器,没有埋点,没有账号,不收集任何数据。

源码可读,自己审。全部是客户端 React。

### 技术栈

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4**(CSS-first 配置,无需 `tailwind.config.js`)
- **Zustand**(状态) · **react-i18next**(8 语言) · **framer-motion**(动画)
- **OpenAI SDK** + **Anthropic SDK**(在 `llm.ts` 里统一抽象)
- **Fraunces**(可变 serif)+ **Caveat**(手写)+ **Inter**(sans)+ **JetBrains Mono** + **Noto Sans/Serif SC/JP/KR**(中日韩)

### 路线图

- [x] 分叉孵化(6 个 fork + 分支时间轴)
- [x] 8 个模型提供商(海外 3 + 国内 5)
- [x] 8 种语言 + 浏览器自动检测
- [x] 明 / 暗 / 自动主题
- [x] 文件导入 → Claude 自动提取节点
- [x] 细颗粒度时间(`moment` 字段:上周 / 2019 年 10 月)
- [ ] **残章还原**模块 — 还原失落的文本/历史/被涂黑的档案
- [ ] **分享** — 把 fork 导出成图片 / 链接
- [ ] **再分叉** — 从一个 fork 再分叉(递归 what-if)
- [ ] **收藏** — 保存历史 fork
- [ ] **托管 demo** — 带限流的免费 key

### 贡献

欢迎 Issue / PR。详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

如果你做了一个有意思的 preset(历史人物、地区情境、虚构角色),欢迎 PR 加到 `src/lib/presets.ts`。

### 致敬

- **[MiroFish](https://github.com/666ghj/MiroFish)** — 群体智能预测引擎,本类型的源头
- **[The Public Domain Review](https://publicdomainreview.org)** — 纸 / 档案美学
- **Anthropic.com** — 暖色克制 editorial 表面
- **NYT Magazine / A24 / Klim Type** — 字体参考

### 协议

MIT © 2026 mighta 贡献者们

---

<div align="center">

_由一群 LLM agent 推演 · 自带密钥 · 只在你浏览器里_

</div>
