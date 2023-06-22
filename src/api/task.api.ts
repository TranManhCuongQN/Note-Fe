import { Task } from 'src/types/task'
import axiosClient from './axiosClient'

const taskApi = {
  create: (
    boardId: string,
    body: {
      sectionId: string
    }
  ) => axiosClient.post<Task>(`boards/${boardId}/tasks`, body),
  updatePosition: (
    boardId: string,
    body: {
      resourceList: Task[]
      destinationList: Task[]
      resourceSectionId: string
      destinationSectionId: string
    }
  ) => axiosClient.put(`boards/${boardId}/tasks/update-position`, body),
  delete: (boardId: string, taskId: string) => axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
  update: (
    boardId: string,
    taskId: string,
    body: {
      title?: string
      content?: string
    }
  ) => axiosClient.put(`boards/${boardId}/tasks/${taskId}`, body)
}

export default taskApi
