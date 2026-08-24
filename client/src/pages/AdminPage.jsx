import { formatPrice, formatDate } from '../lib/format'

const TODAY_RES = [
  { id: 'a1', stay: '논골담길', guest: '김도윤', checkIn: '2026-05-07', guests: 2, status: '태그' },
  { id: 'a2', stay: '묵호등대', guest: '유서진', checkIn: '2026-05-07', guests: 1, status: '완료' },
  { id: 'a3', stay: '무릉별유천지', guest: '정수아', checkIn: '2026-05-07', guests: 4, status: '태그' }
]

const SUMMARY = [
  { label: '오늘 매출', value: 1480000 },
  { label: '주간 매출', value: 8230000 },
  { label: '월간 매출', value: 32140000 }
]

export default function AdminPage() {
  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">
      <h1 className="font-pretendard font-bold
                     text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                     text-text-pri tracking-[-0.02em] leading-tight">
        운영 대시보드
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
        오늘 입실, 매출, 호스트 정산 현황
      </p>

      <section className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-3">
        {SUMMARY.map((s) => (
          <div key={s.label} className="shadow-card rounded-xl p-5">
            <p className="font-pretendard font-medium text-[14px] text-text-meta">{s.label}</p>
            <p className="mt-2 font-pretendard font-bold text-[24px] text-text-pri">{formatPrice(s.value)}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-pretendard font-bold text-[20px] md:text-[22px] lg:text-[24px] text-text-pri tracking-[-0.02em] mb-4">
          오늘 예약 현황
        </h2>
        <div className="overflow-x-auto shadow-card rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-sub bg-bg-card">
                <th className="px-5 py-3 font-pretendard font-medium text-[13px] text-text-meta">거점</th>
                <th className="px-5 py-3 font-pretendard font-medium text-[13px] text-text-meta">게스트</th>
                <th className="px-5 py-3 font-pretendard font-medium text-[13px] text-text-meta">날짜</th>
                <th className="px-5 py-3 font-pretendard font-medium text-[13px] text-text-meta">인원</th>
                <th className="px-5 py-3 font-pretendard font-medium text-[13px] text-text-meta">상태</th>
              </tr>
            </thead>
            <tbody>
              {TODAY_RES.map((r) => (
                <tr key={r.id} className="border-b border-border-sub last:border-b-0">
                  <td className="px-5 py-4 font-pretendard font-medium text-[15px] text-text-pri">{r.stay}</td>
                  <td className="px-5 py-4 font-pretendard font-normal text-[15px] text-text-sec">{r.guest}</td>
                  <td className="px-5 py-4 font-pretendard font-light text-[14px] text-text-meta">{formatDate(r.checkIn)}</td>
                  <td className="px-5 py-4 font-pretendard font-normal text-[15px] text-text-sec">{r.guests}명</td>
                  <td className="px-5 py-4">
                    <span className="font-pretendard font-medium text-[12px] text-primary bg-primary-soft px-2.5 py-1 rounded-md">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
