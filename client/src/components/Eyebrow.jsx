// 전 페이지 공용 아이브로우. 크기와 굵기와 자간을 여기 한 곳에서만 정한다.
// 페이지마다 11~13px에 medium 으로 제각각이던 값을 하나로 모았다. 축소 변형 금지
const TONE = {
  primary: 'text-primary',
  accent: 'text-accent',
  meta: 'text-text-meta',
  light: 'text-white/85'
}

export default function Eyebrow({ tone = 'primary', as: Tag = 'p', className = '', children }) {
  return (
    <Tag className={`font-pretendard font-semibold uppercase
                     text-[13px] md:text-[14px] tracking-[0.12em] leading-none
                     ${TONE[tone] || TONE.primary} ${className}`}>
      {children}
    </Tag>
  )
}
