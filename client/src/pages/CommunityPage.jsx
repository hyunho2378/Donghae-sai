import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, ThumbsUp, MessageCircle, Pencil, TrendingUp, Calendar } from 'lucide-react'
import communityData from '../data/community.json'
import { useAuthStore } from '../store/useAuthStore'
import { formatDate } from '../lib/format'

const TABS = [
  { key: 'all', label: '전체' },
  { key: '모임', label: '모임' },
  { key: '후기', label: '후기' },
  { key: '질문', label: '질문' }
]

const CATEGORY_COLOR = {
  '모임': 'bg-primary-soft text-primary',
  '후기': 'bg-[#FEF3C7] text-[#92400E]',
  '질문': 'bg-[#E0E7FF] text-[#3730A3]'
}

const STAGE_COLOR = {
  visit: 'bg-bg-card text-text-meta',
  connect: 'bg-primary-soft text-primary',
  relationship: 'bg-[#DCFCE7] text-[#166534]',
  settlement: 'bg-[#FCE7F3] text-[#9D174D]'
}

export default function CommunityPage() {
  const [tab, setTab] = useState('all')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()

  const items = tab === 'all' ? communityData : communityData.filter((p) => p.category === tab)
  const top5 = [...communityData].sort((a, b) => b.views - a.views).slice(0, 5)
  const meetings = communityData.filter((p) => p.category === '모임').slice(0, 4)

  const onWrite = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/community')
      return
    }
    alert('글쓰기 기능은 준비 중입니다.')
  }

  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-pretendard font-bold
                         text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                         text-text-pri tracking-[-0.02em] leading-tight">
            커뮤니티
          </h1>
          <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
            동해사이 이용자 게시판. 준비 중이다
          </p>
        </div>
        <button
          onClick={onWrite}
          className="hidden md:inline-flex items-center gap-2 h-11 px-5
                     bg-primary text-white
                     font-pretendard font-medium text-[14px]
                     rounded-lg hover:bg-primary-hover transition-colors duration-150">
          <Pencil size={16} />
          글쓰기
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex gap-1 border-b border-border-sub overflow-x-auto scrollbar-hide -mx-5 px-5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 font-pretendard font-medium text-[14px] tracking-[0.02em]
                            border-b-2 transition-colors duration-150 whitespace-nowrap
                            ${tab === t.key
                              ? 'text-text-pri border-text-pri'
                              : 'text-text-meta border-transparent hover:text-text-pri'}`}>
                {t.label}
                <span className="ml-1.5 font-light text-[12px] text-text-meta">
                  {t.key === 'all' ? communityData.length : communityData.filter((p) => p.category === t.key).length}
                </span>
              </button>
            ))}
          </div>

          <ul className="mt-2 divide-y divide-border-sub">
            {items.map((p) => (
              <li key={p.id} className="py-5 hover:bg-bg-card -mx-2 px-2 rounded-lg transition-colors duration-150">
              <Link to={`/community/${p.id}`} className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center h-[22px] px-2
                                     font-pretendard font-medium text-[11px] rounded-md
                                     ${CATEGORY_COLOR[p.category]}`}>
                    {p.category}
                  </span>
                  <span className={`inline-flex items-center h-[22px] px-2
                                     font-pretendard font-medium text-[11px] rounded-md
                                     ${STAGE_COLOR[p.authorStage]}`}>
                    {null}
                  </span>
                </div>
                <h3 className="font-pretendard font-bold text-[16px] md:text-[17px] text-text-pri tracking-[-0.02em] leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 font-pretendard font-normal text-[14px] text-text-sec line-clamp-2 leading-relaxed">
                  {p.preview}
                </p>
                <div className="mt-3 flex items-center gap-4 font-pretendard text-[12px] text-text-meta">
                  <span className="font-medium">{p.author}</span>
                  <span className="font-light">{formatDate(p.date)}</span>
                  <span className="ml-auto inline-flex items-center gap-1"><Eye size={14} />{p.views}</span>
                  <span className="inline-flex items-center gap-1"><ThumbsUp size={14} />{p.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle size={14} />{p.comments}</span>
                </div>
              </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={onWrite}
            className="md:hidden mt-8 w-full inline-flex items-center justify-center gap-2 h-12 px-5
                       bg-primary text-white
                       font-pretendard font-medium text-[15px]
                       rounded-lg hover:bg-primary-hover transition-colors duration-150">
            <Pencil size={16} />
            글쓰기
          </button>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[100px] h-fit">
          <div className="shadow-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <p className="font-pretendard font-bold text-[15px] text-text-pri">인기 게시글</p>
            </div>
            <ol className="space-y-3">
              {top5.map((p, i) => (
                <li key={p.id} className="flex items-start gap-3">
                  <span className="font-pretendard font-bold text-[13px] text-primary w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pretendard font-medium text-[13px] text-text-pri line-clamp-2 leading-snug">
                      {p.title}
                    </p>
                    <p className="mt-1 font-pretendard font-light text-[11px] text-text-meta">
                      조회 {p.views}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="shadow-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-primary" />
              <p className="font-pretendard font-bold text-[15px] text-text-pri">이번 주 모임</p>
            </div>
            <ul className="space-y-3">
              {meetings.map((m) => (
                <li key={m.id}>
                  <p className="font-pretendard font-medium text-[13px] text-text-pri line-clamp-2 leading-snug">
                    {m.title}
                  </p>
                  <p className="mt-1 font-pretendard font-light text-[11px] text-text-meta">
                    {formatDate(m.date)} 댓글 {m.comments}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
