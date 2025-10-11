import { useState } from 'react'
import '../styles/ParentDashboard.css'

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  const markAllAsRead = () => {
    setNotificationCount(0)
    setShowNotifications(false)
  }

  // Sri Lankan students data - Both O/L and A/L children
  const students = [
    {
      id: 1,
      name: 'Kamal Bandara Perera',
      class: 'Grade 12 M1',
      stream: 'Physical Science',
      level: 'A/L',
      admissionNo: 'AL2025001',
      overallGrade: 'A',
      gpa: '3.8',
      attendance: 92,
      subjects: 5,
      nextExam: 'First Term Test',
      school: 'Mahinda College, Colombo 07'
    },
    {
      id: 2,
      name: 'Sanduni Perera',
      class: 'Grade 10 A',
      level: 'O/L',
      admissionNo: 'OL2025045',
      overallGrade: 'A',
      attendance: 95,
      subjects: 8,
      nextExam: 'Monthly Test',
      school: 'Mahinda College, Colombo 07'
    }
  ]

  // Sri Lankan teachers data
  const teachers = [
    {
      id: 1,
      name: 'Mr. Sunil Perera',
      subject: 'Mathematics',
      email: 'sunil.perera@mahindacollege.lk',
      phone: '+94 77 123 4567',
      experience: '12 years',
      availability: 'Mon-Fri 8AM-3PM',
      level: 'A/L Physical Science & Bio Science'
    },
    {
      id: 2,
      name: 'Dr. Amara Silva',
      subject: 'Physics',
      email: 'amara.silva@mahindacollege.lk',
      phone: '+94 76 234 5678',
      experience: '15 years',
      availability: 'Mon-Fri 9AM-4PM',
      level: 'A/L Physical Science & Bio Science'
    },
    {
      id: 3,
      name: 'Mrs. Kushani Jayawardena',
      subject: 'Chemistry',
      email: 'kushani.j@mahindacollege.lk',
      phone: '+94 75 345 6789',
      experience: '10 years',
      availability: 'Mon-Fri 8AM-3PM',
      level: 'A/L Physical Science & Bio Science'
    },
    {
      id: 4,
      name: 'Mr. Nimal Rajapaksa',
      subject: 'English',
      email: 'nimal.rajapaksa@mahindacollege.lk',
      phone: '+94 78 456 7890',
      experience: '8 years',
      availability: 'Mon-Fri 9AM-4PM',
      level: 'All A/L Streams & O/L'
    },
    {
      id: 5,
      name: 'Mrs. Chamari Wickramasinghe',
      subject: 'Mathematics (O/L)',
      email: 'chamari.w@mahindacollege.lk',
      phone: '+94 77 567 8901',
      experience: '7 years',
      availability: 'Mon-Fri 8AM-3PM',
      level: 'O/L Grades 6-11'
    }
  ]

  // Academic progress data for selected student
  const getSubjectsProgress = (studentLevel) => {
    if (studentLevel === 'A/L') {
      return [
        {
          subject: 'Mathematics',
          grade: 'A',
          progress: 92,
          teacher: 'Mr. Sunil Perera',
          assignments: 12,
          completed: 11,
          upcoming: 'Integration Test - Oct 5'
        },
        {
          subject: 'Physics',
          grade: 'A',
          progress: 88,
          teacher: 'Dr. Amara Silva',
          assignments: 10,
          completed: 9,
          upcoming: 'Practical Test - Oct 8'
        },
        {
          subject: 'Chemistry',
          grade: 'B',
          progress: 85,
          teacher: 'Mrs. Kushani Jayawardena',
          assignments: 8,
          completed: 7,
          upcoming: 'Organic Chemistry - Oct 12'
        },
        {
          subject: 'English',
          grade: 'A',
          progress: 94,
          teacher: 'Mr. Nimal Rajapaksa',
          assignments: 6,
          completed: 6,
          upcoming: 'Essay Writing - Oct 10'
        },
        {
          subject: 'ICT',
          grade: 'A',
          progress: 96,
          teacher: 'Mr. Ravi Wickramasinghe',
          assignments: 5,
          completed: 5,
          upcoming: 'Programming Project - Oct 15'
        }
      ]
    } else {
      return [
        {
          subject: 'Mathematics',
          grade: 'A',
          progress: 95,
          teacher: 'Mrs. Chamari Wickramasinghe',
          assignments: 15,
          completed: 14,
          upcoming: 'Algebra Test - Oct 3'
        },
        {
          subject: 'Science',
          grade: 'A',
          progress: 90,
          teacher: 'Mr. Roshan Perera',
          assignments: 12,
          completed: 11,
          upcoming: 'Biology Project - Oct 7'
        },
        {
          subject: 'English',
          grade: 'A',
          progress: 93,
          teacher: 'Miss. Sandamali Fernando',
          assignments: 10,
          completed: 10,
          upcoming: 'Reading Comprehension - Oct 5'
        },
        {
          subject: 'Sinhala',
          grade: 'A',
          progress: 88,
          teacher: 'Mr. Priyantha Jayawardena',
          assignments: 8,
          completed: 7,
          upcoming: 'Essay Writing - Oct 9'
        },
        {
          subject: 'History',
          grade: 'B',
          progress: 82,
          teacher: 'Mr. Nimal Rathnayake',
          assignments: 6,
          completed: 5,
          upcoming: 'Ancient Civilizations - Oct 11'
        }
      ]
    }
  }

  // Messages from teachers
  const messages = [
    {
      id: 1,
      from: 'Mr. Sunil Perera',
      student: 'Kamal Bandara Perera',
      subject: 'Excellent Progress in A/L Mathematics',
      content: 'Kamal has been performing exceptionally well in his A/L Mathematics classes. He scored 95% on his recent Calculus unit test and shows excellent understanding of integration techniques. Keep up the good work!',
      date: '2025-09-28',
      time: '2:30 PM',
      priority: 'normal',
      read: false,
      category: 'academic'
    },
    {
      id: 2,
      from: 'Dr. Amara Silva',
      student: 'Kamal Bandara Perera',
      subject: 'Physics Practical Session Reminder',
      content: 'Dear Parent, please remind Kamal to bring his lab coat and safety glasses for tomorrow\'s Physics practical session on Electromagnetic Induction. The session starts at 9:00 AM.',
      date: '2025-09-27',
      time: '4:15 PM',
      priority: 'high',
      read: false,
      category: 'reminder'
    },
    {
      id: 3,
      from: 'Mrs. Chamari Wickramasinghe',
      student: 'Sanduni Perera',
      subject: 'Mathematics Assignment Completed',
      content: 'Sanduni has successfully completed her O/L Mathematics assignment on Algebraic Expressions. She scored full marks and her problem-solving approach was impressive. Well done!',
      date: '2025-09-26',
      time: '11:45 AM',
      priority: 'normal',
      read: true,
      category: 'academic'
    },
    {
      id: 4,
      from: 'Miss. Sandamali Fernando',
      student: 'Sanduni Perera',
      subject: 'English Speaking Competition',
      content: 'Sanduni has been selected to represent Grade 10 in the inter-school English speaking competition. Please encourage her to practice and prepare well. The competition is on October 15th.',
      date: '2025-09-25',
      time: '1:20 PM',
      priority: 'high',
      read: false,
      category: 'achievement'
    }
  ]

  // Get recent test results for selected student
  const getRecentTests = (studentLevel) => {
    if (studentLevel === 'A/L') {
      return [
        { subject: 'Mathematics', score: '95%', date: '2025-09-25', grade: 'A', type: 'Unit Test' },
        { subject: 'Physics', score: '88%', date: '2025-09-22', grade: 'B', type: 'Practical Test' },
        { subject: 'Chemistry', score: '85%', date: '2025-09-20', grade: 'B', type: 'Term Test' },
        { subject: 'English', score: '92%', date: '2025-09-18', grade: 'A', type: 'Assignment' }
      ]
    } else {
      return [
        { subject: 'Mathematics', score: '96%', date: '2025-09-24', grade: 'A', type: 'Monthly Test' },
        { subject: 'Science', score: '94%', date: '2025-09-21', grade: 'A', type: 'Unit Test' },
        { subject: 'English', score: '93%', date: '2025-09-19', grade: 'A', type: 'Assignment' },
        { subject: 'Sinhala', score: '90%', date: '2025-09-17', grade: 'A', type: 'Essay' }
      ]
    }
  }

  const notifications = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      message: 'Scheduled for October 5th at 2:00 PM',
      time: '2 hours ago',
      type: 'info'
    },
    {
      id: 2,
      title: 'School Fee Payment',
      message: 'Third term fees due by October 10th',
      time: '1 day ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Academic Achievement',
      message: 'Sanduni selected for English competition',
      time: '2 days ago',
      type: 'success'
    }
  ]

  const unreadMessages = messages.filter(m => !m.read).length

  const currentStudent = students[selectedStudent]
  const currentSubjects = getSubjectsProgress(currentStudent.level)
  const currentTests = getRecentTests(currentStudent.level)



  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="parent-profile">
          <div className="profile-image">
            <img src="/parent-avatar.svg" alt="Parent" />
          </div>
          <h3>Mr. & Mrs. Perera</h3>
          <p>Parent Portal</p>
          <p>Mahinda College</p>
        </div>
        
        <div className="student-selector">
          <h4>Select Child</h4>
          <div className="student-tabs">
            {students.map((student, index) => (
              <button
                key={student.id}
                className={`student-tab ${selectedStudent === index ? 'active' : ''}`}
                onClick={() => setSelectedStudent(index)}
              >
                <div className="student-tab-info">
                  <span className="student-name">{student.name.split(' ')[0]}</span>
                  <span className="student-class">{student.class}</span>
                  <span className="student-level">{student.level}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Academic Progress
          </button>
          <button 
            className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers
          </button>
          <button 
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
            {unreadMessages > 0 && (
              <span className="notification-badge">{unreadMessages}</span>
            )}
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-info">
            <h2>
              {currentStudent.name} - {currentStudent.class}
              {currentStudent.stream && ` (${currentStudent.stream})`}
            </h2>
            <p>{currentStudent.school}</p>
          </div>
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
              <div className="student-stats">
                <div className="stat-card">
                  <h3>Overall Grade</h3>
                  <div className="stat-value grade">{currentStudent.overallGrade}</div>
                  {currentStudent.gpa && <p>GPA: {currentStudent.gpa}</p>}
                </div>
                <div className="stat-card">
                  <h3>Attendance</h3>
                  <div className="stat-value attendance">{currentStudent.attendance}%</div>
                  <p>Above average</p>
                </div>
                <div className="stat-card">
                  <h3>Active Subjects</h3>
                  <div className="stat-value subjects">{currentStudent.subjects}</div>
                  <p>All enrolled</p>
                </div>
                <div className="stat-card">
                  <h3>Next Exam</h3>
                  <div className="stat-value exam">{currentStudent.nextExam}</div>
                  <p>Coming up</p>
                </div>
              </div>

              <div className="recent-tests">
                <h3>Recent Test Results</h3>
                <div className="test-list">
                  {currentTests.map((test, index) => (
                    <div key={index} className="test-item">
                      <div className="test-subject">{test.subject}</div>
                      <div className="test-score">{test.score}</div>
                      <div className="test-grade">{test.grade}</div>
                      <div className="test-date">{test.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-section">
              <h3>Academic Progress - {currentStudent.level} Level</h3>
              <div className="subjects-grid">
                {currentSubjects.map((subject, index) => (
                  <div key={index} className="subject-card">
                    <div className="subject-header">
                      <h4>{subject.subject}</h4>
                      <span className="subject-grade">{subject.grade}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <div className="subject-info">
                      <p>Teacher: {subject.teacher}</p>
                      <p>Assignments: {subject.completed}/{subject.assignments}</p>
                      <p>Next: {subject.upcoming}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="teachers-section">
              <h3>Teachers Directory</h3>
              <div className="teachers-grid">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="teacher-card">
                    <h4>{teacher.name}</h4>
                    <p className="teacher-subject">{teacher.subject}</p>
                    <p className="teacher-level">{teacher.level}</p>
                    <div className="teacher-contact">
                      <p>📧 {teacher.email}</p>
                      <p>📞 {teacher.phone}</p>
                      <p>⏰ {teacher.availability}</p>
                      <p>🎓 {teacher.experience}</p>
                    </div>
                    <button className="contact-btn">Send Message</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="messages-section">
              <h3>Messages from Teachers</h3>
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message.id} className={`message-card ${!message.read ? 'unread' : ''}`}>
                    <div className="message-header">
                      <h4>{message.subject}</h4>
                      <span className="message-time">{message.date} at {message.time}</span>
                    </div>
                    <div className="message-from">
                      <strong>{message.from}</strong> - {message.student}
                    </div>
                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>
                    <div className="message-actions">
                      <button className="reply-btn">Reply</button>
                      {!message.read && (
                        <button className="mark-read-btn">Mark as Read</button>
                      )}
                    </div>
                    <span className={`priority-badge ${message.priority}`}>
                      {message.priority} priority
                    </span>
                  </div>
                ))}
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
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
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
    </div>
  )
}

export default ParentDashboard;
