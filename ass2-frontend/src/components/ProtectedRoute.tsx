import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: any) {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}