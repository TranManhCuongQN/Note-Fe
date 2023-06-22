import { Board } from 'src/types/board'
import axiosClient from './axiosClient'

const boardApi = {
  create: () => axiosClient.post('boards'),
  getAll: () => axiosClient.get('boards'),
  updatePosition: (body: { boards: Board[] }) => axiosClient.put('boards', body),
  getOne: (id: string) => axiosClient.get(`boards/${id}`),
  delete: (id: string) => axiosClient.delete(`boards/${id}`),
  update: (
    id: string,
    body: {
      icon?: string
      title?: string
      description?: string
      favourite?: boolean
    }
  ) => axiosClient.put(`boards/${id}`, body),
  getFavourites: () => axiosClient.get('boards/favourites'),
  updateFavouritePosition: (boards: Board[]) => axiosClient.put('boards/favourites', boards)
}

export default boardApi
