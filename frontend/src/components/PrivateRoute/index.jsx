import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "@/hooks/useAuth"

export function PrivateRoute() {
  const { isAuthenticated } = useContext(AuthContext)

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}