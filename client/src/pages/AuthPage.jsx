import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../components/Input'
import Select from '../components/Select'
import { useAuthStore } from '../store/useAuthStore'
import { ROLE_LABEL } from '../lib/format'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('walk2030')
  const [error, setError] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/'

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.includes('@')) { setError('올바른 이메일을 입력하세요.'); return }
    if (password.length < 4) { setError('비밀번호는 4자 이상이어야 합니다.'); return }
    const mockUser = {
      id: 'user-' + email.split('@')[0],
      name: name || email.split('@')[0],
      email,
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
                    max-w-[480px]
                    py-12 lg:py-20">
      <h1 className="font-pretendard font-bold
                     text-[24px] md:text-[28px] text-text-pri tracking-[-0.02em] leading-tight">
        {mode === 'login' ? '로그인' : '가입하기'}
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[14px] md:text-[15px] text-text-meta">
        {mode === 'login' ? '이메일과 비밀번호로 들어오세요' : '역할을 골라 가입을 시작합니다'}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === 'signup' && (
          <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <Input label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {mode === 'signup' && (
          <Select
            label="여행 유형"
            value={role}
            onChange={setRole}
            options={Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }))} />
        )}
        {error && (
          <p className="font-pretendard font-normal text-[13px] text-[#DC2626]">{error}</p>
        )}
        <button type="submit"
                className="w-full h-12 lg:h-14 px-6
                           bg-primary text-white
                           font-pretendard font-medium text-[16px]
                           rounded-lg
                           hover:bg-primary-hover
                           transition-colors duration-150">
          {mode === 'login' ? '로그인' : '가입 완료'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        className="mt-6 w-full font-pretendard font-medium text-[14px] text-text-sec hover:text-text-pri transition-colors duration-100">
        {mode === 'login' ? '계정이 없으신가요. 가입하기' : '이미 계정이 있으신가요. 로그인'}
      </button>
    </div>
  )
}
