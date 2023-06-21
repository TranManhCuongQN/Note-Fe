import axiosClient from './axiosClient'

const authApi = {
  register: (params: { username: string; password: string }) => axiosClient.post('auth/register', params),
  login: (params: { username: string; password: string }) => axiosClient.post('auth/login', params),
  verifyToken: () => axiosClient.post('auth/verify-token')
}

export default authApi
