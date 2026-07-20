'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import { getKey, setKey, clearKey } from './auth'
import { FALLBACK_IMAGE, FALLBACK_VIDEO, TRENDING_STUBS, TRENDING_LIVE_SLUGS } from './catalog'
import { detectLocalRuntime } from './local/client'
import { LOCAL_MODEL } from './local/model'
import type { LocalState } from './local/types'
import type { Model, Me } from './types'

const INITIAL_LOCAL_STATE: LocalState = {
  status: 'checking',
  hint: 'unknown',
  system: null,
  unetFile: null,
}

interface StudioState {
  me: Me | null
  connected: boolean
  imageModels: Model[]
  videoModels: Model[]
  trending: Model[]
  loadingModels: boolean
  modelsError: boolean
  localState: LocalState
  connect: (key: string) => Promise<void>
  disconnect: () => void
  refreshMe: () => Promise<void>
  refreshLocal: () => Promise<void>
}

const StudioCtx = createContext<StudioState>({
  me: null,
  connected: false,
  imageModels: [LOCAL_MODEL, ...FALLBACK_IMAGE],
  videoModels: FALLBACK_VIDEO,
  trending: TRENDING_STUBS,
  loadingModels: true,
  modelsError: false,
  localState: INITIAL_LOCAL_STATE,
  connect: async () => {},
  disconnect: () => {},
  refreshMe: async () => {},
  refreshLocal: async () => {},
})

export function StudioProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [imageModels, setImageModels] = useState<Model[]>([])
  const [videoModels, setVideoModels] = useState<Model[]>([])
  const [loadingModels, setLoadingModels] = useState(true)
  const [modelsError, setModelsError] = useState(false)
  const [localState, setLocalState] = useState<LocalState>(INITIAL_LOCAL_STATE)

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

  const refreshLocal = useCallback(async () => {
    setLocalState(await detectLocalRuntime())
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

  useEffect(() => {
    void refreshLocal()
    const onFocus = () => void refreshLocal()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refreshLocal])

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

  const cloudImage = imageModels.length ? imageModels : FALLBACK_IMAGE
  const resolvedImage = [LOCAL_MODEL, ...cloudImage.filter((model) => model.slug !== LOCAL_MODEL.slug)]
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
        localState,
        connect,
        disconnect,
        refreshMe,
        refreshLocal,
      }}
    >
      {children}
    </StudioCtx.Provider>
  )
}

export const useStudio = () => useContext(StudioCtx)
