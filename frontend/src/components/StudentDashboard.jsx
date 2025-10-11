import { useState, useEffect } from 'react'
import Calculator from './Calculator'
import Notepad from './Notepad'
import StudentProgress from './dashboard/StudentProgress'
import '../styles/StudentDashboard.css'

// Default avatar image
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23CBD5E1" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 2c5.523 0 10 2.239 10 5v2H2v-2c0-2.761 4.477-5 10-5z"/%3E%3C/svg%3E'

// Student data based on their level - this would come from authentication/context in a real app
const getStudentData = () => {
  // In a real application, this would come from authentication context or API
  // For demo purposes, we'll simulate different student types
  const studentType = localStorage.getItem('studentType') || 'AL'; // AL or OL
  
  if (studentType === 'AL') {
    return {
      name: 'Kamal Perera',
      studentId: 'ST2025001',
      grade: 'Grade 12',
      stream: 'Physical Science Stream',
      level: 'A/L',
      year: '2025',
      subjects: [
        { id: 1, name: 'Mathematics', code: 'MATH_AL', progress: 78, grade: 'A', credits: 4 },
        { id: 2, name: 'Physics', code: 'PHYS_AL', progress: 82, grade: 'A', credits: 4 },
        { id: 3, name: 'Chemistry', code: 'CHEM_AL', progress: 85, grade: 'A', credits: 4 },
        { id: 4, name: 'English', code: 'ENG_AL', progress: 75, grade: 'B', credits: 3 },
        { id: 5, name: 'ICT', code: 'ICT_AL', progress: 92, grade: 'A', credits: 4 }
      ],
      upcomingExams: [
        { subject: 'Mathematics', date: '2025-10-15', type: 'Model Paper' },
        { subject: 'Physics', date: '2025-10-20', type: 'Practical Exam' },
        { subject: 'Chemistry', date: '2025-10-25', type: 'Theory Exam' }
      ],
      achievements: [
        'Merit Award in Physics Olympiad 2024',
        'Best Student in Mathematics - Term 2',
        'Science Fair First Place 2024'
      ]
    }
  } else {
    return {
      name: 'Tharindu Silva',
      studentId: 'ST2025002',
      grade: 'Grade 10',
      class: 'Class A',
      level: 'O/L',
      year: '2025',
      subjects: [
        { id: 1, name: 'Mathematics', code: 'MATH_OL', progress: 82, grade: 'A', marks: 87 },
        { id: 2, name: 'Science', code: 'SCI_OL', progress: 78, grade: 'B+', marks: 82 },
        { id: 3, name: 'English', code: 'ENG_OL', progress: 75, grade: 'B+', marks: 79 },
        { id: 4, name: 'Sinhala', code: 'SIN_OL', progress: 88, grade: 'A', marks: 89 },
        { id: 5, name: 'History', code: 'HIS_OL', progress: 80, grade: 'B+', marks: 83 },
        { id: 6, name: 'Geography', code: 'GEO_OL', progress: 85, grade: 'A', marks: 86 },
        { id: 7, name: 'Art', code: 'ART_OL', progress: 90, grade: 'A', marks: 91 },
        { id: 8, name: 'Health & PE', code: 'PE_OL', progress: 95, grade: 'A+', marks: 96 }
      ],
      upcomingExams: [
        { subject: 'Mathematics', date: '2025-10-12', type: 'Term Test' },
        { subject: 'Science', date: '2025-10-18', type: 'Practical Assessment' },
        { subject: 'English', date: '2025-10-22', type: 'Essay Writing' }
      ],
      achievements: [
        'Class Topper - Mathematics',
        'Perfect Attendance Award',
        'Inter-school Art Competition Winner'
      ]
    }
  }
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  const [studentData, setStudentData] = useState(null)

  // Initialize student data based on their level
  useEffect(() => {
    const data = getStudentData()
    setStudentData(data)
  }, [])

  if (!studentData) {
    return <div className="loading">Loading student dashboard...</div>
  }

  // Generate level-specific notifications
  const notifications = studentData.level === 'A/L' ? [
    { 
      id: 1, 
      title: 'A/L Mathematics Model Paper', 
      message: 'Practice paper for upcoming A/L exam', 
      time: '2 hours ago', 
      type: 'warning',
      details: 'Your A/L Mathematics Model Paper #3 is scheduled for tomorrow. This paper covers Advanced Functions, Calculus, and Coordinate Geometry. Make sure to bring your calculator and mathematical instruments. The exam duration is 3 hours and will be held in Hall A from 8:00 AM.',
      sender: 'Mr. Sunil Perera - Mathematics',
      priority: 'High'
    },
    { 
      id: 2, 
      title: 'Physics Practical Assessment', 
      message: 'Lab practical exam next week', 
      time: '4 hours ago', 
      type: 'info',
      details: 'Your Physics Practical Assessment is scheduled for next week. The practical will cover experiments on Wave Motion, Optics, and Electricity. Please review your lab manual and practice calculations. Lab coats and safety goggles are mandatory.',
      sender: 'Dr. Amara Silva - Physics',
      priority: 'Medium'
    },
    { 
      id: 3, 
      title: 'Chemistry Grade Updated', 
      message: 'Your latest chemistry test results are available', 
      time: '1 day ago', 
      type: 'success',
      details: 'Your Chemistry Test on Organic Chemistry has been graded. You scored 85/100 (A grade). Excellent work on understanding reaction mechanisms! Your overall A/L Chemistry grade is now 84%. Keep up the excellent work as you prepare for the final A/L examination.',
      sender: 'Mrs. Kushani Jayawardena - Chemistry',
      priority: 'Low'
    }
  ] : [
    { 
      id: 1, 
      title: 'O/L Mathematics Assignment', 
      message: 'Algebra homework due tomorrow', 
      time: '3 hours ago', 
      type: 'warning',
      details: 'Your O/L Mathematics homework on Algebraic Expressions (Chapter 5) is due tomorrow. Complete exercises 5.1 to 5.5 from your textbook. Show all working clearly and submit during the first period. Remember to bring your exercise book.',
      sender: 'Mrs. Chamari Wickramasinghe - Mathematics',
      priority: 'High'
    },
    { 
      id: 2, 
      title: 'Science Project Reminder', 
      message: 'Environmental science project deadline approaching', 
      time: '5 hours ago', 
      type: 'info',
      details: 'Your Environmental Science project on "Water Pollution in Sri Lanka" is due next Friday. Make sure to include your research findings, photographs, and proposed solutions. The project should be 5-7 pages long with proper references.',
      sender: 'Mr. Roshan Perera - Science',
      priority: 'Medium'
    },
    { 
      id: 3, 
      title: 'English Essay Results', 
      message: 'Your essay grades are now available', 
      time: '1 day ago', 
      type: 'success',
      details: 'Your English Essay on "The Impact of Technology on Education" has been graded. You received a B+ grade (79/100). Good use of examples and clear arguments. Work on improving your conclusion paragraphs for even better results.',
      sender: 'Ms. Priyanka Fernando - English',
      priority: 'Low'
    }
  ]

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
  


  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="student-profile">
          <div className="profile-image">
            <img src={defaultAvatar} alt="Student" />
          </div>
          <h3>{studentData.name}</h3>
          <p className="student-id">ID: {studentData.studentId}</p>
          <p className="student-level">
            {studentData.level === 'A/L' 
              ? `${studentData.grade} - ${studentData.stream}` 
              : `${studentData.grade} - ${studentData.class}`
            }
          </p>
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
