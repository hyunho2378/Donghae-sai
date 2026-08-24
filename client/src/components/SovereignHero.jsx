import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, CornerDownRight, Plus, Sparkles } from 'lucide-react'
import useSovereignChat, { stripMarkdown } from '../hooks/useSovereignChat'
import AnswerSkeleton from './AnswerSkeleton'
import AnswerText from './AnswerText'

const SUGGESTIONS = [
  { label: '코스 추천', question: '2030 뚜벅이인데 1박 코스 짜줘' },
  { label: '묵호 맛집', question: '묵호에서 저녁 먹을 데 알려줘' },
  { label: '패스 안내', question: '2일권은 뭐가 포함돼' }
]

// 인트로가 사라지는 시간. 이 뒤에 입력창이 하단으로 내려간다
const LEAVE_MS = 240

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const WRAP = 'mx-auto w-full max-w-[900px] px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24'

export default function SovereignHero() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle 초기, leaving 인트로 소멸, chat 대화
  const [mukoErr, setMukoErr] = useState(false) // 무코 애셋 부재 시 아이콘 폴백
  const { messages, streaming, send, reset } = useSovereignChat()
  const scrollRef = useRef(null)
  const taRef = useRef(null)
  const timer = useRef(null)

  const opened = phase === 'chat'
  const leaving = phase === 'leaving'

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, opened])

  // 입력이 길어지면 textarea 높이를 내용에 맞춰 늘린다. 최소와 최대는 CSS 가 잡는다
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
      // 인트로를 먼저 위로 걷어내고 그 다음 입력창을 하단으로 내린다
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

  const introMotion = `transition-[opacity,transform] duration-[240ms] ease-out
                       motion-reduce:transition-none
                       ${leaving ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`

  return (
    <section className={`bg-page flex flex-col flex-1 min-h-0 overflow-hidden
                         ${opened ? '' : 'justify-center py-10 md:py-14 lg:py-16'}`}>

      {/* 위쪽. 초기에는 헤드라인, 대화 중에는 스크롤되는 대화 영역 */}
      <div ref={scrollRef}
           className={opened ? 'flex-1 min-h-0 overflow-y-auto pt-8 lg:pt-12 pb-6' : ''}>
        <div className={WRAP}>
          {!opened && (
            <div className={introMotion}>
              {/* 무코 캐릭터 자리. 애셋 부재 시 아이콘 폴백 */}
              <div className="flex justify-center mb-5">
                {!mukoErr ? (
                  <img src="/images/character/muko-main.png" alt="동해사이 무코" loading="lazy"
                       onError={() => setMukoErr(true)}
                       className="w-20 h-20 lg:w-24 lg:h-24 object-contain" />
                ) : (
                  <span className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary-soft
                                   inline-flex items-center justify-center">
                    <Sparkles size={28} className="text-primary" />
                  </span>
                )}
              </div>
              <h1 className="text-center font-pretendard font-bold
                             text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                             tracking-[-0.02em] leading-tight text-balance">
                <span className="text-primary-hover">오늘 밤 동해</span>
                <span className="text-text-pri">, 어디로 갈까요</span>
              </h1>
            </div>
          )}

          {opened && (
            <div className="space-y-6 lg:space-y-8">
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
                        sources={m.sources}
                        links={m.links}
                        showSources={!(streaming && i === messages.length - 1)} />
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 아래쪽. 입력창은 초기에 헤드라인 밑, 대화 중에는 화면 하단 */}
      <div className={`shrink-0 ${opened ? 'pb-8 lg:pb-10 pt-2 animate-flow-down-late' : ''}`}>
        <div className={WRAP}>
          <div className={`${opened ? '' : 'mt-8 lg:mt-10'}
                          flex items-end gap-3 p-3 pl-5
                          rounded-2xl border border-border-def
                          focus-within:border-primary transition-colors duration-150`}>
            <textarea
              ref={taRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="동해사이 도우미에게 질문하기"
              placeholder={opened ? '무엇이든 이어서 물어보세요' : '무엇이든 물어보세요'}
              className="flex-1 min-w-0 self-stretch resize-none bg-transparent outline-none
                         py-2 min-h-[72px] lg:min-h-[88px] max-h-[220px] overflow-y-auto
                         font-pretendard font-normal text-text-pri
                         text-[16px] lg:text-[17px] tracking-[-0.01em] leading-relaxed
                         placeholder:text-text-meta" />
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

          {!opened && (
            <div className={`mt-6 ${introMotion}`}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => submit(s.question)}
                  className="w-full min-h-14 lg:min-h-16 px-1 py-3 text-left
                             flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3
                             border-b border-border-sub last:border-b-0
                             hover:bg-bg-card transition-colors duration-150">
                  <span className="shrink-0 flex items-center gap-3">
                    <CornerDownRight size={16} className="shrink-0 text-text-ter" />
                    <span className="font-pretendard font-normal
                                     text-[15px] lg:text-[16px] text-text-meta tracking-[-0.01em]">
                      {s.label}
                    </span>
                  </span>
                  <span className="xs:truncate font-pretendard font-normal
                                   text-[15px] lg:text-[16px] text-text-pri tracking-[-0.01em]">
                    {s.question}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <p className="font-pretendard font-light text-[12px] 4xl:text-[13px] text-text-meta">
              동해 로컬 데이터로만 답해요. 동해 밖 정보는 모를 수 있어요
            </p>
            <span aria-hidden="true" className="hidden sm:inline-block w-px h-3 bg-border-def" />
            <span className="flex items-center gap-3">
              <Link to="/privacy"
                    className="font-pretendard font-medium text-[12px] text-text-sec
                               hover:text-text-pri transition-colors duration-150">
                개인정보처리안내
              </Link>
              <button type="button"
                      className="font-pretendard font-medium text-[12px] text-text-sec
                                 hover:text-text-pri transition-colors duration-150">
                고객센터
              </button>
            </span>
            {opened && (
              <button
                onClick={newChat}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full
                           border border-border-def
                           font-pretendard font-medium text-[12px] text-text-sec
                           hover:border-primary hover:text-primary-hover
                           transition-colors duration-150">
                <Plus size={16} />
                새 대화
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
