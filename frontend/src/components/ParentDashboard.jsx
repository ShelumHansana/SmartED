import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import '../styles/ParentDashboard.css'

const ParentDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [children, setChildren] = useState([])
  const [childrenGrades, setChildrenGrades] = useState({})
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch parent's children and their data
  useEffect(() => {
    const fetchParentData = async () => {
      if (!user || !user.id) {
        console.log('ParentDashboard: No user found');
        return;
      }

      console.log('=== ParentDashboard: Fetching Parent Data ===');
      console.log('Full user object:', user);
      console.log('Parent children data:', user.children);
      console.log('Parent parentData:', user.parentData);

      try {
        setLoading(true);

        // Get children array from either flattened user or nested parentData
        const childrenArray = user.children || user.parentData?.children || [];
        console.log('Children array to fetch:', childrenArray);

        // Fetch children based on parent's children array
        if (childrenArray && childrenArray.length > 0) {
          console.log(`Fetching data for ${childrenArray.length} children`);

          const childrenPromises = childrenArray.map(async (child, index) => {
            try {
              console.log(`\n--- Fetching child ${index + 1} ---`);
              console.log('Child data:', child);

              // Handle both object format {indexNumber: "..."} and string format "indexNumber"
              const childIndexNumber = typeof child === 'string' ? child : child.indexNumber || child;
              console.log('Looking for student with index number:', childIndexNumber);

              if (!childIndexNumber) {
                console.warn('No index number provided for child:', child);
                return null;
              }

              // Query student by index number in nested studentData
              const studentQuery = query(
                collection(db, 'users'),
                where('role', '==', 'student'),
                where('studentData.indexNumber', '==', childIndexNumber)
              );
              
              console.log('Executing Firestore query for indexNumber:', childIndexNumber);
              const studentSnapshot = await getDocs(studentQuery);
              console.log(`Query returned ${studentSnapshot.docs.length} results`);

              if (!studentSnapshot.empty) {
                const studentDoc = studentSnapshot.docs[0];
                const studentFirestoreData = studentDoc.data();
                console.log('Found student:', studentFirestoreData.fullName || studentFirestoreData.email);

                // Flatten student data
                const studentData = {
                  id: studentDoc.id,
                  ...studentFirestoreData,
                  ...(studentFirestoreData.studentData || {}),
                  level: (studentFirestoreData.studentData?.grade === '12' || 
                         studentFirestoreData.studentData?.grade === '13') ? 'A/L' : 'O/L'
                };

                console.log('Flattened student data:', {
                  id: studentData.id,
                  name: studentData.fullName,
                  grade: studentData.grade,
                  class: studentData.className || studentData.class,
                  level: studentData.level
                });

                // Fetch grades for this child
                console.log('Fetching grades for student ID:', studentData.id);
                const gradesQuery = query(
                  collection(db, 'grades'),
                  where('studentId', '==', studentData.id)
                );
                const gradesSnapshot = await getDocs(gradesQuery);
                const grades = gradesSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }));
                console.log(`Found ${grades.length} grades for student`);

                return {
                  ...studentData,
                  grades
                };
              } else {
                console.warn(`No student found with index number: ${childIndexNumber}`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching child ${index + 1}:`, error);
              return null;
            }
          });

          const childrenData = (await Promise.all(childrenPromises)).filter(Boolean);
          console.log(`\n=== Successfully loaded ${childrenData.length} children ===`);
          console.log('Children data:', childrenData);
          setChildren(childrenData);

          // Organize grades by child
          const gradesMap = {};
          childrenData.forEach(child => {
            gradesMap[child.id] = child.grades || [];
            console.log(`Child ${child.fullName}: ${child.grades?.length || 0} grades`);
          });
          setChildrenGrades(gradesMap);
        } else {
          console.warn('No children found in parent data');
          console.log('Available user fields:', Object.keys(user));
          setChildren([]);
          setChildrenGrades({});
        }

        // Fetch notifications
        console.log('\n--- Fetching notifications ---');
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.id)
        );
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`Found ${notificationsData.length} notifications`);
        setNotifications(notificationsData);
        setNotificationCount(notificationsData.filter(n => !n.read).length);

        setLoading(false);
        console.log('=== ParentDashboard: Data Fetch Complete ===\n');
      } catch (error) {
        console.error('Error fetching parent data:', error);
        setLoading(false);
      }
    }

    fetchParentData();
  }, [user])

  const markAllAsRead = () => {
    setNotificationCount(0)
    setShowNotifications(false)
  }

  // Helper function to calculate average grade
  const calculateAverageGrade = (grades) => {
    if (!grades || grades.length === 0) return 'N/A'
    const total = grades.reduce((sum, grade) => sum + (parseFloat(grade.marks) || 0), 0)
    const average = total / grades.length
    if (average >= 75) return 'A'
    if (average >= 65) return 'B'
    if (average >= 50) return 'C'
    if (average >= 35) return 'S'
    return 'W'
  }

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

  // Use loaded data
  const currentStudent = children[selectedStudent]
  const currentSubjects = currentStudent ? getSubjectsProgress(currentStudent.level) : []
  const currentTests = currentStudent ? getRecentTests(currentStudent.level) : []

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading parent data...</div>
      </div>
    )
  }

  if (!currentStudent) {
    return (
      <div className="dashboard-container">
        <div className="no-data">No children data available</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="parent-profile">
          <div className="profile-image">
            <img src="/parent-avatar.svg" alt="Parent" />
          </div>
          <h3>{user.fullName || 'Parent'}</h3>
          <p>Parent Portal</p>
          <p>{user.school || 'Mahinda College'}</p>
        </div>
        
        <div className="student-selector">
          <h4>Select Child</h4>
          <div className="student-tabs">
            {children.map((student, index) => (
              <button
                key={student.id}
                className={`student-tab ${selectedStudent === index ? 'active' : ''}`}
                onClick={() => setSelectedStudent(index)}
              >
                <div className="student-tab-info">
                  <span className="student-name">{student.fullName?.split(' ')[0] || student.name?.split(' ')[0]}</span>
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
              {currentStudent.fullName || currentStudent.name} - {currentStudent.class}
              {currentStudent.stream && ` (${currentStudent.stream})`}
            </h2>
            <p>{currentStudent.school || user.school || 'Mahinda College'}</p>
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
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="student-stats">
                <div className="stat-card">
                  <h3>Overall Grade</h3>
                  <div className="stat-value grade">
                    {childrenGrades[currentStudent.id]?.length > 0 
                      ? calculateAverageGrade(childrenGrades[currentStudent.id])
                      : 'N/A'}
                  </div>
                  {currentStudent.gpa && <p>GPA: {currentStudent.gpa}</p>}
                </div>
                <div className="stat-card">
                  <h3>Attendance</h3>
                  <div className="stat-value attendance">
                    {currentStudent.attendance || 'N/A'}%
                  </div>
                  <p>{currentStudent.attendance >= 90 ? 'Excellent' : 'Above average'}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Subjects</h3>
                  <div className="stat-value subjects">
                    {currentStudent.subjects?.length || childrenGrades[currentStudent.id]?.length || 0}
                  </div>
                  <p>All enrolled</p>
                </div>
                <div className="stat-card">
                  <h3>Grade Level</h3>
                  <div className="stat-value exam">{currentStudent.level}</div>
                  <p>Grade {currentStudent.grade}</p>
                </div>
              </div>

              <div className="recent-tests">
                <h3>Recent Test Results</h3>
                <div className="test-list">
                  {childrenGrades[currentStudent.id]?.slice(0, 5).map((grade, index) => (
                    <div key={index} className="test-item">
                      <div className="test-subject">{grade.subject}</div>
                      <div className="test-score">{grade.marks}%</div>
                      <div className="test-grade">{grade.grade}</div>
                      <div className="test-date">
                        {grade.date ? new Date(grade.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                  {(!childrenGrades[currentStudent.id] || childrenGrades[currentStudent.id].length === 0) && (
                    <p>No test results available yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-section">
              <h3>Academic Progress - {currentStudent.level} Level</h3>
              <div className="subjects-grid">
                {childrenGrades[currentStudent.id]?.map((grade, index) => {
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

                  const getPerformanceLevel = (marks) => {
                    if (marks >= 75) return 'excellent';
                    return 'normal';
                  };

                  return (
                    <div 
                      key={index} 
                      className="subject-card"
                      data-performance={getPerformanceLevel(grade.marks)}
                      tabIndex="0"
                    >
                      <div className="subject-header">
                        <h4 data-subject-icon={getSubjectIcon(grade.subject)}>
                          {grade.subject}
                        </h4>
                        <span 
                          className="subject-grade" 
                          data-grade={grade.grade}
                        >
                          {grade.grade}
                        </span>
                      </div>
                      <div 
                        className="progress-bar"
                        style={{ 
                          height: '14px', 
                          width: grade.marks < 25 ? 'calc(100% - 50px)' : '100%', 
                          position: 'relative',
                          display: 'block'
                        }}
                      >
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${grade.marks}%`, 
                            height: '14px',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            zIndex: '5'
                          }}
                        ></div>
                        <span 
                          className={`progress-percentage ${grade.marks < 25 ? 'outside' : ''}`}
                          style={{
                            background: grade.marks >= 25 ? 'rgba(255, 255, 255, 0.95)' : undefined,
                            color: grade.marks >= 25 ? '#1e293b' : undefined,
                            padding: grade.marks >= 25 ? '2px 8px' : undefined,
                            borderRadius: grade.marks >= 25 ? '12px' : undefined
                          }}
                        >
                          {grade.marks}%
                        </span>
                      </div>
                      <div className="subject-info">
                        <p>Teacher: {grade.teacherName || 'N/A'}</p>
                        <p>Assessment: {grade.assessmentType || 'Test'}</p>
                        <p>Date: {grade.date ? new Date(grade.date.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(!childrenGrades[currentStudent.id] || childrenGrades[currentStudent.id].length === 0) && (
                <p className="no-data">No grade data available for this student yet</p>
              )}
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="teachers-section">
              <h3>Teachers Directory</h3>
              <p className="info-message">Contact your child's teachers for more information about their progress.</p>
              <div className="teachers-grid">
                {currentStudent.subjects?.map((subject, index) => (
                  <div key={index} className="teacher-card">
                    <h4>Subject Teacher</h4>
                    <p className="teacher-subject">{subject}</p>
                    <p className="teacher-level">{currentStudent.level}</p>
                    <div className="teacher-contact">
                      <p>Contact school administration for teacher contact details</p>
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
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${notification.type || 'info'}`}>
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleString() : 'Recently'}
                </span>
              </div>
            ))
          ) : (
            <p className="no-notifications">No notifications at this time</p>
          )}
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
