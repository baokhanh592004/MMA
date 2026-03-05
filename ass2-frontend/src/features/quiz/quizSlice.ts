import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { Quiz } from "../../types/Quiz"
import type { Question } from "../../types/Question"
import type { RootState } from "../../app/store"

interface QuizState {
  quizzes: Quiz[]
  selectedQuiz: Quiz | null
  loading: boolean
  error: string | null
}

const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: null,
  loading: false,
  error: null
}

export const fetchQuizzes = createAsyncThunk<Quiz[], void, { state: RootState }>(
  "quiz/fetchAll",
  async (_, { getState }) => {
    const token = getState().auth.token
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/quizzes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
)

export const fetchQuizById = createAsyncThunk<Quiz, string, { state: RootState }>(
  "quiz/fetchById",
  async (id, { getState }) => {
    const token = getState().auth.token
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
)

export const createQuiz = createAsyncThunk<
  Quiz,
  { title: string; description: string },
  { state: RootState }
>("quiz/create", async (data, { getState }) => {
  const token = getState().auth.token
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/quizzes`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
})

export const updateQuiz = createAsyncThunk<
  Quiz,
  { id: string; title: string; description: string },
  { state: RootState }
>("quiz/update", async ({ id, title, description }, { getState }) => {
  const token = getState().auth.token
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/quizzes/${id}`,
    { title, description },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
})

export const deleteQuiz = createAsyncThunk<string, string, { state: RootState }>(
  "quiz/delete",
  async (id, { getState }) => {
    const token = getState().auth.token
    await axios.delete(`${import.meta.env.VITE_API_URL}/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return id
  }
)

interface NewQuestion {
  text: string
  options: string[]
  correctAnswerIndex: number
  keyword: string[]
}

export const addQuestion = createAsyncThunk<
  Question,
  { quizId: string; question: NewQuestion },
  { state: RootState }
>("quiz/addQuestion", async ({ quizId, question }, { getState }) => {
  const token = getState().auth.token
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/quizzes/${quizId}/question`,
    question,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
})

export const deleteQuestion = createAsyncThunk<
  { quizId: string; questionId: string },
  { quizId: string; questionId: string },
  { state: RootState }
>("quiz/deleteQuestion", async ({ quizId, questionId }, { getState }) => {
  const token = getState().auth.token
  await axios.delete(`${import.meta.env.VITE_API_URL}/questions/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return { quizId, questionId }
})

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes = action.payload
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Failed to fetch quizzes"
      })
      .addCase(fetchQuizById.pending, (state) => { state.loading = true })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedQuiz = action.payload
      })
      .addCase(fetchQuizById.rejected, (state) => { state.loading = false })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload)
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const idx = state.quizzes.findIndex(q => q._id === action.payload._id)
        if (idx !== -1) state.quizzes[idx] = action.payload
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(q => q._id !== action.payload)
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        if (state.selectedQuiz) {
          state.selectedQuiz.question.push(action.payload)
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        if (state.selectedQuiz) {
          state.selectedQuiz.question = state.selectedQuiz.question.filter(
            q => q._id !== action.payload.questionId
          )
        }
      })
  }
})

export default quizSlice.reducer