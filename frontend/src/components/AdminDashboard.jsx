import { useState } from 'react'
import '../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

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
            <button className="notification-btn">
              <span className="notification-badge">3</span>
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
    </div>
  )
}

export default AdminDashboard
