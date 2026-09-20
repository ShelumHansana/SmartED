import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎓</span>
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
              fontWeight: 500
            }} onClick={goToDashboard}>
              👤 {user?.firstName || user?.fullName || user?.email}
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
