import { create } from 'zustand'

export interface boards {
  user: {
    username: string
    password: string
  }
  icon: string
  title: string
  description: string
  position: number
  favourite: boolean
  favouritePosition: number
  _id: string
  id: string
}

export interface BoardState {
  boards: boards[]
  setBoards: (boards: boards[]) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  setBoards: (boards: boards[]) => set({ boards })
}))
