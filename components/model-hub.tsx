'use client'

import { useI18n } from '@/lib/i18n'
import { gradientFor, costOf } from '@/lib/catalog'
import type { Model } from '@/lib/types'
import { IconSearch } from './icons'

export function ModelHub({
  title,
  subtitle,
  models,
  onPick,
}: {
  title: string
  subtitle: string
  models: Model[]
  onPick: (m: Model) => void
}) {
  const { t } = useI18n()

  return (
    <section className="px-6 py-7">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-400">
          <IconSearch className="w-4 h-4" />
          {t.hub.search}
        </div>
      </div>

      {models.length === 0 ? (
        <p className="text-sm text-neutral-400 py-12 text-center">{t.hub.empty}</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {models.map((m, i) => {
            const cost = costOf(m)
            const soon = m.is_coming_soon
            return (
              <button
                key={m.slug}
                onClick={() => !soon && onPick(m)}
                disabled={soon}
                style={{ animationDelay: `${i * 35}ms` }}
                className="fade-up group text-left rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden transition hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-black/5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                <div className={`aspect-[4/3] grain bg-gradient-to-br ${gradientFor(m.name)} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  {soon && (
                    <span className="absolute top-2.5 left-2.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur">
                      {t.hub.soon}
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{m.name}</div>
                      <div className="text-xs text-neutral-400 truncate mt-0.5">
                        {t.hub.by} {m.creator}
                      </div>
                    </div>
                    {cost != null && (
                      <span className="shrink-0 text-[11px] font-mono px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                        {cost} cr
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
