import { Task } from './task'

export interface Section {
  title: string
  _id: string
  createdAt: string
  id: string
  tasks: Task[]
}
