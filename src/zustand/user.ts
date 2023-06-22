import { User } from 'src/types/user'
import { create } from 'zustand'

interface UserState {
  user: User
  setUser: (user: User) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    username: '',
    password: ''
  },
  setUser: (user: User) => set({ user })
}))
