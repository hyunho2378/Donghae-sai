import { Search } from 'lucide-react'

export default function SearchBar({ compact = false, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="검색창 열기"
      className={`flex items-center gap-2 bg-bg-card rounded-full text-left
                  ${compact ? 'h-10 px-4 w-full' : 'h-12 px-5 w-full max-w-[480px]'}`}>
      <Search size={compact ? 18 : 20} className="text-text-meta shrink-0" />
      <span className="flex-1 font-pretendard font-normal text-[14px] md:text-[15px]
                        text-text-ter">
        어디로 떠날까요
      </span>
    </button>
  )
}
