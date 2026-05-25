// ============================================================
// app/page.tsx — Landing page
// ============================================================

import Link from 'next/link'
import { Heart, Shield, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-serene-50 to-stone-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-stone-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-serene-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-lg font-medium text-stone-800">Serene</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-stone-500 hover:text-stone-800 transition-colors hidden md:block">
            Dashboard
          </Link>
          <Link href="/session" className="serene-btn-primary text-sm">
            Start Session
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-serene-100 text-serene-700 text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-serene-200">
          <span className="w-2 h-2 rounded-full bg-serene-500 animate-pulse-soft inline-block" />
          Private & Confidential
        </div>

        <h1 className="font-serif text-4xl md:text-6xl text-stone-800 leading-tight mb-6">
          Your mental wellness,<br />
          <span className="text-serene-600">deeply understood.</span>
        </h1>

        <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Serene is an empathetic companion that listens deeply, tracks your emotional wellbeing over time, and connects you with the right professional support — exactly when you need it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/session" className="serene-btn-primary text-base px-8 py-3 gap-3">
            Begin your session
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="serene-btn-ghost text-base px-8 py-3">
            View dashboard
          </Link>
        </div>

        <p className="text-xs text-stone-400 mt-6">
          Not a substitute for professional mental healthcare. In crisis? Call iCall: 9152987821
        </p>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Heart className="w-5 h-5" />,
              title: 'Empathetic conversations',
              desc: 'Trained on CBT, DBT, and motivational interviewing. Speaks like a trusted friend, not a bot.'
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              title: 'Real-time wellness scoring',
              desc: 'Every conversation updates your PHQ-9 and GAD-7 equivalent scores invisibly in the background.'
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: 'Tiered specialist referrals',
              desc: 'From self-care tips to emergency helplines — you\'re connected to the right level of support.'
            }
          ].map((f) => (
            <div key={f.title} className="serene-card">
              <div className="w-10 h-10 rounded-xl bg-serene-100 text-serene-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-medium text-stone-800 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-6 md:px-12 py-12 max-w-3xl mx-auto">
        <div className="serene-card bg-serene-50 border-serene-100 text-center">
          <Shield className="w-8 h-8 text-serene-500 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-stone-800 mb-3">Built for trust</h3>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {[
              'No data sold or shared',
              'Session stored locally only',
              'Clinically-informed AI'
            ].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-serene-700">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-xs text-stone-400 border-t border-stone-100">
        Serene is not a medical device. Always consult a qualified professional for clinical support.
        <span className="mx-2">·</span>
        iCall: 9152987821
        <span className="mx-2">·</span>
        AASRA: 9820466627
      </footer>
    </main>
  )
}
