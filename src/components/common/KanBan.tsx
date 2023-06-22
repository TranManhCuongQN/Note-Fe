import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import sectionApi from 'src/api/section.api'
import taskApi from 'src/api/task.api'
import { Section } from 'src/types/section'
import { Task } from 'src/types/task'
import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import TaskModal from './TaskModal'

let timer: any
const timeout = 500

const KanBan = ({ boardId, dataSection }: { boardId: string; dataSection: Section[] }) => {
  const [data, setData] = useState<Section[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const updatePositionTaskMutation = useMutation({
    mutationFn: (data: {
      boardId: string
      body: {
        resourceList: Task[]
        destinationList: Task[]
        resourceSectionId: string
        destinationSectionId: string
      }
    }) => taskApi.updatePosition(data.boardId, data.body),
    onSuccess: (res) => {
      setData(res.data)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const createSectionMutation = useMutation({
    mutationFn: () => sectionApi.create(boardId),
    onSuccess: (res) => {
      console.log('res:', res.data)
      setData((prev) => {
        if (Array.isArray(prev)) {
          return [...prev, res.data]
        }
        return [res.data]
      })
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const deleteSectionMutation = useMutation({
    mutationFn: (params: { boardId: string; sectionId: string }) => sectionApi.delete(params.boardId, params.sectionId),
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const updateSectionMutation = useMutation({
    mutationFn: (data: {
      boardId: string
      sectionId: string
      body: {
        title: string
      }
    }) => sectionApi.update(data.boardId, data.sectionId, data.body),
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const createTaskMutation = useMutation({
    mutationFn: (data: {
      boardId: string
      body: {
        sectionId: string
      }
    }) => taskApi.create(data.boardId, data.body),
    onSuccess: (res, variable) => {
      console.log('res:', res.data)
      const newData = [...data]
      const index = newData.findIndex((e) => e.id === variable.body.sectionId)
      console.log(newData[index].tasks)
      newData[index]?.tasks?.unshift(res.data)
      setData(newData)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  useEffect(() => {
    setData(dataSection)
  }, [dataSection])

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId)
    const destinationColIndex = data.findIndex((e) => e.id === destination.droppableId)
    const sourceCol = data[sourceColIndex]
    const destinationCol = data[destinationColIndex]

    const sourceSectionId = sourceCol.id
    const destinationSectionId = destinationCol.id

    const sourceTasks = [...sourceCol.tasks]
    const destinationTasks = [...destinationCol.tasks]

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[sourceColIndex].tasks = sourceTasks
      data[destinationColIndex].tasks = destinationTasks
    } else {
      const [removed] = destinationTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[destinationColIndex].tasks = destinationTasks
    }

    updatePositionTaskMutation.mutate({
      boardId,
      body: {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId
      }
    })
  }

  const createSection = () => {
    createSectionMutation.mutate()
  }

  const deleteSection = async (sectionId: string) => {
    await deleteSectionMutation.mutate({ boardId, sectionId })
    const newData = [...data].filter((e) => e.id !== sectionId)
    setData(newData)
  }

  const updateSectionTitle = async (e: any, sectionId: string) => {
    clearTimeout(timer)
    const newTtile = e.target.value
    const newData = [...data]
    const index = newData.findIndex((e) => e.id === sectionId)
    newData[index].title = newTtile
    setData(newData)
    timer = setTimeout(() => {
      updateSectionMutation.mutate({ boardId, sectionId, body: { title: newTtile } })
    }, timeout)
  }

  const createTask = async (sectionId: string) => {
    createTaskMutation.mutate({ boardId, body: { sectionId } })
  }

  const onUpdateTask = (task: Task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id)
    const taskIndex = newData[sectionIndex].tasks.findIndex((e) => e.id === task.id)
    newData[sectionIndex].tasks[taskIndex] = task
    setData(newData)
  }

  const onDeleteTask = (task: Task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id)
    const taskIndex = newData[sectionIndex].tasks.findIndex((e) => e.id === task.id)
    newData[sectionIndex].tasks.splice(taskIndex, 1)
    setData(newData)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Button onClick={createSection}>Add section</Button>
        <Typography variant='body2' fontWeight='700'>
          {data?.length} Sections
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: 'calc(100vw - 400px)',
            overflowX: 'auto'
          }}
        >
          {data?.map((section) => (
            <div key={section.id} style={{ width: '300px' }}>
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}
                    >
                      <TextField
                        value={section.title}
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        placeholder='Untitled'
                        variant='outlined'
                        sx={{
                          flexGrow: 1,
                          '& .MuiOutlinedInput-input': { padding: 0 },
                          '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                          '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                        }}
                      />
                      <IconButton
                        size='small'
                        sx={{
                          color: 'gray',
                          '&:hover': { color: 'green' }
                        }}
                        onClick={() => createTask(section.id)}
                      >
                        <AddOutlinedIcon />
                      </IconButton>
                      <IconButton
                        size='small'
                        sx={{
                          color: 'gray',
                          '&:hover': { color: 'red' }
                        }}
                        onClick={() => deleteSection(section.id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                    {/* tasks */}
                    {section?.tasks?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: '10px',
                              marginBottom: '10px',
                              cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                            }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography>{task.title === '' ? 'Untitled' : task.title}</Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        taskProps={selectedTask as Task}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </>
  )
}

export default KanBan
