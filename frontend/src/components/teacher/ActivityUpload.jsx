import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ActivityUpload = ({ showToast }) => {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('')
  const [activityType, setActivityType] = useState('assignment')
  const [activities, setActivities] = useState([])

  // Get teacher's classes dynamically
  const teacherClasses = user?.classes || []
  const classes = teacherClasses.map((cls, index) => ({
    id: `class-${index}`,
    value: cls,
    name: cls
  }))

  // Set default selected class
  useState(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id)
    }
  }, [classes])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newActivity.title && newActivity.description && newActivity.dueDate && selectedClass) {
      const selectedClassName = classes.find(cls => cls.id === selectedClass)?.name || selectedClass
      setActivities([
        {
          id: activities.length + 1,
          class: selectedClass,
          className: selectedClassName,
          type: activityType,
          ...newActivity
        },
        ...activities
      ])
      setNewActivity({
        title: '',
        description: '',
        dueDate: '',
        file: null
      })
      if (showToast) {
        showToast('Activity uploaded successfully!', 'success')
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

  const handleConfirmDelete = () => {
    if (activityToDelete) {
      setActivities(activities.filter(a => a.id !== activityToDelete.id))
      if (showToast) {
        showToast('Activity deleted successfully!', 'success')
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
                  <option key={cls.id} value={cls.id}>
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

          <button type="submit" className="upload-btn">
            <span>📤</span> Upload Activity
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
                      {activity.className}
                    </span>
                  </div>
                  <span className="due-date">📅 {activity.dueDate}</span>
                </div>
                <h4>{activity.title}</h4>
                <p className="activity-description">{activity.description}</p>
                {activity.file && (
                  <p className="activity-file">📎 {activity.file.name}</p>
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
