export interface Question {
  _id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  keyword: string[]
}