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
  const [activities, setActivities] = useState([])
  const [messages, setMessages] = useState([])
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

        // Get student's class in the format teachers use: "grade-className" (e.g., "10-D")
        const className = user.className || user.class
        const studentClass = user.grade && className ? `${user.grade}-${className}` : (user.originalClassInfo || className)

        console.log('Student class format for queries:', studentClass);

        // Fetch activities for student's class
        if (studentClass) {
          const activitiesQuery = query(
            collection(db, 'activities'),
            where('class', '==', studentClass)
          )
          const activitiesSnapshot = await getDocs(activitiesQuery)
          const activitiesData = activitiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          console.log('Activities loaded:', activitiesData.length);
          setActivities(activitiesData)
        }

        // Fetch messages for student's class
        if (studentClass) {
          const messagesQuery = query(
            collection(db, 'messages'),
            where('class', '==', studentClass)
          )
          const messagesSnapshot = await getDocs(messagesQuery)
          const messagesData = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }))
          console.log('Messages loaded:', messagesData.length);
          setMessages(messagesData)
        }

        // Fetch assignments/assessments - only if grade and className are available
        if (user.grade && studentClass) {
          console.log('Fetching assignments for:', { grade: user.grade, className: studentClass });
          const assignmentsQuery = query(
            collection(db, 'assessments'),
            where('grade', '==', user.grade),
            where('className', '==', studentClass)
          )
          const assignmentsSnapshot = await getDocs(assignmentsQuery)
          const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          console.log('Assignments loaded:', assignmentsData.length);
          setAssignments(assignmentsData)
        } else {
          console.log('Missing grade or className:', { grade: user.grade, className: studentClass });
          setAssignments([])
        }

        // Fetch notifications (all types: messages, activities, grades)
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.id)
        )
        const notificationsSnapshot = await getDocs(notificationsQuery)
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()
        }))
        // Sort by createdAt descending (newest first)
        notificationsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0)
          const dateB = b.createdAt?.toDate?.() || new Date(0)
          return dateB - dateA
        })
        setNotifications(notificationsData)
        setNotificationCount(notificationsData.filter(n => !n.read).length)

        console.log(`📬 StudentDashboard - Fetched ${notificationsData.length} notifications`)
        console.log('Notification breakdown:', {
          total: notificationsData.length,
          unread: notificationsData.filter(n => !n.read).length,
          messages: notificationsData.filter(n => n.type === 'message').length,
          activities: notificationsData.filter(n => n.type === 'activity').length,
          grades: notificationsData.filter(n => n.type === 'grade').length
        })
        if (notificationsData.length > 0) {
          console.log('Latest notification:', notificationsData[0])
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching student data:', error)
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user?.id) return

    const pollNotifications = async () => {
      try {
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.id)
        )
        const notificationsSnapshot = await getDocs(notificationsQuery)
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()
        }))
        // Sort by createdAt descending
        notificationsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0)
          const dateB = b.createdAt?.toDate?.() || new Date(0)
          return dateB - dateA
        })
        setNotifications(notificationsData)
        setNotificationCount(notificationsData.filter(n => !n.read).length)
        
        console.log(`🔄 StudentDashboard - Polled notifications: ${notificationsData.length} total, ${notificationsData.filter(n => !n.read).length} unread`)
      } catch (error) {
        console.error('Error polling notifications:', error)
      }
    }

    // Poll immediately, then every 30 seconds
    const interval = setInterval(pollNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [user?.id])

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

              {/* Activities/Assignments Section */}
              <div className="activities-section modern-section">
                <div className="section-header-modern">
                  <div className="header-icon-wrapper activity-icon">
                    <span className="header-icon">📚</span>
                  </div>
                  <div className="header-text">
                    <h3>Recent Activities & Assignments</h3>
                    <p>{activities.length} total activities</p>
                  </div>
                </div>
                <div className="modern-cards-grid">
                  {activities.length === 0 ? (
                    <div className="empty-state-modern">
                      <span className="empty-icon">📭</span>
                      <p>No activities assigned yet</p>
                    </div>
                  ) : (
                    activities.slice(0, 5).map(activity => (
                      <div key={activity.id} className="modern-activity-card">
                        <div className="card-ribbon">
                          <span className={`ribbon-badge ribbon-${activity.type}`}>
                            {activity.type?.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="modern-card-header">
                          <h4 className="card-title">{activity.title}</h4>
                          <div className="due-date-badge">
                            <span className="date-icon">📅</span>
                            <span className="date-text">{activity.dueDate}</span>
                          </div>
                        </div>
                        <p className="card-description">{activity.description}</p>
                        <div className="card-footer-meta">
                          {activity.teacherName && (
                            <div className="meta-item">
                              <span className="meta-icon">👨‍🏫</span>
                              <span className="meta-text">{activity.teacherName}</span>
                            </div>
                          )}
                          {activity.subject && (
                            <div className="meta-item">
                              <span className="meta-icon">📖</span>
                              <span className="meta-text">{activity.subject}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Messages Section */}
              <div className="messages-section modern-section">
                <div className="section-header-modern">
                  <div className="header-icon-wrapper message-icon">
                    <span className="header-icon">💬</span>
                  </div>
                  <div className="header-text">
                    <h3>Recent Messages</h3>
                    <p>{messages.length} unread messages</p>
                  </div>
                </div>
                <div className="modern-messages-list">
                  {messages.length === 0 ? (
                    <div className="empty-state-modern">
                      <span className="empty-icon">📪</span>
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.slice(0, 5).map(message => (
                      <div key={message.id} className="modern-message-card">
                        <div className="message-card-avatar">
                          <div className="avatar-circle">
                            {(message.teacherName || 'T').charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="message-card-content">
                          <div className="message-card-header">
                            <strong className="sender-name">{message.teacherName || 'Teacher'}</strong>
                            <span className="message-timestamp">{message.date}</span>
                          </div>
                          <p className="message-text">{message.content}</p>
                          {message.subject && (
                            <div className="message-subject-tag">
                              <span className="tag-icon">📖</span>
                              <span className="tag-text">{message.subject}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
          <h3>🔔 Notifications</h3>
          <button 
            className="close-notifications"
            onClick={() => setShowNotifications(false)}
          >
            ×
          </button>
        </div>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <div className="empty-notification-icon">📭</div>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map(notification => {
              // Determine icon based on notification type
              const getNotificationIcon = (type) => {
                switch(type) {
                  case 'message': return '💬'
                  case 'activity': return '📚'
                  case 'grade': return '📊'
                  default: return '🔔'
                }
              }

              // Format the timestamp
              const formatTimestamp = (date) => {
                if (!date) return 'Just now'
                
                const now = new Date()
                const notifDate = typeof date === 'string' ? new Date(date) : date
                const diffMs = now - notifDate
                const diffMins = Math.floor(diffMs / 60000)
                const diffHours = Math.floor(diffMs / 3600000)
                const diffDays = Math.floor(diffMs / 86400000)
                
                if (diffMins < 1) return 'Just now'
                if (diffMins < 60) return `${diffMins}m ago`
                if (diffHours < 24) return `${diffHours}h ago`
                if (diffDays === 1) return 'Yesterday'
                if (diffDays < 7) return `${diffDays}d ago`
                
                return notifDate.toLocaleDateString()
              }

              return (
                <div 
                  key={notification.id} 
                  className={`notification-item notification-${notification.type} ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon-wrapper">
                    <span className="notification-icon-emoji">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="notification-content-wrapper">
                    <div className="notification-content">
                      <h4 className="notification-title">{notification.title}</h4>
                      <p className="notification-message">{notification.message}</p>
                      <div className="notification-meta">
                        {notification.teacherName && (
                          <span className="notification-teacher">
                            <span className="meta-icon">👨‍🏫</span>
                            {notification.teacherName}
                          </span>
                        )}
                        {notification.subject && (
                          <span className="notification-subject">
                            <span className="meta-icon">📖</span>
                            {notification.subject}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="notification-timestamp">
                      {formatTimestamp(notification.createdAt?.toDate?.() || notification.date)}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              )
            })
          )}
        </div>
        {notifications.length > 0 && (
          <div className="notification-footer">
            <button 
              className="mark-all-read"
              onClick={markAllAsRead}
            >
              ✓ Mark all as read
            </button>
          </div>
        )}
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
