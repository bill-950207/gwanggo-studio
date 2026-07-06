'use client'

import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import { IconBack, IconCoins } from './icons'

export function TopBar({
  title,
  showBack,
  onBack,
  onOpenConnect,
}: {
  title: string
  showBack: boolean
  onBack: () => void
  onOpenConnect: () => void
}) {
  const { t } = useI18n()
  const { me, connected } = useStudio()

  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-6 border-b border-neutral-200 dark:border-neutral-800/80 bg-[#FAFAFA]/80 dark:bg-neutral-950/80 backdrop-blur z-10">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition">
            <IconBack className="w-4 h-4" />
            {t.top.models}
          </button>
        )}
        <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <a href="https://github.com/bill-950207/gwanggo-studio#readme" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition">
          {t.top.docs}
        </a>
        <a href="https://github.com/bill-950207/gwanggo-studio/issues" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition">
          {t.top.community}
        </a>
        <button onClick={onOpenConnect} className="flex items-center gap-2 ml-1 pl-3 pr-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
          <IconCoins className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-semibold tabular-nums">{connected && me ? me.credits : '—'}</span>
          <span className="text-xs text-neutral-400">{t.top.credits}</span>
        </button>
        <button
          onClick={onOpenConnect}
          className="ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 grid place-items-center text-white text-xs font-bold ring-1 ring-black/5 dark:ring-white/10"
        >
          {connected && me?.email ? me.email[0].toUpperCase() : 'U'}
        </button>
      </div>
    </header>
  )
}
