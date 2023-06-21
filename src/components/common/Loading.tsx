import React from 'react'
import { Box, CircularProgress } from '@mui/material'
const Loading = ({ fullHeight }: { fullHeight: boolean }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullHeight ? '100vh' : '100%'
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default Loading
