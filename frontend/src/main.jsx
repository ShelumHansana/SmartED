import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import TeacherDashboard from './components/TeacherDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import './styles/App.css'
import './styles/Auth.css'
import './styles/LandingPage.css'
import './styles/TeacherDashboard.css'
import './styles/AdminDashboard.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>,
)
