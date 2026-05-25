# 🌿 Serene — AI Mental Health Monitoring Platform

> An empathetic, clinically-informed mental wellness companion powered by Groq's ultra-fast LLaMA inference. Monitors mental health in real time, scores users using PHQ-9/GAD-7 equivalents, and routes them to the right level of care — all in a warm, human conversation.

![Serene Platform](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=flat-square)
![Groq](https://img.shields.io/badge/AI-Groq%20%2B%20LLaMA%203.3%2070B-orange?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ What Serene does

| Feature | Details |
|---|---|
| **Empathetic chat** | Powered by LLaMA 3.3 70B via Groq — responds like a trained wellness companion |
| **Live wellness scoring** | PHQ-9 + GAD-7 equivalent scores extracted from every message, invisibly |
| **Signal detection** | Detects 15 mental health signals: depression, anxiety, trauma, suicidal ideation, and more |
| **Tiered recommendations** | 6 levels: self-help → peer support → counselor → therapist → psychiatrist → emergency |
| **Analytics dashboard** | Score trends over time, top signals, improvement rate |
| **RAG-style knowledge base** | Clinical knowledge embedded in system prompt (upgradeable to Pinecone) |

---

## 🏗️ Tech Stack

```
Frontend:   Next.js 14 (App Router) + TypeScript
Styling:    Tailwind CSS + custom design system
AI Model:   LLaMA 3.3 70B via Groq API (ultra-fast inference)
State:      Zustand (with localStorage persistence)
Charts:     Recharts
Validation: Zod
Animation:  Framer Motion
Deployment: Vercel (Mumbai region)
```

---

## 📁 Project Structure

```
serene-mental-health/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── session/page.tsx          # Main chat interface
│   ├── dashboard/page.tsx        # Analytics dashboard
│   ├── api/
│   │   ├── chat/route.ts         # Groq chat endpoint
│   │   └── score/route.ts        # Analytics computation
│   ├── layout.tsx                # Root layout + metadata
│   └── globals.css               # Global styles
│
├── components/
│   └── chat/
│       ├── ScoreBar.tsx          # Animated wellness score bar
│       ├── SignalBadges.tsx      # Mental health signal tags
│       └── RecommendationCard.tsx # Specialist recommendation card
│
├── lib/
│   ├── groq-client.ts            # Groq client + score parser
│   ├── rag-knowledge.ts          # Clinical knowledge base + system prompt
│   ├── recommendations.ts        # Specialist recommendation data
│   └── session-store.ts          # Zustand session state
│
├── types/
│   └── index.ts                  # All TypeScript types
│
├── vercel.json                   # Vercel deployment config
└── .env.local.example            # Environment variable template
```

---

## 🚀 Quick Start (Local)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/serene-mental-health.git
cd serene-mental-health
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
SESSION_SECRET=your_random_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your free Groq API key:** [console.groq.com](https://console.groq.com)

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy to Vercel

### Option A — One-click deploy (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/serene-mental-health)

### Option B — Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add your Groq API key as a secret
vercel env add GROQ_API_KEY
# Paste your key when prompted

vercel env add SESSION_SECRET
# Paste a random string (run: openssl rand -base64 32)

# Deploy
vercel --prod
```

### Option C — GitHub + Vercel (Recommended for teams)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables in the Vercel dashboard:
   - `GROQ_API_KEY` → your Groq API key
   - `SESSION_SECRET` → random string
5. Click Deploy

---

## 🧠 How the Scoring Works

Every AI response secretly includes a structured data block:

```
SCORE_DATA:{"score":45,"category":"moderate","signals":["anxiety","sleep_disturbance"],"recommendation":"counselor","confidence":0.8,"phq_estimate":12,"gad_estimate":9}
```

The frontend extracts this via regex, strips it from the displayed message, and uses it to:
- Update the live wellness score bar
- Show color-coded severity badges
- Display appropriate specialist recommendations
- Track score history for the dashboard chart

### Severity Tiers

| Score | Category | Recommendation |
|---|---|---|
| 0–15 | Thriving 🟢 | Self-care resources |
| 16–30 | Mild 🟡 | Peer support groups |
| 31–50 | Moderate 🟠 | Counselor (iCall) |
| 51–65 | Moderate+ 🔶 | Licensed therapist |
| 66–80 | Severe 🔴 | Psychiatric evaluation |
| 81–100 | Crisis 🚨 | Emergency helplines |

---

## 🔧 Upgrading to Production RAG

The current knowledge base is embedded in the system prompt. To upgrade to full RAG:

```bash
npm install @pinecone-database/pinecone openai
```

```typescript
// lib/rag-pipeline.ts
import { Pinecone } from '@pinecone-database/pinecone'

async function retrieveContext(userMessage: string): Promise<string> {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  const index = pc.index('mental-health-kb')
  
  // Embed the user message
  const embedding = await getEmbedding(userMessage)
  
  // Query top-5 relevant clinical passages
  const results = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true
  })
  
  return results.matches.map(m => m.metadata?.text).join('\n\n')
}
```

---

## 🔒 Privacy & Safety

- **No data leaves the device** without explicit action — session data stored in browser only
- **No user accounts required** — fully anonymous by default
- **API key is server-side only** — never exposed to the client
- **Crisis detection** — automatic emergency resource display when score > 80

### Crisis Resources (India)
- **iCall:** 9152987821 (Mon–Sat, 8am–10pm)
- **AASRA:** 9820466627 (24/7)
- **Vandrevala Foundation:** 1860-2662-345 (24/7)
- **Emergency:** 112

---

## 📈 Roadmap

- [ ] User authentication (NextAuth.js)
- [ ] Database persistence (Supabase)
- [ ] Real Pinecone RAG pipeline
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Therapist portal / admin dashboard
- [ ] Weekly email wellness reports
- [ ] Mobile app (React Native)
- [ ] HIPAA / DPDP compliance audit

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

Serene is a wellness support tool, not a medical device or substitute for professional mental healthcare. Always consult a qualified mental health professional for clinical concerns.

---

## 📄 License

MIT © Serene Health Platform
