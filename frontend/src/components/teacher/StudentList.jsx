import { useState, useEffect } from 'react'

const StudentList = ({ students = [], teacherClasses = [] }) => {
  const [selectedClass, setSelectedClass] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])

  // Initialize selected class when teacherClasses changes
  useEffect(() => {
    if (teacherClasses.length > 0 && !selectedClass) {
      setSelectedClass(teacherClasses[0])
    }
  }, [teacherClasses, selectedClass])

  // Filter students based on selected class
  useEffect(() => {
    if (selectedClass && students.length > 0) {
      const filtered = students.filter(student => 
        student.originalClassInfo === selectedClass || student.class === selectedClass
      )
      setFilteredStudents(filtered)
      console.log(`Filtered ${filtered.length} students for class: ${selectedClass}`)
    } else {
      setFilteredStudents([])
    }
  }, [selectedClass, students])

  console.log('StudentList - Received props:', {
    studentsCount: students.length,
    teacherClassesCount: teacherClasses.length,
    selectedClass,
    filteredStudentsCount: filteredStudents.length
  })

  if (teacherClasses.length === 0) {
    return (
      <div className="student-list-container">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          <h3>No Classes Assigned</h3>
          <p>You don't have any classes assigned yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="student-list-container">
      <div className="class-selector">
        <h3>Select Class</h3>
        <div className="class-buttons">
          {teacherClasses.map((cls, index) => (
            <button
              key={index}
              className={`class-button ${selectedClass === cls ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)}
            >
              Class {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="students-table">
        {filteredStudents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            <p>No students found for class {selectedClass}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Index/Admission No</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Stream</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.indexNumber || student.admissionNo || 'N/A'}</td>
                  <td>{student.fullName || student.name || 'N/A'}</td>
                  <td>{student.grade || 'N/A'}</td>
                  <td>{student.stream || 'General'}</td>
                  <td>{student.attendance ? `${student.attendance}%` : '0%'}</td>
                  <td>{student.gpa || '0.0'}</td>
                  <td>
                    <button className="action-btn view-btn" onClick={() => console.log('View student:', student)}>
                      View Details
                    </button>
                    <button className="action-btn message-btn" onClick={() => console.log('Message student:', student)}>
                      Send Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default StudentList
