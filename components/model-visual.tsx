/* eslint-disable @next/next/no-img-element */
import { gradientFor } from '@/lib/catalog'
import type { Model } from '@/lib/types'

/** Card visual: example thumbnail (or gradient fallback) + official provider logo badge. */
export function ModelThumb({ model, className = '' }: { model: Model; className?: string }) {
  return (
    <div className={`relative overflow-hidden grain bg-gradient-to-br ${gradientFor(model.name)} ${className}`}>
      {model.thumbnail_url && (
        <img src={model.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {model.logo_url && (
        <img
          src={model.logo_url}
          alt=""
          className="absolute top-2 left-2 w-6 h-6 rounded-md bg-white p-0.5 shadow-sm ring-1 ring-black/5"
        />
      )}
    </div>
  )
}

/** Small provider logo (or gradient fallback) — used in the model pill. */
export function ModelLogo({ model, size = 20 }: { model: Model; size?: number }) {
  if (model.logo_url) {
    return (
      <img
        src={model.logo_url}
        alt=""
        className="rounded bg-white object-contain ring-1 ring-black/5"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className={`inline-block rounded bg-gradient-to-br ${gradientFor(model.name)}`}
      style={{ width: size, height: size }}
    />
  )
}
