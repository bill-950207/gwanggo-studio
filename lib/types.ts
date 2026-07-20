export interface ModelCreditConfig {
  cost?: number
  type?: string
  [k: string]: unknown
}

export interface Model {
  slug: string
  name: string
  type: 'image' | 'video' | string
  creator: string
  creator_color?: string | null
  badge?: string | null
  credit_config?: ModelCreditConfig | null
  form_config?: Record<string, unknown> | null
  is_coming_soon?: boolean
  thumbnail_url?: string | null
  logo_url?: string | null
}

export interface Me {
  id: string
  email: string | null
  credits: number
}

export type GenStatus = 'PENDING' | 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export interface Task {
  id: string
  type: string
  model: string
  status: GenStatus
  result_url?: string
  thumbnail_url?: string
  error?: string
  credits_used: number
}

export interface GenerateResult {
  id: string
  task_id: string
  credits_used: number
}

/** /api/v1/generations 항목 — 토큰 소유자의 클라우드 생성 기록 */
export interface CloudGeneration {
  id: string
  type: 'image' | 'video' | 'trending' | string
  model: string
  prompt: string | null
  status: GenStatus
  result_url: string | null
  thumbnail_url: string | null
  credits_used: number
  created_at: string
}

export interface Paginated {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasMore: boolean
}

export interface Example {
  id: string
  model: string
  prompt: string | null
  input_image: string | null
  input_video: string | null
  output: string
  output_type: 'image' | 'video'
  thumbnail: string | null
}
