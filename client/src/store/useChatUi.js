import { create } from 'zustand'

// 홈 히어로 챗봇이 대화 모드로 열렸는지 전역으로 공유한다.
// TopNav 가 이 값으로 헤더를 중앙 정렬(첫 화면) ↔ 좌측 정렬(대화 모드)로 전환한다.
export const useChatUi = create((set) => ({
  panelOpen: false,
  setPanelOpen: (panelOpen) => set({ panelOpen })
}))
