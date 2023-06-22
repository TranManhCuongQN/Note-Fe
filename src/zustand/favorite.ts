import { Board } from 'src/types/board'
import { create } from 'zustand'

export interface FavoriteState {
  favorites: Board[]
  setFavorites: (favorites: Board[]) => void
}
export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [],
  setFavorites: (favorites: Board[]) => set({ favorites })
}))
