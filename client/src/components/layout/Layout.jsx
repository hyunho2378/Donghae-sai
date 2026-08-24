import { Outlet, useLocation } from 'react-router-dom'
import TopNav from '../nav/TopNav'
import Footer from './Footer'
import SovereignChat from '../SovereignChat'

export default function Layout() {
  // 홈은 히어로 자체가 챗봇이다. FAB와 푸터를 숨겨 한 화면에 고정한다
  const isHome = useLocation().pathname === '/'

  return (
    <div className={`${isHome ? 'h-screen' : 'min-h-screen'} bg-white flex flex-col`}>
      <TopNav />
      <main className="flex-1 min-h-0 flex flex-col">
        <Outlet />
      </main>
      {!isHome && <SovereignChat />}
      {!isHome && <Footer />}
    </div>
  )
}
