import { Link } from 'react-router-dom'

// 프로그램은 동해 사이 안으로 합쳐졌다. 푸터 메뉴에는 네 갈래만 둔다
const MENU = [
  { to: '/story', label: '동해 스토리' },
  { to: '/stays', label: '동해 사이' },
  { to: '/goods', label: '굿즈' },
  { to: '/membership', label: '패스' }
]

// 공공 협력 사업. 개인 사업이 아니다
const PARTNERS = ['동해시청 관광과', '동해문화관광재단']

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-white">
      <div className="container-page py-12 lg:py-14">
        {/* 상단. 좌측 로고와 태그라인, 우측 세로 메뉴 */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" aria-label="동해사이 홈" className="inline-flex items-center">
              <img src="/images/logo/logo-wordmark.svg" alt="동해사이" className="h-7 lg:h-8 w-auto" />
            </Link>
            <p className="mt-4 font-pretendard font-medium text-[14px] text-white/80">
              머무는 여행, 이어지는 동해
            </p>
          </div>

          <nav aria-label="푸터 메뉴" className="flex flex-col gap-1">
            {MENU.map((m) => (
              <Link key={m.to} to={m.to}
                    className="inline-flex items-center min-h-11 -my-0.5
                               font-pretendard font-semibold text-[15px] text-white/90
                               hover:text-white
                               transition-colors duration-100 motion-reduce:transition-none">
                {m.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 하단. 협력 기관과 법적 고지 */}
        <div className="mt-10 pt-6 border-t border-white/15
                        flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="font-pretendard font-normal text-[13px] text-white/70 space-y-1">
            <p>공공 협력 기관 {PARTNERS.join(', ')}</p>
            <p>강원특별자치도 동해시</p>
            <p>이메일 hello@donghaesai.kr</p>
          </div>
          <Link to="/privacy"
                className="inline-flex items-center min-h-11
                           font-pretendard font-semibold text-[13px] text-white/85 hover:text-white
                           transition-colors duration-100 motion-reduce:transition-none">
            개인정보처리방침
          </Link>
        </div>

        <p className="mt-4 font-pretendard font-normal text-[12px] text-white/60">
          © 2026 동해사이. 공공 협력 사업
        </p>
      </div>
    </footer>
  )
}
