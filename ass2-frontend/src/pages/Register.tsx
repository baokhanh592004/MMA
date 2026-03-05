import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import { register } from "../features/auth/authSlice"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [localError, setLocalError] = useState("")

  const handleRegister = async () => {
    setLocalError("")
    if (!username || !password) {
      setLocalError("Please fill in all fields")
      return
    }
    if (password !== confirm) {
      setLocalError("Passwords do not match")
      return
    }
    const result = await dispatch(register({ username, password }))
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login")
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Register</h2>
      {(localError || error) && (
        <div className="alert alert-danger">{localError || error}</div>
      )}
      <input
        className="form-control mb-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        className="btn btn-primary w-100"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
