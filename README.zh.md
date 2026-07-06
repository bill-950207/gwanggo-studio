<div align="center">

<img src="./docs/hero.png" alt="Gwanggo Studio" width="100%" />

<br />

# ⚡ Gwanggo Studio

### 所有顶级AI图像·视频模型。一把钥匙。在你自己的机器上。

**为 Seedream、Sora、Veo、Kling、GPT Image、Nano Banana 及 30+ 模型打造的开源工作室。**

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](./LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-111111?logo=react&logoColor=white)](https://react.dev)
[![Models](https://img.shields.io/badge/AI%20models-35%2B-6d28d9.svg)](#-模型)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg)](#-参与贡献)

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md) · **中文**

[快速开始](#-快速开始60秒) · [截图](#-预览) · [模型](#-模型) · [API](#%EF%B8%8F-底层api) · [配置](#%EF%B8%8F-配置)

</div>

---

> **封闭平台把最好的模型锁在墙内。**
> Gwanggo Studio 拆掉这堵墙:克隆仓库,粘贴一把钥匙,就能在一个完全属于你、每一行代码都可以读的应用里,用同样的前沿模型进行创作。

<br />

## 👀 预览

<table>
<tr>
<td width="50%">
<img src="./docs/screenshot-image-surface.png" alt="图像生成界面" />
<p align="center"><sub><b>图像生成</b> — 每个模型的真实生成结果与实时积分成本</sub></p>
</td>
<td width="50%">
<img src="./docs/screenshot-video-surface.png" alt="视频生成界面" />
<p align="center"><sub><b>视频生成</b> — 输入 → 结果预览,按模型定制的控制项</sub></p>
</td>
</tr>
</table>

<img src="./docs/screenshot-model-picker.png" alt="模型选择器" />
<p align="center"><sub><b>模型选择器</b> — 一个网格容纳所有前沿模型,官方厂商标志与真实样例输出</sub></p>

<br />

## 🥊 为什么选择 Gwanggo Studio

|              | 封闭式AI工作室          | **Gwanggo Studio**                  |
| ------------ | ----------------------- | ----------------------------------- |
| 源代码       | 🔒 封闭                 | ✅ **MIT — 可读、可fork、真正拥有** |
| 模型阵容     | 只有一家的模型          | ✅ **横跨所有厂商的35+模型**        |
| 所需账号     | 每个厂商一个            | ✅ **一把钥匙搞定一切**             |
| 运行位置     | 他们的服务器、他们的规则 | ✅ **你自己的机器**                 |
| 价格透明度   | 不透明的订阅            | ✅ **每个按钮上都有精确积分成本**   |

<br />

## ✨ 亮点

- 🎨 **35+前沿模型,一把钥匙。** ByteDance、OpenAI、Google、快手、阿里巴巴、xAI 等所有厂商的图像·视频生成,统一在单个托管API之后。
- 🧩 **真正的开源 (MIT)。** 工作室是纯客户端。仓库里没有隐藏的后端,没有遥测,没有任何秘密。
- ⚡ **始终可见的诚实定价。** 每个模型都暴露真实选项(宽高比、分辨率、时长、音频),生成按钮上实时显示精确积分成本。
- 🖼️ **图生视频 & 参考图。** 上传参考图,驱动 I2V、运动控制和编辑工作流。
- 🌗 **默认即美。** 深色模式、专注的单页创作流、官方厂商标志、每个模型的真实示例输出。
- 🌍 **内置4种语言。** English、한국어、日本語、中文。

<br />

## 🚀 快速开始(60秒)

```bash
git clone https://github.com/bill-950207/gwanggo-studio
cd gwanggo-studio
npm install
npm run dev        # → http://localhost:3000
```

就这样 — 连 `.env` 都不需要。工作室开箱即指向托管的 Gwanggo API。

**连接你的钥匙:** 点击头像 → 粘贴API密钥。密钥**只存储在你的设备上**,仅作为 Bearer 令牌发送。

> 🔑 **获取密钥:** 登录 [gwanggo.jocoding.io](https://gwanggo.jocoding.io) → **API keys** → **Create**。
> 新账号赠送**免费积分** — 足够体验完整的图像·视频工作流。

<br />

## 🧠 模型

精心策划、持续更新的阵容 — 没有僵尸模型,没有废弃残留。

**🖼️ 图像 (19)**

| | | | |
|---|---|---|---|
| Seedream 5 / 5 Lite | GPT Image 2 / 2.0 | Nano Banana Pro / 2 | FLUX.2 Pro / Kontext |
| Qwen Image 2.0 / Pro | WAN 2.7 / 2.7 Pro | Recraft V4 | Grok Imagine |
| Ideogram · Phota | ImagineArt 1.5 | ERNIE Image | Z-Image · Topaz Upscale |

**🎬 视频 (18)**

| | | | |
|---|---|---|---|
| Seedance 2.0 / 1.5 Pro | Sora 2 | Veo 3.1 / Lite | Kling 3.0 / O3 / MC |
| Hailuo-02 | PixVerse V6 / C1 / v5 | Vidu Q3 | WAN 2.7 Video / 2.6 |
| Grok Imagine | OmniHuman v1.5 | LTX 2.3 | |

<br />

## 🛠️ 底层API

工作室是干净REST API之上的轻客户端。浏览目录免费且无需密钥;生成才消耗积分。

| 操作           | 端点                          |
| -------------- | ----------------------------- |
| 模型目录       | `GET /api/v1/models` (公开)   |
| 账户 / 积分    | `GET /api/v1/me`              |
| 生成图像       | `POST /api/v1/generate/image` |
| 生成视频       | `POST /api/v1/generate/video` |
| 上传参考图     | `POST /api/v1/upload`         |
| 轮询任务       | `GET /api/v1/tasks/:id`       |

也可以直接用脚本调用 — 同一把钥匙在工作室之外照样能用:

```bash
curl -X POST https://gwanggo.jocoding.io/api/v1/generate/image \
  -H "Authorization: Bearer gwk_..." \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-image-2", "prompt": "霓虹小巷里的猫,电影感"}'
```

<br />

## ⚙️ 配置

零配置即可运行。仅在自托管后端时才需要覆盖:

| 变量                        | 默认值                                           | 用途               |
| --------------------------- | ------------------------------------------------ | ------------------ |
| `NEXT_PUBLIC_API_URL`       | `https://gwanggo.jocoding.io`                    | 生成请求的目标地址 |
| `NEXT_PUBLIC_DASHBOARD_URL` | `https://gwanggo.jocoding.io/dashboard/api-keys` | "获取密钥"链接地址 |

## 🧱 技术栈

Next.js 15 (App Router) · React 19 · Tailwind CSS · TypeScript — 这个仓库里的后端代码为**零**。纯客户端。

```
app/           Next.js 路由(单一创作界面)
components/    侧边栏、顶栏、生成界面、模型选择器、连接弹窗
lib/           API客户端、i18n、主题、模型目录
```

## 🤝 参与贡献

欢迎 Issue 和 PR — 代码库小到一口气就能读完。添加一门语言、打磨一个界面、接入一个新工作流。

## 📄 许可证

[MIT](./LICENSE) — 随意使用,注明出处更佳。

---

<div align="center">

**如果这帮你省下了又一个每月$60的订阅,请点个 ⭐ — 它能帮助更多创作者发现这个项目。**

<sub>为想真正拥有自己工具的创作者,用 ❤️ 打造。</sub>

</div>
