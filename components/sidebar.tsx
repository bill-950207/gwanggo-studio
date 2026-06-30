'use client'

import type { ReactNode } from 'react'
import { Logo } from './logo'
import { LanguageSwitcher } from './language-switcher'
import { useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { IconImage, IconVideo, IconTrending, IconMoon, IconGithub } from './icons'

export type Tab = 'image' | 'video' | 'trending'

export function Sidebar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const { t } = useI18n()
  const { theme, toggle } = useTheme()

  const items: { id: Tab; icon: ReactNode; label: string }[] = [
    { id: 'image', icon: <IconImage className="w-[18px] h-[18px]" />, label: t.nav.image },
    { id: 'video', icon: <IconVideo className="w-[18px] h-[18px]" />, label: t.nav.video },
    { id: 'trending', icon: <IconTrending className="w-[18px] h-[18px]" />, label: t.nav.trending },
  ]

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800/80 bg-white/60 dark:bg-neutral-900/40 backdrop-blur">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-neutral-200 dark:border-neutral-800/80">
        <Logo size={36} />
        <div className="leading-tight">
          <div className="font-bold text-[15px] tracking-tight">Gwanggo Studio</div>
          <div className="text-[11px] text-neutral-500">{t.brand.tagline}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => (
          <button key={it.id} data-active={tab === it.id} onClick={() => onTab(it.id)} className="nav-item">
            {it.icon}
            {it.label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-neutral-200 dark:border-neutral-800/80 space-y-1">
        <LanguageSwitcher />
        <button onClick={toggle} className="nav-item">
          <IconMoon className="w-[18px] h-[18px]" />
          {theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
        </button>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-item">
          <IconGithub className="w-[18px] h-[18px]" />
          {t.nav.github}
        </a>
        <div className="px-3 pt-1 text-[11px] text-neutral-400 dark:text-neutral-600">v0.1 · {t.nav.license}</div>
      </div>
    </aside>
  )
}
