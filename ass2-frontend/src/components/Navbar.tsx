import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../app/store"
import { logout } from "../features/auth/authSlice"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user, token } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  if (!token) return null

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        QuizApp
      </Link>
      <div className="ms-auto d-flex align-items-center gap-3">
        {user?.admin && (
          <Link className="btn btn-outline-warning btn-sm" to="/admin">
            Admin Dashboard
          </Link>
        )}
        <span className="text-white">Hello, {user?.username}</span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
