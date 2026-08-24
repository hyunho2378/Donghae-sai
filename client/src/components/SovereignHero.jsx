import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, CornerDownRight, Plus, Sparkles } from 'lucide-react'
import useSovereignChat, { stripMarkdown, resolveSources } from '../hooks/useSovereignChat'
import AnswerSkeleton from './AnswerSkeleton'
import AnswerText from './AnswerText'
import SourcePanel from './SourcePanel'

// 온보딩 추천 질문. 동해 맥락으로 새로 쓴다. 네이버 예시를 베끼지 않는다
const SUGGESTIONS = [
  { label: '오늘 밤', question: '오늘 밤 묵호에서 뭐 하지' },
  { label: '아이와', question: '아이랑 가기 좋은 코스 알려줘' },
  { label: '뚜벅이', question: '뚜벅이인데 1박 2일 추천해줘' }
]

const LEAVE_MS = 240

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SovereignHero() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle 초기, leaving 인트로 소멸, chat 대화
  const [mukoErr, setMukoErr] = useState(false)
  const { messages, streaming, send, reset } = useSovereignChat()
  const scrollRef = useRef(null)
  const taRef = useRef(null)
  const timer = useRef(null)

  const opened = phase === 'chat'
  const leaving = phase === 'leaving'

  // 우측 패널. 가장 최근 어시스턴트 답변의 근거를 카드로 푼다
  const latestSources = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.role === 'assistant' && m.sources?.length) return resolveSources(m.sources, m.links)
    }
    return []
  }, [messages])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, opened])

  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [input, opened])

  useEffect(() => () => clearTimeout(timer.current), [])

  function submit(text) {
    if (streaming || !text.trim()) return
    if (phase === 'idle') {
      setPhase('leaving')
      timer.current = setTimeout(() => setPhase('chat'), reduceMotion() ? 0 : LEAVE_MS)
    }
    send(text)
    setInput('')
  }

  function newChat() {
    clearTimeout(timer.current)
    reset()
    setInput('')
    setPhase('idle')
  }

  function onKeyDown(e) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(input)
    }
  }

  // 입력창은 idle과 opened 양쪽에서 같은 모양을 쓴다. 무코는 대화 중에만
  const inputBox = (
    <div className="flex items-end gap-3 p-3 pl-4
                    rounded-2xl bg-white
                    focus-within:ring-2 focus-within:ring-primary
                    transition-shadow duration-150">
      {opened && (
        <div className="shrink-0 self-end mb-0.5">
          {!mukoErr ? (
            <img src="/images/character/muko-main.png" alt="무코" loading="lazy"
                 onError={() => setMukoErr(true)}
                 className="w-9 h-9 lg:w-10 lg:h-10 object-contain" />
          ) : (
            <span className="w-9 h-9 rounded-full bg-primary-soft inline-flex items-center justify-center">
              <Sparkles size={18} className="text-primary" />
            </span>
          )}
        </div>
      )}
      <textarea
        ref={taRef}
        rows={opened ? 1 : 2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="동해사이 도우미에게 질문하기"
        placeholder={opened ? '무엇이든 이어서 물어보세요' : '무엇이든 물어보세요'}
        className={`flex-1 min-w-0 self-stretch resize-none bg-transparent outline-none
                    py-2 max-h-[200px] overflow-y-auto
                    ${opened ? 'min-h-[44px]' : 'min-h-[72px] lg:min-h-[88px]'}
                    font-pretendard font-normal text-text-pri
                    text-[16px] lg:text-[17px] tracking-[-0.01em] leading-relaxed
                    placeholder:text-text-meta`} />
      <button
        onClick={() => submit(input)}
        disabled={streaming || !input.trim()}
        aria-label="전송"
        className={`w-11 h-11 lg:w-12 lg:h-12 shrink-0
                    inline-flex items-center justify-center rounded-full
                    transition-colors duration-150
                    ${input.trim() && !streaming
                      ? 'bg-primary text-white hover:bg-primary-hover'
                      : 'bg-bg-card text-text-ter cursor-not-allowed'}`}>
        <ArrowUp size={20} />
      </button>
    </div>
  )

  const guidance = (
    <p className="mt-3 text-center font-pretendard font-light text-[12px] 4xl:text-[13px] text-text-meta">
      동해 로컬 데이터만 사용해 답하며, 최신 정보와 다를 수 있어요
    </p>
  )

  const messageList = (
    <div className="space-y-4">
      {messages.map((m, i) => (
        m.role === 'user' ? (
          <div key={i} className="flex justify-end animate-flow-down">
            <p className="max-w-[85%] px-4 py-3 rounded-2xl
                          bg-primary-soft text-text-pri
                          font-pretendard font-medium
                          text-[15px] lg:text-[16px] tracking-[-0.01em]
                          leading-relaxed whitespace-pre-wrap">
              {m.content}
            </p>
          </div>
        ) : (
          <div key={i} className="animate-flow-down">
            {m.content === '' ? (
              <AnswerSkeleton />
            ) : (
              <AnswerText
                text={stripMarkdown(m.content)}
                showSources={false}
                showActions={!(streaming && i === messages.length - 1)} />
            )}
          </div>
        )
      ))}
    </div>
  )

  // 대화 상태. 좌 대화 우 출처 패널로 분할한다
  if (opened) {
    return (
      <section className="bg-page flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* 상단 바. 좌측에서 새 대화를 연다. 하단 새 대화 버튼은 없앴다 */}
        <div className="shrink-0 border-b border-border-sub">
          <div className="container-page py-3 flex items-center justify-between">
            <button
              onClick={newChat}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full
                         bg-white
                         font-pretendard font-semibold text-[13px] text-text-pri
                         hover:bg-bg-card transition-colors duration-150">
              <Plus size={16} className="text-primary" />
              새 대화
            </button>
            <span className="font-pretendard font-semibold text-[13px] text-text-meta">
              동해사이 도우미
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className="container-page h-full lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
            {/* 좌. 대화와 입력 */}
            <div className="flex flex-col min-h-0 h-full py-4">
              <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto pb-3 animate-flow-down">
                {messageList}
                {/* 모바일. 우측 패널을 대화 아래에 쌓는다 */}
                {latestSources.length > 0 && (
                  <div className="lg:hidden mt-6">
                    <SourcePanel sources={latestSources} />
                  </div>
                )}
              </div>
              <div className="shrink-0 pt-2 animate-flow-down-late">
                {inputBox}
                {guidance}
              </div>
            </div>

            {/* 우. 출처 카드 패널. 데스크톱 전용 */}
            <aside className="hidden lg:block overflow-y-auto py-4">
              {latestSources.length > 0 ? (
                <SourcePanel sources={latestSources} />
              ) : (
                <p className="font-pretendard font-normal text-[13px] text-text-ter">
                  답변의 근거가 여기에 표시돼요
                </p>
              )}
            </aside>
          </div>
        </div>
      </section>
    )
  }

  // 첫 화면. 온보딩과 중앙 입력창
  const introMotion = `transition-[opacity,transform] duration-[240ms] ease-out
                       motion-reduce:transition-none
                       ${leaving ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`

  return (
    <section className="bg-page flex flex-col flex-1 min-h-0 overflow-hidden justify-center py-10 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[720px] px-5 md:px-8 lg:px-12">
        <div className={introMotion}>
          <h1 className="text-center font-pretendard font-bold
                         text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                         tracking-[-0.02em] leading-tight text-balance">
            <span className="text-primary-hover">오늘 밤 동해</span>
            <span className="text-text-pri">, 무엇이든 물어보세요</span>
          </h1>
          <p className="mt-3 text-center font-pretendard font-normal
                        text-[14px] md:text-[15px] text-text-meta">
            동해 로컬 데이터로 오늘의 여행을 안내해요
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          {inputBox}
        </div>

        <div className={`mt-4 flex flex-wrap justify-center gap-2 ${introMotion}`}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.question}
              onClick={() => submit(s.question)}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full
                         bg-white
                         font-pretendard font-medium text-[14px] text-text-pri
                         hover:bg-bg-card transition-colors duration-150">
              <CornerDownRight size={15} className="text-text-ter" />
              {s.question}
            </button>
          ))}
        </div>

        {guidance}

        {/* 로그인 전 온보딩. 로그인은 시각적 안내 수준. 실제 로그인은 최소 동작 */}
        <p className="mt-2 text-center font-pretendard font-light text-[12px] text-text-meta">
          <Link to="/auth" className="text-primary-hover hover:underline underline-offset-2 font-medium">로그인</Link>
          하면 대화를 이어서 볼 수 있어요
        </p>
      </div>
    </section>
  )
}
