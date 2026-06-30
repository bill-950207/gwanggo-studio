<div align="center">

<img src="./docs/hero.png" alt="Gwanggo Studio" width="100%" />

<h1>Gwanggo Studio</h1>

**Open-source AI media generation studio.**
Run every top image & video model — Seedream, Veo, Sora, Kling, Nano Banana, and more — from one clean, self-hostable app.

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-111111?logo=react&logoColor=white)](https://react.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg)](#contributing)

[Quick start](#-quick-start) · [How it works](#-how-it-works) · [Models](#-models) · [Configuration](#-configuration)

</div>

---

> **Higgsfield keeps its models behind a wall. Gwanggo Studio is open.**
> Run it yourself, and power generation with a single Gwanggo API key — no juggling FAL / Kie / WaveSpeed accounts, no lock-in.

## ✨ Highlights

- **🎨 Every model, one key.** 20+ image models and 18+ video models behind a single hosted API.
- **🧩 Open source (MIT).** Clone it, read it, run it on your own machine. The studio is a pure client.
- **🌗 Clean by default.** Dark mode, a focused single-surface creation flow, official provider logos and live example thumbnails.
- **🌍 Multilingual.** English by default; Korean, Japanese, and Chinese built in.
- **🖼️ Image-to-video & reference images.** Upload a reference and drive I2V, motion, and editing workflows.
- **⚡ Per-model controls.** Each model exposes its real options (aspect, resolution, duration, audio) with accurate live credit cost.

## 🚀 Quick start

```bash
git clone https://github.com/bill-950207/gwanggo-studio
cd gwanggo-studio
npm install
cp .env.example .env.local      # points at the hosted Gwanggo API by default
npm run dev                     # http://localhost:3000
```

Then open the app, click the avatar, and paste your API key. The key is stored
locally on your device and sent only as a Bearer token to the API.

> **Get a key:** sign in at [gwanggo.jocoding.io](https://gwanggo.jocoding.io) → **API keys** → **Create**.
> New accounts get free credits to try the full workflow.

## 🛠️ How it works

The studio is a thin client. Browsing the model catalog is free and needs no key;
generating requires a key and spends credits. Everything runs through the hosted API:

| Action            | Endpoint                        |
| ----------------- | ------------------------------- |
| Model catalog     | `GET /api/v1/models` (public)   |
| Account / credits | `GET /api/v1/me`                |
| Generate image    | `POST /api/v1/generate/image`   |
| Generate video    | `POST /api/v1/generate/video`   |
| Upload reference  | `POST /api/v1/upload`           |
| Poll a task       | `GET /api/v1/tasks/:id`         |

Point `NEXT_PUBLIC_API_URL` at your own deployment if you self-host the backend too.

## 🧠 Models

A curated, continuously updated lineup of the top models — no dead weight.

**Image** — Seedream 5 · Nano Banana Pro · Nano Banana 2 · FLUX.2 Pro · FLUX Kontext ·
Qwen Image 2 / Pro · Recraft V4 · GPT Image · Grok Image · Ideogram 3 · Krea 2 · Z-Image …

**Video** — Seedance 2.0 · Veo 3.1 / Lite · Sora 2 · Kling 3.0 / Motion Control · Hailuo 02 ·
PixVerse V6 · Vidu Q3 · LTX 2.3 · Grok Imagine · Happy Horse …

## ⚙️ Configuration

| Variable                     | Default                                  | Purpose                      |
| ---------------------------- | ---------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL`        | `https://gwanggo.jocoding.io`            | Where generation requests go |
| `NEXT_PUBLIC_DASHBOARD_URL`  | `https://gwanggo.jocoding.io/dashboard/api-keys` | Where "Get a key" links to   |

## 🧱 Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS · TypeScript. No backend in this
repo — it's a pure client that talks to the hosted Gwanggo API.

## 🤝 Contributing

Issues and PRs are welcome. The codebase is small and approachable:

```
app/          Next.js routes (single creation surface)
components/    Sidebar, top bar, generation surface, model picker, connect modal
lib/           API client, i18n, theme, model catalog
```

## 📄 License

[MIT](./LICENSE) — do what you want, attribution appreciated.

<div align="center">
<sub>Built with ❤️ for creators who'd rather own their tools.</sub>
</div>
