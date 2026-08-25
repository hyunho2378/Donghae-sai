import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, CornerDownRight, SquarePen } from 'lucide-react'
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
const COMPLETED_SPACER_MAX = 160
const COMPLETED_SPACER_RATIO = 0.24

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const WRAP = 'mx-auto w-full max-w-[900px] px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24'

export default function SovereignHero() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle 초기, leaving 인트로 소멸, chat 대화
  const { messages, streaming, send, reset } = useSovereignChat()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setPanelOpen = useChatUi((s) => s.setPanelOpen)
  const scrollRef = useRef(null)
  const taRef = useRef(null)
  const timer = useRef(null)
  const lastQRef = useRef(null) // 가장 최근 질문 말풍선. 새 질문을 상단으로 앵커할 때 쓴다
  const lastMsgRef = useRef(null) // 마지막 메시지. 하단 스페이서를 무시하고 이 요소 기준으로 위치를 잡는다
  const [showScrollDown, setShowScrollDown] = useState(false)
  const [spacerH, setSpacerH] = useState(0) // 하단 여유 공간 높이(px). 마지막 질문을 상단까지 올릴 만큼만

  const opened = phase === 'chat'
  const leaving = phase === 'leaving'

  // 질문 개수와 마지막 질문 위치. 새 질문이 늘면 그 질문을 상단으로 앵커한다
  const userCount = messages.reduce((n, m) => n + (m.role === 'user' ? 1 : 0), 0)
  let lastUserIndex = -1
  for (let k = 0; k < messages.length; k++) if (messages[k].role === 'user') lastUserIndex = k

  // 대화 모드 여부를 전역에 알린다. TopNav 가 헤더를 좌측으로 옮기는 신호. 언마운트 시 원복
  useEffect(() => {
    setPanelOpen(opened)
    return () => setPanelOpen(false)
  }, [opened, setPanelOpen])

  // 마지막 답변 바닥이 뷰포트 바닥에 오도록 하는 스크롤 위치. 하단 스페이서는 계산에서 뺀다
  function bottomTarget() {
    const el = scrollRef.current
    const last = lastMsgRef.current
    if (!el) return 0
    const lastBottom = last ? last.offsetTop + last.offsetHeight : el.scrollHeight
    return Math.max(0, lastBottom - el.clientHeight + 24) // 24는 하단 여백
  }

  // 스크롤 위치 추적. 마지막 답변이 화면 밖으로 넘어가면 아래로 가기 버튼을 띄운다
  function handleScroll() {
    const el = scrollRef.current
    const last = lastMsgRef.current
    if (!el) return
    const lastBottom = last ? last.offsetTop + last.offsetHeight : el.scrollHeight
    const dist = lastBottom - (el.scrollTop + el.clientHeight)
    setShowScrollDown(dist > 120)
  }

  function scrollToBottom() {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: bottomTarget(), behavior: reduceMotion() ? 'auto' : 'smooth' })
  }

  // 대화 모드에서 답변이 끝나면(또는 방금 열렸으면) 입력창 포커스를 유지한다
  useEffect(() => {
    if (opened && !streaming) taRef.current?.focus()
  }, [opened, streaming])

  // 새 질문을 보내면 그 질문 말풍선을 대화 영역 최상단으로 올린다(챗지피티식 앵커).
  // 질문의 offsetTop 은 그 위 콘텐츠(이미 확정됨)로 정해져 안정적이다. 아래에 답변이 쌓여도
  // 질문 위치는 안 바뀐다. 컨테이너를 직접 scrollTo 하고, 부드러운 스크롤이 초기 레이아웃 변화로
  // 어긋날 수 있어 한 프레임 뒤와 잠시 뒤에 한 번 더 확정한다. 강제 바닥 스크롤은 없다
  useEffect(() => {
    if (!opened) return
    const el = scrollRef.current
    const q = lastQRef.current
    if (!el || !q) return
    const anchor = (behavior) => el.scrollTo({ top: Math.max(0, q.offsetTop - 24), behavior })
    const raf = requestAnimationFrame(() => anchor(reduceMotion() ? 'auto' : 'smooth'))
    const fix = setTimeout(() => anchor('auto'), 450) // sources/토큰 유입으로 어긋나면 즉시 재확정
    return () => { cancelAnimationFrame(raf); clearTimeout(fix) }
  }, [userCount, opened])

  // 하단 여유 공간을 동적으로 계산한다. 마지막 질문이 화면 최상단까지 스크롤될 만큼만 준다.
  // 답변이 짧으면 화면을 딱 채우는 만큼, 답변이 길면 0에 가깝게 → 과한 흰 여백이 안 남는다.
  // paint 전에 확정해 앵커(rAF)가 올바른 여백 위에서 동작하게 한다
  useLayoutEffect(() => {
    const el = scrollRef.current
    const q = lastQRef.current
    const last = lastMsgRef.current
    if (!opened || !el || !q || !last) { setSpacerH(0); return }
    const contentAfterQ = (last.offsetTop + last.offsetHeight) - q.offsetTop
    const needed = Math.max(0, el.clientHeight - contentAfterQ)
    const completedCap = Math.min(COMPLETED_SPACER_MAX, el.clientHeight * COMPLETED_SPACER_RATIO)
    const nextSpacer = streaming ? needed : Math.min(needed, completedCap)
    setSpacerH(Math.round(nextSpacer))

    if (streaming) return
    // 완료 후 스페이서를 줄이면 브라우저가 scrollTop을 자동 clamp할 수 있다.
    // 새 높이가 반영된 다음 프레임에 질문 앵커와 가능한 최대 스크롤 사이로 다시 맞춘다.
    const raf = requestAnimationFrame(() => {
      const target = Math.max(0, q.offsetTop - 24)
      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight)
      el.scrollTo({ top: Math.min(target, maxScroll), behavior: 'auto' })
    })
    return () => cancelAnimationFrame(raf)
  }, [messages, opened, streaming])

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
    setTimeout(() => taRef.current?.focus(), 0) // 전송 직후 재포커스
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
    <div className="flex items-center gap-3 p-3 pl-4
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
        className="flex-1 min-w-0 resize-none bg-transparent outline-none
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
            : 'bg-primary-soft text-primary cursor-not-allowed'}`}>
        <ArrowUp size={20} />
      </button>
    </div>
  )

  const disclaimer = (
    <p className="font-pretendard font-normal text-[12px] text-text-meta text-center">
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
                className="min-w-11 min-h-11 inline-flex items-center justify-center font-pretendard font-semibold text-[13px] text-primary-hover
                           hover:text-primary transition-colors duration-150">
                로그인
              </Link>
            </div>
          )}

          <div className="mt-16 md:mt-20 lg:mt-24 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {disclaimer}
            <span aria-hidden="true" className="hidden sm:inline-block w-px h-3 bg-border-def" />
            <span className="flex items-center gap-3">
              <Link to="/privacy"
                className="min-w-11 min-h-11 inline-flex items-center justify-center font-pretendard font-medium text-[12px] text-text-sec
                               hover:text-text-pri transition-colors duration-150">
                개인정보처리안내
              </Link>
              <button type="button"
                className="min-w-11 min-h-11 inline-flex items-center justify-center font-pretendard font-medium text-[12px] text-text-sec
                                 hover:text-text-pri transition-colors duration-150">
                고객센터
              </button>
            </span>
          </div>
        </div>
      ) : (
        /* ===== 대화 화면. 얇은 사이드바 + 답변마다 [본문 | 근거] 2단 행 ===== */
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

          {/* 대화 컬럼 */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* 스크롤 영역. 상대 위치라 아래로 가기 버튼을 이 영역 하단에 띄운다 */}
            <div className="relative flex-1 min-h-0">
              <div ref={scrollRef} onScroll={handleScroll}
                   className="absolute inset-0 overflow-y-auto py-6 animate-flow-down-late">
                {/* 본문 열과 근거 열의 폭을 한 번 정한다. 근거가 나중에 생겨도 폭이 안 바뀌어 점프가 없다 */}
                <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8 space-y-6">
                  {messages.map((m, i) => {
                    if (m.role === 'user') {
                      return (
                        <div key={i}
                             ref={(el) => { if (i === lastUserIndex) lastQRef.current = el; if (i === messages.length - 1) lastMsgRef.current = el }}
                             className="scroll-mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:items-start animate-flow-down">
                          <div className="flex justify-end">
                            <p className="max-w-[85%] px-4 py-3 rounded-2xl
                                          bg-primary-soft text-text-pri
                                          font-pretendard font-medium
                                          text-[15px] lg:text-[16px] tracking-[-0.01em]
                                          leading-relaxed whitespace-pre-wrap">
                              {m.content}
                            </p>
                          </div>
                          <div className="hidden lg:block" aria-hidden="true" />
                        </div>
                      )
                    }
                    // 답변마다 자기 근거를 자기 옆에 가진다. 근거 없어도 우측 340 트랙은 유지된다
                    const cards = m.sources?.length ? resolveSources(m.sources, m.links) : []
                    // 스트리밍 중인 마지막 답변에는 아직 근거 카드를 안 띄운다. 답변이 끝난 뒤에 뜬다
                    const showCards = cards.length > 0 && !(streaming && i === messages.length - 1)
                    return (
                      <div key={i}
                           ref={(el) => { if (i === messages.length - 1) lastMsgRef.current = el }}
                           className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:items-start animate-flow-down">
                        <div className="min-w-0">
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
                          {/* 모바일. 우측 열이 접히므로 근거 카드를 본문 아래에 둔다. 스트리밍 끝난 뒤에만 */}
                          {showCards && (
                            <div className="lg:hidden mt-4 pt-4 border-t border-border-sub">
                              <SourcePanel sources={cards} />
                            </div>
                          )}
                        </div>
                        {/* 데스크톱. 이 답변의 근거를 같은 높이 우측 열에 붙인다. 스트리밍 끝난 뒤에만 */}
                        <div className="hidden lg:block min-w-0">
                          {showCards && <SourcePanel sources={cards} />}
                        </div>
                      </div>
                    )
                  })}

                  {/* 하단 여유 공간. 동적 높이. 마지막 질문을 상단까지 올릴 만큼만 주고, 답변이 끝나
                      화면이 차면 0에 가까워진다. 감지는 마지막 메시지 기준이라 이 여백이
                      아래로 가기 버튼을 잘못 띄우지 않고, 아래로 가기도 마지막 답변까지만 간다 */}
                  <div aria-hidden="true" style={{ height: spacerH }} />
                </div>
              </div>

              {/* 아래로 가기 버튼. 맨 아래에서 멀어지면 뜬다. box-shadow 없이 테두리로만 구분 */}
              {showScrollDown && (
                <button onClick={scrollToBottom} aria-label="맨 아래로" title="맨 아래로"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10
                             w-10 h-10 inline-flex items-center justify-center rounded-full
                             bg-white border border-border-def text-text-sec
                             hover:text-primary hover:border-primary
                             transition-colors duration-150 motion-reduce:transition-none">
                  <ArrowDown size={20} />
                </button>
              )}
            </div>

            {/* 하단 입력. 본문 열과 같은 폭/좌표에 맞춘다 */}
            <div className="shrink-0 border-t border-border-sub py-4">
              <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8">
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                  <div>
                    {inputBox}
                    <div className="mt-3">{disclaimer}</div>
                  </div>
                  <div className="hidden lg:block" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
