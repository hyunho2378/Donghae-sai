import { SearchX } from 'lucide-react'

export default function EmptyState({
  icon: Icon = SearchX,
  title = '결과가 없어요',
  description = '조건을 바꿔서 다시 검색해 보세요',
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-24 text-center">
      <Icon size={48} className="text-text-ter" />
      <h3 className="mt-4 font-pretendard font-medium text-[18px] text-text-pri">
        {title}
      </h3>
      <p className="mt-1 font-pretendard font-normal text-[15px] text-text-sec">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
