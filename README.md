# Gwanggo Studio

**Open-source AI media generation studio.** Run every top image & video model —
Seedream, Veo, Sora, Kling, Nano Banana, and more — from one clean, self-hostable
app. No model lock-in like closed tools. One key, every model.

> Higgsfield keeps its models behind a wall. Gwanggo Studio is open: run it
> yourself, and power generation with a single Gwanggo API key.

![studio](./design/01-main-hub.png)

## Why

- **Open source (MIT).** Clone it, read it, run it on your own machine.
- **Every model, one key.** 16+ image models and 18+ video models behind a single
  hosted API — no juggling FAL / Kie / WaveSpeed accounts.
- **Clean by default.** Dark mode, keyboard-friendly, no clutter.
- **Multilingual.** English by default; Korean, Japanese, and Chinese built in.

## Quick start

```bash
git clone https://github.com/your-org/gwanggo-studio
cd gwanggo-studio
npm install
cp .env.example .env.local      # points at the hosted Gwanggo API by default
npm run dev                     # http://localhost:3000
```

Then open the app, click the avatar, and paste an API key. The key is stored
locally on your device and sent only as a Bearer token to the API.

**Get a key:** sign in at [gwanggo.jocoding.io](https://gwanggo.jocoding.io) → API keys → create.
New accounts get free credits to try the full workflow.

## How it works

The studio is a thin client. All generation runs through the hosted Gwanggo API:

| Action            | Endpoint                       |
| ----------------- | ------------------------------ |
| Model catalog     | `GET /api/v1/models` (public)  |
| Account / credits | `GET /api/v1/me`               |
| Generate image    | `POST /api/v1/generate/image`  |
| Generate video    | `POST /api/v1/generate/video`  |
| Poll a task       | `GET /api/v1/tasks/:id`        |

Browsing models is free and needs no key. Generating requires a key and spends
credits. Point `NEXT_PUBLIC_API_URL` at your own deployment if you self-host the
backend too.

## Configuration

| Variable                     | Default                                  | Purpose                      |
| ---------------------------- | ---------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL`        | `https://gwanggo.jocoding.io`            | Where generation requests go |
| `NEXT_PUBLIC_DASHBOARD_URL`  | `https://gwanggo.jocoding.io/dashboard/api-keys`  | Where "Get a key" links to   |

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS · TypeScript. No backend in this
repo — it's a pure client.

## License

MIT.
