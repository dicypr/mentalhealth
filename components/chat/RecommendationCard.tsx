// ============================================================
// components/chat/RecommendationCard.tsx
// Shows the current specialist recommendation in the sidebar
// ============================================================

import { Phone, Globe, Smartphone, Building2, AlertTriangle } from 'lucide-react'
import type { SpecialistRecommendation, Resource } from '@/types'

const COLOR_MAP = {
  green:   { bg: '#E1F5EE', border: '#5DCAA5', text: '#04342C', title: '#085041' },
  yellow:  { bg: '#FAEEDA', border: '#EF9F27', text: '#412402', title: '#633806' },
  orange:  { bg: '#FAECE7', border: '#D85A30', text: '#4A1B0C', title: '#993C1D' },
  red:     { bg: '#FCEBEB', border: '#A32D2D', text: '#501313', title: '#791F1F' },
  crimson: { bg: '#F7C1C1', border: '#791F1F', text: '#501313', title: '#501313' }
}

const TYPE_ICONS: Record<Resource['type'], React.ReactNode> = {
  hotline: <Phone className="w-3 h-3" />,
  app:     <Smartphone className="w-3 h-3" />,
  website: <Globe className="w-3 h-3" />,
  clinic:  <Building2 className="w-3 h-3" />
}

interface RecommendationCardProps {
  recommendation: SpecialistRecommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const colors = COLOR_MAP[recommendation.color]

  return (
    <div className="rounded-xl p-4 border text-sm" style={{
      background: colors.bg,
      borderColor: colors.border,
      color: colors.text
    }}>
      {recommendation.urgency === 'critical' && (
        <div className="flex items-center gap-1.5 mb-2 text-xs font-medium" style={{ color: colors.title }}>
          <AlertTriangle className="w-3.5 h-3.5" />
          Immediate support needed
        </div>
      )}
      <p className="font-medium mb-1 leading-snug" style={{ color: colors.title }}>
        {recommendation.title}
      </p>
      <p className="text-xs leading-relaxed mb-3 opacity-80">
        {recommendation.description}
      </p>
      <div className="space-y-1.5">
        {recommendation.resources.map(r => (
          <div key={r.name} className="flex items-start gap-2">
            <span className="mt-0.5 opacity-60">{TYPE_ICONS[r.type]}</span>
            <div>
              <p className="text-xs font-medium leading-none mb-0.5" style={{ color: colors.title }}>
                {r.name}
              </p>
              <a
                href={r.type === 'hotline' ? `tel:${r.contact.replace(/[^0-9]/g, '')}` : `https://${r.contact}`}
                className="text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
                target={r.type !== 'hotline' ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                {r.contact}
              </a>
              <span className="text-xs opacity-50 ml-1.5">{r.available}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
