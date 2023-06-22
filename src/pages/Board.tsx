import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import boardApi from 'src/api/board.api'
import { Section } from 'src/types/section'
import { useBoardStore } from 'src/zustand/board'
import { useFavoriteStore } from 'src/zustand/favorite'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import EmojiPicker from '../components/common/EmojiPicker'
import Kanban from '../components/common/KanBan'

let timer: any
const timeout = 500
const Board = () => {
  const navigate = useNavigate()
  const { boardId } = useParams()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [sections, setSections] = useState<Section[]>([])
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [icon, setIcon] = useState<string>('')

  const boards = useBoardStore((state) => state.boards)
  const setBoards = useBoardStore((state) => state.setBoards)
  const favoriteList = useFavoriteStore((state) => state.favorites)
  const setFavoriteList = useFavoriteStore((state) => state.setFavorites)

  const getBoardOne = useQuery({
    queryKey: ['getBoardOne', boardId],
    queryFn: () => boardApi.getOne(boardId as string),
    onSuccess: (res) => {
      setTitle(res.data.title)
      setDescription(res.data.description)
      setSections(res.data.sections)
      setIsFavorite(res.data.favourite)
      setIcon(res.data.icon)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const updateBoardMutation = useMutation({
    mutationFn: (data: {
      boardId: string
      body: {
        icon?: string
        title?: string
        description?: string
        favourite?: boolean
      }
    }) => boardApi.update(boardId as string, data.body),
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const deleteBoardMutation = useMutation({
    mutationFn: () => boardApi.delete(boardId as string),
    onSuccess: () => {
      if (isFavorite) {
        const newFavouriteList = favoriteList.filter((e) => e.id !== boardId)
        setFavoriteList(newFavouriteList)
      }

      const newList = boards.filter((e) => e.id !== boardId)
      if (newList.length === 0) {
        navigate('/boards')
      } else {
        navigate(`/boards/${newList[0].id}`)
      }
      setBoards(newList)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const onIconChange = async (newIcon: string) => {
    const temp = [...boards]
    const index = temp.findIndex((e) => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }

    if (isFavorite) {
      const tempFavourite = [...favoriteList]
      const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
      setFavoriteList(tempFavourite)
    }

    setIcon(newIcon)
    setBoards(temp)

    updateBoardMutation.mutate({
      boardId: boardId as string,
      body: {
        icon: newIcon
      }
    })
  }

  const updateTitle = (e: any) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    const temp = [...boards]
    const index = temp.findIndex((e) => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    if (isFavorite) {
      const tempFavourite = [...favoriteList]
      const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
      setFavoriteList(tempFavourite)
    }

    setBoards(temp)

    timer = setTimeout(async () => {
      updateBoardMutation.mutate({
        boardId: boardId as string,
        body: {
          title: newTitle
        }
      })
    }, timeout)
  }

  const updateDescription = async (e: any) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      updateBoardMutation.mutate({
        boardId: boardId as string,
        body: {
          description: newDescription
        }
      })
    }, timeout)
  }

  const addFavourite = async () => {
    const res = await updateBoardMutation.mutateAsync({
      boardId: boardId as string,
      body: {
        favourite: !isFavorite
      }
    })

    let newFavouriteList = [...favoriteList]
    if (isFavorite) {
      newFavouriteList = newFavouriteList.filter((e) => e.id !== boardId)
    } else {
      newFavouriteList.unshift(res.data)
    }
    setFavoriteList(newFavouriteList)
    setIsFavorite(!isFavorite)
  }

  const deleteBoard = () => {
    deleteBoardMutation.mutate()
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <IconButton onClick={addFavourite}>
          {isFavorite ? <StarOutlinedIcon color='warning' /> : <StarBorderOutlinedIcon />}
        </IconButton>
        <IconButton color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
          {/* Kanban board */}
          <Kanban dataSection={sections} boardId={boardId as string} />
        </Box>
      </Box>
    </>
  )
}

export default Board
