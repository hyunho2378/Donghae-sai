import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" aria-label="동해사이 홈" className="inline-flex items-center leading-none">
      <span className="font-pretendard font-bold text-[18px] lg:text-[20px] tracking-[-0.02em] text-text-pri">
        동해사이
      </span>
    </Link>
  )
}
