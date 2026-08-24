import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SectionHeader({ title, subtitle, to }) {
  return (
    <header className="flex items-end justify-between mb-6 lg:mb-8">
      <div>
        <h2 className="font-pretendard font-bold
                       text-[20px] md:text-[22px] lg:text-[24px] 4xl:text-[28px]
                       text-text-pri tracking-[-0.02em]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 font-pretendard font-normal text-[14px] md:text-[15px] text-text-meta">
            {subtitle}
          </p>
        )}
      </div>
      {to && (
        <Link to={to} aria-label="전체 보기"
              className="w-10 h-10 rounded-full hover:bg-bg-card
                         inline-flex items-center justify-center
                         transition-colors duration-150">
          <ChevronRight size={24} className="text-text-pri" />
        </Link>
      )}
    </header>
  )
}
