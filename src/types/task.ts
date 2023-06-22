import { Section } from './section'

export interface Task {
  title: string
  content: string
  position: number
  _id: string
  createdAt: string
  section: Section
  id: string
}
