'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import { api, ApiError } from '@/lib/api'
import { gradientFor, creditCost } from '@/lib/catalog'
import type { Model, Task } from '@/lib/types'
import { IconSparkle, IconChevronDown, IconImage } from './icons'
import { ModelLogo } from './model-visual'

type Slot = { status: 'pending' | 'done' | 'error'; url?: string; error?: string }

interface FormField {
  type: string
  required?: boolean
  options?: Array<string | number>
  default?: string | number | boolean
}

// form_config field type → request body key
const BODY_KEY: Record<string, string> = {
  aspect_ratio: 'aspectRatio',
  resolution: 'resolution',
  duration: 'duration',
  quality: 'quality',
  tier: 'tier',
  toggle: 'generateAudio',
}

const POLL_MS = 2500
const MAX_POLLS = 200

export function GenerationSurface({
  model,
  onOpenPicker,
  onNeedConnect,
}: {
  model: Model
  onOpenPicker: () => void
  onNeedConnect: () => void
}) {
  const { t } = useI18n()
  const { connected, refreshMe, imageModels, videoModels } = useStudio()
  const isVideo = model.type === 'video'

  const fields = useMemo<FormField[]>(
    () => ((model.form_config?.fields as FormField[] | undefined) ?? []),
    [model]
  )
  const controlFields = fields.filter((f) => f.type !== 'prompt' && f.type !== 'image_upload')
  const needsImage = fields.some((f) => f.type === 'image_upload' && f.required)

  // 3 distinct example thumbnails for the empty-state fan
  const allThumbs = Array.from(
    new Set([...imageModels, ...videoModels].map((m) => m.thumbnail_url).filter(Boolean) as string[])
  )
  const examples =
    allThumbs.length >= 3
      ? [allThumbs[0], allThumbs[Math.floor(allThumbs.length / 2)], allThumbs[allThumbs.length - 1]]
      : allThumbs

  const [prompt, setPrompt] = useState('')
  const [values, setValues] = useState<Record<string, string | number | boolean>>({})
  const [count, setCount] = useState(1)
  const [slots, setSlots] = useState<Slot[]>([])
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Reset controls to each model's defaults when the model changes.
  useEffect(() => {
    const init: Record<string, string | number | boolean> = {}
    for (const f of fields) {
      if (f.type === 'prompt' || f.type === 'image_upload') continue
      init[f.type] = f.default ?? f.options?.[0] ?? ''
    }
    setValues(init)
    setSlots([])
    setError('')
    setImageUrl('')
  }, [model.slug, fields])

  const pollers = useRef<ReturnType<typeof setInterval>[]>([])
  useEffect(() => () => pollers.current.forEach(clearInterval), [])

  const cost = creditCost(model, values, count)
  const busy = slots.some((s) => s.status === 'pending')

  function buildBody(): Record<string, unknown> {
    const body: Record<string, unknown> = { model: model.slug, prompt }
    for (const f of controlFields) {
      const key = BODY_KEY[f.type]
      if (key && values[f.type] !== undefined && values[f.type] !== '') body[key] = values[f.type]
    }
    if (imageUrl) {
      // the image field key varies by model
      if (model.slug === 'seedance-1.5-pro') body.imageUrls = [imageUrl]
      else if (model.slug === 'vidu-q3') body.image = imageUrl
      else body.imageUrl = imageUrl
    }
    return body
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!connected) return onNeedConnect()
    setUploading(true)
    setError('')
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader()
        r.onload = () => res(r.result as string)
        r.onerror = rej
        r.readAsDataURL(file)
      })
      const { url } = await api.upload(dataUrl)
      setImageUrl(url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function runOne(index: number) {
    const body = buildBody()
    try {
      const res = isVideo ? await api.generateVideo(body) : await api.generateImage(body)
      await poll(res.id, index)
    } catch (e) {
      handleError(e, index)
    }
  }

  function poll(id: string, index: number) {
    return new Promise<void>((resolve) => {
      let n = 0
      const iv = setInterval(async () => {
        n += 1
        if (n > MAX_POLLS) {
          clearInterval(iv)
          setSlot(index, { status: 'error', error: t.ws.failed })
          return resolve()
        }
        let task: Task
        try {
          task = await api.task(id)
        } catch (e) {
          clearInterval(iv)
          handleError(e, index)
          return resolve()
        }
        if (task.status === 'COMPLETED') {
          clearInterval(iv)
          setSlot(index, { status: 'done', url: task.result_url })
          refreshMe()
          resolve()
        } else if (task.status === 'FAILED') {
          clearInterval(iv)
          setSlot(index, { status: 'error', error: task.error || t.ws.failed })
          refreshMe()
          resolve()
        }
      }, POLL_MS)
      pollers.current.push(iv)
    })
  }

  function setSlot(index: number, value: Slot) {
    setSlots((prev) => prev.map((s, i) => (i === index ? value : s)))
  }

  function handleError(e: unknown, index: number) {
    if (e instanceof ApiError && e.status === 401) {
      onNeedConnect()
      setSlot(index, { status: 'error', error: t.connect.needKey })
      return
    }
    if (e instanceof ApiError && e.status === 402) {
      setError(t.connect.lowCredits)
      setSlot(index, { status: 'error', error: t.connect.lowCredits })
      return
    }
    setSlot(index, { status: 'error', error: e instanceof ApiError ? e.message : t.ws.failed })
  }

  function generate() {
    if (!connected) return onNeedConnect()
    if (!prompt.trim() || busy) return
    setError('')
    pollers.current.forEach(clearInterval)
    pollers.current = []
    setSlots(Array.from({ length: count }, () => ({ status: 'pending' })))
    for (let i = 0; i < count; i++) runOne(i)
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-44">
        {slots.length === 0 ? (
          <EmptyState model={model} examples={examples} />
        ) : (
          <div className={`mx-auto max-w-4xl grid gap-4 ${slots.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {slots.map((s, i) => (
              <ResultTile key={i} slot={s} model={model} hint={t.ws.generating} />
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 px-4 pb-5 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur shadow-xl shadow-black/5 dark:shadow-black/40">
          <div className="flex items-start gap-3 px-4 pt-3.5">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            {imageUrl ? (
              <div className="mt-0.5 relative w-9 h-9 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0 group/img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute inset-0 grid place-items-center bg-black/50 text-white text-xs opacity-0 group-hover/img:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                title={needsImage ? 'This model needs a reference image' : 'Add reference image'}
                className={`mt-0.5 grid place-items-center w-9 h-9 rounded-lg border transition shrink-0 disabled:opacity-50 ${
                  needsImage
                    ? 'border-amber-400 text-amber-500'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
              >
                {uploading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <IconImage className="w-4 h-4" />
                )}
              </button>
            )}
            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate()
              }}
              placeholder={t.ws.promptPlaceholder}
              className="flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400 max-h-32"
            />
          </div>

          <div className="flex items-start gap-2 px-3 pb-3 pt-2.5">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <button
              onClick={onOpenPicker}
              className="shrink-0 flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition"
            >
              <ModelLogo model={model} size={20} />
              <span className="text-sm font-medium whitespace-nowrap">{model.name}</span>
              <IconChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {controlFields.map((f, i) =>
              f.type === 'toggle' ? (
                <button
                  key={i}
                  onClick={() => setValues((v) => ({ ...v, toggle: !v.toggle }))}
                  data-active={!!values.toggle}
                  className="ratio shrink-0 px-3 py-1.5"
                >
                  {values.toggle ? 'Audio on' : 'Audio off'}
                </button>
              ) : (
                <FieldSelect
                  key={i}
                  field={f}
                  value={values[f.type]}
                  onChange={(val) => setValues((v) => ({ ...v, [f.type]: val }))}
                />
              )
            )}

            <div className="shrink-0 flex items-center gap-1 px-1 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <button onClick={() => setCount((c) => Math.max(1, c - 1))} className="w-6 h-6 grid place-items-center rounded text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">−</button>
              <span className="text-sm tabular-nums w-8 text-center">{count}/4</span>
              <button onClick={() => setCount((c) => Math.min(4, c + 1))} className="w-6 h-6 grid place-items-center rounded text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">+</button>
            </div>
            </div>

            <button onClick={generate} disabled={busy || !prompt.trim()} className="primary-btn shrink-0 self-end px-5 py-2.5 disabled:opacity-50">
              <IconSparkle className="w-4 h-4" />
              {t.ws.generate}
              {cost != null && <span className="font-mono ml-0.5">{cost}</span>}
            </button>
          </div>
          {error && <p className="px-4 pb-3 -mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function FieldSelect({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: string | number | boolean | undefined
  onChange: (v: string | number) => void
}) {
  const opts = field.options ?? []
  if (!opts.length) return null // no options → nothing to pick, skip the control
  const isNum = typeof opts[0] === 'number'
  const cur = value ?? field.default ?? opts[0] ?? ''
  return (
    <div className="relative shrink-0">
      <select
        value={String(cur)}
        onChange={(e) => onChange(isNum ? Number(e.target.value) : e.target.value)}
        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm font-medium capitalize cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition outline-none"
      >
        {opts.map((o) => (
          <option key={String(o)} value={String(o)}>
            {field.type === 'duration' ? `${o}s` : String(o)}
          </option>
        ))}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
    </div>
  )
}

