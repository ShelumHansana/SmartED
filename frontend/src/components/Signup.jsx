import { useState } from 'react'

const Signup = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student specific fields
    grade: '',
    studentId: '',
    // Teacher specific fields
    subject: '',
    qualification: '',
    // Parent specific fields
    childName: '',
    childGrade: '',
    relation: ''
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Form submitted:', { role: selectedRole, ...formData })
  }

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <>
            <div className="form-group">
              <label htmlFor="grade">Grade/Class</label>
              <input
                type="text"
                id="grade"
                placeholder="Enter your grade"
                value={formData.grade}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="studentId">Student ID (if any)</label>
              <input
                type="text"
                id="studentId"
                placeholder="Enter your student ID"
                value={formData.studentId}
                onChange={handleInputChange}
              />
            </div>
          </>
        )
      case 'teacher':
        return (
          <>
            <div className="form-group">
              <label htmlFor="subject">Subject Specialization</label>
              <input
                type="text"
                id="subject"
                placeholder="Enter your subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="qualification">Qualifications</label>
              <input
                type="text"
                id="qualification"
                placeholder="Enter your qualifications"
                value={formData.qualification}
                onChange={handleInputChange}
              />
            </div>
          </>
        )
      case 'parent':
        return (
          <>
            <div className="form-group">
              <label htmlFor="childName">Child's Name</label>
              <input
                type="text"
                id="childName"
                placeholder="Enter your child's name"
                value={formData.childName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="childGrade">Child's Grade</label>
              <input
                type="text"
                id="childGrade"
                placeholder="Enter your child's grade"
                value={formData.childGrade}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="relation">Relation to Child</label>
              <input
                type="text"
                id="relation"
                placeholder="Enter your relation to the child"
                value={formData.relation}
                onChange={handleInputChange}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Sign Up</h2>
        <div className="role-selector">
          <h3>Select Role</h3>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-button ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-button ${selectedRole === 'teacher' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('teacher')}
            >
              Teacher
            </button>
            <button
              type="button"
              className={`role-button ${selectedRole === 'parent' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('parent')}
            >
              Parent
            </button>
          </div>
        </div>
        {selectedRole && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            {renderRoleSpecificFields()}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Sign Up</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Signup
