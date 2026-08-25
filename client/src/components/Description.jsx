import { asList, endSentence } from '../lib/format'

// 원문 설명이 반점 나열이면 항목으로 끊어 보여 주고, 문장이면 문장 그대로 읽힌다.
// 반점 떡칠과 잘린 말줄임을 화면에 그대로 내보내지 않기 위한 한 곳의 규칙
export default function Description({ text, className = '', size = 'md' }) {
  const items = asList(text)

  if (items) {
    return (
      <ul className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((it) => (
          <li key={it}
            className="inline-flex items-center h-8 px-3 rounded-full bg-bg-mute
                         font-pretendard font-medium text-[13px] md:text-[14px] text-text-pri">
            {it}
          </li>
        ))}
      </ul>
    )
  }

  const t = endSentence(text)
  if (!t) return null
  return (
    <p className={`font-pretendard font-normal text-pretty
                   ${size === 'lg' ? 'text-[15px] md:text-[16px]' : 'text-[14px] md:text-[15px]'}
                   text-text-sec leading-relaxed ${className}`}>
      {t}
    </p>
  )
}
