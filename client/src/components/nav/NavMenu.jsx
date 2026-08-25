import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/stays', label: '동해 사이' },
  { to: '/story', label: '동해 스토리' },
  { to: '/membership', label: '패스' },
  { to: '/goods', label: '굿즈' }
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
