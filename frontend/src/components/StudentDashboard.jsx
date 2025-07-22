import { useState } from 'react'
import Calculator from './Calculator'
import Notepad from './Notepad'
import '../styles/StudentDashboard.css'
// Default avatar image
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23CBD5E1" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 2c5.523 0 10 2.239 10 5v2H2v-2c0-2.761 4.477-5 10-5z"/%3E%3C/svg%3E'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  const studentInfo = {
    name: 'John Doe',
    grade: '10th Grade',
    courses: [
      { id: 1, name: 'Mathematics', progress: 75 },
      { id: 2, name: 'Science', progress: 60 },
      { id: 3, name: 'English', progress: 85 }
    ]
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="student-profile">
          <div className="profile-image">
            <img src={defaultAvatar} alt="Student" />
          </div>
          <h3>{studentInfo.name}</h3>
          <p>{studentInfo.grade}</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button 
            className={`nav-item ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            Study Tools
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Welcome back, {studentInfo.name}!</h2>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="notification-badge">3</span>
              Notifications
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="quick-stats">
                <div className="stat-card">
                  <h3>Courses</h3>
                  <p>{studentInfo.courses.length} Active Courses</p>
                </div>
                <div className="stat-card">
                  <h3>Average Progress</h3>
                  <p>{Math.round(
                    studentInfo.courses.reduce((acc, course) => acc + course.progress, 0) / 
                    studentInfo.courses.length
                  )}%</p>
                </div>
                <div className="stat-card">
                  <h3>Next Deadline</h3>
                  <p>Math Assignment - Tomorrow</p>
                </div>
              </div>
              
              <div className="tools-section">
                <Calculator />
                <Notepad />
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-section">
              {studentInfo.courses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.name}</h3>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p>{course.progress}% Complete</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="tools-grid">
              <Calculator />
              <Notepad />
              <div className="todo-widget">
                <h3>To-Do List</h3>
                {/* Add Todo functionality here */}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
