import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import SovereignHero from '../components/SovereignHero'

export default function HomePage() {
  // 로고를 눌러 홈으로 다시 오면 히어로를 초기 상태로 되돌린다
  const location = useLocation()

  return (
    <div className="page-enter flex-1 min-h-0 flex flex-col">
      <Helmet>
        <title>동해사이 | 하루와 하루 사이, 동해</title>
        <meta name="description" content="흩어진 동해의 장소와 경험을 이어 하루 더 머무는 여행을 만든다. 추암 무릉 천곡 묵호 망상 5개 권역과 동해사이 패스." />
        <meta property="og:title" content="동해사이 | 하루와 하루 사이, 동해" />
        <meta property="og:description" content="당일에서 1박으로. 동해사이가 흩어진 장소를 잇는다." />
        <meta property="og:image" content="/images/regions/mukho.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#60A5FA" />
      </Helmet>
      <SovereignHero key={location.key} />
    </div>
  )
}
