import { useState } from 'react'

const ActivityUpload = () => {
  const [selectedClass, setSelectedClass] = useState('class-1')
  const [activityType, setActivityType] = useState('assignment')
  const [activities, setActivities] = useState([
    {
      id: 1,
      class: 'class-1',
      type: 'assignment',
      title: 'Calculus Integration Practice',
      dueDate: '2025-10-05',
      description: 'Complete exercises 1-15 from Chapter 8: Integration Techniques. Focus on integration by parts and substitution methods.'
    },
    {
      id: 2,
      class: 'class-2',
      type: 'unit-test',
      title: 'Differential Calculus Unit Test',
      dueDate: '2025-10-03',
      description: 'Unit test covering differentiation rules, chain rule, and applications of derivatives. Duration: 2 hours.'
    },
    {
      id: 3,
      class: 'class-3',
      type: 'model-paper',
      title: 'A/L Mathematics Model Paper 2025',
      dueDate: '2025-10-10',
      description: 'Practice model paper based on previous A/L examination patterns. Covers Pure Mathematics and Applied Mathematics sections.'
    }
  ])

  const classes = [
    { id: 'class-1', name: 'Grade 12 M1 (Physical Science)' },
    { id: 'class-2', name: 'Grade 12 M2 (Physical Science)' },
    { id: 'class-3', name: 'Grade 13 M1 (Physical Science)' }
  ]

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
