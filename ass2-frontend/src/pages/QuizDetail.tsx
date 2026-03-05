import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchQuizById } from "../features/quiz/quizSlice"
import type { RootState, AppDispatch } from "../app/store"

export default function QuizDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedQuiz: quiz, loading } = useSelector((state: RootState) => state.quiz)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id))
  }, [dispatch, id])

  const handleSubmit = () => {
    let s = 0
    quiz?.question.forEach((q) => {
      if (answers[q._id] === q.correctAnswerIndex) s++
    })
    setScore(s)
  }

  if (loading) return <div className="container mt-4">Loading...</div>
  if (!quiz) return <div className="container mt-4">Quiz not found.</div>

  const total = quiz.question.length

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate("/")}>
        ← Back to Quizzes
      </button>
      <h2>{quiz.title}</h2>
      <p className="text-muted">{quiz.description}</p>
      <hr />

      {score !== null ? (
        <div className="text-center mt-4">
          <h3>Your Score: {score} / {total}</h3>
          <p>{score === total ? "🎉 Perfect!" : score >= total / 2 ? "👍 Good job!" : "😅 Keep practicing!"}</p>
          <button className="btn btn-primary" onClick={() => { setScore(null); setAnswers({}) }}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {quiz.question.map((q, idx) => (
            <div key={q._id} className="card mb-3 p-3">
              <h6>Q{idx + 1}: {q.text}</h6>
              {q.options.map((opt, index) => (
                <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={q._id}
                    id={`${q._id}-${index}`}
                    checked={answers[q._id] === index}
                    onChange={() => setAnswers({ ...answers, [q._id]: index })}
                  />
                  <label className="form-check-label" htmlFor={`${q._id}-${index}`}>
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < total}
          >
            Submit ({Object.keys(answers).length}/{total} answered)
          </button>
        </>
      )}
    </div>
  )
}
