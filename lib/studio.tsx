'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import { getKey, setKey, clearKey } from './auth'
import { FALLBACK_IMAGE, FALLBACK_VIDEO, TRENDING } from './catalog'
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
  trending: TRENDING,
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
    let mounted = true
    api
      .models()
      .then(({ models }) => {
        if (!mounted) return
        setImageModels(models.filter((m) => m.type === 'image'))
        setVideoModels(models.filter((m) => m.type === 'video'))
      })
      .catch(() => {
        if (!mounted) return
        setModelsError(true)
      })
      .finally(() => {
        if (mounted) setLoadingModels(false)
      })
    refreshMe()
    return () => {
      mounted = false
    }
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

  return (
    <StudioCtx.Provider
      value={{
        me,
        connected: !!me,
        imageModels: imageModels.length ? imageModels : FALLBACK_IMAGE,
        videoModels: videoModels.length ? videoModels : FALLBACK_VIDEO,
        trending: TRENDING,
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
