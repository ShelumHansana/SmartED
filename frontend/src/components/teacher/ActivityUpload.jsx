import { useState } from 'react'

const ActivityUpload = () => {
  const [selectedClass, setSelectedClass] = useState('class-1')
  const [activityType, setActivityType] = useState('assignment')
  const [activities, setActivities] = useState([
    {
      id: 1,
      class: 'class-1',
      type: 'assignment',
      title: 'Algebra Practice',
      dueDate: '2025-07-25',
      description: 'Complete exercises 1-10 from Chapter 5'
    },
    {
      id: 2,
      class: 'class-2',
      type: 'quiz',
      title: 'Geometry Quiz',
      dueDate: '2025-07-23',
      description: 'Online quiz on basic geometric shapes'
    }
  ])

  const classes = [
    { id: 'class-1', name: 'Class 10-A' },
    { id: 'class-2', name: 'Class 10-B' },
    { id: 'class-3', name: 'Class 11-A' }
  ]

  const activityTypes = [
    { id: 'assignment', name: 'Assignment' },
    { id: 'quiz', name: 'Quiz' },
    { id: 'project', name: 'Project' },
    { id: 'exam', name: 'Exam' }
  ]

  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    dueDate: '',
    file: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newActivity.title && newActivity.description && newActivity.dueDate) {
      setActivities([
        {
          id: activities.length + 1,
          class: selectedClass,
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
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setNewActivity(prev => ({ ...prev, file }))
  }

  return (
    <div className="activity-upload">
      <div className="upload-section">
        <h3>Upload New Activity</h3>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Class:</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Activity Type:</label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              {activityTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={newActivity.title}
              onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Activity title"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Activity description"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={newActivity.dueDate}
              onChange={(e) => setNewActivity(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Attachment:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <button type="submit" className="upload-btn">Upload Activity</button>
        </form>
      </div>

      <div className="activities-list">
        <h3>Uploaded Activities</h3>
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <div>
                <span className="activity-type">{
                  activityTypes.find(type => type.id === activity.type)?.name
                }</span>
                <span className="class-tag">{
                  classes.find(cls => cls.id === activity.class)?.name
                }</span>
              </div>
              <span className="due-date">Due: {activity.dueDate}</span>
            </div>
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <div className="activity-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityUpload
