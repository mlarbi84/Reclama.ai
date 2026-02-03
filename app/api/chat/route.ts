import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const runtime = 'edge'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Viability scoring function
function calculateViabilityScore(claimInfo: any): number {
  let score = 50 // Base score
  
  // Adjust based on claim type
  const highViabilityTypes = ['personal injury', 'medical malpractice', 'workplace accident']
  const mediumViabilityTypes = ['discrimination', 'contract dispute', 'property damage']
  
  const claimType = claimInfo.claimType?.toLowerCase() || ''
  if (highViabilityTypes.some(type => claimType.includes(type))) {
    score += 20
  } else if (mediumViabilityTypes.some(type => claimType.includes(type))) {
    score += 10
  }
  
  // Adjust based on documentation mentioned
  if (claimInfo.hasDocumentation) {
    score += 15
  }
  
  // Adjust based on timeframe (statute of limitations consideration)
  if (claimInfo.timeframe && claimInfo.timeframe.includes('recent') || claimInfo.timeframe?.includes('year')) {
    score += 10
  }
  
  // Adjust based on damages/injury severity
  if (claimInfo.severity === 'severe' || claimInfo.severity === 'significant') {
    score += 15
  }
  
  return Math.min(100, Math.max(0, score))
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Extract claim information from conversation
  const conversationText = messages.map((m: any) => m.content).join(' ')
  
  const claimInfo = {
    claimType: conversationText,
    hasDocumentation: /document|evidence|proof|report|record/i.test(conversationText),
    timeframe: conversationText.match(/(\d+\s*(day|week|month|year)s?\s*ago|recent|yesterday|last\s*(week|month|year))/i)?.[0],
    severity: /severe|serious|significant|major/i.test(conversationText) ? 'severe' : 'minor',
  }

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `You are a helpful legal intake assistant for Reclama.AI, a platform connecting people with legal claims to qualified lawyers. Your role is to:

1. Gather information about the user's legal claim in a friendly, empathetic manner
2. Ask relevant questions about:
   - Type of claim (personal injury, workplace, medical, etc.)
   - When the incident occurred
   - Key facts and circumstances
   - Any documentation they have
   - Severity of damages/injuries
   - Location where incident occurred

3. After gathering sufficient information (usually 3-5 exchanges), provide a preliminary viability assessment
4. Keep questions conversational and not overwhelming
5. Show empathy and understanding
6. Don't provide legal advice, but help them understand the intake process

Remember: You're gathering information to help match them with the right lawyer, not providing legal counsel.`,
    messages,
  })

  return result.toTextStreamResponse()
}
