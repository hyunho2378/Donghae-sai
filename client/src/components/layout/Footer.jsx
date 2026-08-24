import { Link } from 'react-router-dom'

const QUICK = [
  { to: '/stays', label: '사이 찾기' },
  { to: '/packages', label: '코스' },
  { to: '/story', label: '이야기' },
  { to: '/goods', label: '굿즈' },
  { to: '/membership', label: '패스' }
]
const OPS = [
  { type: 'link', to: '/about', label: '회사 소개' },
  { type: 'mute', label: '호스트 가입 (준비중)' },
  { type: 'mail', href: 'mailto:hello@donghaesai.kr', label: '고객 문의' },
  { type: 'mail', href: 'mailto:hello@donghaesai.kr', label: '제휴 문의' }
]
const LEGAL = ['이용약관', '개인정보처리방침', '사업자 정보']

// 사업자 정보는 원본 확인 전까지 확인 안 됨으로 둔다
const COMPANY_INFO = [
  '상호: 동해사이',
  '사업자등록번호: 확인 안 됨',
  '대표: 확인 안 됨',
  '주소: 강원특별자치도 동해시',
  '이메일: hello@donghaesai.kr'
]

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto w-full
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                      max-w-[1400px] 2xl:max-w-[1600px]
                      py-10 lg:py-16">
        <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-4">
          <div>
            <p className="font-pretendard font-bold text-[18px] tracking-[-0.02em]">
              동해사이
            </p>
            <p className="mt-1 font-pretendard font-medium text-[13px] tracking-[-0.02em] text-white/80">
              donghae sai
            </p>
            <p className="mt-3 font-pretendard font-light text-[13px] text-white/70 leading-relaxed">
              흩어진 장소를 이어 하루 더 머무는 여행을 만든다
            </p>
          </div>
          <div>
            <p className="font-pretendard font-medium text-[14px] mb-4">바로가기</p>
            <ul className="space-y-2 font-pretendard font-normal text-[14px] text-white/80">
              {QUICK.map((q) => (
                <li key={q.label}>
                  <Link to={q.to} className="hover:text-white transition-colors duration-100">{q.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-pretendard font-medium text-[14px] mb-4">운영</p>
            <ul className="space-y-2 font-pretendard font-normal text-[14px] text-white/80">
              {OPS.map((o, i) => (
                <li key={i}>
                  {o.type === 'link' && (
                    <Link to={o.to} className="hover:text-white transition-colors duration-100">{o.label}</Link>
                  )}
                  {o.type === 'mail' && (
                    <a href={o.href} className="hover:text-white transition-colors duration-100">{o.label}</a>
                  )}
                  {o.type === 'mute' && (
                    <span className="text-white/50 cursor-default">{o.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-pretendard font-medium text-[14px] mb-4">법적 고지</p>
            <ul className="space-y-2 font-pretendard font-normal text-[14px] text-white/80">
              {LEGAL.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10
                        font-pretendard font-light text-[12px] text-white/60
                        grid gap-y-1 gap-x-6 md:grid-cols-2">
          {COMPANY_INFO.map((line) => <p key={line}>{line}</p>)}
        </div>
        <p className="mt-4 font-pretendard font-light text-[12px] text-white/50">
          © 2026 동해사이. 강원특별자치도 동해시
        </p>
      </div>
    </footer>
  )
}
