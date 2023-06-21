import { boards } from 'src/zustand/board'
import axiosClient from './axiosClient'

const boardApi = {
  create: () => axiosClient.post('boards'),
  getAll: () => axiosClient.get('boards'),
  updatePosition: (params: { boards: boards[] }) => axiosClient.put('boards', params),
  getOne: (id: string) => axiosClient.get(`boards/${id}`),
  delete: (id: string) => axiosClient.delete(`boards/${id}`),
  update: (id: string, params: string) => axiosClient.put(`boards/${id}`, params),
  getFavourites: () => axiosClient.get('boards/favourites'),
  updateFavouritePosition: (params: string) => axiosClient.put('boards/favourites', params)
}

export default boardApi
