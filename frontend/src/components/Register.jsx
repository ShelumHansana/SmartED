import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validateEmail, validatePassword, validatePhoneNumber } from '../utils/validation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'

const Register = ({ onClose, onLoginClick }) => {
  const [selectedRole, setSelectedRole] = useState('student')
  const [selectedGrade, setSelectedGrade] = useState('1')
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [selectedClasses, setSelectedClasses] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [availableStudents, setAvailableStudents] = useState([])
  const [selectedChildren, setSelectedChildren] = useState([])
  const navigate = useNavigate()
  const { register, logout } = useAuth()

  // Fetch all students when parent role is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedRole === 'parent') {
        try {
          const studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student')
          )
          const studentsSnapshot = await getDocs(studentsQuery)
          const studentsList = studentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            ...(doc.data().studentData || {})
          }))
          setAvailableStudents(studentsList)
        } catch (error) {
          console.error('Error fetching students:', error)
        }
      }
    }
    fetchStudents()
  }, [selectedRole])

  const handleChildSelect = (e) => {
    const selectedIndexNumber = e.target.value
    if (selectedIndexNumber && !selectedChildren.includes(selectedIndexNumber)) {
      setSelectedChildren(prev => [...prev, selectedIndexNumber])
      e.target.value = ''
    }
  }

  const handleChildRemove = (indexNumber) => {
    setSelectedChildren(prev => prev.filter(idx => idx !== indexNumber))
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const formData = new FormData(e.target)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    const email = formData.get('email')
    
    // Validation
    if (!password || !confirmPassword) {
      setError('Please enter a password')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0])
      return
    }
    
    try {
      setLoading(true)
      
      let userData = { email, password }
      
      if (selectedRole === 'student') {
        const fullName = formData.get('fullName')
        if (!fullName || fullName.trim() === '') {
          setError('Please enter your full name')
          setLoading(false)
          return
        }
        
        const indexNumber = formData.get('indexNumber')
        if (!indexNumber || indexNumber.trim() === '') {
          setError('Please enter your index number')
          setLoading(false)
          return
        }
        
        const grade = formData.get('grade')
        if (!grade) {
          setError('Please select your grade')
          setLoading(false)
          return
        }
        
        const className = formData.get('class')
        if (!className) {
          setError('Please select your class')
          setLoading(false)
          return
        }
        
        const day = formData.get('birthDay')
        const month = formData.get('birthMonth')
        const year = formData.get('birthYear')
        
        if (!day || !month || !year) {
          setError('Please select your complete birthday')
          setLoading(false)
          return
        }
        
        const birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        
        userData = {
          ...userData,
          fullName: fullName.trim(),
          indexNumber,
          grade,
          className,
          stream: selectedStream || undefined,
          birthday,
          gender: formData.get('gender'),
          address: formData.get('address'),
          phoneNumber: formData.get('contactNumber'),
          guardianName: formData.get('guardianName'),
          guardianContact: formData.get('guardianContact'),
          admissionDate: formData.get('admissionDate')
        }
      } else if (selectedRole === 'teacher') {
        const fullName = formData.get('fullName')
        if (!fullName || fullName.trim() === '') {
          setError('Please enter your full name')
          setLoading(false)
          return
        }
        
        const teacherIndex = formData.get('teacherIndex')
        if (!teacherIndex || teacherIndex.trim() === '') {
          setError('Please enter your teacher index number')
          setLoading(false)
          return
        }
        
        const title = formData.get('title')
        if (!title) {
          setError('Please select your title')
          setLoading(false)
          return
        }
        
        userData = {
          ...userData,
          title,
          fullName: fullName.trim(),
          teacherIndex,
          subjects: selectedSubjects,
          classes: selectedClasses,
          inChargeType: formData.get('inChargeType') || undefined,
          inChargeDetails: formData.get('inChargeDetails') || undefined
        }
        
        if (selectedSubjects.length === 0) {
          setError('Please select at least one subject')
          setLoading(false)
          return
        }
        
        if (selectedClasses.length === 0) {
          setError('Please add at least one teaching class')
          setLoading(false)
          return
        }
      } else if (selectedRole === 'parent') {
        const fullName = formData.get('fullName')
        if (!fullName || fullName.trim() === '') {
          setError('Please enter your full name')
          setLoading(false)
          return
        }
        
        if (selectedChildren.length === 0) {
          setError("Please select at least one child")
          setLoading(false)
          return
        }
        
        const day = formData.get('birthDay')
        const month = formData.get('birthMonth')
        const year = formData.get('birthYear')
        
        if (!day || !month || !year) {
          setError('Please select your complete birthday')
          setLoading(false)
          return
        }
        
        const birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        
        userData = {
          ...userData,
          title: formData.get('parentTitle'),
          fullName: fullName.trim(),
          relationship: formData.get('relationship'),
          maritalStatus: formData.get('maritalStatus'),
          birthday,
          phoneNumber: formData.get('telephone'),
          mobileNumber: formData.get('mobile'),
          children: selectedChildren
        }
      }
      
      // Register user
      await register(userData, selectedRole)
      
      // Logout to force manual login
      await logout()
      
      // Show success message and redirect to login
      alert(`Registration successful! Please login with your email and password.`)
      
      // Close registration modal
      onClose()
      
      // Navigate to login page (LandingPage with login modal)
      navigate('/')
      
    } catch (err) {
      console.error('Registration error:', err)
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      })
      
      // Show detailed error message to user
      let errorMessage = err.message || 'Registration failed. Please try again.'
      
      // Add helpful context for permission errors
      if (errorMessage.includes('permission') || errorMessage.includes('insufficient')) {
        errorMessage = 'Database permission error detected. Please ask your administrator to:\n\n' +
                      '1. Go to Firebase Console > Firestore Database > Rules\n' +
                      '2. Update security rules to allow user registration\n' +
                      '3. See firestore-security-rules.txt in the project folder for the correct rules\n\n' +
                      'Technical error: ' + errorMessage
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleModalClick = (e) => {
    if (e.target.className === 'auth-modal') {
      onClose()
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    onClose() // Close register modal
    if (onLoginClick) {
      onLoginClick() // Open login modal
    }
  }

  return (
    <div className="auth-modal" onClick={handleModalClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Register</h2>
        
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
                    name="fullName"
                    placeholder="Enter your full name" 
                    disabled={loading}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="Enter your email" 
                    disabled={loading}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender*</label>
                  <select id="gender" name="gender" disabled={loading} required>
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
                    name="indexNumber"
                    placeholder="Enter your index number" 
                    disabled={loading}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="birthDay">Birthday*</label>
                    <div className="date-inputs">
                      <select id="birthDay" name="birthDay" disabled={loading} required defaultValue="">
                        <option value="">Day</option>
                        {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <select id="birthMonth" name="birthMonth" disabled={loading} required defaultValue="">
                        <option value="">Month</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'
                        ].map((month, index) => (
                          <option key={month} value={index + 1}>{month}</option>
                        ))}
                      </select>
                      <select id="birthYear" name="birthYear" disabled={loading} required defaultValue="">
                        <option value="">Year</option>
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
                    name="guardianName"
                    placeholder="Enter parent/guardian's name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    name="confirmPassword"
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
                    name="grade"
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    required
                  >
                    <option value="">Select Grade</option>
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
                      name="stream"
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
                    name="class"
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
                  name="admissionDate"
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address*</label>
                <textarea 
                  id="address"
                  name="address"
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
                  name="contactNumber"
                  placeholder="Enter your contact number" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="guardianContact">Guardian's Contact Number*</label>
                <input 
                  type="tel" 
                  id="guardianContact"
                  name="guardianContact"
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
                  <select id="title" name="title" required>
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Rev">Rev</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name*</label>
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="Enter your email" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacherIndex">Teacher's Index Number*</label>
                  <input 
                    type="text" 
                    id="teacherIndex"
                    name="teacherIndex"
                    placeholder="Enter your teacher's index number" 
                    required 
                  />
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
                      <select id="teacherGrade" name="teacherGrade">
                        <option value="">Select Grade</option>
                        {Array.from({length: 13}, (_, i) => i + 1).map(grade => (
                          <option key={grade} value={grade}>Grade {grade}</option>
                        ))}
                      </select>
                      <select id="teacherClass" name="teacherClass">
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
                    <select id="inChargeType" name="inChargeType">
                      <option value="">Select Type</option>
                      <option value="class">Class</option>
                      <option value="sport">Sport</option>
                    </select>
                    <input 
                      type="text" 
                      id="inChargeDetails"
                      name="inChargeDetails"
                      placeholder="Enter class (e.g., 10-A) or sport name" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password" 
                    required 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="parentTitle">Title*</label>
                  <select id="parentTitle" name="parentTitle" required>
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
                    name="fullName"
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="Enter your email address" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="childSelect">Select Children*</label>
                  <select 
                    id="childSelect"
                    onChange={handleChildSelect}
                    defaultValue=""
                  >
                    <option value="">Select a student to add</option>
                    {availableStudents
                      .filter(student => !selectedChildren.includes(student.indexNumber))
                      .map(student => (
                        <option key={student.id} value={student.indexNumber}>
                          {student.fullName || student.name} - {student.indexNumber} (Grade {student.grade})
                        </option>
                      ))
                    }
                  </select>
                  {selectedChildren.length > 0 && (
                    <div className="selected-children">
                      {selectedChildren.map(indexNumber => {
                        const student = availableStudents.find(s => s.indexNumber === indexNumber)
                        return student ? (
                          <div key={indexNumber} className="selected-child-item">
                            <span>{student.fullName || student.name} ({student.indexNumber})</span>
                            <button 
                              type="button"
                              onClick={() => handleChildRemove(indexNumber)}
                              className="remove-child-btn"
                            >
                              ×
                            </button>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="relationship">Parent/Guardian*</label>
                  <select id="relationship" name="relationship" required>
                    <option value="">Select Relationship</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="maritalStatus">Marital Status*</label>
                  <select id="maritalStatus" name="maritalStatus" required>
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
                    <select id="birthDay" name="birthDay" required defaultValue="">
                      <option value="">Day</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select id="birthMonth" name="birthMonth" required defaultValue="">
                      <option value="">Month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <select id="birthYear" name="birthYear" required defaultValue="">
                      <option value="">Year</option>
                      {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 50 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">Telephone Number*</label>
                  <input 
                    type="tel" 
                    id="telephone"
                    name="telephone"
                    placeholder="Enter your telephone number" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number*</label>
                  <input 
                    type="tel" 
                    id="mobile"
                    name="mobile"
                    placeholder="Enter your mobile number" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password" 
                    required 
                  />
                </div>
              </div>
            </div>
          )}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Registering...' : `Register as ${selectedRole}`}
          </button>
        </form>
        
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          Already have an account? <a href="#" onClick={handleLoginClick} style={{ color: '#4A90E2', textDecoration: 'none', cursor: 'pointer' }}>Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register
