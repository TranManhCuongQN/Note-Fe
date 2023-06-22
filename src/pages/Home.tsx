import { Box } from '@mui/system'
import React from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import boardApi from 'src/api/board.api'
import { useBoardStore } from 'src/zustand/board'
import LoadingButton from '@mui/lab/LoadingButton'

const Home = () => {
  const navigate = useNavigate()
  const setBoards = useBoardStore((state) => state.setBoards)
  const createBoardMutation = useMutation({
    mutationFn: () => boardApi.create(),
    onSuccess: (res) => {
      setBoards([res.data])
      navigate(`/boards/${res.data.id}`)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const createBoard = () => {
    createBoardMutation.mutate()
  }
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <LoadingButton variant='outlined' color='success' onClick={createBoard} loading={createBoardMutation.isLoading}>
        Click here to create your first board
      </LoadingButton>
    </Box>
  )
}

export default Home
