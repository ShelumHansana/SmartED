import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('students')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  const [students, setStudents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Toast notification state
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)
  
  // Show toast notification
  const showToast = (message, type = 'info') => {
    toastIdRef.current += 1
    const id = toastIdRef.current
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }
  
  // Fetch teacher data from Firestore
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user || !user.id) {
        console.log('No user or user.id found');
        return;
      }

      console.log('=== Teacher Dashboard Data Fetch ===');
      console.log('Full user object:', user);
      console.log('Teacher ID:', user.id);
      console.log('Teacher classes:', user.classes);
      console.log('Teacher subjects:', user.subjects);
      console.log('Teacher Index:', user.teacherIndex);
      console.log('Teacher Title:', user.title);
      console.log('Teacher Full Name:', user.fullName);

      try {
        setLoading(true)

        // Fetch students for teacher's classes
        if (user.classes && Array.isArray(user.classes) && user.classes.length > 0) {
          console.log('Fetching students for classes:', user.classes);
          
          const studentsPromises = user.classes.map(async (classInfo) => {
            try {
              // Handle both "Grade-Class" format (e.g., "10-A") and plain class names
              let grade, className;
              
              if (classInfo.includes('-')) {
                [grade, className] = classInfo.split('-');
              } else {
                // If no hyphen, treat as className and try to extract grade
                className = classInfo;
                // Try to extract grade from format like "10A" or "Grade 10"
                const gradeMatch = classInfo.match(/(\d+)/);
                grade = gradeMatch ? gradeMatch[1] : null;
              }

              console.log(`Querying students for grade: ${grade}, class: ${className}`);

              if (!grade || !className) {
                console.warn(`Invalid class format: ${classInfo}`);
                return [];
              }

              const studentsQuery = query(
                collection(db, 'users'),
                where('role', '==', 'student'),
                where('studentData.grade', '==', grade),
                where('studentData.className', '==', className)
              );
              
              const snapshot = await getDocs(studentsQuery);
              console.log(`Found ${snapshot.docs.length} students for class ${classInfo}`);
              
              return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  ...data,
                  // Flatten student data for easier access
                  ...(data.studentData || {}),
                  class: classInfo,
                  originalClassInfo: classInfo
                };
              });
            } catch (error) {
              console.error(`Error fetching students for class ${classInfo}:`, error);
              return [];
            }
          });
          
          const studentsArrays = await Promise.all(studentsPromises);
          const allStudents = studentsArrays.flat();
          console.log('Total students fetched:', allStudents.length);
          console.log('Students data:', allStudents);
          setStudents(allStudents);
        } else {
          console.warn('No classes assigned to teacher or classes format is incorrect');
          console.log('Classes value:', user.classes);
          setStudents([]);
        }

        // Fetch notifications for teacher
        try {
          const notificationsQuery = query(
            collection(db, 'notifications'),
            where('recipientId', '==', user.id)
          );
          const notificationsSnapshot = await getDocs(notificationsQuery);
          const notificationsData = notificationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log('Notifications fetched:', notificationsData.length);
          setNotifications(notificationsData);
          setNotificationCount(notificationsData.filter(n => !n.read).length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
          setNotificationCount(0);
        }

        setLoading(false);
        console.log('=== Teacher Dashboard Data Fetch Complete ===');
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setLoading(false);
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
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">Teacher Dashboard</h2>
          <p className="loading-text">Preparing your classes and student data...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const teacherName = user.fullName ? `${user.title || ''} ${user.fullName}`.trim() : `${user.title || 'Mr.'} ${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Teacher'
  const teacherSubjects = user.subjects?.join(', ') || 'No subjects assigned'

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="teacher-profile">
          <div className="profile-image">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Teacher" />
            ) : (
              <div className="profile-avatar-letter">
                {teacherName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3>{teacherName}</h3>
          <p className="teacher-subject">{teacherSubjects}</p>
          <p className="teacher-classes">{user.classes?.length || 0} Classes Assigned</p>
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
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'students' && <StudentList students={students} teacherClasses={user.classes || []} />}
          {activeTab === 'grades' && <GradeEntry students={students} teacherId={user.id} showToast={showToast} />}
          {activeTab === 'analytics' && <GradeAnalytics students={students} teacher={user} />}
          {activeTab === 'messages' && <MessageBoard teacher={user} />}
          {activeTab === 'activities' && <ActivityUpload teacher={user} showToast={showToast} />}
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

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherDashboard
