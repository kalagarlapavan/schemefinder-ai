import { useState, useRef, useEffect } from 'react'
import { chatWithAssistant } from '../services/api'
import { Send, Bot, User, Loader, AlertCircle, ExternalLink } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

const SUGGESTED_QUESTIONS = [
  'Which schemes are available for students?',
  'What schemes can farmers apply for?',
  'What documents are needed for PM-KISAN?',
  'Which schemes are for senior citizens?',
  'How do I apply for Ayushman Bharat?',
  'What business schemes are available?',
]

function formatResponse(text: string): string {
  // Convert markdown-like bold to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m the SchemeFinder AI assistant. I can help you understand government schemes, eligibility criteria, required documents, and how to apply.\n\nWhat would you like to know?',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [configError, setConfigError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setConfigError('')

    try {
      const res = await chatWithAssistant({ message: text, session_id: sessionId })
      setSessionId(res.data.session_id)
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.data.response,
        sources: res.data.sources,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || ''
      if (detail.includes('API key') || detail.includes('Gemini')) {
        setConfigError(detail)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ The AI assistant is not configured yet. ' + detail
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or check that the backend is running.'
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-slate-500 mt-1">Ask anything about government schemes — powered by Google Gemini</p>
      </div>

      {/* Config Error Banner */}
      {configError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Gemini API not configured.</strong> Add your GEMINI_API_KEY to{' '}
            <code className="bg-amber-100 px-1 rounded">backend/.env</code>.
            Get a free key at{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline">
              aistudio.google.com
            </a>
          </div>
        </div>
      )}

      <div className="card flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}
                      className="prose prose-sm max-w-none"
                    />
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.sources.map((src, si) => (
                      <a
                        key={si}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full"
                      >
                        Source {si + 1} <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader size={14} className="animate-spin text-slate-500" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="border-t border-slate-100 pt-3 mb-3">
            <p className="text-xs text-slate-500 mb-2 font-medium">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 border-t border-slate-200 pt-4">
          <input
            id="chat-input"
            type="text"
            placeholder="Ask about schemes, eligibility, documents..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            id="chat-send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="btn-primary py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-3">
        AI responses are based on our verified scheme database. Always verify at official government websites.
      </p>
    </div>
  )
}
