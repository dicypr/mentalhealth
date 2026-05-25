// ============================================================
// types/index.ts — All shared TypeScript types for Serene
// ============================================================

export type SeverityCategory =
  | 'thriving'
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'crisis'

export type RecommendationType =
  | 'self_help'
  | 'peer_support'
  | 'counselor'
  | 'therapist'
  | 'psychiatrist'
  | 'emergency'

export type MentalHealthSignal =
  | 'depression'
  | 'anxiety'
  | 'stress'
  | 'loneliness'
  | 'grief'
  | 'trauma'
  | 'suicidal_ideation'
  | 'self_harm'
  | 'sleep_disturbance'
  | 'appetite_changes'
  | 'substance_use'
  | 'social_withdrawal'
  | 'hopelessness'
  | 'panic_attacks'
  | 'intrusive_thoughts'

export interface ScoreData {
  score: number                     // 0–100
  category: SeverityCategory
  signals: MentalHealthSignal[]
  recommendation: RecommendationType
  confidence: number                // 0–1
  phq_estimate: number             // PHQ-9 equivalent 0–27
  gad_estimate: number             // GAD-7 equivalent 0–21
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  scoreData?: ScoreData
}

export interface Session {
  id: string
  startedAt: Date
  messages: Message[]
  latestScore?: ScoreData
  userName?: string
}

export interface SpecialistRecommendation {
  type: RecommendationType
  title: string
  description: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  resources: Resource[]
  color: 'green' | 'yellow' | 'orange' | 'red' | 'crimson'
}

export interface Resource {
  name: string
  contact: string
  type: 'hotline' | 'app' | 'website' | 'clinic'
  available: string
}
