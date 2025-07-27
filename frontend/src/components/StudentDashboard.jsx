import { useState } from 'react'
import Calculator from './Calculator'
import Notepad from './Notepad'
import '../styles/StudentDashboard.css'
// Default avatar image
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23CBD5E1" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 2c5.523 0 10 2.239 10 5v2H2v-2c0-2.761 4.477-5 10-5z"/%3E%3C/svg%3E'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  
  const notifications = [
    { 
      id: 1, 
      title: 'Math Assignment Due', 
      message: 'Your math assignment is due tomorrow', 
      time: '2 hours ago', 
      type: 'warning',
      details: 'Your Mathematics Assignment #5 on Algebraic Equations is due tomorrow, July 27th, 2025 at 11:59 PM. This assignment covers chapters 8-10 from your textbook and includes 15 problems. Please ensure you show all your work and submit it through the online portal. Late submissions will result in a 10% penalty per day.',
      sender: 'Mr. Smith - Mathematics',
      priority: 'High'
    },
    { 
      id: 2, 
      title: 'New Message', 
      message: 'You have a new message from your teacher', 
      time: '4 hours ago', 
      type: 'info',
      details: 'Hello John, I noticed you\'ve been doing excellent work in class lately. Your participation in discussions and your recent test scores show great improvement. Keep up the good work! If you have any questions about the upcoming topics, please don\'t hesitate to ask during office hours.',
      sender: 'Ms. Johnson - English',
      priority: 'Medium'
    },
    { 
      id: 3, 
      title: 'Grade Updated', 
      message: 'Your Science test grade has been posted', 
      time: '1 day ago', 
      type: 'success',
      details: 'Your Science Test #3 on Chemical Reactions has been graded and posted. You scored 92/100 (A-). Great work on understanding the complex chemical equations! Your overall grade in Science has improved to 88%. The detailed feedback and solutions are available in your gradebook.',
      sender: 'Dr. Wilson - Science',
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
