import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import StaysPage from './pages/StaysPage'
import StayDetailPage from './pages/StayDetailPage'
import PackagesPage from './pages/PackagesPage'
import PackageDetailPage from './pages/PackageDetailPage'
import JournalPage from './pages/JournalPage'
import JournalDetailPage from './pages/JournalDetailPage'
import StoryListPage from './pages/StoryListPage'
import StoryDetailPage from './pages/StoryDetailPage'
import MembershipPage from './pages/MembershipPage'
import PassPage from './pages/PassPage'
import GoodsPage from './pages/GoodsPage'
import MyPage from './pages/MyPage'
import PrivacyPage from './pages/PrivacyPage'
import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutCompletePage from './pages/CheckoutCompletePage'
import BookmarksPage from './pages/BookmarksPage'

function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }
  return children
}

function RequireOperator({ children }) {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }
  if (user?.role !== 'operator') {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/stays" element={<StaysPage />} />
            <Route path="/stays/:id" element={<StayDetailPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:id" element={<PackageDetailPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:id" element={<JournalDetailPage />} />
            <Route path="/story" element={<StoryListPage />} />
            <Route path="/story/:slug" element={<StoryDetailPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/pass" element={<PassPage />} />
            <Route path="/goods" element={<GoodsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
            <Route path="/checkout/complete" element={<RequireAuth><CheckoutCompletePage /></RequireAuth>} />
            <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<RequireOperator><AdminPage /></RequireOperator>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
