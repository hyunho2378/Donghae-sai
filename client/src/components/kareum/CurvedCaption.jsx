// KAREUM_MIRROR 2-4. 블롭 사진 위 곡선 카피. viewBox 기준이라 폭이 바뀌어도 비율이 유지된다
export default function CurvedCaption({ id, text, className = 'text-white' }) {
  if (!text) return null
  const pathId = `curved-caption-${id}`
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"
         className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      <path id={pathId} d="M 52 148 Q 200 82 348 148" fill="none" />
      <text fill="currentColor" fontWeight="500" fontSize="18" letterSpacing="-0.4"
            className="font-pretendard">
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}
