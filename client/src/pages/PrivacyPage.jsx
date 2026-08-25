import { Helmet } from 'react-helmet-async'
import { BRAND_HEX } from '../lib/designTokens'

// 공공 협력 사업 개인정보처리방침. 확정 문안 도착 전까지 표준 골격으로 둔다
const SECTIONS = [
  {
    title: '1. 수집하는 개인정보 항목',
    body: '동해사이는 회원 가입과 패스 발급, 예약 처리에 필요한 최소한의 정보만 수집합니다. 이메일, 닉네임, 예약 일정, 결제 확인 정보가 이에 해당합니다. 민감정보는 수집하지 않습니다.'
  },
  {
    title: '2. 개인정보의 이용 목적',
    body: '수집한 정보는 회원 식별, 패스와 예약 서비스 제공, 고객 문의 응대, 서비스 개선을 위한 통계 분석에만 사용합니다. 목적 외 용도로 이용하지 않습니다.'
  },
  {
    title: '3. 개인정보의 보유 및 이용 기간',
    body: '이용 목적이 달성되면 지체 없이 파기합니다. 관계 법령이 정한 기간이 있는 경우 그 기간 동안 보관한 뒤 파기합니다.'
  },
  {
    title: '4. 개인정보의 제3자 제공',
    body: '이용자의 동의가 있거나 법령에 근거가 있는 경우를 제외하고 개인정보를 외부에 제공하지 않습니다. 공공 협력 기관과는 통계 형태로만 데이터를 공유합니다.'
  },
  {
    title: '5. 이용자의 권리',
    body: '이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제하거나 처리 정지를 요청할 수 있습니다. 요청은 아래 문의처로 접수해 주세요.'
  }
]

const SECTION = 'container-page'

export default function PrivacyPage() {
  return (
    <div className="page-enter">
      <Helmet>
        <title>개인정보처리방침 | 동해사이</title>
        <meta name="description" content="동해사이 개인정보처리방침. 동해시청 관광과와 동해문화관광재단이 함께하는 공공 협력 사업." />
        <meta name="theme-color" content={BRAND_HEX.primary} />
      </Helmet>

      <div className={`${SECTION} pt-10 lg:pt-16 pb-16 lg:pb-24`}>
        <h1 className="type-page-title text-text-pri">
          개인정보처리방침
        </h1>
        <p className="mt-3 font-pretendard font-normal text-[14px] md:text-[15px] text-text-sec leading-relaxed">
          동해사이는 동해시청 관광과와 동해문화관광재단이 함께하는 공공 협력 사업입니다.
          이용자의 개인정보를 소중히 다루며 관계 법령을 준수합니다.
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="type-section-title text-text-pri">
                {s.title}
              </h2>
              <p className="mt-2 font-pretendard font-normal text-[14px] md:text-[15px] text-text-sec leading-relaxed tracking-[-0.01em]">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border-sub">
          <h2 className="type-section-title text-text-pri">
            문의처
          </h2>
          <div className="mt-2 font-pretendard font-normal text-[14px] md:text-[15px] text-text-sec leading-relaxed space-y-1">
            <p>강원특별자치도 동해시</p>
            <p>이메일 hello@donghaesai.kr</p>
          </div>
        </div>
      </div>
    </div>
  )
}
