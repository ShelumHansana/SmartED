import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const StudentList = ({ students = [], teacherClasses = [], teacherId }) => {
  const [selectedClass, setSelectedClass] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])
  const [studentGrades, setStudentGrades] = useState({})

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

  // Fetch grades for filtered students
  useEffect(() => {
    const fetchGrades = async () => {
      if (filteredStudents.length === 0) return

      try {
        const gradesMap = {}
        
        // Fetch grades for each student
        for (const student of filteredStudents) {
          const gradesQuery = query(
            collection(db, 'grades'),
            where('studentId', '==', student.id)
          )
          const gradesSnapshot = await getDocs(gradesQuery)
          const grades = gradesSnapshot.docs.map(doc => doc.data())
          
          // Calculate average and latest grade
          if (grades.length > 0) {
            const avgMarks = grades.reduce((sum, g) => sum + (parseFloat(g.marks) || 0), 0) / grades.length
            const latestGrade = grades.sort((a, b) => {
              const dateA = b.date?.toDate?.() || new Date(0)
              const dateB = a.date?.toDate?.() || new Date(0)
              return dateB - dateA
            })[0]
            
            gradesMap[student.id] = {
              average: avgMarks.toFixed(1),
              latest: latestGrade,
              count: grades.length
            }
          }
        }
        
        setStudentGrades(gradesMap)
      } catch (error) {
        console.error('Error fetching grades:', error)
      }
    }

    fetchGrades()
  }, [filteredStudents])

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
                <th>Average Grade</th>
                <th>Latest Assessment</th>
                <th>Total Grades</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const gradeInfo = studentGrades[student.id]
                return (
                  <tr key={student.id}>
                    <td>{student.indexNumber || student.admissionNo || 'N/A'}</td>
                    <td>{student.fullName || student.name || 'N/A'}</td>
                    <td>{student.grade || 'N/A'}</td>
                    <td>{student.stream || 'General'}</td>
                    <td>
                      {gradeInfo ? (
                        <span className="grade-badge">
                          {gradeInfo.average}%
                        </span>
                      ) : (
                        <span className="no-data">No grades</span>
                      )}
                    </td>
                    <td>
                      {gradeInfo?.latest ? (
                        <div className="latest-grade">
                          <span className="subject-name">{gradeInfo.latest.subject}</span>
                          <span className="marks">{gradeInfo.latest.marks}%</span>
                        </div>
                      ) : (
                        <span className="no-data">-</span>
                      )}
                    </td>
                    <td>
                      {gradeInfo ? (
                        <span className="count-badge">{gradeInfo.count}</span>
                      ) : (
                        <span className="no-data">0</span>
                      )}
                    </td>
                    <td>
                      <button className="action-btn view-btn" onClick={() => console.log('View student:', student)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default StudentList
