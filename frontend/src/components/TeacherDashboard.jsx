import { useState } from 'react'
import StudentList from './teacher/StudentList'
import MessageBoard from './teacher/MessageBoard'
import Notepad from './Notepad'
import TodoList from './teacher/TodoList'
import ActivityUpload from './teacher/ActivityUpload'
import GradeEntry from './teacher/GradeEntry'
import GradeAnalytics from './teacher/GradeAnalytics'
import '../styles/TeacherDashboard.css'

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('students')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(5)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  
  const notifications = [
    { 
      id: 1, 
      title: 'New Student Registration', 
      message: 'Kamal Perera has registered for your A/L Mathematics class', 
      time: '1 hour ago', 
      type: 'info',
      details: 'Student Kamal Perera (Admission No: AL2025001) has successfully registered for your Advanced Level Mathematics class for Physical Science stream. Please review his O/L results and add him to your Grade 12 M1 class roster. His contact information and guardian details are available in the student management system.',
      sender: 'Registration System',
      priority: 'Medium'
    },
    { 
      id: 2, 
      title: 'Assignment Submitted', 
      message: '18 students have submitted their Calculus homework', 
      time: '3 hours ago', 
      type: 'success',
      details: 'A total of 18 students have submitted their Mathematics Assignment on Differential Calculus. The submission deadline was today at 11:59 PM. You can now review and grade these submissions in the assignments section. This covers Grade 12 Physical Science and Bio Science streams.',
      sender: 'Assignment System',
      priority: 'Low'
    },
    { 
      id: 3, 
      title: 'Parent Message', 
      message: 'Mrs. Sanduni Silva sent you a message about her daughter', 
      time: '5 hours ago', 
      type: 'warning',
      details: 'Dear Mr. Sunil Perera, I am writing to discuss my daughter Tharika\'s recent performance in your A/L Mathematics class. She has been struggling with the Integration topics and I would appreciate if we could schedule a meeting to discuss how we can support her learning at home. Please let me know your available times this week. Thank you for your dedication to teaching our children.',
      sender: 'Mrs. Sanduni Silva',
      priority: 'High'
    },
    { 
      id: 4, 
      title: 'Term Test Deadline', 
      message: 'Reminder: First Term marks due this Friday', 
      time: '1 day ago', 
      type: 'warning',
      details: 'This is a reminder that all marks for the First Term Test must be submitted by Friday, September 30th, 2025 at 5:00 PM. Please ensure all A/L Mathematics tests for Grade 12 and Grade 13 are graded and entered into the system. Late submissions may affect the term report generation.',
      sender: 'Academic Office - Mahinda College',
      priority: 'High'
    },
    { 
      id: 5, 
      title: 'A/L Syllabus Update', 
      message: 'New A/L Mathematics syllabus features available', 
      time: '2 days ago', 
      type: 'info',
      details: 'The Department of Education has released updates to the A/L Mathematics syllabus including: new topics in Applied Mathematics, revised marking schemes for practical assessments, and enhanced university entrance preparation materials. Please check the syllabus section for detailed guides.',
      sender: 'Department of Education',
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
        <div className="teacher-profile">
          <div className="profile-image">
            <img src="/teacher-avatar.svg" alt="Teacher" />
          </div>
          <h3>Mr. Sunil Perera</h3>
          <p>Mathematics Teacher</p>
          <p>A/L Physical Science</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            Grades
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
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
          <h2>Welcome back, Mr. Sunil Perera!</h2>
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
          {activeTab === 'students' && <StudentList />}
          {activeTab === 'grades' && <GradeEntry />}
          {activeTab === 'analytics' && <GradeAnalytics />}
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

export default TeacherDashboard
