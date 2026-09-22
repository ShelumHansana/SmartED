import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, User } from 'lucide-react'

const Navbar = ({ onLoginClick }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  const goToDashboard = () => {
    const roleRoutes = {
      student: '/student-dashboard',
      teacher: '/teacher-dashboard',
      parent: '/parent-dashboard',
      admin: '/admin-dashboard'
    }
    navigate(roleRoutes[user?.role] || '/')
  }
  
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GraduationCap size={24} color="#4f46e5" />
          <h1>SmartED</h1>
        </div>
        <span className="tagline">Smart Learning Management System</span>
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <span style={{ 
              marginRight: '15px', 
              color: '#333',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }} onClick={goToDashboard}>
              <User size={16} color="#6366f1" />
              <span>{user?.firstName || user?.fullName || user?.email}</span>
            </span>
            <button className="login-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-button" onClick={onLoginClick}>Login</button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
