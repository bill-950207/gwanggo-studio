'use client'

import { useState } from 'react'
import { LOCALES, useI18n, type Locale } from '@/lib/i18n'
import { IconGlobe, IconCheck, IconChevronDown } from './icons'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="nav-item">
        <IconGlobe className="w-[18px] h-[18px]" />
        <span className="flex-1 text-left">{LOCALES[locale]}</span>
        <IconChevronDown className="w-4 h-4 opacity-50" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-1 left-0 right-0 z-20 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-lg">
            {(Object.keys(LOCALES) as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l)
                  setOpen(false)
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                {LOCALES[l]}
                {l === locale && <IconCheck className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
