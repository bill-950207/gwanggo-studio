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
