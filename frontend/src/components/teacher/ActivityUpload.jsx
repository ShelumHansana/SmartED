import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const ActivityUpload = ({ showToast }) => {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('')
  const [activityType, setActivityType] = useState('assignment')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  // Get teacher's classes dynamically
  const teacherClasses = user?.classes || []
  const classes = teacherClasses.map((cls, index) => ({
    id: `class-${index}`,
    value: cls,
    name: cls
  }))

  // Set default selected class
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].value)
    }
  }, [classes])

  // Fetch activities when class changes
  useEffect(() => {
    const fetchActivities = async () => {
      if (!selectedClass || !user?.id) return

      try {
        const activitiesQuery = query(
          collection(db, 'activities'),
          where('class', '==', selectedClass),
          where('teacherId', '==', user.id)
        )
        const activitiesSnapshot = await getDocs(activitiesQuery)
        const activitiesData = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().getTime() : 0
        }))
        // Sort client-side by timestamp descending
        activitiesData.sort((a, b) => b.timestamp - a.timestamp)
        setActivities(activitiesData)
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [selectedClass, user?.id])

  const activityTypes = [
    { id: 'assignment', name: 'Assignment' },
    { id: 'unit-test', name: 'Unit Test' },
    { id: 'term-test', name: 'Term Test' },
    { id: 'practical', name: 'Practical Test' },
    { id: 'model-paper', name: 'Model Paper' },
    { id: 'project', name: 'Project' }
  ]

  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    dueDate: '',
    file: null
  })

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newActivity.title && newActivity.description && newActivity.dueDate && selectedClass) {
      setLoading(true)
      try {
        // Parse the selected class format (e.g., "10-D" -> grade: 10, className: D)
        let grade, className
        if (selectedClass.includes('-')) {
          [grade, className] = selectedClass.split('-')
        } else {
          className = selectedClass
          grade = null
        }

        // Get all students in the selected class
        let studentsQuery
        if (grade && className) {
          studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('studentData.grade', '==', grade),
            where('studentData.className', '==', className)
          )
        } else {
          studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('studentData.className', '==', className)
          )
        }
        
        const studentsSnapshot = await getDocs(studentsQuery)
        const studentIds = studentsSnapshot.docs.map(doc => doc.id)

        console.log(`Found ${studentIds.length} students in class ${selectedClass}`)

        // Save activity to Firestore
        const activityData = {
          class: selectedClass,
          type: activityType,
          title: newActivity.title,
          description: newActivity.description,
          dueDate: newActivity.dueDate,
          fileName: newActivity.file?.name || null,
          teacherId: user.id,
          teacherName: user.fullName || user.name || 'Teacher',
          subject: user.subjects?.[0] || 'General',
          createdAt: serverTimestamp(),
          studentIds: studentIds
        }
        
        const activityDoc = await addDoc(collection(db, 'activities'), activityData)

        // Create notification for each student in the class
        const activityTypeName = activityTypes.find(t => t.id === activityType)?.name || activityType
        const notificationPromises = studentIds.map(studentId => {
          return addDoc(collection(db, 'notifications'), {
            recipientId: studentId,
            type: 'activity',
            title: `New ${activityTypeName}: ${newActivity.title}`,
            message: `${newActivity.description.substring(0, 100)}${newActivity.description.length > 100 ? '...' : ''}`,
            class: selectedClass,
            subject: user.subjects?.[0] || 'General',
            activityType: activityType,
            dueDate: newActivity.dueDate,
            teacherId: user.id,
            teacherName: user.fullName || user.name || 'Teacher',
            read: false,
            createdAt: serverTimestamp(),
            activityId: activityDoc.id
          })
        })

        await Promise.all(notificationPromises)

        console.log(`✅ Created ${notificationPromises.length} notifications for activity`)
        console.log('Notification details:', {
          type: 'activity',
          activityType: activityType,
          recipientCount: studentIds.length,
          class: selectedClass,
          subject: user.subjects?.[0] || 'General',
          dueDate: newActivity.dueDate
        })

        // Refresh activities list
        const updatedActivitiesQuery = query(
          collection(db, 'activities'),
          where('class', '==', selectedClass),
          where('teacherId', '==', user.id)
        )
        const updatedActivitiesSnapshot = await getDocs(updatedActivitiesQuery)
        const updatedActivitiesData = updatedActivitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().getTime() : 0
        }))
        // Sort client-side by timestamp descending
        updatedActivitiesData.sort((a, b) => b.timestamp - a.timestamp)
        setActivities(updatedActivitiesData)

        setNewActivity({
          title: '',
          description: '',
          dueDate: '',
          file: null
        })
        if (showToast) {
          showToast(`Activity uploaded and sent to ${studentIds.length} students successfully!`, 'success')
        }
      } catch (error) {
        console.error('Error uploading activity:', error)
        if (showToast) {
          showToast('Failed to upload activity. Please try again.', 'error')
        }
      } finally {
        setLoading(false)
      }
    } else {
      if (showToast) {
        showToast('Please fill all required fields', 'error')
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setNewActivity(prev => ({ ...prev, file }))
  }

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity)
    setShowConfirmModal(true)
  }

  const handleConfirmDelete = async () => {
    if (activityToDelete) {
      try {
        // Delete activity from Firestore
        await deleteDoc(doc(db, 'activities', activityToDelete.id))
        
        // Refresh activities list
        setActivities(activities.filter(a => a.id !== activityToDelete.id))
        
        if (showToast) {
          showToast('Activity deleted successfully!', 'success')
        }
      } catch (error) {
        console.error('Error deleting activity:', error)
        if (showToast) {
          showToast('Failed to delete activity. Please try again.', 'error')
        }
      }
    }
    setShowConfirmModal(false)
    setActivityToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowConfirmModal(false)
    setActivityToDelete(null)
  }

  if (!user || !user.classes || user.classes.length === 0) {
    return (
      <div className="activity-upload">
        <div className="no-classes-message">
          <h3>No Classes Assigned</h3>
          <p>You don't have any classes assigned yet. Please contact the administrator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="activity-upload">
      <div className="upload-section">
        <h3>📤 Upload New Activity</h3>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label>Class *</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                {classes.length === 0 && <option value="">No classes assigned</option>}
                {classes.map(cls => (
                  <option key={cls.id} value={cls.value}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Activity Type *</label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                required
              >
                {activityTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={newActivity.title}
              onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter activity title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter activity description"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                value={newActivity.dueDate}
                onChange={(e) => setNewActivity(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Attachment (Optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
              />
              {newActivity.file && (
                <p className="file-name">📎 {newActivity.file.name}</p>
              )}
            </div>
          </div>

          <button type="submit" className="upload-btn" disabled={loading}>
            <span>📤</span> {loading ? 'Uploading...' : 'Upload Activity'}
          </button>
        </form>
      </div>

      <div className="activities-list">
        <h3>📚 Uploaded Activities</h3>
        {activities.length === 0 ? (
          <p className="no-activities">No activities uploaded yet. Create your first activity above!</p>
        ) : (
          <div className="activities-grid">
            {activities.map(activity => (
              <div key={activity.id} className="activity-card">
                <div className="activity-header">
                  <div className="activity-tags">
                    <span className={`activity-type type-${activity.type}`}>
                      {activityTypes.find(type => type.id === activity.type)?.name}
                    </span>
                    <span className="class-tag">
                      {activity.class}
                    </span>
                  </div>
                  <span className="due-date">📅 {activity.dueDate}</span>
                </div>
                <h4>{activity.title}</h4>
                <p className="activity-description">{activity.description}</p>
                {activity.fileName && (
                  <p className="activity-file">📎 {activity.fileName}</p>
                )}
                <div className="activity-actions">
                  <button className="edit-btn">
                    <span>✏️</span> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClick(activity)}
                  >
                    <span>🗑️</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <div className="modal-header">
              <h3>Delete Activity</h3>
            </div>
            <div className="modal-body">
              <div className="confirm-icon confirm-icon-danger">
                ⚠️
              </div>
              <p className="confirm-message">
                Are you sure you want to delete "{activityToDelete?.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelDelete}>
                <span>❌</span> Cancel
              </button>
              <button className="confirm-btn confirm-btn-danger" onClick={handleConfirmDelete}>
                <span>🗑️</span> Delete Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityUpload
