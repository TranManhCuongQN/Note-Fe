import { Section } from './section'
import { User } from './user'

export interface Board {
  user: User
  icon: string
  title: string
  description: string
  position: number
  favourite: boolean
  favouritePosition: number
  _id: string
  id: string
  createdAt: string
  sections: Section[]
}
