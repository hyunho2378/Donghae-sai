import { Link } from 'react-router-dom'

// 프로그램은 동해 사이 안으로 합쳐졌다. 푸터 메뉴에는 네 갈래만 둔다
const MENU = [
  { to: '/stays', label: '로컬 자원' },
  { to: '/packages', label: '여행 코스' },
  { to: '/story', label: '동해 스토리' },
  { to: '/membership', label: '패스' },
  { to: '/about', label: '동해사이' }
]

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-white">
      <div className="container-page py-8 lg:py-10">
        {/* 한 줄 가로 배치. 세로로 자리를 잡아먹지 않는다 */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6 flex-wrap">
            <Link to="/" aria-label="동해사이 홈" className="inline-flex items-center shrink-0">
              <img src="/images/logo/logo-wordmark.svg" alt="동해사이" className="h-6 lg:h-7 w-auto" />
            </Link>
            <nav aria-label="푸터 메뉴" className="flex items-center gap-5 flex-wrap">
              {MENU.map((m) => (
                <Link key={m.to} to={m.to}
                  className="inline-flex items-center min-h-11
                                 font-pretendard font-semibold text-[14px] text-white/90
                                 hover:text-white
                                 transition-colors duration-100 motion-reduce:transition-none">
                  {m.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-wrap
                          font-pretendard font-normal text-[12px] text-white/70">
            <span>강원특별자치도 동해시</span>
            <span aria-hidden="true" className="w-px h-3 bg-white/20" />
            <span>hello@donghaesai.kr</span>
            <span aria-hidden="true" className="w-px h-3 bg-white/20" />
            <Link to="/privacy" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center min-h-11
                             font-pretendard font-semibold text-white/85 hover:text-white
                             transition-colors duration-100 motion-reduce:transition-none">
              개인정보처리방침
            </Link>
          </div>
        </div>

        <p className="mt-4 pt-4 border-t border-white/10
                      font-pretendard font-normal text-[12px] text-white/55">
          © 2026 동해사이. 공공 협력 사업
        </p>
      </div>
    </footer>
  )
}
