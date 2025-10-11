import { useState } from 'react'
import '../styles/Dashboard.css'
import '../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(4)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  
  // User Management States
  const [users, setUsers] = useState([
    { id: 1, name: 'Kamal Perera', email: 'kamal.perera@mahindacollege.lk', role: 'Student', grade: 'Grade 12 M1', status: 'Active', joinDate: '2025-01-15' },
    { id: 2, name: 'Sanduni Silva', email: 'sanduni.silva@mahindacollege.lk', role: 'Student', grade: 'Grade 10 A', status: 'Active', joinDate: '2024-12-10' },
    { id: 3, name: 'Mr. Sunil Perera', email: 'sunil.perera@mahindacollege.lk', role: 'Teacher', subject: 'Mathematics', status: 'Active', joinDate: '2020-03-01' },
    { id: 4, name: 'Dr. Amara Silva', email: 'amara.silva@mahindacollege.lk', role: 'Teacher', subject: 'Physics', status: 'Active', joinDate: '2018-07-15' },
    { id: 5, name: 'Mrs. Perera (Parent)', email: 'parent.perera@gmail.com', role: 'Parent', children: 'Kamal & Sanduni', status: 'Active', joinDate: '2024-12-10' }
  ])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userFilter, setUserFilter] = useState('All')
  
  // Course Management States
  const [courses, setCourses] = useState([
    { id: 1, name: 'A/L Mathematics', level: 'A/L', stream: 'Physical Science', teacher: 'Mr. Sunil Perera', students: 24, status: 'Active' },
    { id: 2, name: 'A/L Physics', level: 'A/L', stream: 'Physical Science', teacher: 'Dr. Amara Silva', students: 22, status: 'Active' },
    { id: 3, name: 'A/L Chemistry', level: 'A/L', stream: 'Physical Science', teacher: 'Mrs. Kushani Jayawardena', students: 20, status: 'Active' },
    { id: 4, name: 'O/L Mathematics', level: 'O/L', grade: 'Grade 10', teacher: 'Mrs. Chamari Wickramasinghe', students: 32, status: 'Active' },
    { id: 5, name: 'O/L Science', level: 'O/L', grade: 'Grade 10', teacher: 'Mr. Roshan Perera', students: 30, status: 'Active' }
  ])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Settings States
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'Mahinda College',
    address: 'Colombo 07, Sri Lanka',
    phone: '+94 11 269 1731',
    email: 'admin@mahindacollege.lk',
    academicYear: '2025',
    terms: 3,
    gradingSystem: 'A/B/C/S/W',
    languages: ['English', 'Sinhala', 'Tamil']
  })

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

  // ===== ACTION BUTTON HANDLERS =====

  // User Management Actions
  const handleAddUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    setUsers(prev => [...prev, newUser])
    setStats(prev => ({ ...prev, activeUsers: prev.activeUsers + 1 }))
    setShowUserModal(false)
    setSelectedUser(null)
    console.log('User added:', newUser)
  }

  const handleUpdateUser = (userData) => {
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { ...user, ...userData } : user
    ))
    setShowUserModal(false)
    setSelectedUser(null)
    console.log('User updated:', userData)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
      setStats(prev => ({ ...prev, activeUsers: prev.activeUsers - 1 }))
      console.log('User deleted:', userId)
    }
  }

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ))
    console.log('User status toggled:', userId)
  }

  // Course Management Actions
  const handleAddCourse = (courseData) => {
    const newCourse = {
      id: courses.length + 1,
      ...courseData,
      students: 0,
      status: 'Active'
    }
    setCourses(prev => [...prev, newCourse])
    setStats(prev => ({ ...prev, totalCourses: prev.totalCourses + 1 }))
    setShowCourseModal(false)
    setSelectedCourse(null)
    console.log('Course added:', newCourse)
  }

  const handleUpdateCourse = (courseData) => {
    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id ? { ...course, ...courseData } : course
    ))
    setShowCourseModal(false)
    setSelectedCourse(null)
    console.log('Course updated:', courseData)
  }

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will affect all enrolled students.')) {
      setCourses(prev => prev.filter(course => course.id !== courseId))
      setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }))
      console.log('Course deleted:', courseId)
    }
  }

  const handleViewCourse = (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
    console.log('Viewing course:', course)
  }

  const handleEditCourse = (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
    console.log('Editing course:', course)
  }

  // Settings Actions
  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    console.log('Settings saved:', schoolSettings)
    alert('Settings saved successfully!')
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSchoolSettings({
        schoolName: 'Mahinda College',
        address: 'Colombo 07, Sri Lanka',
        phone: '+94 11 269 1731',
        email: 'admin@mahindacollege.lk',
        academicYear: '2025',
        terms: 3,
        gradingSystem: 'A/B/C/S/W',
        languages: ['English', 'Sinhala', 'Tamil']
      })
      console.log('Settings reset to defaults')
      alert('Settings reset to defaults!')
    }
  }

  const handleCreateBackup = () => {
    // Simulate backup creation
    const backupData = {
      users,
      courses,
      settings: schoolSettings,
      stats,
      timestamp: new Date().toISOString()
    }
    console.log('Backup created:', backupData)
    
    // In a real app, this would trigger a download or send to server
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `smarted-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    alert('Backup created and downloaded successfully!')
  }

  // Report Generation Actions
  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType)
    
    const reportData = {
      type: reportType,
      generatedAt: new Date().toISOString(),
      data: {
        users: users.length,
        courses: courses.length,
        activeUsers: stats.activeUsers,
        totalStudents: stats.totalStudents
      }
    }

    // Simulate report generation
    setTimeout(() => {
      console.log('Report generated:', reportData)
      alert(`${reportType} report generated successfully!`)
    }, 1000)
  }

  const handleDownloadReport = (reportType, format) => {
    console.log(`Downloading ${reportType} report in ${format} format`)
    
    // Simulate download
    setTimeout(() => {
      alert(`${reportType} report downloaded as ${format}!`)
    }, 500)
  }

  // Quick Actions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'addUser':
        setShowUserModal(true)
        setSelectedUser(null)
        break
      case 'createCourse':
        setShowCourseModal(true)
        setSelectedCourse(null)
        break
      case 'generateReport':
        setActiveTab('reports')
        break
      case 'systemSettings':
        setActiveTab('settings')
        break
      default:
        console.log('Quick action:', action)
    }
  }

  // Refresh Actions
  const handleRefreshData = () => {
    // Clear filters
    setSearchQuery('')
    setLevelFilter('')
    setStatusFilter('')
    setUserFilter('All')
    
    // Simulate data refresh
    console.log('Refreshing data...')
    setTimeout(() => {
      // In a real app, this would fetch fresh data from API
      console.log('Data refreshed successfully')
    }, 500)
  }

  return (
    <div className="dashboard-container admin-dashboard">
      <aside className="dashboard-sidebar">
        <div className="admin-profile">
          <div className="profile-image">
            <img src="/admin-avatar.svg" alt="Admin" />
          </div>
          <h3>System Admin</h3>
          <p>Administrator</p>
          <p>Mahinda College</p>
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
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('addUser')}
                  >
                    <span className="action-icon">👤</span>
                    Add New User
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('createCourse')}
                  >
                    <span className="action-icon">📚</span>
                    Create Course
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('generateReport')}
                  >
                    <span className="action-icon">📊</span>
                    Generate Report
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('systemSettings')}
                  >
                    <span className="action-icon">⚙️</span>
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h3>User Management</h3>
                <div className="section-actions">
                  <select 
                    value={userFilter} 
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Users</option>
                    <option value="Student">Students</option>
                    <option value="Teacher">Teachers</option>
                    <option value="Parent">Parents</option>
                  </select>
                  <button className="add-btn" onClick={() => setShowUserModal(true)}>
                    Add New User
                  </button>
                </div>
              </div>
              
              <div className="users-grid">
                {users
                  .filter(user => userFilter === 'All' || user.role === userFilter)
                  .map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-header">
                        <div className="user-avatar">
                          {user.name.charAt(0)}
                        </div>
                        <div className="user-info">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                          <span className={`role-badge ${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className="user-details">
                        {user.role === 'Student' && <p>Class: {user.grade}</p>}
                        {user.role === 'Teacher' && <p>Subject: {user.subject}</p>}
                        {user.role === 'Parent' && <p>Children: {user.children}</p>}
                        <p>Joined: {user.joinDate}</p>
                        <span className={`status ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          title="Edit user information"
                        >
                          <span className="btn-icon">✏️</span>
                          Edit
                        </button>
                        <button 
                          className="deactivate-btn"
                          onClick={() => handleToggleUserStatus(user.id)}
                          title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                        >
                          <span className="btn-icon">{user.status === 'Active' ? '❌' : '✅'}</span>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete user permanently"
                        >
                          <span className="btn-icon">🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-section">
              {/* Top Header Section */}
              <div className="section-top">
                <div className="page-title">
                  <div className="title-with-icon">
                    <div className="page-icon">📚</div>
                    <div>
                      <h2>Course Management</h2>
                      <p>Manage all courses in your institution</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Summary - Enhanced with Icons */}
                <div className="quick-stats">
                  <div className="stat-item total-courses">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <span className="stat-label">Total Courses</span>
                      <span className="stat-value">{courses.length}</span>
                    </div>
                  </div>
                  <div className="stat-item al-courses">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-content">
                      <span className="stat-label">A/L Courses</span>
                      <span className="stat-value">{courses.filter(c => c.level === 'A/L').length}</span>
                    </div>
                  </div>
                  <div className="stat-item ol-courses">
                    <div className="stat-icon">📖</div>
                    <div className="stat-content">
                      <span className="stat-label">O/L Courses</span>
                      <span className="stat-value">{courses.filter(c => c.level === 'O/L').length}</span>
                    </div>
                  </div>
                  <div className="stat-item total-students">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <span className="stat-label">Total Students</span>
                      <span className="stat-value">{courses.reduce((sum, c) => sum + c.students, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Controls Section */}
              <div className="controls-section">
                <div className="controls-left">
                  <div className="search-wrapper">
                    <input 
                      type="text" 
                      placeholder="Search by course name, teacher, or subject..." 
                      className="search-field"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                  </div>
                  <div className="filter-group">
                    <div className="filter-item">
                      <label className="filter-label">Level</label>
                      <select 
                        className="filter-dropdown"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                      >
                        <option value="">All Levels</option>
                        <option value="O/L">🏫 O/L Courses</option>
                        <option value="A/L">🎓 A/L Courses</option>
                      </select>
                    </div>
                    <div className="filter-item">
                      <label className="filter-label">Status</label>
                      <select 
                        className="filter-dropdown"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="Active">✅ Active</option>
                        <option value="Inactive">❌ Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="controls-right">
                  <button 
                    className="refresh-btn" 
                    title="Refresh course list and clear filters"
                    onClick={handleRefreshData}
                  >
                    <span className="btn-icon">🔄</span>
                    Refresh
                  </button>
                  <button className="add-new-btn" onClick={() => setShowCourseModal(true)} title="Add a new course">
                    <span className="btn-icon">➕</span>
                    Add New Course
                  </button>
                </div>
              </div>

              {/* Main Course List */}
              <div className="courses-container">
                <div className="courses-header">
                  <h3>📋 Course Directory</h3>
                  <p>Showing {(() => {
                    const filteredCount = courses.filter(course => {
                      const matchesSearch = searchQuery === '' || 
                        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesLevel = levelFilter === '' || course.level === levelFilter;
                      const matchesStatus = statusFilter === '' || course.status === statusFilter;
                      return matchesSearch && matchesLevel && matchesStatus;
                    }).length;
                    return `${filteredCount} course${filteredCount !== 1 ? 's' : ''}`;
                  })()} {(searchQuery || levelFilter || statusFilter) ? `of ${courses.length} total` : ''}</p>
                </div>
                
                <div className="course-list">
                  {(() => {
                    const filteredCourses = courses.filter(course => {
                      const matchesSearch = searchQuery === '' || 
                        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesLevel = levelFilter === '' || course.level === levelFilter;
                      const matchesStatus = statusFilter === '' || course.status === statusFilter;
                      return matchesSearch && matchesLevel && matchesStatus;
                    });
                    
                    return filteredCourses.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <h4>No courses found</h4>
                      <p>Get started by adding your first course to the system.</p>
                      <button 
                        className="empty-action-btn"
                        onClick={() => setShowCourseModal(true)}
                      >
                        <span className="btn-icon">➕</span>
                        Add Your First Course
                      </button>
                    </div>
                  ) : (
                    filteredCourses.map(course => (
                    <div key={course.id} className="course-item">
                      <div className="course-avatar">
                        <div className={`subject-icon ${course.level.toLowerCase().replace('/', '-')}`}>
                          {course.name.includes('Mathematics') ? '📐' : 
                           course.name.includes('Physics') ? '⚛️' : 
                           course.name.includes('Chemistry') ? '🧪' : 
                           course.name.includes('Science') ? '🔬' : '📚'}
                        </div>
                      </div>
                      
                      <div className="course-content">
                        <div className="course-info">
                          <div className="course-header-row">
                            <div className="course-title-group">
                              <h4 className="course-title">{course.name}</h4>
                              {course.grade && (
                                <span className="grade-label">📖 {course.grade}</span>
                              )}
                            </div>
                            <div className="course-meta">
                              <span className={`level-tag ${course.level.toLowerCase().replace('/', '-')}`}>
                                {course.level === 'A/L' ? '🎓 A/L' : '🏫 O/L'}
                              </span>
                              {course.stream && (
                                <span className="stream-tag">🎯 {course.stream}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="course-details-row">
                            <div className="detail-group teacher-info">
                              <span className="detail-icon">👨‍🏫</span>
                              <span className="detail-label">Teacher:</span>
                              <span className="detail-text">{course.teacher}</span>
                            </div>
                            <div className="detail-group enrollment-info">
                              <span className="detail-icon">👥</span>
                              <span className="detail-label">Students:</span>
                              <span className="detail-text">{course.students} enrolled</span>
                            </div>
                            <div className="detail-group status-info">
                              <span className="detail-icon">
                                {course.status === 'Active' ? '✅' : '❌'}
                              </span>
                              <span className="detail-label">Status:</span>
                              <span className={`status-badge ${course.status.toLowerCase()}`}>
                                {course.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="course-actions">
                        <button 
                          className="btn-action btn-view"
                          onClick={() => handleViewCourse(course)}
                          title="View course details and analytics"
                        >
                          <span className="btn-icon">👁️</span>
                          View
                        </button>
                        <button 
                          className="btn-action btn-edit" 
                          onClick={() => handleEditCourse(course)}
                          title="Edit course information"
                        >
                          <span className="btn-icon">✏️</span>
                          Edit
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete course (cannot be undone)"
                        >
                          <span className="btn-icon">🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                    ))
                  );
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h3>Reports & Analytics</h3>
              
              <div className="reports-grid">
                <div className="report-category">
                  <h4>Academic Reports</h4>
                  <div className="report-cards">
                    <div className="report-card">
                      <h5>Student Performance Report</h5>
                      <p>Overall academic performance by grade and subject</p>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Student Performance Report')}
                        >
                          <span className="btn-icon">📊</span>
                          Generate Report
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownloadReport('Student Performance Report', 'PDF')}
                        >
                          <span className="btn-icon">📄</span>
                          Download PDF
                        </button>
                      </div>
                    </div>
                    <div className="report-card">
                      <h5>Teacher Performance Report</h5>
                      <p>Teaching effectiveness and student feedback analysis</p>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Teacher Performance Report')}
                        >
                          <span className="btn-icon">📊</span>
                          Generate Report
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownloadReport('Teacher Performance Report', 'PDF')}
                        >
                          <span className="btn-icon">📄</span>
                          Download PDF
                        </button>
                      </div>
                    </div>
                    <div className="report-card">
                      <h5>Grade Analysis Report</h5>
                      <p>Grade distribution across A/L and O/L levels</p>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Grade Analysis Report')}
                        >
                          <span className="btn-icon">📊</span>
                          Generate Report
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownloadReport('Grade Analysis Report', 'PDF')}
                        >
                          <span className="btn-icon">📄</span>
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="report-category">
                  <h4>Administrative Reports</h4>
                  <div className="report-cards">
                    <div className="report-card">
                      <h5>Attendance Report</h5>
                      <p>Student and teacher attendance statistics</p>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Attendance Report')}
                        >
                          <span className="btn-icon">📅</span>
                          Generate Report
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownloadReport('Attendance Report', 'Excel')}
                        >
                          <span className="btn-icon">📊</span>
                          Download Excel
                        </button>
                      </div>
                    </div>
                    <div className="report-card">
                      <h5>User Activity Report</h5>
                      <p>System usage and user engagement metrics</p>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('User Activity Report')}
                        >
                          <span className="btn-icon">👥</span>
                          Generate Report
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownloadReport('User Activity Report', 'PDF')}
                        >
                          <span className="btn-icon">📄</span>
                          Download PDF
                        </button>
                      </div>
                    </div>
                    <div className="report-card">
                      <h5>Financial Report</h5>
                      <p>Fee collection and financial summary</p>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Financial Report')}
                        >
                          <span className="btn-icon">💰</span>
                          Generate Report
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownloadReport('Financial Report', 'Excel')}
                        >
                          <span className="btn-icon">📊</span>
                          Download Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="report-category">
                  <h4>Quick Analytics</h4>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h5>Current Month</h5>
                      <div className="analytics-stats">
                        <div className="stat-item">
                          <span>New Registrations</span>
                          <strong>12</strong>
                        </div>
                        <div className="stat-item">
                          <span>Average Attendance</span>
                          <strong>92%</strong>
                        </div>
                        <div className="stat-item">
                          <span>Assignments Submitted</span>
                          <strong>1,248</strong>
                        </div>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h5>Performance Overview</h5>
                      <div className="analytics-stats">
                        <div className="stat-item">
                          <span>A/L Pass Rate</span>
                          <strong>94%</strong>
                        </div>
                        <div className="stat-item">
                          <span>O/L Pass Rate</span>
                          <strong>96%</strong>
                        </div>
                        <div className="stat-item">
                          <span>Teacher Satisfaction</span>
                          <strong>4.8/5</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>System Settings</h3>
              
              <div className="settings-tabs">
                <div className="settings-category">
                  <h4>School Information</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>School Name</label>
                      <input 
                        type="text" 
                        value={schoolSettings.schoolName}
                        onChange={(e) => setSchoolSettings({...schoolSettings, schoolName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input 
                        type="text" 
                        value={schoolSettings.address}
                        onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={schoolSettings.phone}
                        onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={schoolSettings.email}
                        onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="settings-category">
                  <h4>Academic Settings</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Current Academic Year</label>
                      <select 
                        value={schoolSettings.academicYear}
                        onChange={(e) => setSchoolSettings({...schoolSettings, academicYear: e.target.value})}
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Terms</label>
                      <select 
                        value={schoolSettings.terms}
                        onChange={(e) => setSchoolSettings({...schoolSettings, terms: parseInt(e.target.value)})}
                      >
                        <option value="2">2 Terms</option>
                        <option value="3">3 Terms</option>
                        <option value="4">4 Terms</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Grading System</label>
                      <select 
                        value={schoolSettings.gradingSystem}
                        onChange={(e) => setSchoolSettings({...schoolSettings, gradingSystem: e.target.value})}
                      >
                        <option value="A/B/C/S/W">A/B/C/S/W (Sri Lankan)</option>
                        <option value="A+/A/B/C/D/F">A+/A/B/C/D/F (International)</option>
                        <option value="1-9">1-9 (GCSE Style)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="settings-category">
                  <h4>System Configuration</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Default Language</label>
                      <select>
                        <option value="en">English</option>
                        <option value="si">Sinhala</option>
                        <option value="ta">Tamil</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Time Zone</label>
                      <select>
                        <option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Enable Email Notifications
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Allow Parent Portal Access
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" />
                        Enable SMS Notifications
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-category">
                  <h4>Security Settings</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Password Policy</label>
                      <select>
                        <option value="basic">Basic (6+ characters)</option>
                        <option value="medium">Medium (8+ characters, mixed case)</option>
                        <option value="strong">Strong (12+ characters, symbols)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Session Timeout (minutes)</label>
                      <select>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="480">8 hours</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="settings-actions">
                <button 
                  className="save-btn"
                  onClick={handleSaveSettings}
                  title="Save all current settings"
                >
                  <span className="btn-icon">💾</span>
                  Save All Settings
                </button>
                <button 
                  className="reset-btn"
                  onClick={handleResetSettings}
                  title="Reset all settings to default values"
                >
                  <span className="btn-icon">🔄</span>
                  Reset to Defaults
                </button>
                <button 
                  className="backup-btn"
                  onClick={handleCreateBackup}
                  title="Create a backup of all system data"
                >
                  <span className="btn-icon">📦</span>
                  Create Backup
                </button>
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

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedUser ? 'Edit User' : 'Add New User'}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter full name"
                    defaultValue={selectedUser?.name || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter email address"
                    defaultValue={selectedUser?.email || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select 
                    name="role"
                    defaultValue={selectedUser?.role || 'Student'}
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Parent">Parent</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status"
                    defaultValue={selectedUser?.status || 'Active'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                }}
              >
                <span className="btn-icon">❌</span>
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={(e) => {
                  e.preventDefault()
                  const form = e.target.closest('.modal-content').querySelector('form') || 
                              e.target.closest('.modal-content').querySelector('.modal-body')
                  const formData = new FormData()
                  const inputs = form.querySelectorAll('input, select')
                  const userData = {}
                  
                  inputs.forEach(input => {
                    if (input.name) {
                      userData[input.name] = input.value
                    } else if (input.placeholder) {
                      const fieldName = input.placeholder.toLowerCase().replace(/[^a-z]/g, '')
                      userData[fieldName] = input.value
                    }
                  })
                  
                  if (selectedUser) {
                    handleUpdateUser(userData)
                  } else {
                    handleAddUser(userData)
                  }
                }}
              >
                <span className="btn-icon">{selectedUser ? '📝' : '➕'}</span>
                {selectedUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCourse ? 'Course Details' : 'Add New Course'}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowCourseModal(false)
                  setSelectedCourse(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter course name"
                    defaultValue={selectedCourse?.name || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select 
                    name="level"
                    defaultValue={selectedCourse?.level || 'O/L'}
                    required
                  >
                    <option value="O/L">O/L (Ordinary Level)</option>
                    <option value="A/L">A/L (Advanced Level)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Teacher</label>
                  <select 
                    name="teacher"
                    defaultValue={selectedCourse?.teacher || ''}
                    required
                  >
                    <option value="">Select Teacher</option>
                    <option value="Mr. Sunil Perera">Mr. Sunil Perera</option>
                    <option value="Dr. Amara Silva">Dr. Amara Silva</option>
                    <option value="Mrs. Kushani Jayawardena">Mrs. Kushani Jayawardena</option>
                    <option value="Mrs. Chamari Wickramasinghe">Mrs. Chamari Wickramasinghe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status"
                    defaultValue={selectedCourse?.status || 'Active'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {selectedCourse && (
                <div className="course-stats-detail">
                  <h4>Course Statistics</h4>
                  <div className="stats-row">
                    <div className="stat-item">
                      <span>Enrolled Students:</span>
                      <strong>{selectedCourse.students}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Level:</span>
                      <strong>{selectedCourse.level}</strong>
                    </div>
                    {selectedCourse.stream && (
                      <div className="stat-item">
                        <span>Stream:</span>
                        <strong>{selectedCourse.stream}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowCourseModal(false)
                  setSelectedCourse(null)
                }}
              >
                <span className="btn-icon">❌</span>
                Close
              </button>
              {!selectedCourse && (
                <button 
                  className="save-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    const form = e.target.closest('.modal-content').querySelector('.modal-body')
                    const inputs = form.querySelectorAll('input, select')
                    const courseData = {}
                    
                    inputs.forEach(input => {
                      if (input.name) {
                        courseData[input.name] = input.value
                      }
                    })
                    
                    handleAddCourse(courseData)
                  }}
                >
                  <span className="btn-icon">✅</span>
                  Add Course
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
