import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../app/store"
import { createQuiz } from "../features/quiz/quizSlice"
import { useNavigate } from "react-router-dom"

export default function CreateQuiz() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    await dispatch(createQuiz({ title, description }))
    navigate("/admin")
  }

  return (
    <div className="container mt-4">
      <h2>Create Quiz</h2>
      <input
        className="form-control mb-2"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSubmit}>
        Create
      </button>
    </div>
  )
}