function EmptyState({ model, examples }: { model: Model; examples: string[] }) {
  const cards = examples.length ? examples.slice(0, 3) : [null, null, null]
  return (
    <div className="h-full grid place-items-center text-center">
      <div>
        <div className="flex justify-center -space-x-5 mb-8">
          {cards.map((url, i) => (
            <div
              key={i}
              className={`w-28 h-36 rounded-2xl overflow-hidden grain bg-gradient-to-br ${gradientFor(model.name + i)} border-2 border-white dark:border-neutral-950 shadow-lg`}
              style={{ transform: `rotate(${(i - 1) * 8}deg)` }}
            >
              {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Start creating with <span className="text-neutral-900 dark:text-white">{model.name}</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
          Describe a scene, character, mood, or style — and watch it come to life.
        </p>
      </div>
    </div>
  )
}

function ResultTile({ slot, model, hint }: { slot: Slot; model: Model; hint: string }) {
  return (
    <div className={`relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 ${slot.url ? 'bg-neutral-100 dark:bg-neutral-950' : `grain bg-gradient-to-br ${gradientFor(model.name)} opacity-90 dark:opacity-30`}`}>
      {slot.status === 'done' && slot.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slot.url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          {slot.status === 'error' ? (
            <span className="px-3 text-xs text-red-600 text-center">{slot.error}</span>
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-600/70 dark:text-neutral-400/70">
              <span className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span className="text-xs">{hint}…</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
