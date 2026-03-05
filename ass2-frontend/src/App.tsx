import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import QuizList from "./pages/QuizList"
import QuizDetail from "./pages/QuizDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import AdminDashboard from "./pages/AdminDashboard"
import CreateQuiz from "./pages/CreateQuiz"
import ManageQuestions from "./pages/ManageQuestions"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <AdminRoute>
              <CreateQuiz />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/quiz/:id"
          element={
            <AdminRoute>
              <ManageQuestions />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App