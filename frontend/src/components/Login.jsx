import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Lock } from 'lucide-react'

const Login = ({ onClose }) => {
  const [identifier, setIdentifier] = useState('')
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
    if (!identifier.trim() || !password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      
      // Login with Firebase via identifier (username, index number, or email)
      const userData = await login(identifier.trim(), password)
      
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
      setError(err.message || 'Invalid credentials. Please try again.')
      setLoading(false)
    }
  }
  
  const handleModalClick = (e) => {
    if (e.target.className === 'auth-modal') {
      onClose()
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
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            color: '#b91c1c',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Username, Index Number, or Email</label>
            <input 
              type="text" 
              id="identifier" 
              placeholder="e.g. ST260001, username, or email" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              required 
              autoFocus
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
        
        <p style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={14} /> New account? Credentials are provided by the school administrator.
        </p>
      </div>
    </div>
  )
}

export default Login
