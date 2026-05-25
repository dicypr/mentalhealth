'use client'
// ============================================================
// app/dashboard/page.tsx — Wellness insights dashboard
// ============================================================

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Heart, MessageCircle, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useSessionStore } from '@/lib/session-store'
import { SEVERITY_META } from '@/lib/groq-client'
import { RECOMMENDATIONS } from '@/lib/recommendations'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { session, scoreHistory, userName } = useSessionStore()
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (scoreHistory.length === 0) return
    fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores: scoreHistory })
    })
      .then(r => r.json())
      .then(setAnalytics)
      .catch(() => {})
  }, [scoreHistory])

  const latestScore = session?.latestScore
  const scoreCategory = latestScore ? SEVERITY_META[latestScore.category] : null
  const recommendation = latestScore ? RECOMMENDATIONS[latestScore.recommendation] : null

  const chartData = session?.messages
    .filter(m => m.scoreData)
    .map((m, i) => ({
      turn: i + 1,
      score: m.scoreData!.score,
      label: format(new Date(m.timestamp), 'HH:mm')
    })) ?? []

  const trendIcon = analytics?.trend === 'improving'
    ? <TrendingDown className="w-4 h-4 text-serene-500" />
    : analytics?.trend === 'worsening'
    ? <TrendingUp className="w-4 h-4 text-red-500" />
    : <Minus className="w-4 h-4 text-stone-400" />

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/session" className="text-stone-400 hover:text-stone-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-serene-500" />
            <span className="font-serif text-stone-800 font-medium">Wellness Insights</span>
          </div>
        </div>
        <Link href="/session" className="serene-btn-primary text-sm">
          Continue session
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="font-serif text-2xl text-stone-800 mb-1">
            {userName ? `Hello, ${userName}` : 'Your wellness overview'}
          </h1>
          <p className="text-stone-500 text-sm">
            {session?.startedAt ? `Session started ${format(new Date(session.startedAt), 'MMMM d, yyyy')}` : 'Start a session to see your insights'}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Current score',
              value: latestScore ? `${latestScore.score}/100` : '—',
              sub: scoreCategory?.label ?? 'No session yet',
              color: scoreCategory?.color ?? '#888'
            },
            {
              label: 'PHQ estimate',
              value: latestScore ? `${latestScore.phq_estimate}/27` : '—',
              sub: 'Depression screen',
              color: '#5c7cfa'
            },
            {
              label: 'GAD estimate',
              value: latestScore ? `${latestScore.gad_estimate}/21` : '—',
              sub: 'Anxiety screen',
              color: '#EF9F27'
            },
            {
              label: 'Messages',
              value: session?.messages.length ?? 0,
              sub: 'This session',
              color: '#1D9E75'
            }
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-stone-100 p-4">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{card.label}</p>
              <p className="text-2xl font-medium text-stone-800">{card.value}</p>
              <p className="text-xs mt-1" style={{ color: card.color }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <div className="bg-white rounded-xl border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-stone-700 text-sm">Wellness score over session</h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                {trendIcon}
                <span className="capitalize">{analytics?.trend ?? 'Tracking...'}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(v: number) => [`Score: ${v}`, '']}
                />
                <Line
                  type="monotone" dataKey="score"
                  stroke="#1D9E75" strokeWidth={2}
                  dot={{ fill: '#1D9E75', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Signals + Recommendation */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top signals */}
          {analytics?.topSignals?.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <h2 className="font-medium text-stone-700 text-sm mb-4">Detected wellbeing signals</h2>
              <div className="space-y-2.5">
                {analytics.topSignals.map((s: any) => (
                  <div key={s.signal} className="flex items-center justify-between">
                    <span className="text-sm text-stone-600 capitalize">{s.signal.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-stone-100 rounded-full h-1.5">
                        <div className="bg-serene-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, s.count * 33)}%` }} />
                      </div>
                      <span className="text-xs text-stone-400">{s.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <h2 className="font-medium text-stone-700 text-sm mb-3">Current recommendation</h2>
              <div className="rounded-lg p-4 border" style={{
                background: recommendation.color === 'green' ? '#E1F5EE'
                  : recommendation.color === 'yellow' ? '#FAEEDA'
                  : recommendation.color === 'orange' ? '#FAECE7'
                  : '#FCEBEB',
                borderColor: recommendation.color === 'green' ? '#5DCAA5'
                  : recommendation.color === 'yellow' ? '#EF9F27'
                  : recommendation.color === 'orange' ? '#D85A30'
                  : '#A32D2D'
              }}>
                <p className="font-medium text-sm text-stone-800 mb-1">{recommendation.title}</p>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">{recommendation.description}</p>
                <div className="space-y-1.5">
                  {recommendation.resources.map(r => (
                    <div key={r.name} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-700">{r.name}</span>
                      <span className="text-serene-700 font-medium">{r.contact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!latestScore && (
          <div className="text-center py-16">
            <MessageCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 mb-4">No session data yet. Start a conversation with Serene.</p>
            <Link href="/session" className="serene-btn-primary">Begin session</Link>
          </div>
        )}
      </div>
    </div>
  )
}
