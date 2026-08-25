import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Ticket, Bookmark, CalendarCheck } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { getBookmarkIds } from '../hooks/useBookmark'
import staysData from '../data/stays.json'
import StayCard from '../components/card/StayCard'
import Eyebrow from '../components/Eyebrow'

const MEMBERSHIP_LABEL = { basic: '베이직', premium: '프리미엄', family: '패밀리' }

export default function MyPage() {
  const user = useAuthStore((s) => s.user)
  const savedIds = getBookmarkIds('stays')
  const saved = staysData.filter((s) => savedIds.includes(s.id)).slice(0, 4)
  const membership = user?.membership ? (MEMBERSHIP_LABEL[user.membership] || user.membership) : '미구독'

  const LINKS = [
    { to: '/pass', Icon: Ticket, title: '내 패스', desc: '스탬프와 방문 기록' },
    { to: '/bookmarks', Icon: Bookmark, title: '저장한 장소', desc: `${savedIds.length}곳 저장됨` },
    { to: '#reservations', Icon: CalendarCheck, title: '예약 내역', desc: '예약과 결제 기록' }
  ]

  return (
    <div className="page-enter container-page py-8 lg:py-12">
      <Helmet>
        <title>마이페이지 | 동해사이</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* 프로필 */}
      <Eyebrow>내 여행</Eyebrow>
      <section className="mt-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-soft
                        flex items-center justify-center
                        font-pretendard font-bold text-[22px] text-primary-hover">
          {(user?.name || '동').slice(0, 1)}
        </div>
        <div>
          <h1 className="type-page-title text-text-pri">
            {user?.name || '동해 여행자'}
          </h1>
          <p className="mt-1 font-pretendard font-semibold text-[14px] text-primary-hover">
            패스 {membership}
          </p>
        </div>
      </section>

      {/* 내 패스 카드. pass.png를 실물 카드처럼 보여준다 */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-2xl bg-accent-soft
                        shadow-float p-6 flex items-center gap-5">
          <img src="/images/pass/pass.png" alt="동해사이 패스 카드"
            className="w-[96px] h-auto shrink-0" />
          <div className="min-w-0">
            <p className="font-pretendard font-semibold text-[13px] text-accent tracking-[0.04em]">
              동해사이 패스
            </p>
            <p className="mt-1 font-pretendard font-bold text-[19px] md:text-[21px] text-text-pri">
              {membership === '미구독' ? '아직 패스가 없어요' : `${membership} 이용 중`}
            </p>
            <Link to="/pass"
              className="mt-3 inline-flex items-center min-h-11 md:min-h-10 px-4 rounded-full
                             bg-accent text-white
                             font-pretendard font-semibold text-[13px]
                             hover:bg-accent-hover active:scale-[0.96]
                             transition-[background-color,transform] duration-150 motion-reduce:transition-none">
              내 패스 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 바로가기 */}
      <div className="mt-8 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
        {LINKS.map(({ to, Icon, title, desc }) => (
          <Link key={title} to={to}
            className="bg-white shadow-depth rounded-2xl p-5">
            <Icon size={24} strokeWidth={2} className="text-primary-hover" />
            <p className="mt-3 font-pretendard font-bold text-[16px] text-text-pri">{title}</p>
            <p className="mt-1 font-pretendard font-medium text-[13px] text-text-sec tabular-nums">{desc}</p>
          </Link>
        ))}
      </div>

      {/* 저장한 장소 */}
      <section className="mt-12">
        <h2 className="type-section-title text-text-pri mb-4">
          저장한 장소
        </h2>
        {saved.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {saved.map((s) => <StayCard key={s.id} {...s} />)}
          </div>
        ) : (
          <p className="font-pretendard font-normal text-[14px] text-text-sec">
            아직 저장한 장소가 없어요. 마음에 드는 곳을 저장해 보세요
          </p>
        )}
      </section>

      {/* 예약 내역 */}
      <section id="reservations" className="mt-12 scroll-mt-24">
        <h2 className="type-section-title text-text-pri mb-4">
          예약 내역
        </h2>
        <p className="font-pretendard font-normal text-[14px] text-text-sec">
          아직 예약 내역이 없어요
        </p>
      </section>
    </div>
  )
}
