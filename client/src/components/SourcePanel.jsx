import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

// 우측 출처 카드 패널. 답변 근거가 된 장소 코스 패스 프로그램을 카드로 쌓는다
// 카드 클릭 시 실제 상세페이지로 이동한다. 검증된 link 라우트를 그대로 쓴다
const VISIBLE = 3

export default function SourcePanel({ sources = [] }) {
  const [expanded, setExpanded] = useState(false)
  if (!sources.length) return null

  const shown = expanded ? sources : sources.slice(0, VISIBLE)
  const hidden = sources.length - VISIBLE

  return (
    <div className="space-y-3">
      <p className="font-pretendard font-semibold text-[13px] text-text-meta tracking-[0.02em]">
        이 답변의 근거 {sources.length}
      </p>

      {shown.map((s) => (
        <Link key={s.id} to={s.route}
              className="group block rounded-xl bg-bg-card overflow-hidden
                         hover:bg-bg-mute transition-colors duration-150">
          <div className="flex gap-3 p-3">
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-bg-mute">
              {s.image ? (
                <img src={s.image} alt={s.name} loading="lazy"
                     className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary-soft flex items-center justify-center">
                  <span className="font-pretendard font-bold text-[11px] text-primary">
                    {s.kind || '동해'}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {s.kind && (
                <p className="font-pretendard font-semibold text-[11px] text-primary tracking-[0.02em]">
                  {s.kind}
                </p>
              )}
              <p className="font-pretendard font-bold text-[14px] text-text-pri leading-snug line-clamp-1">
                {s.name}
              </p>
              {s.desc && (
                <p className="mt-0.5 font-pretendard font-normal text-[12px] text-text-sec leading-normal line-clamp-2">
                  {s.desc}
                </p>
              )}
            </div>
            <ArrowUpRight size={16}
                          className="shrink-0 text-text-ter group-hover:text-primary transition-colors duration-150" />
          </div>
        </Link>
      ))}

      {hidden > 0 && (
        <button type="button" onClick={() => setExpanded((v) => !v)}
                className="w-full h-10 rounded-xl bg-bg-card hover:bg-bg-mute
                           font-pretendard font-medium text-[13px] text-text-sec
                           transition-colors duration-150">
          {expanded ? '접기' : `출처 ${sources.length}건 전체보기`}
        </button>
      )}
    </div>
  )
}
