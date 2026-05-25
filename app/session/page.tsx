'use client'
// ============================================================
// app/session/page.tsx — Main chat session page
// ============================================================

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Send, ArrowLeft, BarChart2, RefreshCw, Phone } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSessionStore } from '@/lib/session-store'
import { SEVERITY_META } from '@/lib/groq-client'
import { RECOMMENDATIONS } from '@/lib/recommendations'
import { RecommendationCard } from '@/components/chat/RecommendationCard'
import { ScoreBar } from '@/components/chat/ScoreBar'
import { SignalBadges } from '@/components/chat/SignalBadges'
import type { Message, ScoreData } from '@/types'

const OPENING_MESSAGE =
  "Hello, I'm glad you're here. This is a safe, private space — no judgement, just honest conversation.\n\nI'm Serene. How are you feeling today? There's no right or wrong answer — just tell me what's true for you right now."

export default function SessionPage() {
  const router = useRouter()
  const { session, isLoading, initSession, addMessage, updateLatestScore, setLoading } = useSessionStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [latestScore, setLatestScore] = useState<ScoreData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Init session on mount
  useEffect(() => {
    if (!session) initSession()
    // Add opening message
    const opener: Message = {
      id: uuidv4(), role: 'assistant', content: OPENING_MESSAGE, timestamp: new Date()
    }
    setMessages([opener])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')

    // Add user message
    const userMsg: Message = { id: uuidv4(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // Build history for API (exclude opening bot message from API call)
      const apiHistory = [
        ...messages.filter(m => m.role === 'user' || m !== messages[0])
          .map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: text }
      ]

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory, sessionId: session?.id })
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()

      const botMsg: Message = {
        id: uuidv4(), role: 'assistant', content: data.message,
        timestamp: new Date(), scoreData: data.scoreData ?? undefined
      }
      setMessages(prev => [...prev, botMsg])

      if (data.scoreData) {
        setLatestScore(data.scoreData)
        updateLatestScore(data.scoreData)
      }

      // Auto-focus crisis resources if emergency
      if (data.scoreData?.recommendation === 'emergency') {
        toast.error('Please reach out for immediate support. Call iCall: 9152987821', {
          duration: 10000, important: true
        })
      }

    } catch {
      toast.error('Something went wrong. Please try again.')
      setMessages(prev => [...prev, {
        id: uuidv4(), role: 'assistant',
        content: "I'm having a brief moment of difficulty. Please try again.",
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, isLoading, messages, session, setLoading, updateLatestScore])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const scoreCategory = latestScore ? SEVERITY_META[latestScore.category] : null
  const recommendation = latestScore ? RECOMMENDATIONS[latestScore.recommendation] : null

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-80 border-r border-stone-100 bg-white p-5 gap-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="text-stone-400 hover:text-stone-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-serif text-stone-700 font-medium">Serene</span>
        </div>

        {/* Live Score */}
        {latestScore ? (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
            <p className="text-xs text-stone-400 mb-2 uppercase tracking-wide font-sans">Wellness Score</p>
            <ScoreBar score={latestScore.score} category={latestScore.category} />
            <div className="mt-3 flex gap-2 text-xs">
              <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                PHQ ~{latestScore.phq_estimate}
              </span>
              <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                GAD ~{latestScore.gad_estimate}
              </span>
            </div>
            {latestScore.signals.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-stone-400 mb-1.5">Detected signals</p>
                <SignalBadges signals={latestScore.signals} />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-center">
            <p className="text-xs text-stone-400">Share how you feel to see your wellness score.</p>
          </div>
        )}

        {/* Recommendation */}
        {recommendation && <RecommendationCard recommendation={recommendation} />}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <Link href="/dashboard"
            className="serene-btn-ghost text-sm w-full justify-center gap-2">
            <BarChart2 className="w-4 h-4" />
            View insights
          </Link>
          <button
            onClick={() => { setMessages([{ id: uuidv4(), role: 'assistant', content: OPENING_MESSAGE, timestamp: new Date() }]); setLatestScore(null) }}
            className="serene-btn-ghost text-sm w-full justify-center gap-2 text-stone-500">
            <RefreshCw className="w-4 h-4" />
            New session
          </button>
        </div>

        <p className="text-xs text-stone-400 text-center leading-relaxed">
          Crisis support: <a href="tel:9152987821" className="text-serene-600 font-medium">9152987821</a> (iCall)
        </p>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-white md:hidden">
          <Link href="/" className="text-stone-400"><ArrowLeft className="w-5 h-5" /></Link>
          <span className="font-serif text-stone-700">Serene</span>
          {latestScore && (
            <span className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ background: scoreCategory?.bgColor, color: scoreCategory?.textColor }}>
              {latestScore.score}
            </span>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={msg.id}
              className={`flex gap-3 animate-fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${i === messages.length - 1 ? '0ms' : '0ms'}` }}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-serene-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs">S</span>
                </div>
              )}
              <div className={`max-w-lg ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
                <p className="text-xs opacity-40 mt-1.5">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start animate-fade-up">
              <div className="w-8 h-8 rounded-full bg-serene-500 flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs">S</span>
              </div>
              <div className="chat-bubble-bot">
                <div className="flex gap-1 py-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-stone-300 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-stone-100 bg-white px-4 md:px-8 py-4">
          {/* Mobile score bar */}
          {latestScore && (
            <div className="md:hidden mb-3">
              <ScoreBar score={latestScore.score} category={latestScore.category} compact />
            </div>
          )}
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind…"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-serif text-stone-800 placeholder-stone-400 focus:outline-none focus:border-serene-400 focus:ring-2 focus:ring-serene-100 disabled:opacity-50 transition-all leading-relaxed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full bg-serene-600 hover:bg-serene-700 disabled:bg-stone-200 text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
              aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-400 text-center mt-2">
            Not a substitute for professional care · iCall: <a href="tel:9152987821" className="text-serene-500">9152987821</a>
          </p>
        </div>
      </main>
    </div>
  )
}
