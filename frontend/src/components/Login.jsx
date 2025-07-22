import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState('student')
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would normally handle authentication
    switch(selectedRole) {
      case 'student':
        navigate('/student-dashboard')
        break;
      case 'teacher':
        navigate('/teacher-dashboard')
        break;
      case 'parent':
        navigate('/parent-dashboard') // To be implemented
        break;
      case 'admin':
        navigate('/admin-dashboard')
        break;
      default:
        navigate('/')
    }
    onClose()
  }
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role)
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
        <div className="role-selector">
          <h3>Select Role</h3>
          <div className="role-buttons">
            <button 
              className={`role-button ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
              type="button"
            >
              Student
            </button>
            <button 
              className={`role-button ${selectedRole === 'teacher' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('teacher')}
              type="button"
            >
              Teacher
            </button>
            <button 
              className={`role-button ${selectedRole === 'parent' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('parent')}
              type="button"
            >
              Parent
            </button>
            <button 
              className={`role-button ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('admin')}
              type="button"
            >
              Admin
            </button>
          </div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="submit-button">Login as {selectedRole}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
