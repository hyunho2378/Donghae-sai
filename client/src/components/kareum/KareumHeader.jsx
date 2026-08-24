// KAREUM_MIRROR 2-1. 좌 제목, 가운데 긴 구분선, 우 개수
// 기존 SectionHeader는 전체보기 화살표용으로 남긴다
export default function KareumHeader({ title, count, countLabel = '' }) {
  return (
    <header className="flex items-center">
      <h2 className="font-pretendard font-bold
                     text-[20px] md:text-[24px]
                     tracking-[-0.02em] text-text-pri whitespace-nowrap">
        {title}
      </h2>
      <span aria-hidden="true" className="flex-1 border-t border-border-def mx-4" />
      {count != null && (
        <span className="font-pretendard font-medium text-[13px] text-text-meta whitespace-nowrap">
          {count}{countLabel}
        </span>
      )}
    </header>
  )
}
