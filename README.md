<div align="center">

<img src="./docs/hero.png" alt="Gwanggo Studio" width="100%" />

<img src="./docs/demo.gif" alt="Prompt to result in one flow" width="100%" />

<br />

# ⚡ Gwanggo Studio

### Every top AI image & video model. One key. Your machine.

**The open-source studio for Seedream, Sora, Veo, Kling, GPT Image, Nano Banana — and 30+ more.**

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](./LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-111111?logo=react&logoColor=white)](https://react.dev)
[![Models](https://img.shields.io/badge/AI%20models-35%2B-6d28d9.svg)](#-models)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg)](#-contributing)

**English** · [한국어](./README.ko.md) · [日本語](./README.ja.md) · [中文](./README.zh.md)

[Quick start](#-quick-start-60-seconds) · [Screenshots](#-see-it) · [Models](#-models) · [API](#-the-api-underneath) · [Configuration](#%EF%B8%8F-configuration)

</div>

---

> **Closed platforms keep the best models behind a wall.**
> Gwanggo Studio tears it down: clone the repo, paste one key, and generate with the exact same frontier models — from an app you fully own and can read line by line.

<br />

## 👀 See it

<table>
<tr>
<td width="50%">
<img src="./docs/screenshot-image-surface.png" alt="Image generation surface" />
<p align="center"><sub><b>Image generation</b> — real results from each model, live credit costs</sub></p>
</td>
<td width="50%">
<img src="./docs/screenshot-video-surface.png" alt="Video generation surface" />
<p align="center"><sub><b>Video generation</b> — input → result previews, per-model controls</sub></p>
</td>
</tr>
</table>

<img src="./docs/screenshot-model-picker.png" alt="Model picker" />
<p align="center"><sub><b>The model picker</b> — one grid, every frontier model, official provider logos and real sample outputs</sub></p>

<br />

## 🥊 Why Gwanggo Studio

|                       | Closed AI studios          | **Gwanggo Studio**                       |
| --------------------- | -------------------------- | ---------------------------------------- |
| Source code           | 🔒 Locked                  | ✅ **MIT — read it, fork it, own it**    |
| Model lineup          | One vendor's models        | ✅ **35+ models across every provider**  |
| Accounts needed       | One per provider           | ✅ **One key for everything**            |
| Where it runs         | Their servers, their rules | ✅ **Your machine**                      |
| Pricing transparency  | Opaque subscriptions       | ✅ **Exact credit cost on every button** |

<br />

## ✨ Highlights

- 🎨 **35+ frontier models, one key.** Image and video generation across ByteDance, OpenAI, Google, Kuaishou, Alibaba, xAI, and more — behind a single hosted API.
- 🧩 **Truly open (MIT).** The studio is a pure client. No hidden backend in the repo, no telemetry, nothing to hide.
- ⚡ **Honest pricing, always visible.** Every model exposes its real options — aspect ratio, resolution, duration, audio — with the exact credit cost live on the Generate button.
- 🖼️ **Image-to-video & reference images.** Upload a reference and drive I2V, motion control, and editing workflows.
- 🌗 **Beautiful by default.** Dark mode, a focused single-surface flow, official provider logos, real example outputs for every model.
- 🌍 **4 languages built in.** English, 한국어, 日本語, 中文.

<br />

## 🚀 Quick start (60 seconds)

```bash
git clone https://github.com/bill-950207/gwanggo-studio
cd gwanggo-studio
npm install
npm run dev        # → http://localhost:3000
```

That's it — no `.env` required. The studio points at the hosted Gwanggo API out of the box.

**Then connect your key:** click the avatar → paste your API key. It's stored **only on your device** and sent solely as a Bearer token.

> 🔑 **Get a key:** sign in at [gwanggo.jocoding.io](https://gwanggo.jocoding.io?utm_source=github&utm_medium=readme) → **API keys** → **Create**.
> New accounts get **free credits** — enough to try the full image & video workflow.

<br />

## 🌐 Local generation (free)

Generate locally, free and private, on supported GPUs — no API key needed.

```bash
curl -fsSL https://raw.githubusercontent.com/bill-950207/gwanggo-studio/main/scripts/local/install.sh | bash
```

**Requirements:** NVIDIA GPU 8GB+ (Linux/Windows) or Apple Silicon 24GB+ (macOS, ~2 min/image). [Install guide](./docs/local-generation.md)

**Windows?** Download and run [install.ps1](./scripts/local/install.ps1)

The installer gates on hardware and guides you to the cloud path (35 free credits) if your device doesn't qualify.

<br />

## 🧠 Models

A curated, continuously updated lineup — no dead weight, no deprecated leftovers.

**🖼️ Image (19)**

| | | | |
|---|---|---|---|
| Seedream 5 / 5 Lite | GPT Image 2 / 2.0 | Nano Banana Pro / 2 | FLUX.2 Pro / Kontext |
| Qwen Image 2.0 / Pro | WAN 2.7 / 2.7 Pro | Recraft V4 | Grok Imagine |
| Ideogram · Phota | ImagineArt 1.5 | ERNIE Image | Z-Image · Topaz Upscale |

**🎬 Video (18)**

| | | | |
|---|---|---|---|
| Seedance 2.0 / 1.5 Pro | Sora 2 | Veo 3.1 / Lite | Kling 3.0 / O3 / MC |
| Hailuo-02 | PixVerse V6 / C1 / v5 | Vidu Q3 | WAN 2.7 Video / 2.6 |
| Grok Imagine | OmniHuman v1.5 | LTX 2.3 | |

<br />

## 🛠️ The API underneath

The studio is a thin client over a clean REST API. Browsing the catalog is free and needs no key; generating spends credits.

| Action            | Endpoint                      |
| ----------------- | ----------------------------- |
| Model catalog     | `GET /api/v1/models` (public) |
| Account / credits | `GET /api/v1/me`              |
| Generate image    | `POST /api/v1/generate/image` |
| Generate video    | `POST /api/v1/generate/video` |
| Upload reference  | `POST /api/v1/upload`         |
| Poll a task       | `GET /api/v1/tasks/:id`       |

Script it directly if you want — the same key works outside the studio:

```bash
curl -X POST https://gwanggo.jocoding.io/api/v1/generate/image \
  -H "Authorization: Bearer gwk_..." \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-image-2", "prompt": "a neon-lit alley cat, cinematic"}'
```

<br />

## ⚙️ Configuration

Zero config needed. Override only if you self-host the backend:

| Variable                    | Default                                          | Purpose                      |
| --------------------------- | ------------------------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_API_URL`       | `https://gwanggo.jocoding.io`                    | Where generation requests go |
| `NEXT_PUBLIC_DASHBOARD_URL` | `https://gwanggo.jocoding.io/dashboard/api-keys` | Where "Get a key" links to   |

## 🧱 Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS · TypeScript — and **zero** backend code in this repo. Pure client.

```
app/           Next.js routes (single creation surface)
components/    Sidebar, top bar, generation surface, model picker, connect modal
lib/           API client, i18n, theme, model catalog
```

## 🤝 Contributing

Issues and PRs welcome — the codebase is small enough to read in one sitting. Add a language, polish a surface, wire up a new workflow.

## 📄 License

[MIT](./LICENSE) — do what you want, attribution appreciated.

---

<div align="center">

**If this saved you from another $60/month subscription, drop a ⭐ — it helps more creators find it.**

<sub>Built with ❤️ for creators who'd rather own their tools.</sub>

</div>
