'use client'

import { useEffect, useState } from 'react'
import { Sidebar, type Tab } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { GenerationSurface } from '@/components/generation-surface'
import { ModelPicker } from '@/components/model-picker'
import { ConnectModal } from '@/components/connect-modal'
import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import type { Model } from '@/lib/types'

export default function Studio() {
  const { t } = useI18n()
  const { imageModels, videoModels, trending } = useStudio()
  const [tab, setTab] = useState<Tab>('image')
  const [model, setModel] = useState<Model | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)

  const lists: Record<Tab, Model[]> = { image: imageModels, video: videoModels, trending }
  const titles: Record<Tab, string> = {
    image: t.hub.imageTitle,
    video: t.hub.videoTitle,
    trending: t.hub.trendingTitle,
  }
  const currentList = lists[tab]

  // Keep the selected model in sync with the current tab's list. Critically, when
  // the live catalog replaces the fallback, re-bind to the LIVE object (same slug)
  // so logo_url / thumbnail_url are present instead of the bare fallback entry.
  useEffect(() => {
    if (!currentList.length) return
    const live = model ? currentList.find((m) => m.slug === model.slug) : undefined
    if (live) {
      if (live !== model) setModel(live)
    } else {
      setModel(currentList.find((m) => !m.is_coming_soon) ?? currentList[0])
    }
  }, [currentList, model])

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Sidebar tab={tab} onTab={setTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={titles[tab]} showBack={false} onBack={() => {}} onOpenConnect={() => setConnectOpen(true)} />
        <main className="flex-1 min-h-0">
          {model && (
            <GenerationSurface
              model={model}
              onOpenPicker={() => setPickerOpen(true)}
              onNeedConnect={() => setConnectOpen(true)}
            />
          )}
        </main>
      </div>

      <ModelPicker
        open={pickerOpen}
        models={currentList}
        current={model?.slug ?? ''}
        onPick={setModel}
        onClose={() => setPickerOpen(false)}
      />
      <ConnectModal open={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  )
}
