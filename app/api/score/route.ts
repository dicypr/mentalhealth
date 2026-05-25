// ============================================================
// app/api/score/route.ts
// Returns score history analytics for the dashboard
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { ScoreData } from '@/types'

// In production, replace with database query (Supabase / PlanetScale / Postgres)
// For now, accepts score array from client and computes analytics server-side

export async function POST(req: NextRequest) {
  try {
    const { scores }: { scores: ScoreData[] } = await req.json()

    if (!Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json({ error: 'No scores provided' }, { status: 400 })
    }

    const validScores = scores.filter(s => typeof s.score === 'number')

    const analytics = {
      totalSessions: validScores.length,
      latestScore: validScores[validScores.length - 1]?.score ?? null,
      averageScore: Math.round(validScores.reduce((a, b) => a + b.score, 0) / validScores.length),
      trend: computeTrend(validScores),
      topSignals: computeTopSignals(validScores),
      improvementRate: computeImprovementRate(validScores),
      phqAverage: Math.round(validScores.reduce((a, b) => a + b.phq_estimate, 0) / validScores.length),
      gadAverage: Math.round(validScores.reduce((a, b) => a + b.gad_estimate, 0) / validScores.length)
    }

    return NextResponse.json(analytics)
  } catch {
    return NextResponse.json({ error: 'Analytics computation failed' }, { status: 500 })
  }
}

function computeTrend(scores: ScoreData[]): 'improving' | 'stable' | 'worsening' {
  if (scores.length < 2) return 'stable'
  const recent = scores.slice(-3).reduce((a, b) => a + b.score, 0) / Math.min(3, scores.length)
  const earlier = scores.slice(0, -3).reduce((a, b) => a + b.score, 0) / Math.max(1, scores.length - 3)
  if (recent < earlier - 5) return 'improving'
  if (recent > earlier + 5) return 'worsening'
  return 'stable'
}

function computeTopSignals(scores: ScoreData[]): { signal: string; count: number }[] {
  const counts: Record<string, number> = {}
  scores.forEach(s => s.signals.forEach(sig => { counts[sig] = (counts[sig] ?? 0) + 1 }))
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([signal, count]) => ({ signal, count }))
}

function computeImprovementRate(scores: ScoreData[]): number {
  if (scores.length < 2) return 0
  const first = scores[0].score
  const last = scores[scores.length - 1].score
  return Math.round(((first - last) / first) * 100)
}
