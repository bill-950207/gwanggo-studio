<div align="center">

<img src="./docs/hero.png" alt="Gwanggo Studio" width="100%" />

<img src="./docs/demo.gif" alt="Prompt to result in one flow" width="100%" />

<br />

# ⚡ Gwanggo Studio

### 최고의 AI 이미지·영상 모델 전부. 키 하나. 내 컴퓨터에서.

**Seedream, Sora, Veo, Kling, GPT Image, Nano Banana — 그리고 30+개 모델을 위한 오픈소스 스튜디오.**

[![License: MIT](https://img.shields.io/badge/License-MIT-111111.svg)](./LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-111111?logo=react&logoColor=white)](https://react.dev)
[![Models](https://img.shields.io/badge/AI%20models-35%2B-6d28d9.svg)](#-모델)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg)](#-기여하기)

[English](./README.md) · **한국어** · [日本語](./README.ja.md) · [中文](./README.zh.md)

[빠른 시작](#-빠른-시작-60초) · [스크린샷](#-미리보기) · [모델](#-모델) · [API](#%EF%B8%8F-내부-api) · [설정](#%EF%B8%8F-설정)

</div>

---

> **폐쇄형 플랫폼은 최고의 모델을 벽 뒤에 가둡니다.**
> Gwanggo Studio는 그 벽을 허뭅니다. 저장소를 클론하고, 키 하나만 붙여넣으면 — 코드를 한 줄 한 줄 읽을 수 있는, 온전히 내 것인 앱에서 동일한 프론티어 모델로 생성할 수 있습니다.

<br />

## 👀 미리보기

<table>
<tr>
<td width="50%">
<img src="./docs/screenshot-image-surface.png" alt="이미지 생성 화면" />
<p align="center"><sub><b>이미지 생성</b> — 모델별 실제 생성 결과와 실시간 크레딧 비용</sub></p>
</td>
<td width="50%">
<img src="./docs/screenshot-video-surface.png" alt="영상 생성 화면" />
<p align="center"><sub><b>영상 생성</b> — 입력 → 결과 미리보기, 모델별 세부 옵션</sub></p>
</td>
</tr>
</table>

<img src="./docs/screenshot-model-picker.png" alt="모델 선택" />
<p align="center"><sub><b>모델 피커</b> — 하나의 그리드에 모든 프론티어 모델, 공식 제공사 로고와 실제 샘플 결과물</sub></p>

<br />

## 🥊 왜 Gwanggo Studio인가

|                 | 폐쇄형 AI 스튜디오        | **Gwanggo Studio**                     |
| --------------- | ------------------------- | -------------------------------------- |
| 소스 코드       | 🔒 비공개                 | ✅ **MIT — 읽고, 포크하고, 소유하세요** |
| 모델 라인업     | 한 회사 모델뿐            | ✅ **모든 제공사의 35+개 모델**         |
| 필요한 계정     | 제공사마다 하나씩         | ✅ **키 하나로 전부**                   |
| 실행 위치       | 그들의 서버, 그들의 규칙  | ✅ **내 컴퓨터**                        |
| 가격 투명성     | 불투명한 구독제           | ✅ **모든 버튼에 정확한 크레딧 표시**   |

<br />

## ✨ 핵심 기능

- 🎨 **35+개 프론티어 모델, 키 하나.** ByteDance, OpenAI, Google, Kuaishou, Alibaba, xAI 등 모든 제공사의 이미지·영상 생성 — 단일 호스팅 API 뒤에서.
- 🧩 **진짜 오픈소스 (MIT).** 스튜디오는 순수 클라이언트입니다. 저장소에 숨겨진 백엔드도, 텔레메트리도, 숨길 것도 없습니다.
- ⚡ **항상 보이는 정직한 가격.** 모델마다 실제 옵션(비율, 해상도, 길이, 오디오)을 노출하고, Generate 버튼에 정확한 크레딧 비용을 실시간 표시합니다.
- 🖼️ **이미지-투-비디오 & 레퍼런스 이미지.** 레퍼런스를 업로드해 I2V, 모션 컨트롤, 편집 워크플로우를 구동하세요.
- 🌗 **기본이 아름답다.** 다크 모드, 몰입형 단일 화면 플로우, 공식 제공사 로고, 모델별 실제 예시 결과물.
- 🌍 **4개 언어 내장.** English, 한국어, 日本語, 中文.

<br />

## 🚀 빠른 시작 (60초)

```bash
git clone https://github.com/bill-950207/gwanggo-studio
cd gwanggo-studio
npm install
npm run dev        # → http://localhost:3000
```

끝입니다 — `.env`도 필요 없습니다. 스튜디오는 기본으로 호스팅된 Gwanggo API를 바라봅니다.

**키 연결:** 아바타 클릭 → API 키 붙여넣기. 키는 **내 기기에만** 저장되며 Bearer 토큰으로만 전송됩니다.

> 🔑 **키 발급:** [gwanggo.jocoding.io](https://gwanggo.jocoding.io?utm_source=github&utm_medium=readme) 로그인 → **API keys** → **Create**.
> 신규 가입 시 **무료 크레딧** 지급 — 이미지·영상 워크플로우 전체를 체험하기에 충분합니다.

<br />

## 🌐 로컬 생성 (무료)

지원되는 GPU에서 무료로 로컬 생성 — API 키 필요 없음.

```bash
curl -fsSL https://raw.githubusercontent.com/bill-950207/gwanggo-studio/main/scripts/local/install.sh | bash
```

**필요 사양:** NVIDIA GPU 8GB+ (Linux/Windows) 또는 Apple Silicon 24GB+ (macOS, 장당 약 2분). [설치 가이드](./docs/local-generation.md)

**Windows?** [install.ps1](./scripts/local/install.ps1) 다운로드 후 실행

설치 프로그램이 하드웨어를 검사하고, 조건이 맞지 않으면 클라우드 경로(무료 35크레딧)로 안내합니다.

<br />

## 🧠 모델

엄선되고 지속적으로 업데이트되는 라인업 — 죽은 모델도, 폐기된 찌꺼기도 없습니다.

**🖼️ 이미지 (19)**

| | | | |
|---|---|---|---|
| Seedream 5 / 5 Lite | GPT Image 2 / 2.0 | Nano Banana Pro / 2 | FLUX.2 Pro / Kontext |
| Qwen Image 2.0 / Pro | WAN 2.7 / 2.7 Pro | Recraft V4 | Grok Imagine |
| Ideogram · Phota | ImagineArt 1.5 | ERNIE Image | Z-Image · Topaz Upscale |

**🎬 영상 (18)**

| | | | |
|---|---|---|---|
| Seedance 2.0 / 1.5 Pro | Sora 2 | Veo 3.1 / Lite | Kling 3.0 / O3 / MC |
| Hailuo-02 | PixVerse V6 / C1 / v5 | Vidu Q3 | WAN 2.7 Video / 2.6 |
| Grok Imagine | OmniHuman v1.5 | LTX 2.3 | |

<br />

## 🛠️ 내부 API

스튜디오는 깔끔한 REST API 위의 얇은 클라이언트입니다. 카탈로그 탐색은 무료(키 불필요), 생성은 크레딧을 사용합니다.

| 동작              | 엔드포인트                    |
| ----------------- | ----------------------------- |
| 모델 카탈로그     | `GET /api/v1/models` (공개)   |
| 계정 / 크레딧     | `GET /api/v1/me`              |
| 이미지 생성       | `POST /api/v1/generate/image` |
| 영상 생성         | `POST /api/v1/generate/video` |
| 레퍼런스 업로드   | `POST /api/v1/upload`         |
| 작업 상태 조회    | `GET /api/v1/tasks/:id`       |

스튜디오 밖에서 직접 스크립트로 써도 됩니다 — 같은 키가 그대로 동작합니다:

```bash
curl -X POST https://gwanggo.jocoding.io/api/v1/generate/image \
  -H "Authorization: Bearer gwk_..." \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-image-2", "prompt": "네온 불빛 골목의 고양이, 시네마틱"}'
```

<br />

## ⚙️ 설정

설정 없이 동작합니다. 백엔드를 직접 호스팅할 때만 오버라이드하세요:

| 변수                        | 기본값                                           | 용도                    |
| --------------------------- | ------------------------------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL`       | `https://gwanggo.jocoding.io`                    | 생성 요청을 보낼 주소   |
| `NEXT_PUBLIC_DASHBOARD_URL` | `https://gwanggo.jocoding.io/dashboard/api-keys` | "키 발급" 링크 목적지   |

## 🧱 스택

Next.js 15 (App Router) · React 19 · Tailwind CSS · TypeScript — 이 저장소에 백엔드 코드는 **0줄**. 순수 클라이언트.

```
app/           Next.js 라우트 (단일 생성 화면)
components/    사이드바, 톱바, 생성 화면, 모델 피커, 연결 모달
lib/           API 클라이언트, i18n, 테마, 모델 카탈로그
```

## 🤝 기여하기

이슈와 PR 환영합니다 — 한자리에서 다 읽을 수 있는 작은 코드베이스입니다. 언어를 추가하고, 화면을 다듬고, 새 워크플로우를 연결해 보세요.

## 📄 라이선스

[MIT](./LICENSE) — 마음껏 쓰세요. 출처 표기는 감사히 받겠습니다.

---

<div align="center">

**월 $60짜리 구독 하나를 아꼈다면 ⭐ 하나 부탁드립니다 — 더 많은 크리에이터에게 닿는 데 도움이 됩니다.**

<sub>도구를 소유하고 싶은 크리에이터들을 위해 ❤️ 를 담아 만들었습니다.</sub>

</div>
