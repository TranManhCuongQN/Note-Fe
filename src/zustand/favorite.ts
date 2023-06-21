import { create } from 'zustand'

export interface FavoriteState {
  favorites: {
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
  }[]
}
export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [],
  setFavorites: (favorites: FavoriteState) => set({ favorites: favorites.favorites })
}))
