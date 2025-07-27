import { useState } from 'react'
import '../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(4)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())

  const [stats, setStats] = useState({
    totalStudents: 156,
    totalTeachers: 12,
    totalCourses: 24,
    activeUsers: 168
  })

  const [recentActivities] = useState([
    { id: 1, type: 'New Registration', user: 'John Doe', role: 'Student', time: '2 hours ago' },
    { id: 2, type: 'Course Added', user: 'Jane Smith', role: 'Teacher', time: '3 hours ago' },
    { id: 3, type: 'Report Generated', user: 'Admin', role: 'Admin', time: '5 hours ago' }
  ])

  const notifications = [
    { 
      id: 1, 
      title: 'System Maintenance', 
      message: 'Scheduled maintenance tonight at 2 AM', 
      time: '30 minutes ago', 
      type: 'warning',
      details: 'Scheduled system maintenance will occur tonight from 2:00 AM to 4:00 AM EST. During this time, the system will be temporarily unavailable. This maintenance includes server updates, database optimization, and security patches. Please inform all users to save their work before 2:00 AM.',
      sender: 'System Administrator',
      priority: 'High'
    },
    { 
      id: 2, 
      title: 'New User Registration', 
      message: '5 new students registered today', 
      time: '2 hours ago', 
      type: 'info',
      details: 'Today we have 5 new student registrations across different grades. The new students are: John Smith (Grade 10), Mary Johnson (Grade 11), David Wilson (Grade 9), Sarah Davis (Grade 12), and Michael Brown (Grade 10). Please ensure their accounts are properly set up and class assignments are completed.',
      sender: 'Registration System',
      priority: 'Medium'
    },
    { 
      id: 3, 
      title: 'Server Alert', 
      message: 'High CPU usage detected', 
      time: '4 hours ago', 
      type: 'warning',
      details: 'Server monitoring has detected high CPU usage (85%) on the main application server. This may be due to increased user activity during peak hours. Please monitor the situation and consider load balancing if the issue persists. Current active users: 245.',
      sender: 'Monitoring System',
      priority: 'High'
    },
    { 
      id: 4, 
      title: 'Backup Complete', 
      message: 'Daily backup completed successfully', 
      time: '1 day ago', 
      type: 'success',
      details: 'Daily automated backup has been completed successfully. Backup size: 2.3 GB. All student data, grades, and system configurations have been securely backed up to the cloud storage. Backup verification completed without errors.',
      sender: 'Backup System',
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
        <div className="admin-profile">
          <div className="profile-image">
            <img src="/admin-avatar.svg" alt="Admin" />
          </div>
          <h3>System Admin</h3>
          <p>Administrator</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button 
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Course Management
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
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
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Students</h3>
                  <p>{stats.totalStudents}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Teachers</h3>
                  <p>{stats.totalTeachers}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Courses</h3>
                  <p>{stats.totalCourses}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Users</h3>
                  <p>{stats.activeUsers}</p>
                </div>
              </div>

              <div className="recent-activities">
                <h3>Recent Activities</h3>
                <div className="activities-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-info">
                        <span className="activity-type">{activity.type}</span>
                        <span className="activity-user">{activity.user}</span>
                        <span className="activity-role">{activity.role}</span>
                      </div>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button className="action-button">Add New User</button>
                  <button className="action-button">Create Course</button>
                  <button className="action-button">Generate Report</button>
                  <button className="action-button">System Settings</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h3>User Management</h3>
              <p>User management interface will be implemented here.</p>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-section">
              <h3>Course Management</h3>
              <p>Course management interface will be implemented here.</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h3>Reports</h3>
              <p>Reporting interface will be implemented here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>System Settings</h3>
              <p>Settings interface will be implemented here.</p>
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

export default AdminDashboard
