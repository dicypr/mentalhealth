// ============================================================
// lib/groq-client.ts
// Groq API client wrapper + score extraction engine
// ============================================================

import Groq from 'groq-sdk'
import type { ScoreData, SeverityCategory, RecommendationType, MentalHealthSignal } from '@/types'

// Singleton Groq client
let groqClient: Groq | null = null

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error('GROQ_API_KEY environment variable is not set')
    groqClient = new Groq({ apiKey })
  }
  return groqClient
}

// The Groq model to use — llama-3.3-70b-versatile is best for this use case
export const GROQ_MODEL = 'llama-3.3-70b-versatile'

// ─── Score Extraction ────────────────────────────────────────────────────────

const SCORE_REGEX = /SCORE_DATA:(\{[^}]+\})/

export function extractScoreData(rawReply: string): ScoreData | null {
  const match = rawReply.match(SCORE_REGEX)
  if (!match) return null

  try {
    const parsed = JSON.parse(match[1])

    // Validate and sanitise all fields
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 0))
    const category = validateCategory(parsed.category)
    const recommendation = validateRecommendation(parsed.recommendation)
    const signals = validateSignals(parsed.signals)
    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5))
    const phq_estimate = Math.max(0, Math.min(27, Number(parsed.phq_estimate) || 0))
    const gad_estimate = Math.max(0, Math.min(21, Number(parsed.gad_estimate) || 0))

    return { score, category, recommendation, signals, confidence, phq_estimate, gad_estimate }
  } catch {
    return null
  }
}

export function stripScoreData(rawReply: string): string {
  return rawReply.replace(SCORE_REGEX, '').trim()
}

// ─── Validators ──────────────────────────────────────────────────────────────

const VALID_CATEGORIES: SeverityCategory[] = [
  'thriving', 'mild', 'moderate', 'severe', 'crisis'
]

const VALID_RECOMMENDATIONS: RecommendationType[] = [
  'self_help', 'peer_support', 'counselor', 'therapist', 'psychiatrist', 'emergency'
]

const VALID_SIGNALS: MentalHealthSignal[] = [
  'depression', 'anxiety', 'stress', 'loneliness', 'grief', 'trauma',
  'suicidal_ideation', 'self_harm', 'sleep_disturbance', 'appetite_changes',
  'substance_use', 'social_withdrawal', 'hopelessness', 'panic_attacks', 'intrusive_thoughts'
]

function validateCategory(v: unknown): SeverityCategory {
  return VALID_CATEGORIES.includes(v as SeverityCategory) ? (v as SeverityCategory) : 'mild'
}

function validateRecommendation(v: unknown): RecommendationType {
  return VALID_RECOMMENDATIONS.includes(v as RecommendationType)
    ? (v as RecommendationType)
    : 'self_help'
}

function validateSignals(v: unknown): MentalHealthSignal[] {
  if (!Array.isArray(v)) return []
  return v.filter((s): s is MentalHealthSignal => VALID_SIGNALS.includes(s as MentalHealthSignal))
}

// ─── Score → UI Metadata ─────────────────────────────────────────────────────

export const SEVERITY_META: Record<SeverityCategory, {
  label: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  barColor: string
}> = {
  thriving: {
    label: 'Thriving',
    color: '#1D9E75',
    bgColor: '#E1F5EE',
    textColor: '#04342C',
    borderColor: '#5DCAA5',
    barColor: '#1D9E75'
  },
  mild: {
    label: 'Mild concern',
    color: '#EF9F27',
    bgColor: '#FAEEDA',
    textColor: '#412402',
    borderColor: '#EF9F27',
    barColor: '#EF9F27'
  },
  moderate: {
    label: 'Moderate concern',
    color: '#D85A30',
    bgColor: '#FAECE7',
    textColor: '#4A1B0C',
    borderColor: '#D85A30',
    barColor: '#D85A30'
  },
  severe: {
    label: 'Significant concern',
    color: '#A32D2D',
    bgColor: '#FCEBEB',
    textColor: '#501313',
    borderColor: '#A32D2D',
    barColor: '#A32D2D'
  },
  crisis: {
    label: 'Needs immediate care',
    color: '#791F1F',
    bgColor: '#F7C1C1',
    textColor: '#501313',
    borderColor: '#791F1F',
    barColor: '#791F1F'
  }
}
