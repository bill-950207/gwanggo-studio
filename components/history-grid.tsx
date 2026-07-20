'use client'

import { useEffect, useRef, useState , type ReactNode } from 'react'
import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import { api, thumbUrl, mediaUrl } from '@/lib/api'
import { deleteLocalGeneration, listLocalHistory } from '@/lib/local/history'
import { copyToClipboard } from '@/lib/clipboard'
import type { CloudGeneration } from '@/lib/types'
import type { LocalHistoryEntry } from '@/lib/local/history'
import { IconX, IconPlay, IconDownload, IconCopy, IconCheck } from './icons'

interface HistoryItem {
  id: string
  type: 'cloud' | 'local'
  model: string
  prompt: string | null
  status: 'PENDING' | 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  result_url?: string | null
  objectUrl?: string
  thumbnail_url?: string | null
  createdAt: number
  error?: string
}

interface ModalState {
  open: boolean
  item: HistoryItem | null
  copied: boolean
}

export function HistoryGrid({
  modelType,
  currentCloudTask,
  localInProgress,
  refreshToken,
  empty,
}: {
  modelType: 'image' | 'video'
  currentCloudTask?: { id: string; status: string; model: string; prompt?: string }
  localInProgress?: { seed: number; prompt: string; aspectRatio?: number }
  refreshToken: number
  empty?: ReactNode
}) {
  const { t } = useI18n()
  const { connected } = useStudio()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<ModalState>({ open: false, item: null, copied: false })
  const pollIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const loadHistory = async () => {
    setLoading(true)
    try {
      const [cloudRes, localRes] = await Promise.all([
        connected ? api.generations(modelType) : Promise.resolve({ generations: [], pagination: {} }),
        listLocalHistory(),
      ])

      const merged: HistoryItem[] = []

      // Add current cloud task if in-progress
      if (currentCloudTask && ['PENDING', 'IN_QUEUE', 'IN_PROGRESS'].includes(currentCloudTask.status)) {
        merged.push({
          id: currentCloudTask.id,
          type: 'cloud',
          model: currentCloudTask.model,
          prompt: currentCloudTask.prompt || null,
          status: currentCloudTask.status as any,
          createdAt: Date.now(),
        })
      }

      // Add local in-progress
      if (localInProgress) {
        merged.push({
          id: `local-in-progress-${Date.now()}`,
          type: 'local',
          model: 'local',
          prompt: localInProgress.prompt,
          status: 'IN_PROGRESS',
          createdAt: Date.now(),
        })
      }

      // Add cloud in-progress items
      for (const g of cloudRes.generations || []) {
        if (g.id === currentCloudTask?.id) continue
        if (['PENDING', 'IN_QUEUE', 'IN_PROGRESS'].includes(g.status)) {
          merged.push({
            id: g.id,
            type: 'cloud',
            model: g.model,
            prompt: g.prompt,
            status: g.status,
            result_url: g.result_url,
            thumbnail_url: g.thumbnail_url,
            createdAt: new Date(g.created_at).getTime(),
          })
        }
      }

      // Add completed/failed items (merged cloud + local, sorted by date desc)
      const completed: HistoryItem[] = []

      for (const g of cloudRes.generations || []) {
        if (!['PENDING', 'IN_QUEUE', 'IN_PROGRESS'].includes(g.status)) {
          completed.push({
            id: g.id,
            type: 'cloud',
            model: g.model,
            prompt: g.prompt,
            status: g.status,
            result_url: g.result_url,
            thumbnail_url: g.thumbnail_url,
            createdAt: new Date(g.created_at).getTime(),
            error: g.status === 'FAILED' ? 'Generation failed' : undefined,
          })
        }
      }

      for (const l of localRes) {
        completed.push({
          id: l.id,
          type: 'local',
          model: 'local',
          prompt: l.prompt,
          status: 'COMPLETED',
          objectUrl: l.objectUrl,
          createdAt: l.createdAt,
        })
      }

      completed.sort((a, b) => b.createdAt - a.createdAt)
      setItems([...merged, ...completed])
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [connected, modelType, refreshToken, currentCloudTask, localInProgress])

  useEffect(() => {
    const hasInProgress = items.some((i) => ['PENDING', 'IN_QUEUE', 'IN_PROGRESS'].includes(i.status))
    if (hasInProgress) {
      pollIntervalRef.current = setInterval(loadHistory, 5000)
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [items])

  if (!items.length) return <>{empty ?? null}</>

  const isVideo = modelType === 'video'

  return (
    <>
      <div className={`section mt-8 px-6 py-8 border-t border-neutral-200 dark:border-neutral-800`}>
        <h2 className="text-sm font-semibold mb-4 text-neutral-700 dark:text-neutral-300">{t.history.title}</h2>

        <div
          className={`gap-1 ${
            isVideo
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          } grid`}
        >
          {items.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              isVideo={isVideo}
              onOpenModal={() => setModal({ open: true, item, copied: false })}
              onDelete={async (id) => {
                if (item.type === 'local') {
                  await deleteLocalGeneration(id)
                  setItems((prev) => prev.filter((i) => i.id !== id))
                }
              }}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {modal.open && modal.item && (
        <MediaModal
          item={modal.item}
          isVideo={isVideo}
          copied={modal.copied}
          onClose={() => setModal({ open: false, item: null, copied: false })}
          onCopy={async () => {
            if (modal.item?.prompt) {
              await copyToClipboard(modal.item.prompt)
              setModal((prev) => ({ ...prev, copied: true }))
              setTimeout(() => setModal((prev) => ({ ...prev, copied: false })), 2000)
            }
          }}
          t={t}
        />
      )}
    </>
  )
}

function HistoryCard({
  item,
  isVideo,
  onOpenModal,
  onDelete,
  t,
}: {
  item: HistoryItem
  isVideo: boolean
  onOpenModal: () => void
  onDelete: (id: string) => Promise<void>
  t: any
}) {
  const isInProgress = ['PENDING', 'IN_QUEUE', 'IN_PROGRESS'].includes(item.status)
  const isFailed = item.status === 'FAILED'
  const mediaUrl_ = item.objectUrl || item.result_url || item.thumbnail_url || ''
  const displayUrl = item.objectUrl ? item.objectUrl : mediaUrl_ ? thumbUrl(mediaUrl_, 400) : ''

  return (
    <div
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${
        isVideo ? 'aspect-[9/16]' : 'aspect-square'
      } ${isInProgress ? 'ring-2 ring-primary/40 animate-pulse' : ''} ${
        isFailed ? 'bg-red-900/20' : 'bg-neutral-950 dark:bg-neutral-950'
      } group`}
      onClick={!isInProgress && !isFailed ? onOpenModal : undefined}
    >
      {displayUrl ? (
        <>
          <img src={displayUrl} alt="" className="w-full h-full object-cover brightness-100 group-hover:brightness-110 transition-all" />
          {isVideo && !isInProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <IconPlay className="w-5 h-5 text-black" />
              </div>
            </div>
          )}
        </>
      ) : isInProgress ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin text-primary mb-2" />
          <div className="text-[10px] font-medium text-center px-1 text-primary line-clamp-2">{item.model}</div>
          <div className="text-[9px] text-primary/60 mt-0.5">
            {isVideo ? t.history.estCloudVideo : t.history.estCloudImage}
          </div>
          {item.prompt && <div className="text-[8px] text-primary/50 mt-1 line-clamp-2 px-1 text-center">{item.prompt}</div>}
        </div>
      ) : isFailed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[11px] font-medium text-red-200">{t.history.failed}</div>
          {item.error && <div className="text-[9px] text-red-300/70 mt-1 line-clamp-2 px-1 text-center">{item.error}</div>}
        </div>
      ) : null}

      {/* Badges & Delete Button */}
      {!isInProgress && !isFailed && (
        <>
          {item.type === 'local' && (
            <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-[10px] font-semibold">
              LOCAL
            </div>
          )}

          {item.type === 'local' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                void onDelete(item.id)
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-red-500/80 hover:bg-red-600 text-white"
            >
              <IconX className="w-3 h-3" />
            </button>
          )}
        </>
      )}
    </div>
  )
}

function MediaModal({
  item,
  isVideo,
  copied,
  onClose,
  onCopy,
  t,
}: {
  item: HistoryItem
  isVideo: boolean
  copied: boolean
  onClose: () => void
  onCopy: () => Promise<void>
  t: any
}) {
  const handleDownload = () => {
    const url = item.objectUrl || item.result_url
    if (!url) return

    const a = document.createElement('a')
    a.href = url
    a.download = `gwanggo-${item.id}.${isVideo ? 'mp4' : 'png'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-neutral-950">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* Media Display */}
        <div className={isVideo ? 'aspect-[9/16]' : 'aspect-square'}>
          {isVideo && item.result_url ? (
            <video
              src={item.result_url}
              controls
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={item.objectUrl || item.result_url || ''}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Info Panel */}
        <div className="bg-neutral-900 border-t border-neutral-800 p-4 space-y-3">
          {item.prompt && (
            <div>
              <p className="text-xs text-neutral-400 mb-1">{t.ws.prompt}</p>
              <p className="text-sm text-neutral-200 break-words">{item.prompt}</p>
            </div>
          )}

          <div className="flex gap-2">
            {item.prompt && (
              <button
                onClick={onCopy}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm transition"
              >
                {copied ? (
                  <>
                    <IconCheck className="w-4 h-4" />
                    {t.history.copied}
                  </>
                ) : (
                  <>
                    <IconCopy className="w-4 h-4" />
                    {t.history.copyPrompt}
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm transition"
            >
              <IconDownload className="w-4 h-4" />
              {t.history.download}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
