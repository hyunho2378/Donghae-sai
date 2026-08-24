import { Link } from 'react-router-dom'

// 프로그램은 동해 사이 안으로 합쳐졌다. 독립 항목이 아니라 동해 사이 하위 링크로 둔다
const MENU = [
  { to: '/story', label: '동해 스토리' },
  { to: '/stays', label: '동해 사이', sub: { to: '/packages', label: '프로그램' } },
  { to: '/goods', label: '굿즈' },
  { to: '/membership', label: '패스' }
]

// 공공 협력 사업. 개인 사업이 아니다
const PARTNERS = ['동해시청 관광과', '동해문화관광재단']

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container-page
                      py-10 lg:py-12">
        {/* 상단. 로고와 태그라인, 메뉴 한 줄 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <img src="/images/logo/logo-wordmark.svg" alt="동해사이" className="h-6 w-auto" />
            <p className="mt-3 font-pretendard font-light text-[13px] text-white/70">
              머무는 여행, 이어지는 동해
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {MENU.map((m) => (
              <div key={m.to} className="flex flex-col gap-1">
                <Link to={m.to}
                      className="font-pretendard font-semibold text-[14px] text-white/90
                                 hover:text-white transition-colors duration-100">
                  {m.label}
                </Link>
                {m.sub && (
                  <Link to={m.sub.to}
                        className="font-pretendard font-normal text-[13px] text-white/55
                                   hover:text-white/80 transition-colors duration-100">
                    {m.sub.label}
                  </Link>
                )}
              </div>
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
