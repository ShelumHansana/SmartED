import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import StudentList from './teacher/StudentList'
import MessageBoard from './teacher/MessageBoard'
import Notepad from './Notepad'
import TodoList from './teacher/TodoList'
import ActivityUpload from './teacher/ActivityUpload'
import GradeEntry from './teacher/GradeEntry'
import GradeAnalytics from './teacher/GradeAnalytics'
import '../styles/TeacherDashboard.css'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('students')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  const [students, setStudents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Fetch teacher data from Firestore
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user || !user.id) return

      try {
        setLoading(true)

        // Fetch students for teacher's classes
        if (user.classes && user.classes.length > 0) {
          const studentsPromises = user.classes.map(async (classInfo) => {
            const [grade, className] = classInfo.split('-')
            const studentsQuery = query(
              collection(db, 'users'),
              where('role', '==', 'student'),
              where('grade', '==', grade),
              where('className', '==', className)
            )
            const snapshot = await getDocs(studentsQuery)
            return snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              class: classInfo
            }))
          })
          
          const studentsArrays = await Promise.all(studentsPromises)
          const allStudents = studentsArrays.flat()
          setStudents(allStudents)
        }

        // Fetch notifications for teacher
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.id)
        )
        const notificationsSnapshot = await getDocs(notificationsQuery)
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setNotifications(notificationsData)
        setNotificationCount(notificationsData.filter(n => !n.read).length)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching teacher data:', error)
        setLoading(false)
      }
    }

    fetchTeacherData()
  }, [user])

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

  if (loading || !user) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          color: '#4A90E2'
        }}>
          Loading teacher dashboard...
        </div>
      </div>
    )
  }

  const teacherName = user.fullName ? `${user.title || ''} ${user.fullName}`.trim() : `${user.title || 'Mr.'} ${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Teacher'
  const teacherSubjects = user.subjects?.join(', ') || 'No subjects assigned'

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="teacher-profile">
          <div className="profile-image">
            <img src={user.profileImage || "/teacher-avatar.svg"} alt="Teacher" />
          </div>
          <h3>{teacherName}</h3>
          <p>{teacherSubjects}</p>
          <p>{user.classes?.length || 0} Classes</p>
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
          <h2>Welcome back, {teacherName}!</h2>
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
          {activeTab === 'students' && <StudentList students={students} teacherClasses={user.classes || []} />}
          {activeTab === 'grades' && <GradeEntry students={students} teacherId={user.id} />}
          {activeTab === 'analytics' && <GradeAnalytics students={students} teacher={user} />}
          {activeTab === 'messages' && <MessageBoard teacher={user} />}
          {activeTab === 'activities' && <ActivityUpload teacher={user} />}
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
