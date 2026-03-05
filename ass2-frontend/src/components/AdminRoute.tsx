import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { Navigate } from "react-router-dom"

export default function AdminRoute({ children }: any) {
  const { token, user } = useSelector((state: RootState) => state.auth)

  if (!token) return <Navigate to="/login" />

  if (!user?.admin) return <Navigate to="/" />

  return children
}