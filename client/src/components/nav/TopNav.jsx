import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import NavMenu from './NavMenu'
import IconGroup from './IconGroup'
import { useChatUi } from '../../store/useChatUi'

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  // 홈 챗봇이 대화 모드로 열리면 헤더를 좌측 정렬로 넓혀 로고가 왼쪽으로 이동한다
  const panelOpen = useChatUi((s) => s.panelOpen)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border-sub pt-[env(safe-area-inset-top)]">
        {/* 로고 좌측 기준선을 본문과 완전히 일치시킨다. 본문과 같은 container-page 를 그대로 쓴다 */}
        <div className={`container-page
                        transition-[max-width] duration-300 ease-out motion-reduce:transition-none
                        ${panelOpen ? '!max-w-[2400px]' : ''}
                        h-[60px] lg:h-[80px]
                        flex items-center justify-between gap-6`}>
          <Logo />
          <div className="hidden lg:flex flex-1 items-center justify-end gap-8">
            <NavMenu />
            <IconGroup />
          </div>
          <button
            aria-label="메뉴"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden w-11 h-11 -mr-2 inline-flex items-center justify-center
                       rounded-full hover:bg-bg-mute
                       transition-[background-color,scale] duration-150 ease-out
                       motion-reduce:transition-none active:scale-[0.96]">
            <Menu size={24} className="text-text-pri" />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-y-auto">
            <div className="px-5 h-[60px] flex items-center justify-between border-b border-border-sub">
              <Logo />
              <button
                aria-label="닫기"
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 -mr-2 inline-flex items-center justify-center
                           rounded-full hover:bg-bg-mute
                           transition-[background-color,scale] duration-150 ease-out
                           motion-reduce:transition-none active:scale-[0.96]">
                <X size={24} className="text-text-pri" />
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
