import React from 'react'
import { Container, Box, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Loading from '../common/Loading'
import assets from '../../assets'
import { useQuery } from 'react-query'
import authApi from 'src/api/auth.api'

const AuthLayout = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const { isLoading } = useQuery({
    queryKey: 'verifyToken',
    queryFn: () => authApi.verifyToken(),
    onSuccess: () => navigate('/'),
    enabled: Boolean(token)
  })

  return isLoading ? (
    <Loading fullHeight={true} />
  ) : (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography
          component='h1'
          variant='h4'
          sx={{
            fontWeight: '700'
          }}
        >
          Trello
        </Typography>
        <Outlet />
      </Box>
    </Container>
  )
}

export default AuthLayout
