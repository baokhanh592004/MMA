import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import { fetchQuizById, addQuestion, deleteQuestion } from "../features/quiz/quizSlice"

export default function ManageQuestions() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const quiz = useSelector((state: RootState) => state.quiz.selectedQuiz)

  const [text, setText] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [success, setSuccess] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; text: string } | null>(null)

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id))
  }, [dispatch, id])

  const handleSubmit = async () => {
    if (!id || !text || options.some(o => !o)) return
    await dispatch(
      addQuestion({
        quizId: id,
        question: {
          text,
          options,
          correctAnswerIndex: correctIndex,
          keyword: ["general"]
        }
      })
    )
    setText("")
    setOptions(["", "", "", ""])
    setCorrectIndex(0)
    setSuccess("Question added!")
    setTimeout(() => setSuccess(""), 2000)
  }

  const handleConfirmDelete = () => {
    if (!id || !deleteTarget) return
    dispatch(deleteQuestion({ quizId: id, questionId: deleteTarget.id }))
    setDeleteTarget(null)
  }

  return (
    <div className="container mt-4">
      <h2>Manage Questions — {quiz?.title}</h2>

      {/* Existing questions */}
      <div className="mb-4">
        <h5>Current Questions ({quiz?.question?.length ?? 0})</h5>
        {quiz?.question?.length === 0 && <p className="text-muted">No questions yet.</p>}
        {quiz?.question?.map((q, idx) => (
          <div key={q._id} className="card mb-2 p-3 d-flex flex-row justify-content-between align-items-start">
            <div>
              <strong>Q{idx + 1}:</strong> {q.text}
              <ul className="mb-0 mt-1">
                {q.options.map((opt, i) => (
                  <li key={i} style={{ color: i === q.correctAnswerIndex ? "green" : "inherit" }}>
                    {opt} {i === q.correctAnswerIndex && "✓"}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-danger btn-sm ms-3"
              onClick={() => setDeleteTarget({ id: q._id, text: q.text })}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add new question */}
      <h5>Add New Question</h5>
      {success && <div className="alert alert-success">{success}</div>}
      <input
        className="form-control mb-2"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {options.map((opt, index) => (
        <input
          key={index}
          className="form-control mb-2"
          placeholder={`Option ${index + 1}`}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options]
            newOptions[index] = e.target.value
            setOptions(newOptions)
          }}
        />
      ))}
      <div className="mb-3">
        <label className="form-label">Correct Answer Index (0–3)</label>
        <input
          type="number"
          min={0}
          max={3}
          className="form-control"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
        />
      </div>
      <button className="btn btn-success" onClick={handleSubmit}>
        Add Question
      </button>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteTarget(null)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Bạn có chắc muốn xóa câu hỏi:{" "}
                    <strong>"{deleteTarget.text}"</strong> không?
                  </p>
                  <p className="text-danger mb-0">
                    <small>Hành động này không thể hoàn tác.</small>
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDeleteTarget(null)}
                  >
                    Hủy
                  </button>
                  <button className="btn btn-danger" onClick={handleConfirmDelete}>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={() => setDeleteTarget(null)} />
        </>
      )}
    </div>
  )
}
