import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Copy, Check, Share2, ThumbsUp, ThumbsDown } from 'lucide-react'
import { sourceLabel } from '../hooks/useSovereignChat'

// 별표 두 개로 감싼 구간만 굵게 그린다. 짝이 안 맞으면 그대로 둔다
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-bold text-text-strong">{part.slice(2, -2)}</strong>
      : part
  )
}

// 마크다운 파이프 표 판별. 첫 줄이 헤더, 둘째 줄이 구분선(--- 포함)
function isTableBlock(block) {
  const lines = block.split('\n')
  return lines.length >= 2
    && lines[0].includes('|')
    && /^[\s|:*-]+$/.test(lines[1])
    && lines[1].includes('-')
}

function parseTable(block) {
  const rows = block.split('\n').map((l) => l.trim()).filter(Boolean)
  const cells = (l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
  return { head: cells(rows[0]), body: rows.slice(2).map(cells) }
}

// 표는 DESIGN.md 규격. border-sub, 그림자 없음, 정의된 radius 만
function TableBlock({ block }) {
  const { head, body } = parseTable(block)
  return (
    <div className="overflow-x-auto rounded-lg border border-border-sub">
      <table className="w-full border-collapse font-pretendard text-[13px] lg:text-[14px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="text-left font-semibold text-text-pri
                                     px-3 py-2 bg-bg-card border-b border-border-sub">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-border-sub last:border-b-0">
              {row.map((c, i) => (
                <td key={i} className="px-3 py-2 align-top font-normal text-text-sec">
                  {renderInline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 출처를 문단에 배정한다. 이름이 실제로 언급된 문단에 붙이고, 못 찾으면 마지막 문단에 둔다
function assignSources(paragraphs, sources, links = {}) {
  const slots = paragraphs.map(() => [])
  if (!sources?.length || !paragraphs.length) return slots

  const leftover = []
  for (const id of sources) {
    const label = sourceLabel(id)
    const tokens = label.split(/\s+/).filter((t) => t.length >= 2)
    let best = -1
    let bestScore = 0
    paragraphs.forEach((text, i) => {
      let score = text.includes(label) ? 5 : 0
      for (const t of tokens) if (text.includes(t)) score += 1
      if (score > bestScore) {
        bestScore = score
        best = i
      }
    })
    const entry = { id, label, link: links[id] }
    if (best >= 0) slots[best].push(entry)
    else leftover.push(entry)
  }
  if (leftover.length) slots[slots.length - 1].push(...leftover)
  return slots
}

const CHIP = `inline-flex items-center gap-1 h-8 px-3 rounded-full
              border border-primary
              font-pretendard font-medium text-[12px]
              tracking-[-0.01em] text-primary-hover`

// 상세페이지가 있는 항목은 이동 버튼, 없으면 텍스트 칩으로 둔다
function Chip({ label, link }) {
  if (!link) return <span className={CHIP}>{label}</span>
  return (
    <Link to={link}
          className={`${CHIP} hover:bg-primary-soft transition-colors duration-150
                      motion-reduce:transition-none`}>
      {label} 보기
      <ArrowUpRight size={16} />
    </Link>
  )
}

// 답변 하단 액션. 복사 공유 좋아요 싫어요. 그림자 없이 아웃라인과 프라이머리로만
function ActionBar({ plain }) {
  const [copied, setCopied] = useState(false)
  const [vote, setVote] = useState(null) // 'up' | 'down' | null

  const onCopy = () => {
    navigator.clipboard?.writeText(plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const onShare = () => {
    if (navigator.share) navigator.share({ text: plain }).catch(() => {})
    else { navigator.clipboard?.writeText(plain); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  const btn = 'inline-flex items-center gap-1 h-8 px-2.5 rounded-full font-pretendard font-medium text-[12px] transition-colors duration-150 motion-reduce:transition-none'

  return (
    <div className="mt-3 flex items-center gap-1">
      <button type="button" onClick={onCopy} aria-label="복사"
              className={`${btn} text-text-meta hover:text-text-pri hover:bg-bg-card`}>
        {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
        {copied ? '복사됨' : '복사'}
      </button>
      <button type="button" onClick={onShare} aria-label="공유"
              className={`${btn} text-text-meta hover:text-text-pri hover:bg-bg-card`}>
        <Share2 size={14} />
        공유
      </button>
      <button type="button" onClick={() => setVote((v) => (v === 'up' ? null : 'up'))} aria-label="좋아요"
              aria-pressed={vote === 'up'}
              className={`${btn} ${vote === 'up' ? 'text-primary' : 'text-text-meta hover:text-text-pri hover:bg-bg-card'}`}>
        <ThumbsUp size={14} fill={vote === 'up' ? 'currentColor' : 'none'} />
      </button>
      <button type="button" onClick={() => setVote((v) => (v === 'down' ? null : 'down'))} aria-label="싫어요"
              aria-pressed={vote === 'down'}
              className={`${btn} ${vote === 'down' ? 'text-accent' : 'text-text-meta hover:text-text-pri hover:bg-bg-card'}`}>
        <ThumbsDown size={14} fill={vote === 'down' ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}

export default function AnswerText({ text, sources = [], links = {}, showSources = true, showActions, compact = false }) {
  // showActions 를 안 주면 showSources 와 같은 시점(답변 완료)에 노출한다
  const actions = showActions === undefined ? showSources : showActions
  const rawBlocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  if (rawBlocks.length === 0) return null

  const blocks = rawBlocks.map((raw) => ({ raw, table: isTableBlock(raw) }))
  const textParas = blocks.filter((b) => !b.table).map((b) => b.raw)
  const slots = assignSources(textParas, showSources ? sources : [], links)

  const size = compact ? 'text-[14px]' : 'text-[15px] lg:text-[16px]'
  const plain = text.replace(/\*\*/g, '').replace(/\s*\n\s*/g, '\n').trim()

  let pi = 0
  return (
    <div>
      <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
        {blocks.map((b, i) => {
          if (b.table) return <TableBlock key={i} block={b.raw} />
          const slot = slots[pi++]
          return (
            <div key={i}>
              <p className={`font-pretendard font-normal ${size} text-text-pri
                             tracking-[-0.01em] leading-normal whitespace-pre-wrap text-pretty`}>
                {renderInline(b.raw)}
              </p>
              {slot.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {slot.map((s) => <Chip key={s.id} label={s.label} link={s.link} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 답변이 끝난 뒤에만 액션 바를 보인다. 스트리밍 중에는 감춘다 */}
      {actions && <ActionBar plain={plain} />}
    </div>
  )
}
