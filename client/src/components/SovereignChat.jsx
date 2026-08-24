import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import useSovereignChat, { stripMarkdown } from '../hooks/useSovereignChat'
import AnswerSkeleton from './AnswerSkeleton'
import AnswerText from './AnswerText'

export default function SovereignChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, streaming, send } = useSovereignChat([
    { role: 'assistant', content: '동해 여행에 대해 물어보세요.' }
  ])
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  function sendMessage() {
    if (streaming) return
    send(input)
    setInput('')
  }

  function onKeyDown(e) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-40px)]
                        h-[460px] bg-white border border-border-def rounded-2xl
                        flex flex-col overflow-hidden">
          <div className="h-14 px-5 flex items-center justify-between border-b border-border-sub bg-white">
            <p className="font-pretendard font-bold text-[15px] text-text-pri tracking-[-0.02em]">
              동해사이 도우미
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="w-8 h-8 inline-flex items-center justify-center rounded-full
                         hover:bg-bg-card transition-colors duration-150">
              <X size={18} className="text-text-meta" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-bg-card">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%]">
                  {m.role === 'user' ? (
                    <p className="px-3.5 py-2.5 rounded-xl bg-primary-soft text-text-pri
                                  font-pretendard font-medium text-[14px]
                                  leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                  ) : m.content === '' ? (
                    <AnswerSkeleton compact />
                  ) : (
                    <AnswerText
                      compact
                      text={stripMarkdown(m.content)}
                      sources={m.sources}
                      showSources={!(streaming && i === messages.length - 1)} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="h-16 px-3 flex items-center gap-2 border-t border-border-sub bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="동해 여행에 대해 물어보세요"
              className="flex-1 h-10 px-3 rounded-lg border border-border-def
                         font-pretendard font-normal text-[14px] text-text-pri
                         placeholder:text-text-ter focus:border-primary outline-none
                         transition-colors duration-150" />
            <button
              onClick={sendMessage}
              disabled={streaming || !input.trim()}
              aria-label="전송"
              className="w-10 h-10 shrink-0 inline-flex items-center justify-center
                         bg-primary text-white rounded-lg
                         hover:bg-primary-hover transition-colors duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="동해사이 도우미 열기"
        className="fixed bottom-6 right-5 z-50 w-14 h-14 rounded-full
                   bg-primary text-white flex items-center justify-center
                   hover:bg-primary-hover transition-colors duration-150">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
