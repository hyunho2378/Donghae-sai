import { create } from 'zustand'

function loadUser() {
  try {
    const raw = localStorage.getItem('goun_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const storedUser = loadUser()

export const useAuthStore = create((set) => ({
  user: storedUser,
  isAuthenticated: !!storedUser,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateStage: (stage) =>
    set((state) =>
      state.user
        ? { user: { ...state.user, stage } }
        : {}
    ),
  updateRole: (role) =>
    set((state) =>
      state.user
        ? { user: { ...state.user, role } }
        : {}
    ),
  isOperator: () => false
}))
