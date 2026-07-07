import { getKey } from './auth'
import type { Model, Me, Task, GenerateResult, Example } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://gwanggo.jocoding.io'

/** Resolve a media URL from the API. Relative paths (proxy URLs) get the API base prepended. */
export function mediaUrl(u: string | null | undefined): string {
  if (!u) return ''
  return u.startsWith('/') ? BASE + u : u
}

/**
 * Resized-image URL via the API's media proxy (`?w=` → server-side webp thumbnail).
 * Full-resolution generation outputs are several MB each — never render them raw
 * in card grids. Non-image URLs pass through untouched on the server side.
 */
export function thumbUrl(u: string | null | undefined, width: number): string {
  if (!u) return ''
  if (u.startsWith('/')) {
    return `${BASE}${u}${u.includes('?') ? '&' : '?'}w=${width}`
  }
  return `${BASE}/api/v1/examples/media?url=${encodeURIComponent(u)}&w=${width}`
}

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
  examples: (model: string, limit = 6) =>
    request<{ examples: Example[] }>(
      `/api/v1/examples?model=${encodeURIComponent(model)}&limit=${limit}`
    ),
  me: () => request<Me>('/api/v1/me'),
  generateImage: (body: Record<string, unknown>) =>
    request<GenerateResult>('/api/v1/generate/image', { method: 'POST', body: JSON.stringify(body) }),
  generateVideo: (body: Record<string, unknown>) =>
    request<GenerateResult>('/api/v1/generate/video', { method: 'POST', body: JSON.stringify(body) }),
  task: (id: string) => request<Task>(`/api/v1/tasks/${encodeURIComponent(id)}`),
  presign: (contentType: string, ext?: string) =>
    request<{ uploadUrl: string; publicUrl: string }>('/api/v1/upload', {
      method: 'POST',
      body: JSON.stringify({ contentType, ext }),
    }),
}

/** Presign + direct PUT to R2 (handles large images and videos). Returns the public URL. */
export async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const { uploadUrl, publicUrl } = await api.presign(file.type || 'application/octet-stream', ext)
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
  if (!put.ok) throw new Error('Upload failed')
  return publicUrl
}

