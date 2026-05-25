// ============================================================
// app/api/chat/route.ts
// Main chat endpoint — calls Groq, streams response
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getGroqClient, GROQ_MODEL, extractScoreData, stripScoreData } from '@/lib/groq-client'
import { buildSystemPrompt } from '@/lib/rag-knowledge'
import { z } from 'zod'

// Request validation schema
const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(4000)
    })
  ).min(1).max(50),
  sessionId: z.string().optional()
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ChatRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { messages } = parsed.data
    const groq = getGroqClient()

    // Call Groq API — llama-3.3-70b-versatile is fast and high-quality
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 800,
      temperature: 0.75,       // Slightly creative for natural conversation
      top_p: 0.9,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
      ]
    })

    const rawReply = completion.choices[0]?.message?.content ?? ''
    const scoreData = extractScoreData(rawReply)
    const displayText = stripScoreData(rawReply)

    return NextResponse.json({
      message: displayText,
      scoreData,
      usage: completion.usage,
      model: GROQ_MODEL
    })

  } catch (err) {
    console.error('[Chat API Error]', err)

    if (err instanceof Error && err.message.includes('GROQ_API_KEY')) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Serene Chat API is running', model: GROQ_MODEL })
}
