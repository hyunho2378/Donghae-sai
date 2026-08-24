import { useState } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import ChoiceCuration from '../components/kareum/ChoiceCuration'
import storiesData from '../data/stories.json'

const TABS = [
  { key: 'ALL', label: '전체' },
  { key: '권역', label: '권역' },
  { key: '사람', label: '사람' },
  { key: '음식', label: '음식' },
  { key: '테마', label: '테마' }
]

export default function StoryListPage() {
  const [tab, setTab] = useState('ALL')
  const items = tab === 'ALL' ? storiesData : storiesData.filter((s) => s.category === tab)

  return (
    <div className="page-enter">
      <div className="mx-auto w-full
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                      max-w-[1400px] 2xl:max-w-[1600px]
                      py-8 lg:py-12">
        <h1 className="font-pretendard font-bold
                       text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                       text-text-pri tracking-[-0.02em] leading-tight">
          이야기
        </h1>
        <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
          권역과 사람과 음식으로 읽는 동해
        </p>

        <div className="mt-6 flex gap-1 border-b border-border-sub overflow-x-auto scrollbar-hide -mx-5 px-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 font-pretendard font-semibold text-[15px] tracking-[0.04em]
                          border-b-2 transition-colors duration-150 whitespace-nowrap
                          ${tab === t.key
                            ? 'text-accent border-accent'
                            : 'text-text-meta border-transparent hover:text-text-pri'}`}>
              {t.label}
              <span className="ml-1.5 font-medium text-[12px] text-text-meta">
                {t.key === 'ALL'
                  ? storiesData.length
                  : storiesData.filter((s) => s.category === t.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:gap-8
                        grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <RevealOnScroll key={s.id}>
              <Link to={`/story/${s.slug}`} className="group block">
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-card">
                    <img
                      src={s.cover_image}
                      alt={s.title}
                      className="w-full h-full object-cover
                                 transition-transform duration-[600ms] ease-out
                                 group-hover:scale-[1.04]" />
                    <span className="absolute top-3 left-3
                                     h-[26px] px-2.5
                                     bg-accent text-white
                                     font-pretendard font-semibold text-[12px] tracking-[0.04em]
                                     rounded-md inline-flex items-center">
                      {s.category}
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="font-pretendard font-light text-[12px] text-text-meta">
                      {s.spots?.length ? `스팟 ${s.spots.length}곳` : ''}{s.tags?.[0] ? ` ${s.tags[0]}` : ''}
                    </p>
                    <h3 className="mt-1 font-pretendard font-bold
                                   text-[17px] md:text-[18px] lg:text-[19px]
                                   text-text-strong tracking-[-0.02em] leading-snug
                                   line-clamp-2">
                      {s.title}
                    </h3>
                    <p className="mt-1 font-pretendard font-normal text-[14px] text-text-sec
                                   leading-relaxed line-clamp-2">
                      {s.subtitle?.replace(/\n/g, ' ')}
                    </p>
                    <p className="mt-2 font-pretendard font-medium text-[13px] text-text-meta">
                      {s.author}
                    </p>
                  </div>
                </article>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <ChoiceCuration />
    </div>
  )
}
