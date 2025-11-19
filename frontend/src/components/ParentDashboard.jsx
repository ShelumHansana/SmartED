import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
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
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [availableStudents, setAvailableStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [addingChild, setAddingChild] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastIdCounter = useRef(0)

  const showToast = (message, type = 'success') => {
    const id = toastIdCounter.current++
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }

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

  const refetchChildrenData = async () => {
    try {
      // Get fresh parent data
      const parentRef = doc(db, 'users', user.id)
      const parentDoc = await getDoc(parentRef)
      const parentData = parentDoc.data()
      
      const childrenArray = parentData.children || parentData.parentData?.children || []

      if (childrenArray && childrenArray.length > 0) {
        const childrenPromises = childrenArray.map(async (child) => {
          const childIndexNumber = typeof child === 'string' ? child : child.indexNumber || child
          
          if (!childIndexNumber) return null

          const studentQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('studentData.indexNumber', '==', childIndexNumber)
          )
          
          const studentSnapshot = await getDocs(studentQuery)

          if (!studentSnapshot.empty) {
            const studentDoc = studentSnapshot.docs[0]
            const studentFirestoreData = studentDoc.data()

            const studentData = {
              id: studentDoc.id,
              ...studentFirestoreData,
              ...(studentFirestoreData.studentData || {}),
              level: (studentFirestoreData.studentData?.grade === '12' || 
                     studentFirestoreData.studentData?.grade === '13') ? 'A/L' : 'O/L'
            }

            const gradesQuery = query(
              collection(db, 'grades'),
              where('studentId', '==', studentData.id)
            )
            const gradesSnapshot = await getDocs(gradesQuery)
            const grades = gradesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))

            return {
              ...studentData,
              grades
            }
          }
          return null
        })

        const childrenData = (await Promise.all(childrenPromises)).filter(Boolean)
        setChildren(childrenData)

        const gradesMap = {}
        childrenData.forEach(child => {
          gradesMap[child.id] = child.grades || []
        })
        setChildrenGrades(gradesMap)
      } else {
        setChildren([])
        setChildrenGrades({})
      }
    } catch (error) {
      console.error('Error refetching children data:', error)
    }
  }

  const openAddChildModal = async () => {
    setShowAddChildModal(true)
    setSearchTerm('')
    
    // Fetch all students
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      )
      const studentsSnapshot = await getDocs(studentsQuery)
      const allStudents = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ...(doc.data().studentData || {})
      }))
      
      // Filter out students already added
      const childIndexNumbers = children.map(child => child.indexNumber)
      const availableStudentsList = allStudents.filter(
        student => !childIndexNumbers.includes(student.indexNumber)
      )
      
      setAvailableStudents(availableStudentsList)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const addChildToParent = async (student) => {
    try {
      setAddingChild(true)
      
      // Update parent's children array in Firestore
      const parentRef = doc(db, 'users', user.id)
      await updateDoc(parentRef, {
        'parentData.children': arrayUnion(student.indexNumber)
      })
      
      // Reload page to show updated children list
      window.location.reload()
    } catch (error) {
      console.error('Error adding child:', error)
      showToast('Failed to add child. Please try again.', 'error')
      setAddingChild(false)
    }
  }

  const removeChildFromParent = async (indexNumber, studentName) => {
    if (!confirm('Are you sure you want to remove this child from your account?')) {
      return
    }

    try {
      // Get current children array
      const childrenArray = user.children || user.parentData?.children || []
      const updatedChildren = childrenArray.filter(child => {
        const childIndexNumber = typeof child === 'string' ? child : child.indexNumber || child
        return childIndexNumber !== indexNumber
      })
      
      // Update parent's children array in Firestore
      const parentRef = doc(db, 'users', user.id)
      await updateDoc(parentRef, {
        'parentData.children': updatedChildren
      })
      
      // Reload page to show updated children list
      window.location.reload()
    } catch (error) {
      console.error('Error removing child:', error)
      showToast('Failed to remove child. Please try again.', 'error')
    }
  }

  const filteredStudents = availableStudents.filter(student =>
    (student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.indexNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">Parent Dashboard</h2>
          <p className="loading-text">Loading your children's academic progress...</p>
        </div>
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
            {user.profileImage ? (
              <img src={user.profileImage} alt="Parent" />
            ) : (
              <div className="profile-avatar-letter">
                {(user.fullName || 'Parent').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3>{user.fullName || 'Parent'}</h3>
          <p className="parent-role">Parent Portal</p>
          <p className="parent-children">{children.length} {children.length === 1 ? 'Child' : 'Children'}</p>
        </div>
        
        <div className="student-selector">
          <div className="selector-header">
            <h4>Select Child</h4>
            <button className="add-child-btn" onClick={openAddChildModal} title="Add Child">
              +
            </button>
          </div>
          <div className="student-tabs">
            {children.map((student, index) => (
              <button
                key={student.id}
                className={`student-tab ${selectedStudent === index ? 'active' : ''}`}
                onClick={() => setSelectedStudent(index)}
              >
                <div className="student-avatar">
                  {(student.fullName || student.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="student-tab-info">
                  <span className="student-name">{student.fullName?.split(' ')[0] || student.name?.split(' ')[0]}</span>
                  <span className="student-details">Grade {student.grade} • {student.className || student.class}</span>
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
          <button 
            className={`nav-item ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Children
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          {activeTab !== 'manage' ? (
            <div className="header-info">
              <h2>{currentStudent.fullName || currentStudent.name}</h2>
              <p>Grade {currentStudent.grade} - {currentStudent.className || currentStudent.class}</p>
            </div>
          ) : (
            <div className="header-info">
              <h2>Manage Children</h2>
              <p>Add or remove children from your account</p>
            </div>
          )}
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
                  {currentStudent.gpa ? (
                    <p>GPA: {currentStudent.gpa}</p>
                  ) : (
                    <p>GPA: 0.0</p>
                  )}
                </div>
                <div className="stat-card">
                  <h3>Attendance</h3>
                  <div className="stat-value attendance">
                    {currentStudent.attendance ? `${currentStudent.attendance}%` : '0.0%'}
                  </div>
                  <p>{currentStudent.attendance >= 90 ? 'Excellent' : currentStudent.attendance > 0 ? 'Above average' : 'No data'}</p>
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
                        {grade.date ? new Date(grade.date.seconds * 1000).toLocaleDateString() : 'Not Available'}
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
            <div className="progress-section-redesign">
              <div className="progress-header">
                <div>
                  <h2>Academic Performance</h2>
                  <p className="progress-subtitle">{currentStudent.fullName || currentStudent.name} • Grade {currentStudent.grade} • {currentStudent.level} Level</p>
                </div>
                <div className="performance-summary">
                  <div className="summary-item">
                    <span className="summary-label">Total Subjects</span>
                    <span className="summary-value">{childrenGrades[currentStudent.id]?.length || 0}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Average</span>
                    <span className="summary-value">
                      {childrenGrades[currentStudent.id]?.length > 0 
                        ? (childrenGrades[currentStudent.id].reduce((sum, g) => sum + parseFloat(g.marks), 0) / childrenGrades[currentStudent.id].length).toFixed(1)
                        : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="subjects-grid-redesign">
                {childrenGrades[currentStudent.id]?.map((grade, index) => {
                  const getGradeColor = (gradeValue) => {
                    const gradeColors = {
                      'A+': '#10b981', 'A': '#22c55e', 'A-': '#3b82f6',
                      'B+': '#6366f1', 'B': '#8b5cf6', 'B-': '#f59e0b',
                      'C+': '#f97316', 'C': '#fb923c', 'C-': '#ef4444',
                      'S': '#ec4899', 'W': '#dc2626'
                    }
                    return gradeColors[gradeValue] || '#64748b'
                  }

                  const getPerformanceText = (marks) => {
                    if (marks >= 90) return 'Outstanding'
                    if (marks >= 75) return 'Excellent'
                    if (marks >= 65) return 'Good'
                    if (marks >= 50) return 'Average'
                    if (marks >= 35) return 'Needs Improvement'
                    return 'Requires Attention'
                  }

                  return (
                    <div key={index} className="subject-card-detailed">
                      <div className="card-header-detailed">
                        <div className="subject-info-detailed">
                          <h3 className="subject-name-large">{grade.subject}</h3>
                          <p className="performance-label">{getPerformanceText(grade.marks)}</p>
                        </div>
                      </div>

                      <div className="marks-section">
                        <div className="marks-large">
                          <span className="marks-number">{grade.marks}</span>
                          <span className="marks-percent">%</span>
                        </div>
                        <div className="progress-bar-detailed">
                          <div 
                            className="progress-fill-detailed"
                            style={{ 
                              width: `${grade.marks}%`,
                              background: `linear-gradient(90deg, ${getGradeColor(grade.grade)}, ${getGradeColor(grade.grade)}dd)`
                            }}
                          />
                        </div>
                      </div>

                      <div className="card-details">
                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="detail-icon">👨‍🏫</span>
                            <div className="detail-content">
                              <span className="detail-label">Teacher</span>
                              <span className="detail-value">{grade.teacherName || 'Not Assigned'}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">📝</span>
                            <div className="detail-content">
                              <span className="detail-label">Assessment</span>
                              <span className="detail-value">{grade.assessmentType || 'Test'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <div className="detail-content">
                              <span className="detail-label">Date</span>
                              <span className="detail-value">
                                {grade.date 
                                  ? new Date(grade.date.seconds * 1000).toLocaleDateString('en-US', { 
                                      month: 'long', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    }) 
                                  : 'Not Available'}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">🎯</span>
                            <div className="detail-content">
                              <span className="detail-label">Class Rank</span>
                              <span className="detail-value">{grade.rank || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {(!childrenGrades[currentStudent.id] || childrenGrades[currentStudent.id].length === 0) && (
                <p className="no-data">No grade data available for this student yet</p>
              )}
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="teachers-section-redesign">
              <div className="teachers-header">
                <h2>Subject Teachers</h2>
                <p className="teachers-subtitle">Teachers assigned to {currentStudent.fullName || currentStudent.name}</p>
              </div>
              <div className="teachers-grid-redesign">
                {childrenGrades[currentStudent.id]?.map((grade, index) => (
                  <div key={index} className="teacher-card-detailed">
                    <div className="teacher-subject-header">
                      <div className="subject-icon-circle">
                        {grade.subject.charAt(0)}
                      </div>
                      <div>
                        <h3 className="teacher-subject-name">{grade.subject}</h3>
                        <span className="teacher-grade-level">Grade {currentStudent.grade} • {currentStudent.level}</span>
                      </div>
                    </div>
                    
                    <div className="teacher-info-section">
                      <div className="teacher-avatar">
                        {grade.teacherName 
                          ? grade.teacherName.charAt(0).toUpperCase() 
                          : 'T'}
                      </div>
                      <div className="teacher-details">
                        <h4 className="teacher-name">{grade.teacherName || 'Not Assigned'}</h4>
                        <p className="teacher-role">Subject Teacher</p>
                      </div>
                    </div>

                    <div className="teacher-stats">
                      <div className="stat-item-teacher">
                        <span className="stat-label-teacher">Current Grade</span>
                        <span className="stat-value-teacher" style={{ 
                          color: grade.marks >= 75 ? '#10b981' : grade.marks >= 50 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {grade.grade}
                        </span>
                      </div>
                      <div className="stat-item-teacher">
                        <span className="stat-label-teacher">Latest Score</span>
                        <span className="stat-value-teacher">{grade.marks}%</span>
                      </div>
                      <div className="stat-item-teacher">
                        <span className="stat-label-teacher">Assessment</span>
                        <span className="stat-value-teacher">{grade.assessmentType || 'Test'}</span>
                      </div>
                    </div>

                    <div className="teacher-contact-info">
                      <p className="contact-note">
                        📧 For inquiries, contact through school administration
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {(!childrenGrades[currentStudent.id] || childrenGrades[currentStudent.id].length === 0) && (
                <div className="no-teachers-message">
                  <p>No teacher assignments available yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="manage-children-section">
              <div className="manage-header">
                <h2>Manage Children</h2>
                <p className="manage-subtitle">Add or remove children from your account</p>
              </div>

              <div className="manage-actions">
                <button className="add-child-main-btn" onClick={openAddChildModal}>
                  <span className="btn-icon">+</span>
                  Add New Child
                </button>
              </div>

              <div className="children-cards-grid">
                {children.map((student) => (
                  <div key={student.id} className="child-manage-card">
                    <div className="child-card-header">
                      <div className="child-avatar-large">
                        {(student.fullName || student.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="child-badge-status">Active</div>
                    </div>

                    <div className="child-card-body">
                      <h3 className="child-card-name">{student.fullName || student.name}</h3>
                      <div className="child-card-details">
                        <div className="detail-chip">
                          <span className="chip-icon">🎓</span>
                          <span>Grade {student.grade}</span>
                        </div>
                        <div className="detail-chip">
                          <span className="chip-icon">📚</span>
                          <span>{student.className || student.class}</span>
                        </div>
                        <div className="detail-chip">
                          <span className="chip-icon">🎯</span>
                          <span>{student.level}</span>
                        </div>
                      </div>

                      <div className="child-card-info">
                        <div className="info-row">
                          <span className="info-label">Index Number</span>
                          <span className="info-value">{student.indexNumber}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Subjects</span>
                          <span className="info-value">{childrenGrades[student.id]?.length || 0}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Average Grade</span>
                          <span className="info-value">
                            {childrenGrades[student.id]?.length > 0 
                              ? calculateAverageGrade(childrenGrades[student.id])
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="child-card-footer">
                      <button 
                        className="remove-child-main-btn"
                        onClick={() => removeChildFromParent(student.indexNumber, student.fullName || student.name)}
                      >
                        <span className="btn-icon">×</span>
                        Remove Child
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {children.length === 0 && (
                <div className="no-children-message">
                  <p>No children added yet. Click "Add New Child" to get started.</p>
                </div>
              )}
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

      {/* Add Child Modal */}
      {showAddChildModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowAddChildModal(false)} />
          <div className="add-child-modal">
            <div className="modal-header">
              <h3>Add Child</h3>
              <button 
                className="close-modal"
                onClick={() => setShowAddChildModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="search-student-input"
                placeholder="Search by name, index number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="students-list">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <div key={student.id} className="student-item">
                      <div className="student-item-avatar">
                        {(student.fullName || student.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="student-item-info">
                        <div className="student-item-name">{student.fullName || student.name}</div>
                        <div className="student-item-details">
                          {student.indexNumber} • Grade {student.grade} • {student.className || student.class}
                        </div>
                        <div className="student-item-email">{student.email}</div>
                      </div>
                      <button
                        className="add-student-btn"
                        onClick={() => addChildToParent(student)}
                        disabled={addingChild}
                      >
                        {addingChild ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-students">
                    {searchTerm ? 'No students found matching your search.' : 'No available students to add.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentDashboard;
