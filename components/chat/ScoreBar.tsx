// ============================================================
// components/chat/ScoreBar.tsx
// Animated wellness score progress bar
// ============================================================

import { SEVERITY_META } from '@/lib/groq-client'
import type { SeverityCategory } from '@/types'

interface ScoreBarProps {
  score: number
  category: SeverityCategory
  compact?: boolean
}

export function ScoreBar({ score, category, compact }: ScoreBarProps) {
  const meta = SEVERITY_META[category]

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, background: meta.color }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color: meta.color }}>
          {score}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: meta.bgColor, color: meta.textColor }}>
          {meta.label}
        </span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-medium text-stone-800">{score}<span className="text-sm text-stone-400">/100</span></span>
        <span className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: meta.bgColor, color: meta.textColor }}>
          {meta.label}
        </span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, background: meta.barColor }}
        />
      </div>
    </div>
  )
}
