import { create } from 'zustand'

interface UserState {
  user: {
    username: string
    password: string
  }
  setUser: (user: { username: string; password: string }) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    username: '',
    password: ''
  },
  setUser: (user: { username: string; password: string }) => set({ user })
}))
