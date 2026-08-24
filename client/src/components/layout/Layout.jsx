import { Outlet, useLocation } from 'react-router-dom'
import TopNav from '../nav/TopNav'
import Footer from './Footer'
import SovereignChat from '../SovereignChat'

export default function Layout() {
  // 홈은 히어로 자체가 챗봇이므로 FAB를 숨긴다
  const isHome = useLocation().pathname === '/'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <SovereignChat />}
      <Footer />
    </div>
  )
}
