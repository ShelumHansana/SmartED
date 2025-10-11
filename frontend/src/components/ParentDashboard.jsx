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
                {currentSubjects.map((subject, index) => {
                  const getSubjectIcon = (subjectName) => {
                    const icons = {
                      'Mathematics': '📐',
                      'Physics': '⚛️',
                      'Chemistry': '🧪',
                      'Biology': '🧬',
                      'English': '📚',
                      'Science': '🔬',
                      'Sinhala': '🇱🇰',
                      'History': '📜',
                      'Geography': '🌍',
                      'ICT': '💻'
                    };
                    return icons[subjectName] || '📖';
                  };

                  const getPerformanceLevel = (progress) => {
                    if (progress >= 95) return 'excellent';
                    return 'normal';
                  };

                  return (
                    <div 
                      key={index} 
                      className="subject-card"
                      data-performance={getPerformanceLevel(subject.progress)}
                      tabIndex="0"
                    >
                      <div className="subject-header">
                        <h4 data-subject-icon={getSubjectIcon(subject.subject)}>
                          {subject.subject}
                        </h4>
                        <span 
                          className="subject-grade" 
                          data-grade={subject.grade}
                        >
                          {subject.grade}
                        </span>
                      </div>
                      <div 
                        className="progress-bar"
                        style={{ 
                          height: '14px', 
                          width: subject.progress < 25 ? 'calc(100% - 50px)' : '100%', 
                          position: 'relative',
                          display: 'block'
                        }}
                      >
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${subject.progress}%`, 
                            height: '14px',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            zIndex: '5'
                          }}
                        ></div>
                        <span 
                          className={`progress-percentage ${subject.progress < 25 ? 'outside' : ''}`}
                          style={{
                            background: subject.progress >= 25 ? 'rgba(255, 255, 255, 0.95)' : undefined,
                            color: subject.progress >= 25 ? '#1e293b' : undefined,
                            padding: subject.progress >= 25 ? '2px 8px' : undefined,
                            borderRadius: subject.progress >= 25 ? '12px' : undefined
                          }}
                        >
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="subject-info">
                        <p>Teacher: {subject.teacher}</p>
                        <p>Assignments: {subject.completed}/{subject.assignments}</p>
                        <p>Next: {subject.upcoming}</p>
                      </div>
                    </div>
                  );
                })}
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
