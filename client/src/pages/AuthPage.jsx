import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuthStore } from '../store/useAuthStore'

const FIELD = 'w-full h-12 lg:h-14 px-4 rounded-lg bg-bg-card font-pretendard text-[15px] text-text-pri placeholder:text-text-ter outline-none focus:ring-2 focus:ring-primary transition-shadow duration-150'

export default function AuthPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/'

  // 프로토타입. 서버와 DB 없이 클라이언트 상태로만 로그인한다. 아무 값이나 통과한다
  const onSubmit = (e) => {
    e.preventDefault()
    const id = userId.trim() || '게스트'
    const mockUser = {
      id: 'user-' + id,
      name: id,
      membership: null,
      cart: [],
      bookmarks: []
    }
    localStorage.setItem('goun_user', JSON.stringify(mockUser))
    login(mockUser)
    navigate(redirect, { replace: true })
  }

  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12
                    max-w-[440px]
                    py-12 lg:py-20">
      <Helmet>
        <title>로그인 | 동해사이</title>
      </Helmet>

      <h1 className="font-pretendard font-bold
                     text-[24px] md:text-[28px] text-text-pri tracking-[-0.02em] leading-tight">
        로그인
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[14px] md:text-[15px] text-text-meta">
        아이디와 비밀번호로 들어오세요
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input className={FIELD} placeholder="아이디" aria-label="아이디"
               value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input className={FIELD} type="password" placeholder="비밀번호" aria-label="비밀번호"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit"
                className="w-full h-12 lg:h-14 px-6
                           bg-primary text-white
                           font-pretendard font-medium text-[16px]
                           rounded-lg
                           hover:bg-primary-hover
                           transition-colors duration-150">
          로그인
        </button>
      </form>

      <p className="mt-6 font-pretendard font-normal text-[12px] text-text-meta text-center leading-relaxed">
        프로토타입 로그인입니다. 아무 값이나 넣어도 들어갈 수 있어요
      </p>
    </div>
  )
}
