'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import { api, ApiError } from '@/lib/api'
import { gradientFor, costOf } from '@/lib/catalog'
import type { Model, Task } from '@/lib/types'
import { IconChevronDown, IconSparkle, IconDownload, IconShare, IconExpand } from './icons'

type Ratio = '1:1' | '16:9' | '9:16'
type Status = 'idle' | 'busy' | 'done' | 'error'

const POLL_MS = 2500
const MAX_POLLS = 160 // ~6.5 min

export function Workspace({ model, onNeedConnect }: { model: Model; onNeedConnect: () => void }) {
  const { t } = useI18n()
  const { connected, refreshMe } = useStudio()
  const isVideo = model.type === 'video'

  const [prompt, setPrompt] = useState('')
  const [ratio, setRatio] = useState<Ratio>('1:1')
  const [quality, setQuality] = useState<'basic' | 'high'>('basic')
  const [resolution, setResolution] = useState('720p')
  const [duration, setDuration] = useState(5)

  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState('')
  const [error, setError] = useState('')
  const [recent, setRecent] = useState<string[]>([])

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => () => clearPoll(), [])
  function clearPoll() {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = null
  }

  async function generate() {
    if (!connected) {
      onNeedConnect()
      return
    }
    if (!prompt.trim()) return
    clearPoll()
    setStatus('busy')
    setError('')
    setResultUrl('')

    const body: Record<string, unknown> = isVideo
      ? { model: model.slug, prompt, aspectRatio: ratio, resolution, duration }
      : { model: model.slug, prompt, aspectRatio: ratio, quality }

    try {
      const res = isVideo ? await api.generateVideo(body) : await api.generateImage(body)
      pollTask(res.id)
    } catch (e) {
      handleError(e)
    }
  }

  function pollTask(id: string) {
    let n = 0
    pollRef.current = setInterval(async () => {
      n += 1
      if (n > MAX_POLLS) {
        clearPoll()
        setStatus('error')
        setError(t.ws.failed)
        return
      }
      let task: Task
      try {
        task = await api.task(id)
      } catch (e) {
        clearPoll()
        handleError(e)
        return
      }
      if (task.status === 'COMPLETED') {
        clearPoll()
        setStatus('done')
        if (task.result_url) {
          setResultUrl(task.result_url)
          setRecent((r) => [task.result_url!, ...r].slice(0, 12))
        }
        refreshMe()
      } else if (task.status === 'FAILED') {
        clearPoll()
        setStatus('error')
        setError(task.error || t.ws.failed)
        refreshMe()
      }
    }, POLL_MS)
  }

  function handleError(e: unknown) {
    setStatus('error')
    if (e instanceof ApiError) {
      if (e.status === 401) {
        setStatus('idle')
        onNeedConnect()
        return
      }
      if (e.status === 402) {
        setError(t.connect.lowCredits)
        return
      }
      setError(e.message)
      return
    }
    setError(t.ws.failed)
  }

  const cost = costOf(model)
  const busy = status === 'busy'

  return (
    <section className="px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 max-w-[1400px]">
        {/* control panel */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 self-start">
          <label className="text-xs font-medium text-neutral-500">{t.ws.model}</label>
          <div className="mt-1.5 w-full flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${gradientFor(model.name)}`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{model.name}</div>
              <div className="text-xs text-neutral-400 truncate">
                {t.hub.by} {model.creator}
              </div>
            </div>
          </div>

          <label className="block mt-5 text-xs font-medium text-neutral-500">{t.ws.prompt}</label>
          <div className="mt-1.5 relative">
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
              placeholder={t.ws.promptPlaceholder}
              className="w-full resize-none rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 px-3.5 py-3 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition placeholder:text-neutral-400"
            />
            <span className="absolute bottom-2.5 right-3 text-[11px] text-neutral-400 font-mono">{prompt.length} / 2000</span>
          </div>

          <label className="block mt-5 text-xs font-medium text-neutral-500">{t.ws.ratio}</label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(['1:1', '16:9', '9:16'] as Ratio[]).map((r) => (
              <button key={r} data-active={ratio === r} onClick={() => setRatio(r)} className="ratio">
                {r}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {isVideo ? (
              <>
                <Field label={t.ws.resolution}>
                  <Select value={resolution} onChange={setResolution} options={['480p', '720p', '1080p']} />
                </Field>
                <Field label="Duration">
                  <Select value={String(duration)} onChange={(v) => setDuration(Number(v))} options={['5', '10']} suffix="s" />
                </Field>
              </>
            ) : (
              <Field label={t.ws.quality} wide>
                <Select
                  value={quality}
                  onChange={(v) => setQuality(v as 'basic' | 'high')}
                  options={['basic', 'high']}
                />
              </Field>
            )}
          </div>

          <button onClick={generate} disabled={busy || !prompt.trim()} className="primary-btn mt-6 w-full py-3 disabled:opacity-50">
            <IconSparkle className="w-4 h-4" />
            {t.ws.generate}
            {cost != null && (
              <>
                {' · '}
                <span className="font-mono">
                  {cost} {t.ws.credits}
                </span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* result */}
        <div className="space-y-5 min-w-0">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 h-12 border-b border-neutral-100 dark:border-neutral-800/70">
              <div className="text-sm text-neutral-400">
                {busy ? `${t.ws.generating}…` : status === 'done' ? t.ws.done : t.ws.result}
              </div>
              <div className="flex items-center gap-1">
                {resultUrl && (
                  <a href={resultUrl} target="_blank" rel="noreferrer" download className="icon-btn">
                    <IconDownload className="w-[18px] h-[18px]" />
                  </a>
                )}
                <button className="icon-btn">
                  <IconShare className="w-[18px] h-[18px]" />
                </button>
                <button className="icon-btn">
                  <IconExpand className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
            {busy && (
              <div className="h-1 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div className="anim-prog h-full bg-neutral-900 dark:bg-white" />
              </div>
            )}
            <div className={`relative aspect-[16/10] grain grid place-items-center ${resultUrl ? 'bg-neutral-100 dark:bg-neutral-950' : `bg-gradient-to-br ${gradientFor(model.name)} opacity-90 dark:opacity-30`}`}>
              {resultUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resultUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-sm text-neutral-600/70 dark:text-neutral-400/70">{busy ? `${t.ws.generating}…` : t.ws.canvasHint}</span>
              )}
            </div>
          </div>

          {recent.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-semibold">{t.ws.recent}</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {recent.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="shrink-0 w-20 h-20 rounded-xl object-cover border border-black/5 dark:border-white/5"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-neutral-500">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function Select({
  value,
  onChange,
  options,
  suffix = '',
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  suffix?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select w-full appearance-none pr-9 capitalize"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
            {suffix}
          </option>
        ))}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
    </div>
  )
}
