import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { Outlet, useNavigate } from 'react-router-dom'
import authApi from 'src/api/auth.api'
import { useUserStore } from 'src/zustand/user'
import { Box } from '@mui/material'
import Sidebar from '../common/Sidebar'
import Loading from '../common/Loading'

const AppLayout = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const { isLoading } = useQuery({
    queryKey: 'verifyToken',
    queryFn: () => authApi.verifyToken(),
    onSuccess: (res) => {
      setUser(res.data.user)
    },
    onError: () => navigate('/login'),
    enabled: Boolean(token)
  })
  return isLoading ? (
    <Loading fullHeight={true} />
  ) : (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout
