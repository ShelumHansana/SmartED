import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState('student')
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would normally handle registration
    if (selectedRole === 'student') {
      navigate('/student-dashboard')
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
        <h2>Register</h2>
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
          </div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {selectedRole === 'student' ? (
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name*</label>
                <input 
                  type="text" 
                  id="fullName" 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="indexNumber">Index Number*</label>
                <input 
                  type="text" 
                  id="indexNumber" 
                  placeholder="Enter your index number" 
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthDay">Birthday*</label>
                  <div className="date-inputs">
                    <select id="birthDay" required>
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select id="birthMonth" required>
                      {['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <select id="birthYear" required>
                      {Array.from({length: 20}, (_, i) => new Date().getFullYear() - 20 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="guardianName">Parent/Guardian's Name*</label>
                <input 
                  type="text" 
                  id="guardianName" 
                  placeholder="Enter parent/guardian's name" 
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">Grade*</label>
                  <select id="grade" required>
                    {Array.from({length: 13}, (_, i) => i + 1).map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="class">Class*</label>
                  <select id="class" required>
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G' , 'H' , 'I'].map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="admissionDate">Admission Date*</label>
                <input 
                  type="date" 
                  id="admissionDate" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address*</label>
                <textarea 
                  id="address" 
                  placeholder="Enter your address" 
                  rows="3" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number*</label>
                <input 
                  type="tel" 
                  id="contactNumber" 
                  placeholder="Enter your contact number" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="guardianContact">Guardian's Contact Number*</label>
                <input 
                  type="tel" 
                  id="guardianContact" 
                  placeholder="Enter guardian's contact number" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  placeholder="Confirm your password" 
                  required 
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
              </div>
            </>
          )}
          <button type="submit" className="submit-button">Register as {selectedRole}</button>
        </form>
      </div>
    </div>
  )
}

export default Register
