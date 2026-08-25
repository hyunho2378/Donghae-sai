import { NavLink } from 'react-router-dom'

// 굿즈 삭제. 로컬 자원과 여행 코스를 분리. 동해사이는 브랜드 소개(About)로 이름을 옮겼다
const ITEMS = [
  { to: '/stays', label: '로컬 자원' },
  { to: '/packages', label: '여행 코스' },
  { to: '/story', label: '동해 스토리' },
  { to: '/membership', label: '패스' },
  { to: '/about', label: '동해사이' }
]

export default function NavMenu({ vertical = false, onClick }) {
  return (
    <nav className={vertical ? 'flex flex-col gap-4' : 'hidden lg:flex items-center gap-7'}>
      {ITEMS.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          onClick={onClick}
          className={({ isActive }) =>
            `font-pretendard font-medium text-[15px] tracking-[-0.01em]
             transition-colors duration-100
             ${isActive ? 'text-primary' : 'text-text-pri hover:text-primary'}`
          }>
          {it.label}
        </NavLink>
      ))}
    </nav>
  )
}
