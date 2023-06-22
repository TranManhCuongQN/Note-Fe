import { Board } from 'src/types/board'
import { create } from 'zustand'

export interface BoardState {
  boards: Board[]
  setBoards: (boards: Board[]) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  setBoards: (boards: Board[]) => set({ boards })
}))
