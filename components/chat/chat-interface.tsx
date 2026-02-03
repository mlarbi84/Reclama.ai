'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, AlertTriangle } from 'lucide-react'
import { useEffect, useState, FormEvent } from 'react'

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    id: 'chat-' + Date.now(),
  })
  
  const [input, setInput] = useState('')
  const [viabilityScore, setViabilityScore] = useState<number | null>(null)

  // Calculate viability score based on conversation
  useEffect(() => {
    if (messages.length >= 6) {
      const conversationText = messages
        .map(m => m.parts
          .filter(p => p.type === 'text')
          .map((p: any) => p.text)
          .join(' ')
        )
        .join(' ')
      
      let score = 50
      
      // Adjust based on claim indicators
      if (/personal injury|accident|injury|hurt|medical/i.test(conversationText)) score += 20
      if (/document|evidence|proof|report/i.test(conversationText)) score += 15
      if (/recent|this year|last month|last week/i.test(conversationText)) score += 10
      if (/severe|serious|significant|hospital/i.test(conversationText)) score += 15
      
      setViabilityScore(Math.min(100, Math.max(0, score)))
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === 'streaming') return
    
    await sendMessage({ text: input })
    setInput('')
  }

  const isLoading = status === 'streaming'

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <h2 className="text-2xl font-bold mb-2">Hola! 👋</h2>
            <p>Cuéntame sobre tu caso legal y te ayudaré a conectar con el abogado adecuado.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {message.parts
                  .filter((p: any) => p.type === 'text')
                  .map((p: any) => p.text)
                  .join('')}
              </p>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-white">
              <p className="text-sm text-gray-500">Escribiendo...</p>
            </Card>
          </div>
        )}
      </div>

      {viabilityScore !== null && (
        <Card className={`mx-4 p-4 mb-4 ${viabilityScore < 40 ? 'border-red-500' : 'border-indigo-500'}`}>
          <div className="flex items-center gap-3">
            {viabilityScore < 40 && <AlertTriangle className="text-red-500" />}
            <div className="flex-1">
              <p className="font-semibold">Puntuación de Viabilidad: {viabilityScore}%</p>
              {viabilityScore < 40 ? (
                <p className="text-sm text-gray-500">
                  Tu caso puede tener desafíos. Te conectaremos con un abogado para una evaluación completa.
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Tu caso parece prometedor. Te ayudaremos a encontrar el abogado adecuado.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
