import { useState } from 'react'

const StudentList = () => {
  const [selectedClass, setSelectedClass] = useState('class-1')
  
  const classes = [
    { id: 'class-1', name: 'Grade 12 M1 (Physical Science)' },
    { id: 'class-2', name: 'Grade 12 M2 (Physical Science)' },
    { id: 'class-3', name: 'Grade 13 M1 (Physical Science)' }
  ]

  const students = {
    'class-1': [
      { id: 1, name: 'Kamal Perera', admissionNo: 'AL2025001', attendance: '90%', performance: 'A', gpa: '3.8' },
      { id: 2, name: 'Sanduni Silva', admissionNo: 'AL2025002', attendance: '85%', performance: 'B', gpa: '3.2' },
      { id: 3, name: 'Tharindu Wickramasinghe', admissionNo: 'AL2025003', attendance: '95%', performance: 'A', gpa: '4.0' },
      { id: 4, name: 'Nimali Fernando', admissionNo: 'AL2025004', attendance: '88%', performance: 'B', gpa: '3.0' }
    ],
    'class-2': [
      { id: 5, name: 'Ruwan Jayawardena', admissionNo: 'AL2025015', attendance: '88%', performance: 'B', gpa: '3.1' },
      { id: 6, name: 'Chamari Rathnayake', admissionNo: 'AL2025016', attendance: '92%', performance: 'A', gpa: '3.7' },
      { id: 7, name: 'Ashen Perera', admissionNo: 'AL2025017', attendance: '91%', performance: 'A', gpa: '3.6' }
    ],
    'class-3': [
      { id: 8, name: 'Dilshan Kumar', admissionNo: 'AL2024001', attendance: '94%', performance: 'A', gpa: '3.9' },
      { id: 9, name: 'Tharika Silva', admissionNo: 'AL2024002', attendance: '87%', performance: 'B', gpa: '3.3' },
      { id: 10, name: 'Sachini Mendis', admissionNo: 'AL2024003', attendance: '96%', performance: 'A', gpa: '4.0' }
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
              <th>Admission No</th>
              <th>Name</th>
              <th>Attendance</th>
              <th>Performance</th>
              <th>GPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students[selectedClass].map(student => (
              <tr key={student.id}>
                <td>{student.admissionNo}</td>
                <td>{student.name}</td>
                <td>{student.attendance}</td>
                <td>{student.performance}</td>
                <td>{student.gpa}</td>
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
