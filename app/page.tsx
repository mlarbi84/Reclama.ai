import { ChatInterface } from '@/components/chat/chat-interface'
import { Scale } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-slate-600 bg-clip-text text-transparent">
              Reclama.AI
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Conecta con el abogado perfecto para tu caso
          </p>
        </header>

        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl" style={{ height: 'calc(100vh - 250px)' }}>
          <ChatInterface />
        </div>

        <footer className="text-center mt-8 text-sm text-gray-600">
          <p>Evaluación gratuita • Abogados verificados • Respuesta rápida</p>
        </footer>
      </div>
    </main>
  )
}
