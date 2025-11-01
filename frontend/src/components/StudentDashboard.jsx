import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFirestore } from '../hooks/useFirestore'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import Calculator from './Calculator'
import Notepad from './Notepad'
import StudentProgress from './dashboard/StudentProgress'
import '../styles/StudentDashboard.css'

// Default avatar image
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23CBD5E1" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 2c5.523 0 10 2.239 10 5v2H2v-2c0-2.761 4.477-5 10-5z"/%3E%3C/svg%3E'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  const [grades, setGrades] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch student data from Firestore
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user || !user.id) {
        console.log('User not ready:', user);
        return;
      }

      console.log('StudentDashboard - User data:', {
        id: user.id,
        grade: user.grade,
        className: user.className,
        class: user.class,
        fullName: user.fullName,
        indexNumber: user.indexNumber
      });

      try {
        setLoading(true)

        // Fetch grades
        const gradesQuery = query(
          collection(db, 'grades'),
          where('studentId', '==', user.id)
        )
        const gradesSnapshot = await getDocs(gradesQuery)
        const gradesData = gradesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setGrades(gradesData)

        // Fetch assignments/assessments - only if grade and className are available
        if (user.grade && user.className) {
          console.log('Fetching assignments for:', { grade: user.grade, className: user.className });
          const assignmentsQuery = query(
            collection(db, 'assessments'),
            where('grade', '==', user.grade),
            where('className', '==', user.className)
          )
          const assignmentsSnapshot = await getDocs(assignmentsQuery)
          const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          console.log('Assignments loaded:', assignmentsData.length);
          setAssignments(assignmentsData)
        } else {
          console.log('Missing grade or className:', { grade: user.grade, className: user.className });
          setAssignments([])
        }

        // Fetch notifications
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.id)
        )
        const notificationsSnapshot = await getDocs(notificationsQuery)
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setNotifications(notificationsData)
        setNotificationCount(notificationsData.filter(n => !n.read).length)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching student data:', error)
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  // Calculate student data from user profile and grades
  const studentData = user ? {
    name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student',
    studentId: user.indexNumber || user.id,
    grade: `Grade ${user.grade || 'N/A'}`,
    stream: user.stream || undefined,
    className: user.className || user.class || 'N/A',
    class: user.className || user.class || 'N/A', // Added for backward compatibility
    level: (user.grade === '12' || user.grade === '13') ? 'A/L' : 'O/L',
    year: new Date().getFullYear().toString(),
    subjects: grades.map((grade, index) => ({
      id: index + 1,
      name: grade.subject || 'Subject',
      code: grade.subjectCode || 'CODE',
      progress: grade.progress || Math.round(Math.random() * 40 + 60),
      grade: grade.letterGrade || calculateLetterGrade(grade.marks),
      marks: grade.marks || 0,
      credits: grade.credits || 4
    })),
    upcomingExams: assignments.filter(a => a.type === 'exam').slice(0, 3).map(exam => ({
      subject: exam.subject,
      date: exam.dueDate || exam.date,
      type: exam.examType || 'Exam'
    })),
    achievements: user.achievements || [
      'Welcome to SmartED!',
      'Start your learning journey'
    ]
  } : null

  // Helper function to calculate letter grade
  function calculateLetterGrade(marks) {
    if (marks >= 90) return 'A+'
    if (marks >= 80) return 'A'
    if (marks >= 70) return 'B+'
    if (marks >= 60) return 'B'
    if (marks >= 50) return 'C'
    if (marks >= 40) return 'D'
    return 'F'
  }

  if (loading || !studentData) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          color: '#4A90E2'
        }}>
          Loading student dashboard...
        </div>
      </div>
    )
  }

  const markAllAsRead = () => {
    setNotificationCount(0)
    setShowNotifications(false)
  }

  const openMessageDetail = (notification) => {
    setSelectedMessage(notification)
    setShowMessageDetail(true)
  }

  const closeMessageDetail = () => {
    setSelectedMessage(null)
    setShowMessageDetail(false)
  }

  const markSingleAsRead = (notificationId) => {
    setReadNotifications(prev => new Set(prev).add(notificationId))
    setNotificationCount(prev => Math.max(0, prev - 1))
    closeMessageDetail()
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  


  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="student-profile">
          <div className="profile-image">
            <img src={defaultAvatar} alt="Student" />
          </div>
          <h3>{studentData.name}</h3>
          <div className="student-info">
            <p className="student-id">ID: {studentData.studentId}</p>
            <p className="student-grade">
              {studentData.level === 'A/L' 
                ? `${studentData.grade} - ${studentData.stream || 'Stream'}` 
                : `${studentData.grade} - Class ${studentData.className || 'N/A'}`
              }
            </p>
          </div>
          <div className="level-badge">
            <span className={`badge ${studentData.level.toLowerCase().replace('/', '-')}`}>
              {studentData.level} Student
            </span>
          </div>
        </div>
        
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            <span className="nav-icon">📚</span>
            {studentData.level === 'A/L' ? 'My Subjects' : 'My Subjects'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            <span className="nav-icon">📈</span>
            Academic Progress
          </button>
          <button 
            className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            <span className="nav-icon">📝</span>
            {studentData.level === 'A/L' ? 'A/L Preparation' : 'Examinations'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            <span className="nav-icon">🛠️</span>
            Study Tools
          </button>
          {studentData.level === 'A/L' && (
            <button 
              className={`nav-item ${activeTab === 'university' ? 'active' : ''}`}
              onClick={() => setActiveTab('university')}
            >
              <span className="nav-icon">🎓</span>
              University Prep
            </button>
          )}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Welcome back, {studentData.name}!</h2>
          <div className="header-actions">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
              Notifications
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="quick-stats">
                <div className="stat-card">
                  <h3>{studentData.level === 'A/L' ? 'Subjects' : 'Subjects'}</h3>
                  <p>{studentData.subjects.length} Active Subjects</p>
                </div>
                <div className="stat-card">
                  <h3>Average Progress</h3>
                  <p>{Math.round(
                    studentData.subjects.reduce((acc, subject) => acc + subject.progress, 0) / 
                    studentData.subjects.length
                  )}%</p>
                </div>
                <div className="stat-card">
                  <h3>Next Exam</h3>
                  <p>{studentData.upcomingExams[0]?.subject} - {studentData.upcomingExams[0]?.date}</p>
                </div>
                <div className="stat-card">
                  <h3>Current Level</h3>
                  <p>{studentData.level} - {studentData.year}</p>
                </div>
              </div>

              <div className="achievements-section">
                <h3>🏆 Recent Achievements</h3>
                <div className="achievements-list">
                  {studentData.achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <span className="achievement-icon">🎯</span>
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="tools-section">
                <Calculator />
                <Notepad />
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="subjects-section">
              <h3>{studentData.level} Subject Performance</h3>
              <div className="subjects-grid">
                {studentData.subjects.map(subject => (
                  <div key={subject.id} className="subject-card">
                    <div className="subject-header">
                      <h4>{subject.name}</h4>
                      <span className="subject-code">{subject.code}</span>
                    </div>
                    <div className="subject-stats">
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress" 
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">{subject.progress}% Complete</span>
                      </div>
                      <div className="grade-info">
                        <span className="current-grade">Grade: {subject.grade}</span>
                        {studentData.level === 'O/L' && (
                          <span className="marks">Marks: {subject.marks}/100</span>
                        )}
                        {studentData.level === 'A/L' && (
                          <span className="credits">Credits: {subject.credits}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-section">
              <StudentProgress studentLevel={studentData.level} />
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="exams-section">
              <h3>🗓️ Upcoming {studentData.level} Examinations</h3>
              <div className="exams-list">
                {studentData.upcomingExams.map((exam, index) => (
                  <div key={index} className="exam-card">
                    <div className="exam-header">
                      <h4>{exam.subject}</h4>
                      <span className={`exam-type ${exam.type.toLowerCase().replace(' ', '-')}`}>
                        {exam.type}
                      </span>
                    </div>
                    <div className="exam-details">
                      <div className="exam-date">
                        <span className="date-icon">📅</span>
                        <span>{new Date(exam.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="days-until">
                        {Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {studentData.level === 'A/L' && (
                <div className="al-exam-info">
                  <h4>📖 A/L Examination Information</h4>
                  <div className="info-cards">
                    <div className="info-card">
                      <h5>Examination Year</h5>
                      <p>{studentData.year} A/L Examination</p>
                    </div>
                    <div className="info-card">
                      <h5>Stream</h5>
                      <p>{studentData.stream}</p>
                    </div>
                    <div className="info-card">
                      <h5>Total Credits</h5>
                      <p>{studentData.subjects.reduce((sum, sub) => sum + (sub.credits || 0), 0)} Credits</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="tools-grid">
              <Calculator />
              <Notepad />
              <div className="todo-widget">
                <h3>📝 Study Planner</h3>
                <div className="study-tips">
                  {studentData.level === 'A/L' ? (
                    <ul>
                      <li>🎯 Focus on past paper practice</li>
                      <li>📊 Create mind maps for complex topics</li>
                      <li>⏰ Follow a strict study timetable</li>
                      <li>🤝 Form study groups with classmates</li>
                    </ul>
                  ) : (
                    <ul>
                      <li>📖 Complete daily homework regularly</li>
                      <li>🔄 Review previous lessons weekly</li>
                      <li>❓ Ask questions when in doubt</li>
                      <li>🎨 Use visual aids for better understanding</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'university' && studentData.level === 'A/L' && (
            <div className="university-section">
              <h3>🎓 University Preparation</h3>
              <div className="university-info">
                <div className="info-card">
                  <h4>Admission Requirements</h4>
                  <p>Maintain high grades in core subjects for university admission</p>
                  <ul>
                    <li>Mathematics: Minimum B grade required</li>
                    <li>Science subjects: Consistent performance needed</li>
                    <li>English: Essential for all degree programs</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h4>Career Guidance</h4>
                  <p>Based on your {studentData.stream} stream:</p>
                  <ul>
                    <li>Engineering Programs</li>
                    <li>Medical Sciences</li>
                    <li>Physical Sciences</li>
                    <li>Computer Science & IT</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h4>Study Resources</h4>
                  <ul>
                    <li>📚 A/L Past Papers (2015-2024)</li>
                    <li>🔬 Laboratory Manuals</li>
                    <li>💻 Online Learning Platforms</li>
                    <li>📖 Reference Books & Guides</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Notification Panel */}
      <div className={`notification-panel ${showNotifications ? 'open' : ''}`}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button 
            className="close-notifications"
            onClick={() => setShowNotifications(false)}
          >
            ×
          </button>
        </div>
        <div className="notification-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.type} ${readNotifications.has(notification.id) ? 'read' : ''}`}
              onClick={() => openMessageDetail(notification)}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="notification-footer">
          <button className="mark-all-read" onClick={markAllAsRead}>
            Mark all as read
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showNotifications && (
        <div 
          className="notification-overlay"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Message Detail Modal */}
      {showMessageDetail && selectedMessage && (
        <div className="message-detail-modal">
          <div className="message-detail-overlay" onClick={closeMessageDetail} />
          <div className="message-detail-content">
            <div className="message-detail-header">
              <div className="message-detail-title">
                <h2>{selectedMessage.title}</h2>
                <span className={`priority-badge ${selectedMessage.priority.toLowerCase()}`}>
                  {selectedMessage.priority} Priority
                </span>
              </div>
              <button className="close-message-detail" onClick={closeMessageDetail}>
                ×
              </button>
            </div>
            <div className="message-detail-body">
              <div className="message-meta">
                <div className="meta-item">
                  <strong>From:</strong> {selectedMessage.sender}
                </div>
                <div className="meta-item">
                  <strong>Time:</strong> {selectedMessage.time}
                </div>
                <div className="meta-item">
                  <strong>Type:</strong> 
                  <span className={`type-badge ${selectedMessage.type}`}>
                    {selectedMessage.type.charAt(0).toUpperCase() + selectedMessage.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="message-content-detail">
                <p>{selectedMessage.details}</p>
              </div>
            </div>
            <div className="message-detail-footer">
              <button className="reply-btn">Reply</button>
              <button 
                className="mark-read-btn" 
                onClick={() => markSingleAsRead(selectedMessage.id)}
              >
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
