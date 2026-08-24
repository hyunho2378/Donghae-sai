import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, CornerDownRight, SquarePen } from 'lucide-react'
import useSovereignChat, { stripMarkdown, resolveSources } from '../hooks/useSovereignChat'
import { useAuthStore } from '../store/useAuthStore'
import { useChatUi } from '../store/useChatUi'
import AnswerSkeleton from './AnswerSkeleton'
import AnswerText from './AnswerText'
import SourcePanel from './SourcePanel'

const SUGGESTIONS = [
  { label: '묵호 밤 산책', question: '오늘 밤 묵호에서 뭐 하면 좋을까요' },
  { label: '아이랑 코스', question: '아이랑 가기 좋은 동해 코스 알려줘요' },
  { label: '뚜벅이 1박', question: '뚜벅이인데 1박 2일 코스 추천해줘요' }
]

// 인트로가 사라지는 시간. 이 뒤에 입력창이 하단으로 내려간다
const LEAVE_MS = 240

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const WRAP = 'mx-auto w-full max-w-[900px] px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24'
// 대화 좌측 컬럼 안쪽 폭. 우측 출처 패널과 나란히 놓을 때 읽기 좋은 폭으로 좁힌다
const COL = 'mx-auto w-full max-w-[760px] px-5 md:px-8'

export default function SovereignHero() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle 초기, leaving 인트로 소멸, chat 대화
  const { messages, streaming, send, reset } = useSovereignChat()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setPanelOpen = useChatUi((s) => s.setPanelOpen)
  const scrollRef = useRef(null)
  const taRef = useRef(null)
  const timer = useRef(null)

  const opened = phase === 'chat'
  const leaving = phase === 'leaving'

  // 대화 모드 여부를 전역에 알린다. TopNav 가 헤더를 좌측으로 옮기는 신호. 언마운트 시 원복
  useEffect(() => {
    setPanelOpen(opened)
    return () => setPanelOpen(false)
  }, [opened, setPanelOpen])

  // 최신 어시스턴트 답변의 출처를 우측 카드로 푼다. 답변이 바뀌면 패널도 그 근거로 갱신된다
  const lastWithSources = [...messages].reverse().find((m) => m.role === 'assistant' && m.sources?.length)
  const panelSources = lastWithSources ? resolveSources(lastWithSources.sources, lastWithSources.links) : []

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
      // 인트로를 먼저 위로 걷어내고 그 다음 대화 화면으로 전환한다
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

  // 입력창은 idle 과 chat 에서 위치만 다르고 구성은 같다. 한 곳에서만 렌더된다
  const inputBox = (
    <div className="flex items-end gap-3 p-3 pl-4
                    rounded-2xl bg-white border border-border-def
                    focus-within:border-primary focus-within:ring-2 focus-within:ring-primary
                    transition-colors duration-150">
      <textarea
        ref={taRef}
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="동해사이 도우미에게 질문하기"
        placeholder={opened ? '무엇이든 이어서 물어보세요' : '무엇이든 물어보세요'}
        className="flex-1 min-w-0 self-stretch resize-none bg-transparent outline-none
                   py-2 min-h-[56px] lg:min-h-[64px] max-h-[200px] overflow-y-auto
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
  )

  const disclaimer = (
    <p className="font-pretendard font-light text-[12px] text-text-meta text-center">
      동해 로컬 데이터만 사용해 답하며, 최신 정보와 다를 수 있어요
    </p>
  )

  return (
    <section className={`bg-page flex flex-col flex-1 min-h-0 overflow-hidden
                         ${opened ? '' : 'justify-center py-10 md:py-14 lg:py-16'}`}>

      {!opened ? (
        /* ===== 초기 화면. 중앙 온보딩과 입력창 ===== */
        <div className={WRAP}>
          <h1 className={`text-center font-pretendard font-bold
                          text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                          tracking-[-0.02em] leading-tight text-balance ${introMotion}`}>
            <span className="text-primary-hover">오늘 밤 동해</span>
            <span className="text-text-pri">, 어디로 갈까요</span>
          </h1>

          <div className="mt-8 lg:mt-10">
            {inputBox}
          </div>

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

          {/* 온보딩. 비로그인 시에만 로그인 안내를 붙인다. 로그인은 /auth 로만 연결 */}
          {!isAuthenticated && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="font-pretendard font-normal text-[13px] text-text-meta">
                로그인하면 저장한 장소와 지난 대화를 이어갈 수 있어요
              </span>
              <Link to="/auth"
                className="font-pretendard font-semibold text-[13px] text-primary-hover
                           hover:text-primary transition-colors duration-150">
                로그인
              </Link>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {disclaimer}
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
          </div>
        </div>
      ) : (
        /* ===== 대화 화면. 얇은 사이드바 + 좌 대화 + 우 출처 패널 ===== */
        <div className="flex-1 min-h-0 flex">

          {/* 얇은 세로 사이드바. 아이콘 위주. 새 대화만 둔다(히스토리 기능 없어 생략) */}
          <nav className="w-14 shrink-0 border-r border-border-sub
                          flex flex-col items-center py-4">
            <button
              onClick={newChat}
              aria-label="새 대화"
              title="새 대화"
              className="w-10 h-10 inline-flex items-center justify-center rounded-full
                         text-text-sec hover:bg-bg-card hover:text-primary-hover
                         transition-colors duration-150 motion-reduce:transition-none">
              <SquarePen size={20} />
            </button>
          </nav>

          {/* 대화. 스크롤 영역 + 하단 입력 */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-6 animate-flow-down-late">
              <div className={`${COL} space-y-4`}>
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
                          showSources={false}
                          showActions={!(streaming && i === messages.length - 1)} />
                      )}
                    </div>
                  )
                ))}

                {/* 모바일. 우측 패널 자리가 없으므로 출처 카드를 대화 아래에 쌓는다 */}
                {panelSources.length > 0 && (
                  <div className="lg:hidden pt-4 mt-2 border-t border-border-sub">
                    <SourcePanel sources={panelSources} />
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-border-sub py-4">
              <div className={COL}>
                {inputBox}
                <div className="mt-3">{disclaimer}</div>
              </div>
            </div>
          </div>

          {/* 우측. 출처 카드 패널. 근거 카드가 있을 때만 뜬다. 없으면 빈 공간(안내 문구 없음) */}
          {panelSources.length > 0 && (
            <aside className="hidden lg:block w-[340px] xl:w-[380px] shrink-0
                              border-l border-border-sub overflow-y-auto bg-page">
              <div className="p-5">
                <SourcePanel sources={panelSources} />
              </div>
            </aside>
          )}
        </div>
      )}
    </section>
  )
}
