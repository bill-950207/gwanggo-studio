import { getKey } from './auth'
import type { Model, Me, Task, GenerateResult } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || ''

export class ApiError extends Error {
  status: number
  code?: string
  extra?: Record<string, unknown>
  constructor(status: number, message: string, code?: string, extra?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.extra = extra
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string>) }
  const key = getKey()
  if (key) headers['Authorization'] = `Bearer ${key}`
  if (init?.body) headers['Content-Type'] = 'application/json'

  const res = await fetch(BASE + path, { ...init, headers })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = (data && data.error) || {}
    throw new ApiError(res.status, err.message || res.statusText, err.code, err)
  }
  return data as T
}

export const api = {
  models: () => request<{ models: Model[] }>('/api/v1/models'),
  me: () => request<Me>('/api/v1/me'),
  generateImage: (body: Record<string, unknown>) =>
    request<GenerateResult>('/api/v1/generate/image', { method: 'POST', body: JSON.stringify(body) }),
  generateVideo: (body: Record<string, unknown>) =>
    request<GenerateResult>('/api/v1/generate/video', { method: 'POST', body: JSON.stringify(body) }),
  task: (id: string) => request<Task>(`/api/v1/tasks/${encodeURIComponent(id)}`),
  upload: (dataUrl: string) =>
    request<{ url: string }>('/api/v1/upload', { method: 'POST', body: JSON.stringify({ dataUrl }) }),
}

