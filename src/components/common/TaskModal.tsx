import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import taskApi from 'src/api/task.api'
import { Task } from 'src/types/task'
import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import '../../css/custom-editor.css'

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%'
}
let timer: any
const timeout = 500

const TaskModal = ({
  boardId,
  taskProps,
  onUpdateTask,
  onClose,
  onDeleteTask
}: {
  boardId: string
  taskProps: Task
  onClose: () => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}) => {
  const [task, setTask] = useState<Task | undefined>(taskProps)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const editorWrapperRef = useRef<HTMLDivElement>(null)

  const updateTaskMutation = useMutation({
    mutationFn: (data: { boardId: string; taskId: string; body: { title?: string; content?: string } }) =>
      taskApi.update(data.boardId, data.taskId, data.body),
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const deleteTaskMutation = useMutation({
    mutationFn: () => taskApi.delete(boardId, (task as Task)?._id),
    onSuccess: () => {
      onDeleteTask(task as Task)
      setTask(undefined)
      setIsModalOpen(false)
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  useEffect(() => {
    setTask(taskProps)
    setTitle(taskProps !== undefined ? taskProps.title : '')
    setContent(taskProps !== undefined ? taskProps.content : '')

    if (taskProps !== undefined) {
      setIsModalOpen(true)

      updateEditorHeight()
    }
  }, [taskProps])

  const updateEditorHeight = () => {
    setTimeout(() => {
      const box = editorWrapperRef.current

      if (box) {
        const element = box.querySelector('.ck-editor__editable_inline') as HTMLDivElement
        if (element) {
          element.style.height = box.offsetHeight - 50 + 'px'
        }
      }
    }, timeout)
  }

  const handleClose = () => {
    onClose()
    onUpdateTask(task as Task)
    setIsModalOpen(false)
  }

  const deleteTask = () => {
    deleteTaskMutation.mutate()
  }

  const updateTitle = (e: any) => {
    clearTimeout(timer)
    const newTitle = e.target.value

    timer = setTimeout(() => {
      updateTaskMutation.mutate({ boardId, taskId: (task as Task)?._id, body: { title: newTitle } })
    }, timeout)

    setTask({ ...task, title: newTitle } as Task)
    onUpdateTask(task as Task)
    setTitle(newTitle)
  }

  const updateContent = (e: any, editor: any) => {
    clearTimeout(timer)
    const data = editor.getData()

    if (isModalOpen) {
      timer = setTimeout(() => {
        updateTaskMutation.mutate({ boardId, taskId: (task as Task)?._id, body: { content: data } })
      }, timeout)
    }

    setContent(data)
    setTask({ ...task, content: data } as Task)
    onUpdateTask(task as Task)
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isModalOpen}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%'
            }}
          >
            <IconButton color='error' onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '2rem 5rem 5rem'
            }}
          >
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px'
              }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal
