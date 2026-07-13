/**
 * 로컬 인퍼런스(ComfyUI + Z-Image Turbo) 컨트랙트 타입
 *
 * 스튜디오는 사용자의 localhost ComfyUI를 "local provider"로 사용한다.
 * 사양 판정은 2단계: 브라우저 WebGPU 휴리스틱(기대치) → ComfyUI /system_stats(정식).
 */

/** 로컬 런타임 상태 — 퍼널 분기의 단일 소스 */
export type LocalRuntimeStatus =
  | 'checking'        // 확인 중 (초기)
  | 'ready'           // ComfyUI 응답 + 모델 파일 존재 + 사양 충족
  | 'model_missing'   // ComfyUI는 떠 있으나 Z-Image 모델 파일 없음
  | 'insufficient'    // ComfyUI는 떠 있으나 VRAM 부족 (<8GB)
  | 'offline'         // localhost 런타임 없음

/** 브라우저 휴리스틱 — 런타임 미설치 시 CTA 우선순위 결정용 (정식 판정 아님) */
export type HardwareHint = 'likely' | 'unlikely' | 'unknown'

export interface LocalSystemInfo {
  gpuName: string | null
  vramGB: number | null
  /** ComfyUI가 보고한 디바이스 타입 (cuda | mps | cpu 등) */
  backend: string | null
  comfyVersion: string | null
}

export interface LocalState {
  status: LocalRuntimeStatus
  hint: HardwareHint
  system: LocalSystemInfo | null
  /** ready 판정에 사용된 유닛 파일명 (bf16 또는 int8) */
  unetFile: string | null
}

export interface LocalGenerateParams {
  prompt: string
  width: number
  height: number
  seed?: number
  /** Z-Image Turbo 권장 기본: 8 스텝 / cfg 1 */
  steps?: number
  cfg?: number
}

export interface LocalGenerateResult {
  /** blob object URL — 브라우저 세션 내에서만 유효 */
  objectUrl: string
  blob: Blob
  seed: number
  durationMs: number
}

export type LocalProgress =
  | { phase: 'queued'; position: number }
  | { phase: 'running' }
  | { phase: 'done' }

// ============================================================
// 상수 — 설치 스크립트(scripts/local/*)와 반드시 동기 유지
// ============================================================

export const LOCAL_RUNTIME_URL =
  process.env.NEXT_PUBLIC_LOCAL_RUNTIME_URL || 'http://127.0.0.1:8188'

/** 정식 사양 게이트 (NVIDIA VRAM GB 기준) */
export const MIN_VRAM_GB = 8
/** bf16(고품질) 티어 기준 */
export const BF16_VRAM_GB = 14
/*
 * Apple Silicon(MPS)은 v1에서 미지원 — 클라우드로 안내한다.
 * 실측 근거(M4 Pro 24GB): int8은 MPS에 matmul 커널(aten::_int_mm)이 없어 실행 불가,
 * bf16은 웨이트 19GB 메모리 압박으로 ~202초/스텝(8스텝 ≈ 27분/장)이라 비실용.
 * GGUF(fp16 dequant) 티어가 후속 실험 후보.
 */

/** ComfyUI models/ 하위 파일명 — 존재 검사와 워크플로 구성에 사용 */
export const ZIMAGE_FILES = {
  unetBf16: 'z_image_turbo_bf16.safetensors',
  unetInt8: 'z_image_turbo_int8_convrot.safetensors',
  textEncoderBf16: 'qwen_3_4b.safetensors',
  textEncoderFp8: 'qwen_3_4b_fp8_mixed.safetensors',
  vae: 'ae.safetensors',
} as const
