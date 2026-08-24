import { Link } from 'react-router-dom'

const MENU = [
  { to: '/story', label: '동해 스토리' },
  { to: '/stays', label: '동해 사이' },
  { to: '/packages', label: '프로그램' },
  { to: '/goods', label: '굿즈' },
  { to: '/membership', label: '패스' }
]

// 공공 협력 사업. 개인 사업이 아니다
const PARTNERS = ['동해시청 관광과', '동해문화관광재단']

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto w-full
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                      max-w-[1400px] 2xl:max-w-[1600px]
                      py-10 lg:py-12">
        {/* 상단. 로고와 태그라인, 메뉴 한 줄 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-pretendard font-bold text-[18px] tracking-[-0.02em]">
              <span className="text-accent">동해</span><span className="text-primary">사이</span>
            </p>
            <p className="mt-2 font-pretendard font-light text-[13px] text-white/70">
              머무는 여행, 이어지는 동해
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {MENU.map((m) => (
              <Link key={m.to} to={m.to}
                    className="font-pretendard font-medium text-[14px] text-white/80
                               hover:text-white transition-colors duration-100">
                {m.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 하단. 협력 기관과 법적 고지 */}
        <div className="mt-8 pt-6 border-t border-white/10
                        flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="font-pretendard font-light text-[12px] text-white/60 space-y-1">
            <p>공공 협력 기관 {PARTNERS.join(', ')}</p>
            <p>강원특별자치도 동해시</p>
            <p>이메일 hello@donghaesai.kr</p>
          </div>
          <div className="flex items-center gap-4 font-pretendard font-medium text-[12px] text-white/70">
            <span className="font-light text-white/50">이용약관</span>
            <Link to="/privacy" className="hover:text-white transition-colors duration-100">
              개인정보처리방침
            </Link>
          </div>
        </div>

        <p className="mt-4 font-pretendard font-light text-[12px] text-white/50">
          © 2026 동해사이. 공공 협력 사업
        </p>
      </div>
    </footer>
  )
}
