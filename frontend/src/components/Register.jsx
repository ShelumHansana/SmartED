import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState('student')
  const [selectedGrade, setSelectedGrade] = useState('1')
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [selectedClasses, setSelectedClasses] = useState([])
  const navigate = useNavigate()

  const handleClassAdd = () => {
    const gradeSelect = document.getElementById('teacherGrade')
    const classSelect = document.getElementById('teacherClass')
    const grade = gradeSelect.value
    const className = classSelect.value
    
    if (grade && className) {
      const classItem = `${grade}-${className}`
      if (!selectedClasses.includes(classItem)) {
        setSelectedClasses(prev => [...prev, classItem])
      }
      gradeSelect.value = ''
      classSelect.value = ''
    }
  }

  const handleClassRemove = (classToRemove) => {
    setSelectedClasses(prev => prev.filter(c => c !== classToRemove))
  }

  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const getClassOptions = (grade, stream) => {
    if (grade === '12' || grade === '13') {
      switch(stream) {
        case 'Bio':
          return Array.from({length: 5}, (_, i) => `B${i + 1}`)
        case 'Physical':
          return Array.from({length: 5}, (_, i) => `M${i + 1}`)
        case 'Art':
          return Array.from({length: 5}, (_, i) => `A${i + 1}`)
        case 'Technology':
          return Array.from({length: 5}, (_, i) => `T${i + 1}`)
        default:
          return []
      }
    }
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
  }

  const handleGradeChange = (e) => {
    const grade = e.target.value
    setSelectedGrade(grade)
    if (grade !== '12' && grade !== '13') {
      setSelectedStream('')
    }
  }

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
            <div className="form-columns">
              <div className="form-column">
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
                  <label htmlFor="gender">Gender*</label>
                  <select id="gender" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
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
              </div>
              <div className="form-column">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">Grade*</label>
                  <select 
                    id="grade" 
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    required
                  >
                    {Array.from({length: 13}, (_, i) => i + 1).map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
                {(selectedGrade === '12' || selectedGrade === '13') && (
                  <div className="form-group">
                    <label htmlFor="stream">Stream*</label>
                    <select 
                      id="stream" 
                      value={selectedStream}
                      onChange={(e) => setSelectedStream(e.target.value)}
                      required
                    >
                      <option value="">Select Stream</option>
                      <option value="Bio">Biology</option>
                      <option value="Physical">Physical Science</option>
                      <option value="Art">Arts</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="class">Class*</label>
                  <select 
                    id="class" 
                    required
                    disabled={(selectedGrade === '12' || selectedGrade === '13') && !selectedStream}
                  >
                    <option value="">Select Class</option>
                    {getClassOptions(selectedGrade, selectedStream).map(cls => (
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
              </div>
            </div>
          ) : selectedRole === 'teacher' ? (
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="title">Title*</label>
                  <select id="title" required>
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Rev">Rev</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name*</label>
                  <input type="text" id="fullName" placeholder="Enter your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="teacherIndex">Teacher's Index Number*</label>
                  <input type="text" id="teacherIndex" placeholder="Enter your teacher's index number" required />
                </div>
                <div className="form-group">
                  <label>Subjects*</label>
                  <div className="subjects-grid">
                    {[
                      'Mathematics',
                      'Science',
                      'Physics',
                      'Chemistry',
                      'Biology',
                      'ICT',
                      'History',
                      'Geography',
                      'English',
                      'Sinhala',
                      'Tamil',
                      'Buddhism',
                      'Christianity',
                      'Islam',
                      'Art',
                      'Music',
                      'Dancing',
                      'PTS'
                    ].map(subject => (
                      <div key={subject} className="subject-checkbox">
                        <input
                          type="checkbox"
                          id={`subject-${subject}`}
                          name="subjects"
                          value={subject}
                          checked={selectedSubjects.includes(subject)}
                          onChange={() => handleSubjectChange(subject)}
                          required={selectedSubjects.length === 0}
                        />
                        <label htmlFor={`subject-${subject}`}>{subject}</label>
                      </div>
                    ))}
                  </div>
                  <small className="help-text">Select all subjects that you teach</small>
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="teachingClasses">Teaching Classes*</label>
                  <div className="teaching-classes">
                    <div className="form-row">
                      <select id="teacherGrade">
                        <option value="">Select Grade</option>
                        {Array.from({length: 13}, (_, i) => i + 1).map(grade => (
                          <option key={grade} value={grade}>Grade {grade}</option>
                        ))}
                      </select>
                      <select id="teacherClass">
                        <option value="">Select Class</option>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        className="add-class-btn"
                        onClick={handleClassAdd}
                      >
                        Add Class
                      </button>
                    </div>
                    {selectedClasses.length > 0 && (
                      <div className="selected-classes">
                        {selectedClasses.map(classItem => (
                          <div key={classItem} className="selected-class-tag">
                            <span>Grade {classItem}</span>
                            <button
                              type="button"
                              onClick={() => handleClassRemove(classItem)}
                              className="remove-class-btn"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedClasses.length === 0 && (
                      <input type="hidden" required value={selectedClasses} />
                    )}
                    <small className="help-text">Add all classes that you teach</small>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inCharge">Class/Sport In Charge (Optional)</label>
                  <div className="form-row">
                    <select id="inChargeType">
                      <option value="">Select Type</option>
                      <option value="class">Class</option>
                      <option value="sport">Sport</option>
                    </select>
                    <input 
                      type="text" 
                      id="inChargeDetails" 
                      placeholder="Enter class (e.g., 10-A) or sport name" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
                </div>
              </div>
            </div>
          ) : (
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="parentTitle">Title*</label>
                  <select id="parentTitle" required>
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
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
                  <label htmlFor="childName">Child's Full Name*</label>
                  <input 
                    type="text" 
                    id="childName" 
                    placeholder="Enter your child's full name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="relationship">Parent/Guardian*</label>
                  <select id="relationship" required>
                    <option value="">Select Relationship</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="maritalStatus">Marital Status*</label>
                  <select id="maritalStatus" required>
                    <option value="">Select Status</option>
                    <option value="married">Married</option>
                    <option value="unmarried">Unmarried</option>
                  </select>
                </div>
              </div>
              <div className="form-column">
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
                      {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 50 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="childIndex">Child's Index Number*</label>
                  <input 
                    type="text" 
                    id="childIndex" 
                    placeholder="Enter your child's index number" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">Telephone Number*</label>
                  <input 
                    type="tel" 
                    id="telephone" 
                    placeholder="Enter your telephone number" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number*</label>
                  <input 
                    type="tel" 
                    id="mobile" 
                    placeholder="Enter your mobile number" 
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
              </div>
            </div>
          )}
          <button type="submit" className="submit-button">Register as {selectedRole}</button>
        </form>
      </div>
    </div>
  )
}

export default Register
