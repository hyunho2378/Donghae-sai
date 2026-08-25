import { useState } from 'react'
import JournalCard from '../components/card/JournalCard'
import journalData from '../data/journal.json'
import { JOURNAL_CATEGORY_LABEL } from '../lib/format'

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'travel', label: JOURNAL_CATEGORY_LABEL.travel },
  { key: 'magazine', label: JOURNAL_CATEGORY_LABEL.magazine },
  { key: 'pick', label: JOURNAL_CATEGORY_LABEL.pick }
]

export default function JournalPage() {
  const [tab, setTab] = useState('all')
  const items = tab === 'all' ? journalData : journalData.filter((j) => j.category === tab)

  return (
    <div className="page-enter container-page
                    py-8 lg:py-12">
      <h1 className="type-page-title text-text-pri">
        저널
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec">
        호스트 인터뷰, 마을 이야기, 운영팀의 큐레이션
      </p>

      <div className="mt-6 flex gap-6 border-b border-border-sub overflow-x-auto scrollbar-hide -mx-5 px-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`min-w-11 min-h-11 px-2 inline-flex items-center justify-center
                        font-pretendard font-semibold text-[15px] tracking-[0.02em]
                        border-b-2 transition-colors duration-150 whitespace-nowrap
                        ${tab === t.key
                          ? 'text-accent border-accent'
                          : 'text-text-meta border-transparent hover:text-text-pri'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 lg:mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((j) => <JournalCard key={j.id} {...j} />)}
      </div>
    </div>
  )
}
