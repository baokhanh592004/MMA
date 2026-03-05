import type { Question } from "./Question"

export interface Quiz {
  _id: string
  title: string
  description: string
  question: Question[]
}