import { Box, CircularProgress, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import boardApi from 'src/api/board.api'
import { useBoardStore } from 'src/zustand/board'
import { useUserStore } from 'src/zustand/user'
import assets from 'src/assets'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { Board } from 'src/types/board'

const SIDE_BAR_WIDTH = 250
const Sidebar = () => {
  const user = useUserStore((state) => state.user)
  const boards = useBoardStore((state) => state.boards)
  const setBoards = useBoardStore((state) => state.setBoards)
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const getBoards = useQuery({
    queryKey: 'getBoards',
    queryFn: () => boardApi.getAll(),
    onSuccess: (res) => {
      setBoards(res.data)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error)
    }
  })

  const addBoardMutation = useMutation({
    mutationFn: () => boardApi.create(),
    onSuccess: (res) => {
      const newList = [...boards, res.data.board]
      setBoards(newList)
      navigate(`/boards/${res.data.board._id}`)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const updatePositionMutation = useMutation({
    mutationFn: (params: { boards: Board[] }) => boardApi.updatePosition(params),
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  useEffect(() => {
    const activeItem = boards.findIndex((board) => board._id === boardId)
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0]._id}`)
    }
    setActiveIndex(activeItem)
  }, [boards, boardId, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return
    const newList = [...boards]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex((board) => board._id === boardId)
    setActiveIndex(activeItem)
    setBoards(newList)

    updatePositionMutation.mutate({ boards: newList })
  }

  const addBoard = () => {
    addBoardMutation.mutate()
  }

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{
        width: SIDE_BAR_WIDTH,
        height: '100vh',
        '& > div': { borderRight: 'none' }
      }}
    >
      <List
        disablePadding
        sx={{
          width: SIDE_BAR_WIDTH,
          height: '100vh',
          backgroundColor: assets.colors.secondary
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant='body2' fontWeight='700'>
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        {/* <FavouriteList /> */}
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant='body2' fontWeight='700'>
              Private
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {boards?.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItemButton
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        selected={index === activeIndex}
                        component={Link}
                        to={`/boards/${item.id}`}
                        sx={{
                          pl: '20px',
                          cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                        }}
                      >
                        <Typography
                          variant='body2'
                          fontWeight='700'
                          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItemButton>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </Drawer>
  )
}

export default Sidebar
