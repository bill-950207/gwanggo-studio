'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import { getKey, setKey, clearKey } from './auth'
import { FALLBACK_IMAGE, FALLBACK_VIDEO, TRENDING_STUBS, TRENDING_LIVE_SLUGS } from './catalog'
import type { Model, Me } from './types'

interface StudioState {
  me: Me | null
  connected: boolean
  imageModels: Model[]
  videoModels: Model[]
  trending: Model[]
  loadingModels: boolean
  modelsError: boolean
  connect: (key: string) => Promise<void>
  disconnect: () => void
  refreshMe: () => Promise<void>
}

const StudioCtx = createContext<StudioState>({
  me: null,
  connected: false,
  imageModels: FALLBACK_IMAGE,
  videoModels: FALLBACK_VIDEO,
  trending: TRENDING_STUBS,
  loadingModels: true,
  modelsError: false,
  connect: async () => {},
  disconnect: () => {},
  refreshMe: async () => {},
})

export function StudioProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [imageModels, setImageModels] = useState<Model[]>([])
  const [videoModels, setVideoModels] = useState<Model[]>([])
  const [loadingModels, setLoadingModels] = useState(true)
  const [modelsError, setModelsError] = useState(false)

  const refreshMe = useCallback(async () => {
    if (!getKey()) {
      setMe(null)
      return
    }
    try {
      setMe(await api.me())
    } catch {
      setMe(null)
    }
  }, [])

  useEffect(() => {
    // Note: no mounted-guard — under React StrictMode the dev double-invoke would
    // otherwise drop the resolved catalog and leave us on the fallback list.
    api
      .models()
      .then(({ models }) => {
        setImageModels(models.filter((m) => m.type === 'image'))
        setVideoModels(models.filter((m) => m.type === 'video'))
      })
      .catch(() => setModelsError(true))
      .finally(() => setLoadingModels(false))
    refreshMe()
  }, [refreshMe])

  const connect = useCallback(async (key: string) => {
    setKey(key)
    try {
      setMe(await api.me())
    } catch (e) {
      clearKey()
      setMe(null)
      throw e
    }
  }, [])

  const disconnect = useCallback(() => {
    clearKey()
    setMe(null)
  }, [])

  const resolvedImage = imageModels.length ? imageModels : FALLBACK_IMAGE
  const resolvedVideo = videoModels.length ? videoModels : FALLBACK_VIDEO
  // Trending = real live models (with form_config) + coming-soon placeholders
  const trending = [
    ...(TRENDING_LIVE_SLUGS.map((slug) =>
      [...resolvedImage, ...resolvedVideo].find((m) => m.slug === slug)
    ).filter(Boolean) as Model[]),
    ...TRENDING_STUBS,
  ]

  return (
    <StudioCtx.Provider
      value={{
        me,
        connected: !!me,
        imageModels: resolvedImage,
        videoModels: resolvedVideo,
        trending,
        loadingModels,
        modelsError,
        connect,
        disconnect,
        refreshMe,
      }}
    >
      {children}
    </StudioCtx.Provider>
  )
}

export const useStudio = () => useContext(StudioCtx)
