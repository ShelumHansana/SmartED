import { useState } from 'react'

const StudentList = () => {
  const [selectedClass, setSelectedClass] = useState('class-1')
  
  const classes = [
    { id: 'class-1', name: 'Class 10-A' },
    { id: 'class-2', name: 'Class 10-B' },
    { id: 'class-3', name: 'Class 11-A' }
  ]

  const students = {
    'class-1': [
      { id: 1, name: 'John Doe', attendance: '90%', performance: 'A' },
      { id: 2, name: 'Jane Smith', attendance: '85%', performance: 'B+' },
      { id: 3, name: 'Mike Johnson', attendance: '95%', performance: 'A+' }
    ],
    'class-2': [
      { id: 4, name: 'Sarah Wilson', attendance: '88%', performance: 'B' },
      { id: 5, name: 'Tom Brown', attendance: '92%', performance: 'A-' }
    ],
    'class-3': [
      { id: 6, name: 'Emily Davis', attendance: '94%', performance: 'A' },
      { id: 7, name: 'David Clark', attendance: '87%', performance: 'B+' }
    ]
  }

  return (
    <div className="student-list-container">
      <div className="class-selector">
        <h3>Select Class</h3>
        <div className="class-buttons">
          {classes.map(cls => (
            <button
              key={cls.id}
              className={`class-button ${selectedClass === cls.id ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls.id)}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Attendance</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students[selectedClass].map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.attendance}</td>
                <td>{student.performance}</td>
                <td>
                  <button className="action-btn view-btn">View Details</button>
                  <button className="action-btn message-btn">Send Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentList
