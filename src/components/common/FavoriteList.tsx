import React, { useEffect, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useMutation, useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import boardApi from 'src/api/board.api'
import { Board } from 'src/types/board'
import { useFavoriteStore } from 'src/zustand/favorite'
import { Box, ListItem, ListItemButton, Typography } from '@mui/material'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const FavoriteList = () => {
  const favoriteList = useFavoriteStore((state) => state.favorites)
  const setFavoriteList = useFavoriteStore((state) => state.setFavorites)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const { boardId } = useParams()

  const getBoardsFavorite = useQuery({
    queryKey: 'getBoardsFavorite',
    queryFn: () => boardApi.getFavourites(),
    onSuccess: (res) => {
      setFavoriteList(res.data)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const updateFavoritePositionMutation = useMutation({
    mutationFn: (boards: Board[]) => boardApi.updateFavouritePosition(boards),
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  useEffect(() => {
    const index = favoriteList.findIndex((board) => board._id === boardId)
    setActiveIndex(index)
  }, [boardId, favoriteList])

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return
    const newList = [...favoriteList]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex((e) => e.id === boardId)
    setActiveIndex(activeItem)

    setFavoriteList(newList)

    updateFavoritePositionMutation.mutate(newList)
  }

  return (
    <>
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
            Favourites
          </Typography>
        </Box>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {favoriteList?.map((item, index) => (
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
    </>
  )
}

export default FavoriteList
