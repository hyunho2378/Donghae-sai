import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

const MEMBERSHIP_LABEL = { basic: '베이직', premium: '프리미엄', family: '패밀리' }

export default function IconGroup() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center">
        <Link
          to="/auth"
          className="h-10 px-3 inline-flex items-center gap-1.5
                     font-pretendard font-medium text-[14px] text-text-pri
                     rounded-lg hover:bg-bg-card transition-colors duration-150">
          <User size={18} className="text-text-pri" />
          로그인
        </Link>
      </div>
    )
  }

  const membershipLabel = user?.membership ? (MEMBERSHIP_LABEL[user.membership] || user.membership) : '미구독'

  const onLogout = () => {
    localStorage.removeItem('goun_user')
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <div className="flex items-center gap-1">
      {/* User dropdown */}
      <div ref={ref} className="relative">
        <button
          aria-label="내 계정"
          onClick={() => setOpen(!open)}
          className="w-10 h-10 inline-flex items-center justify-center
                     rounded-full hover:bg-bg-card transition-colors duration-150">
          <User size={20} className="text-text-pri" />
        </button>
        {open && (
          <div className="absolute right-0 top-12 z-50 min-w-[200px]
                          bg-white border border-border-def rounded-xl
                          py-2">
            <div className="px-4 py-3 border-b border-border-sub">
              <p className="font-pretendard font-bold text-[14px] text-text-pri">{user?.name}</p>
              <p className="font-pretendard font-normal text-[12px] text-text-meta">{user?.email}</p>
              <p className="mt-1 font-pretendard font-medium text-[12px] text-primary">
                패스 {membershipLabel}
              </p>
            </div>
            <Link
              to="/mypage"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-pretendard font-medium text-[14px] text-text-pri hover:bg-bg-card">
              마이페이지
            </Link>
            <Link
              to="/pass"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-pretendard font-medium text-[14px] text-text-pri hover:bg-bg-card">
              마이 패스
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2.5 font-pretendard font-medium text-[14px] text-text-pri hover:bg-bg-card">
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
