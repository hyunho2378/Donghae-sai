import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" aria-label="동해사이 홈" className="inline-flex items-center leading-none">
      {/* 동해는 무코 레드, 사이는 동해 블루 */}
      <span className="font-pretendard font-bold text-[18px] lg:text-[20px] tracking-[-0.02em]">
        <span className="text-accent">동해</span><span className="text-primary">사이</span>
      </span>
    </Link>
  )
}
