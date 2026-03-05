import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { User } from "../../types/User"

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// Rehydrate user from localStorage on page refresh
const storedUser = localStorage.getItem("user")

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null
}

export const login = createAsyncThunk(
  "auth/login",
  async (data: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, data)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Login failed")
    }
  }
)

export const register = createAsyncThunk(
  "auth/register",
  async (
    data: { username: string; password: string; admin?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Register failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer