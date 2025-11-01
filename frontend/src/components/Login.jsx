import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setError('')
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      
      // Login with Firebase
      const userData = await login(email, password)
      
      // Role-based navigation
      const roleRoutes = {
        student: '/student-dashboard',
        teacher: '/teacher-dashboard',
        parent: '/parent-dashboard',
        admin: '/admin-dashboard'
      }
      
      const route = roleRoutes[userData.role] || '/'
      navigate(route)
      onClose()
      
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid email or password. Please try again.')
      setLoading(false)
    }
  }
  
  const handleModalClick = (e) => {
    if (e.target.className === 'auth-modal') {
      onClose()
    }
  }

  const handleSignupClick = (e) => {
    e.preventDefault()
    onClose() // Close login modal
    if (onSignupClick) {
      onSignupClick() // Open signup modal
    }
  }

  return (
    <div className="auth-modal" onClick={handleModalClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Login</h2>
        
        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          Don't have an account? <a href="#" onClick={handleSignupClick} style={{ color: '#4A90E2', textDecoration: 'none', cursor: 'pointer' }}>Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Login
