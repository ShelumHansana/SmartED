import { useState } from 'react'
import StudentList from './teacher/StudentList'
import MessageBoard from './teacher/MessageBoard'
import Notepad from './Notepad'
import TodoList from './teacher/TodoList'
import ActivityUpload from './teacher/ActivityUpload'
import '../styles/TeacherDashboard.css'

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('students')

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="teacher-profile">
          <div className="profile-image">
            <img src="/teacher-avatar.svg" alt="Teacher" />
          </div>
          <h3>Mr. Smith</h3>
          <p>Mathematics</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`nav-item ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
          <button 
            className={`nav-item ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Welcome back, Mr. Smith!</h2>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="notification-badge">5</span>
              Notifications
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'students' && <StudentList />}
          {activeTab === 'messages' && <MessageBoard />}
          {activeTab === 'activities' && <ActivityUpload />}
          {activeTab === 'tools' && (
            <div className="tools-section">
              <Notepad />
              <TodoList />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboard
