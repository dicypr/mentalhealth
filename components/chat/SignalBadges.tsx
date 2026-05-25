// ============================================================
// components/chat/SignalBadges.tsx
// Shows detected mental health signals as small badges
// ============================================================

import type { MentalHealthSignal } from '@/types'

const SIGNAL_COLORS: Record<string, { bg: string; text: string }> = {
  depression:          { bg: '#EDE7F6', text: '#4527A0' },
  anxiety:             { bg: '#E3F2FD', text: '#0D47A1' },
  stress:              { bg: '#FFF3E0', text: '#E65100' },
  loneliness:          { bg: '#FCE4EC', text: '#880E4F' },
  grief:               { bg: '#F3E5F5', text: '#6A1B9A' },
  trauma:              { bg: '#FFEBEE', text: '#B71C1C' },
  suicidal_ideation:   { bg: '#FFEBEE', text: '#B71C1C' },
  self_harm:           { bg: '#FFEBEE', text: '#B71C1C' },
  sleep_disturbance:   { bg: '#E8F5E9', text: '#1B5E20' },
  appetite_changes:    { bg: '#FFF8E1', text: '#F57F17' },
  substance_use:       { bg: '#FBE9E7', text: '#BF360C' },
  social_withdrawal:   { bg: '#E0F2F1', text: '#004D40' },
  hopelessness:        { bg: '#EFEBE9', text: '#3E2723' },
  panic_attacks:       { bg: '#E1F5FE', text: '#01579B' },
  intrusive_thoughts:  { bg: '#F9FBE7', text: '#33691E' }
}

interface SignalBadgesProps {
  signals: MentalHealthSignal[]
}

export function SignalBadges({ signals }: SignalBadgesProps) {
  if (!signals.length) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {signals.map(signal => {
        const colors = SIGNAL_COLORS[signal] ?? { bg: '#F5F5F5', text: '#616161' }
        return (
          <span
            key={signal}
            className="text-xs px-2 py-0.5 rounded-full capitalize"
            style={{ background: colors.bg, color: colors.text }}
          >
            {signal.replace(/_/g, ' ')}
          </span>
        )
      })}
    </div>
  )
}
