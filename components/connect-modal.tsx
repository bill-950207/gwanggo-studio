'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useStudio } from '@/lib/studio'
import { Logo } from './logo'

export function ConnectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const { connect, disconnect, connected, me } = useStudio()
  const [key, setKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null
  // Where users create/copy an API key — the hosted dashboard. Falls back to the
  // official URL so "Get a key" always works, even without env config.
  const dashboard = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://gwanggo.jocoding.io/dashboard/api-keys'

  async function submit() {
    if (!key.trim()) return
    setBusy(true)
    setError('')
    try {
      await connect(key)
      setKey('')
      onClose()
    } catch {
      setError(t.connect.invalid)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-7 shadow-2xl fade-up">
        <Logo size={44} />
        <h2 className="mt-4 text-lg font-bold tracking-tight">{t.connect.title}</h2>
        <p className="mt-1.5 text-sm text-neutral-500">{t.connect.desc}</p>

        {connected && me ? (
          <div className="mt-5">
            <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{me.email}</div>
                <div className="text-xs text-neutral-400">
                  {me.credits} {t.top.credits}
                </div>
              </div>
              <span className="text-xs text-emerald-600 font-medium">{t.connect.connected}</span>
            </div>
            <button
              onClick={() => {
                disconnect()
                onClose()
              }}
              className="mt-4 w-full py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
            >
              {t.connect.disconnect}
            </button>
          </div>
        ) : (
          <>
            <label className="block mt-5 text-xs font-medium text-neutral-500">{t.connect.apiKey}</label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="gwk_..."
              autoFocus
              className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 px-4 py-3 font-mono text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition placeholder:text-neutral-400"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <button onClick={submit} disabled={busy || !key.trim()} className="primary-btn mt-4 w-full py-3 disabled:opacity-50">
              {busy ? '…' : t.connect.connect}
            </button>
            <div className="mt-3 text-center">
              <a href={dashboard} target="_blank" rel="noreferrer" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition">
                {t.connect.getKey} →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
