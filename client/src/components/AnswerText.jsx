import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { sourceLabel } from '../hooks/useSovereignChat'

// 별표 두 개로 감싼 구간만 굵게 그린다. 짝이 안 맞으면 그대로 둔다
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-bold text-text-strong">{part.slice(2, -2)}</strong>
      : part
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

export default function AnswerText({ text, sources = [], links = {}, showSources = true, compact = false }) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  if (paragraphs.length === 0) return null
  const slots = assignSources(paragraphs, showSources ? sources : [], links)

  const size = compact ? 'text-[14px]' : 'text-[15px] lg:text-[16px]'

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {paragraphs.map((para, i) => (
        <div key={i}>
          <p className={`font-pretendard font-normal ${size} text-text-pri
                         tracking-[-0.01em] leading-relaxed whitespace-pre-wrap text-pretty`}>
            {renderInline(para)}
          </p>
          {slots[i].length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {slots[i].map((s) => <Chip key={s.id} label={s.label} link={s.link} />)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
