// KAREUM_MIRROR 2-1. 좌 제목, 가운데 긴 구분선, 우 개수
// 기존 SectionHeader는 전체보기 화살표용으로 남긴다
export default function KareumHeader({ title, count, countLabel = '' }) {
  return (
    <header className="flex items-center">
      <h2 className="type-section-title text-text-pri whitespace-nowrap">
        {title}
      </h2>
      <span aria-hidden="true" className="flex-1 border-t border-border-def mx-4" />
      {count != null && (
        <span className="font-pretendard font-medium text-[13px] text-text-meta whitespace-nowrap tabular-nums">
          {count}{countLabel}
        </span>
      )}
    </header>
  )
}
