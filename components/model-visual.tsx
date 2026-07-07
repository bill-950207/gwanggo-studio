'use client'

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { gradientFor } from '@/lib/catalog'
import { thumbUrl } from '@/lib/api'
import type { Model } from '@/lib/types'

function initialsOf(creator: string): string {
  if (!creator) return 'AI'
  return creator.includes(' ')
    ? creator.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : creator.slice(0, 2).toUpperCase()
}

/** Brand-colored initials badge — fallback when no usable provider logo. */
function Badge({ model, size }: { model: Model; size: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded font-bold text-white ring-1 ring-black/5"
      style={{ width: size, height: size, backgroundColor: model.creator_color || '#6366F1', fontSize: Math.round(size * 0.4) }}
    >
      {initialsOf(model.creator)}
    </span>
  )
}

/** Small provider logo (official favicon, else brand badge). */
export function ModelLogo({ model, size = 20 }: { model: Model; size?: number }) {
  const [failed, setFailed] = useState(false)
  if (model.logo_url && !failed) {
    return (
      <img
        src={model.logo_url}
        alt=""
        onError={() => setFailed(true)}
        className="rounded bg-white object-contain ring-1 ring-black/5"
        style={{ width: size, height: size }}
      />
    )
  }
  return <Badge model={model} size={size} />
}

/** Card visual: example thumbnail (or gradient fallback) + provider logo badge. */
export function ModelThumb({ model, className = '' }: { model: Model; className?: string }) {
  return (
    <div className={`relative overflow-hidden grain bg-gradient-to-br ${gradientFor(model.name)} ${className}`}>
      {model.thumbnail_url && (
        <img
          src={thumbUrl(model.thumbnail_url, 480)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute top-2 left-2 rounded-md bg-white/90 p-0.5 shadow-sm ring-1 ring-black/5">
        <ModelLogo model={model} size={22} />
      </div>
    </div>
  )
}
