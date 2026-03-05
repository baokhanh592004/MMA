import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchQuizzes, deleteQuiz, updateQuiz } from "../features/quiz/quizSlice"
import type { RootState, AppDispatch } from "../app/store"
import { Link } from "react-router-dom"

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { quizzes, loading } = useSelector((state: RootState) => state.quiz)
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  const startEdit = (id: string, title: string, description: string) => {
    setEditId(id)
    setEditTitle(title)
    setEditDesc(description)
  }

  const handleUpdate = async () => {
    if (!editId) return
    await dispatch(updateQuiz({ id: editId, title: editTitle, description: editDesc }))
    setEditId(null)
  }

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/create" className="btn btn-success mb-3">
        + Create Quiz
      </Link>

      {loading && <p>Loading...</p>}

      {quizzes.map((quiz) => (
        <div key={quiz._id} className="card mb-3 p-3">
          {editId === quiz._id ? (
            <>
              <input
                className="form-control mb-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                className="form-control mb-2"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleUpdate}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h5>{quiz.title}</h5>
              <p className="text-muted">{quiz.description}</p>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => startEdit(quiz._id, quiz.title, quiz.description)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => dispatch(deleteQuiz(quiz._id))}
                >
                  Delete
                </button>
                <Link to={`/admin/quiz/${quiz._id}`} className="btn btn-primary btn-sm">
                  Manage Questions
                </Link>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
