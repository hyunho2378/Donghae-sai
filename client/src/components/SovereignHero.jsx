import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, MapPin, Ticket } from 'lucide-react'
import useSovereignChat, { stripMarkdown, sourceLabel } from '../hooks/useSovereignChat'

// 동해시 공식 권역 구분 5개와 패스. 네이버 검색창 아래 바로가기 줄과 같은 자리
const SHORTCUTS = [
  { label: '추암', to: '/stays?region=추암', Icon: MapPin },
  { label: '무릉', to: '/stays?region=무릉', Icon: MapPin },
  { label: '천곡', to: '/stays?region=천곡', Icon: MapPin },
  { label: '묵호', to: '/stays?region=묵호', Icon: MapPin },
  { label: '망상', to: '/stays?region=망상', Icon: MapPin },
  { label: '패스', to: '/membership', Icon: Ticket }
]

const SUGGESTIONS = [
  { label: '코스 추천', question: '2030 뚜벅이인데 1박 코스 짜줘' },
  { label: '묵호 맛집', question: '묵호에서 저녁 먹을 데 알려줘' },
  { label: '패스 안내', question: '2일권은 뭐가 포함돼' }
]

// 근거가 많이 잡히면 칩이 줄을 덮는다. 앞 네 개만 보이고 나머지는 개수로 접는다
const SOURCE_LIMIT = 4

export default function SovereignHero() {
  const [input, setInput] = useState('')
  const { messages, loading, streaming, send } = useSovereignChat()
  const panelRef = useRef(null)

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight
    }
  }, [messages])

  function submit(text) {
    if (streaming) return
    send(text)
    setInput('')
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(input)
    }
  }

  const opened = messages.length > 0

  return (
    <section className="bg-white flex items-center
                        min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]
                        py-16 md:py-20 lg:py-24 4xl:py-32">
      <div className="mx-auto w-full max-w-[900px]
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24">
        {!opened && (
          <h1 className="text-center font-pretendard font-bold
                         text-[32px] md:text-[44px] lg:text-[56px] 4xl:text-[72px]
                         tracking-[-0.02em] leading-tight">
            <span className="text-primary-hover">오늘 밤 동해</span>
            <span className="text-text-pri">, 어디로 갈까요</span>
          </h1>
        )}

        <div className={`${opened ? '' : 'mt-8 lg:mt-10'}
                        flex items-center gap-3 h-16 lg:h-20 pl-6 pr-3
                        rounded-2xl border border-border-def
                        focus-within:border-primary transition-colors duration-150`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={streaming}
            aria-label="동해사이 도우미에게 질문하기"
            placeholder="무엇이든 물어보세요"
            className="flex-1 min-w-0 bg-transparent outline-none
                       font-pretendard font-normal text-text-pri
                       text-[16px] lg:text-[17px] tracking-[-0.01em]
                       placeholder:text-text-ter
                       disabled:opacity-40 disabled:cursor-not-allowed" />
          <button
            onClick={() => submit(input)}
            disabled={streaming}
            aria-label="전송"
            className="w-11 h-11 lg:w-12 lg:h-12 shrink-0
                       inline-flex items-center justify-center rounded-full
                       bg-primary-hover text-white
                       hover:bg-primary transition-colors duration-150
                       disabled:opacity-40 disabled:cursor-not-allowed">
            <ArrowUp size={20} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 xs:grid-cols-6 gap-2">
          {SHORTCUTS.map(({ label, to, Icon }) => (
            <Link
              key={label}
              to={to}
              className="py-3 flex flex-col items-center gap-2 rounded-xl
                         hover:bg-bg-card transition-colors duration-150">
              <span className="w-11 h-11 lg:w-12 lg:h-12 inline-flex items-center justify-center
                               rounded-full bg-primary-soft">
                <Icon size={20} className="text-primary-hover" />
              </span>
              <span className="font-pretendard font-medium
                               text-[13px] lg:text-[14px] text-text-sec tracking-[-0.01em]">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {!opened && (
          <div className="mt-6 rounded-2xl border border-border-sub overflow-hidden">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => submit(s.question)}
                className="w-full min-h-14 lg:min-h-16 px-5 py-3 text-left
                           flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3
                           border-t border-border-sub first:border-t-0
                           hover:bg-bg-card transition-colors duration-150">
                <span className="shrink-0 flex items-center gap-3">
                  <ArrowUpRight size={16} className="shrink-0 text-text-ter" />
                  <span className="font-pretendard font-bold
                                   text-[15px] lg:text-[16px] text-text-pri tracking-[-0.01em]">
                    {s.label}
                  </span>
                </span>
                <span className="xs:truncate font-pretendard font-normal
                                 text-[15px] lg:text-[16px] text-text-sec tracking-[-0.01em]">
                  {s.question}
                </span>
              </button>
            ))}
          </div>
        )}

        {opened && (
          <div ref={panelRef}
               className="mt-6 max-h-[420px] overflow-y-auto
                          rounded-2xl border border-border-sub px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%]">
                  <div className={`px-4 py-3 rounded-xl
                                   font-pretendard font-normal text-[15px] lg:text-[16px]
                                   tracking-[-0.01em] leading-relaxed whitespace-pre-wrap
                                   ${m.role === 'user'
                                     ? 'bg-primary text-white'
                                     : 'bg-bg-card text-text-pri border border-border-sub'}`}>
                    {m.role === 'assistant' ? stripMarkdown(m.content) : m.content}
                  </div>
                  {m.role === 'assistant' && m.sources?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.sources.slice(0, SOURCE_LIMIT).map((s) => (
                        <span key={s}
                              className="inline-flex items-center h-7 px-2.5 rounded-full
                                         bg-primary-soft
                                         font-pretendard font-medium text-[12px]
                                         tracking-[-0.01em] text-primary">
                          근거 {sourceLabel(s)}
                        </span>
                      ))}
                      {m.sources.length > SOURCE_LIMIT && (
                        <span className="inline-flex items-center h-7 px-2.5 rounded-full
                                         bg-primary-soft
                                         font-pretendard font-medium text-[12px]
                                         tracking-[-0.01em] text-primary">
                          외 {m.sources.length - SOURCE_LIMIT}개
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl bg-bg-card border border-border-sub
                                font-pretendard font-light text-[14px] text-text-meta">
                  답변 생성 중
                </div>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-center font-pretendard font-light
                      text-[12px] 4xl:text-[13px] text-text-meta">
          동해 자료로만 답하는 동해사이 도우미
        </p>
      </div>
    </section>
  )
}
