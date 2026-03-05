import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchQuizzes } from "../features/quiz/quizSlice"
import type { RootState, AppDispatch } from "../app/store"
import { Link } from "react-router-dom"

export default function QuizList() {
  const dispatch = useDispatch<AppDispatch>()
  const quizzes = useSelector((state: RootState) => state.quiz.quizzes)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  return (
    <div className="container mt-4">
      <h2>Quizzes</h2>
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="card mb-2 p-3">
          <h5>{quiz.title}</h5>
          <p>{quiz.description}</p>
          <Link to={`/quiz/${quiz._id}`} className="btn btn-success">
            Take Quiz
          </Link>
        </div>
      ))}
    </div>
  )
}