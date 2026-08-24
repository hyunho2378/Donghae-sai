import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import NavMenu from './NavMenu'
import IconGroup from './IconGroup'

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border-sub">
        <div className="container-page
                        h-[60px] lg:h-[80px]
                        flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 lg:gap-10 shrink-0">
            <Logo />
          </div>
          <div className="hidden lg:flex flex-1 items-center justify-end gap-8">
            <NavMenu />
            <IconGroup />
          </div>
          <button
            aria-label="메뉴"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center
                       rounded-full hover:bg-bg-card transition-colors duration-150">
            <Menu size={22} className="text-text-pri" />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="px-5 h-[60px] flex items-center justify-between border-b border-border-sub">
              <Logo />
              <button
                aria-label="닫기"
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 inline-flex items-center justify-center
                           rounded-full hover:bg-bg-card transition-colors duration-150">
                <X size={22} className="text-text-pri" />
              </button>
            </div>
            <div className="px-5 py-6 space-y-6">
              <NavMenu vertical onClick={() => setMenuOpen(false)} />
              <div className="pt-6 border-t border-border-sub">
                <IconGroup />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
