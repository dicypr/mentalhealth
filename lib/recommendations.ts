// ============================================================
// lib/recommendations.ts
// Maps score → specialist recommendations + resources
// ============================================================

import type { RecommendationType, SpecialistRecommendation } from '@/types'

export const RECOMMENDATIONS: Record<RecommendationType, SpecialistRecommendation> = {
  self_help: {
    type: 'self_help',
    title: 'Keep nurturing yourself',
    description: 'You\'re doing well. Small daily practices — mindfulness, journaling, movement — keep your mental wellness strong.',
    urgency: 'low',
    color: 'green',
    resources: [
      { name: 'Wysa', contact: 'wysa.io', type: 'app', available: '24/7' },
      { name: 'Mindfulness India', contact: 'mindfulnessindia.org', type: 'website', available: 'Always' },
      { name: 'Headspace', contact: 'headspace.com', type: 'app', available: '24/7' }
    ]
  },
  peer_support: {
    type: 'peer_support',
    title: 'Peer support groups',
    description: 'Talking to others who\'ve been through similar experiences can be incredibly healing.',
    urgency: 'low',
    color: 'green',
    resources: [
      { name: 'iCall Community', contact: 'icallhelpline.org', type: 'website', available: 'Mon–Sat' },
      { name: 'AASRA Forum', contact: 'aasra.info', type: 'website', available: '24/7' },
      { name: 'Vandrevala Foundation Chat', contact: 'vandrevalafoundation.com', type: 'website', available: '24/7' }
    ]
  },
  counselor: {
    type: 'counselor',
    title: 'Speak with a counselor',
    description: 'A trained counselor can help you process what you\'re going through. Many offer free or low-cost sessions.',
    urgency: 'medium',
    color: 'yellow',
    resources: [
      { name: 'iCall Helpline', contact: '9152987821', type: 'hotline', available: 'Mon–Sat, 8am–10pm' },
      { name: 'YourDOST', contact: 'yourdost.com', type: 'website', available: '24/7' },
      { name: 'InnerHour', contact: 'theinnerhour.com', type: 'app', available: '24/7' }
    ]
  },
  therapist: {
    type: 'therapist',
    title: 'Therapy is the right step',
    description: 'A licensed therapist can provide structured support tailored to what you\'re experiencing.',
    urgency: 'medium',
    color: 'orange',
    resources: [
      { name: 'Vandrevala Foundation', contact: '1860-2662-345', type: 'hotline', available: '24/7' },
      { name: 'Practo Mental Health', contact: 'practo.com/mental-health', type: 'website', available: '24/7' },
      { name: 'MindPeers', contact: 'mindpeers.co', type: 'app', available: '24/7' }
    ]
  },
  psychiatrist: {
    type: 'psychiatrist',
    title: 'Psychiatric evaluation recommended',
    description: 'A psychiatrist can assess your situation comprehensively and discuss all available treatment options.',
    urgency: 'high',
    color: 'red',
    resources: [
      { name: 'NIMHANS', contact: '080-46110007', type: 'clinic', available: 'Mon–Sat' },
      { name: 'NIMHANS Helpline', contact: '080-46110007', type: 'hotline', available: '24/7' },
      { name: 'Fortis Mental Health', contact: '8376804102', type: 'hotline', available: '24/7' }
    ]
  },
  emergency: {
    type: 'emergency',
    title: 'You need support right now',
    description: 'Please reach out immediately. You don\'t have to face this alone — help is available right now.',
    urgency: 'critical',
    color: 'crimson',
    resources: [
      { name: 'iCall (Immediate)', contact: '9152987821', type: 'hotline', available: '24/7' },
      { name: 'AASRA Crisis Line', contact: '9820466627', type: 'hotline', available: '24/7' },
      { name: 'Vandrevala Emergency', contact: '1860-2662-345', type: 'hotline', available: '24/7' },
      { name: 'Emergency Services', contact: '112', type: 'hotline', available: '24/7' }
    ]
  }
}
