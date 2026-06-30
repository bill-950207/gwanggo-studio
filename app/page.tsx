'use client'

import { useState } from 'react'
import { Sidebar, type Tab } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { ModelHub } from '@/components/model-hub'
import { Workspace } from '@/components/workspace'
import { ConnectModal } from '@/components/connect-modal'
import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import type { Model } from '@/lib/types'

export default function Studio() {
  const { t } = useI18n()
  const { imageModels, videoModels, trending } = useStudio()
  const [tab, setTab] = useState<Tab>('image')
  const [selected, setSelected] = useState<Model | null>(null)
  const [connectOpen, setConnectOpen] = useState(false)

  const lists: Record<Tab, Model[]> = { image: imageModels, video: videoModels, trending }
  const titles: Record<Tab, [string, string]> = {
    image: [t.hub.imageTitle, t.hub.imageSub],
    video: [t.hub.videoTitle, t.hub.videoSub],
    trending: [t.hub.trendingTitle, t.hub.trendingSub],
  }

  function changeTab(next: Tab) {
    setTab(next)
    setSelected(null)
  }

  const pageTitle = selected ? selected.name : titles[tab][0]

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Sidebar tab={tab} onTab={changeTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={pageTitle}
          showBack={!!selected}
          onBack={() => setSelected(null)}
          onOpenConnect={() => setConnectOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {selected ? (
            <Workspace model={selected} onNeedConnect={() => setConnectOpen(true)} />
          ) : (
            <ModelHub title={titles[tab][0]} subtitle={titles[tab][1]} models={lists[tab]} onPick={setSelected} />
          )}
        </main>
      </div>
      <ConnectModal open={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  )
}
