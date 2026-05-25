// ============================================================
// lib/session-store.ts
// Zustand store — manages chat session, messages, score history
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Message, Session, ScoreData } from '@/types'

interface SessionStore {
  session: Session | null
  scoreHistory: ScoreData[]
  isLoading: boolean
  userName: string | null

  // Actions
  initSession: (userName?: string) => void
  addMessage: (role: 'user' | 'assistant', content: string, scoreData?: ScoreData) => Message
  updateLatestScore: (score: ScoreData) => void
  setLoading: (v: boolean) => void
  resetSession: () => void
  setUserName: (name: string) => void
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      scoreHistory: [],
      isLoading: false,
      userName: null,

      initSession: (userName) => {
        const session: Session = {
          id: uuidv4(),
          startedAt: new Date(),
          messages: [],
          userName
        }
        set({ session, scoreHistory: [], userName: userName || null })
      },

      addMessage: (role, content, scoreData) => {
        const message: Message = {
          id: uuidv4(),
          role,
          content,
          timestamp: new Date(),
          scoreData
        }
        const { session } = get()
        if (!session) return message

        const updatedMessages = [...session.messages, message]
        set({
          session: {
            ...session,
            messages: updatedMessages,
            latestScore: scoreData ?? session.latestScore
          }
        })
        return message
      },

      updateLatestScore: (score) => {
        const { session, scoreHistory } = get()
        if (!session) return
        set({
          session: { ...session, latestScore: score },
          scoreHistory: [...scoreHistory, score]
        })
      },

      setLoading: (v) => set({ isLoading: v }),

      resetSession: () => set({ session: null, scoreHistory: [], isLoading: false }),

      setUserName: (name) => {
        const { session } = get()
        set({ userName: name, session: session ? { ...session, userName: name } : null })
      }
    }),
    {
      name: 'serene-session',
      // Only persist userName and session id, not full message history (privacy)
      partialize: (state) => ({ userName: state.userName })
    }
  )
)
