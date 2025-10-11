import { useState, useEffect } from 'react'
import './GradeEntry.css'

const GradeEntry = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedAssessment, setSelectedAssessment] = useState('')
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [showAddAssessment, setShowAddAssessment] = useState(false)
  const [newAssessment, setNewAssessment] = useState({
    name: '',
    type: '',
    maxMarks: 100,
    date: new Date().toISOString().split('T')[0]
  })
  const [isSaving, setIsSaving] = useState(false)

  // Sample data - in a real app, this would come from API
  const classes = [
    { id: 'AL_M1', name: 'Grade 12 M1 (Physical Science)', level: 'A/L' },
    { id: 'AL_M2', name: 'Grade 12 M2 (Physical Science)', level: 'A/L' },
    { id: 'AL_BS', name: 'Grade 12 Bio Science', level: 'A/L' },
    { id: 'OL_10A', name: 'Grade 10 A', level: 'O/L' },
    { id: 'OL_10B', name: 'Grade 10 B', level: 'O/L' }
  ]

  const subjects = [
    { id: 'MATH_AL', name: 'A/L Mathematics', level: 'A/L' },
    { id: 'MATH_OL', name: 'O/L Mathematics', level: 'O/L' },
    { id: 'PHYS_AL', name: 'A/L Physics', level: 'A/L' },
    { id: 'CHEM_AL', name: 'A/L Chemistry', level: 'A/L' }
  ]

  const assessmentTypes = [
    'Term Test',
    'Model Paper',
    'Assignment',
    'Practical Exam',
    'Class Test',
    'Project Work',
    'Monthly Test'
  ]

  const [assessments, setAssessments] = useState([
    { id: 1, name: 'First Term Test', type: 'Term Test', maxMarks: 100, date: '2025-09-15', subject: 'MATH_AL', class: 'AL_M1' },
    { id: 2, name: 'Calculus Assignment', type: 'Assignment', maxMarks: 50, date: '2025-09-20', subject: 'MATH_AL', class: 'AL_M1' },
    { id: 3, name: 'Model Paper 1', type: 'Model Paper', maxMarks: 100, date: '2025-09-25', subject: 'MATH_AL', class: 'AL_M2' }
  ])

  // Load students when class and subject are selected
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      // Sample student data - in real app, fetch from API
      const sampleStudents = [
        { id: 'ST001', name: 'Kamal Perera', admissionNo: 'AL2025001', currentGrade: 'B+' },
        { id: 'ST002', name: 'Sanduni Silva', admissionNo: 'AL2025002', currentGrade: 'A' },
        { id: 'ST003', name: 'Tharindu Fernando', admissionNo: 'AL2025003', currentGrade: 'B' },
        { id: 'ST004', name: 'Nethmini Perera', admissionNo: 'AL2025004', currentGrade: 'A-' },
        { id: 'ST005', name: 'Ravindu Silva', admissionNo: 'AL2025005', currentGrade: 'B+' },
        { id: 'ST006', name: 'Ishara Fernando', admissionNo: 'AL2025006', currentGrade: 'A' },
        { id: 'ST007', name: 'Dilini Wickramasinghe', admissionNo: 'AL2025007', currentGrade: 'B' },
        { id: 'ST008', name: 'Chamara Perera', admissionNo: 'AL2025008', currentGrade: 'B+' }
      ]
      setStudents(sampleStudents)

      // Initialize marks object
      const initialMarks = {}
      sampleStudents.forEach(student => {
        initialMarks[student.id] = ''
      })
      setMarks(initialMarks)
    }
  }, [selectedClass, selectedSubject])

  const handleMarkChange = (studentId, mark) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: mark
    }))
  }

  const getGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 85) return 'A'
    if (percentage >= 80) return 'A-'
    if (percentage >= 75) return 'B+'
    if (percentage >= 70) return 'B'
    if (percentage >= 65) return 'B-'
    if (percentage >= 60) return 'C+'
    if (percentage >= 55) return 'C'
    if (percentage >= 50) return 'C-'
    if (percentage >= 40) return 'S'
    return 'W'
  }

  const handleAddAssessment = () => {
    if (!newAssessment.name || !newAssessment.type) {
      alert('Please fill in all required fields')
      return
    }

    const assessment = {
      id: Date.now(),
      ...newAssessment,
      subject: selectedSubject,
      class: selectedClass
    }

    setAssessments(prev => [...prev, assessment])
    setNewAssessment({
      name: '',
      type: '',
      maxMarks: 100,
      date: new Date().toISOString().split('T')[0]
    })
    setShowAddAssessment(false)
    alert('Assessment added successfully!')
  }

  const handleSaveMarks = async () => {
    if (!selectedAssessment) {
      alert('Please select an assessment')
      return
    }

    // Validate that all marks are entered
    const emptyMarks = students.filter(student => 
      marks[student.id] === '' || marks[student.id] === undefined
    )

    if (emptyMarks.length > 0) {
      const proceed = window.confirm(
        `${emptyMarks.length} students don't have marks entered. Do you want to save anyway?`
      )
      if (!proceed) return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real app, this would send data to backend
      const marksData = {
        assessmentId: selectedAssessment,
        classId: selectedClass,
        subjectId: selectedSubject,
        marks: Object.entries(marks).map(([studentId, mark]) => ({
          studentId,
          marks: parseFloat(mark) || 0,
          grade: mark ? getGrade(parseFloat(mark), getCurrentAssessment()?.maxMarks || 100) : 'N/A'
        })),
        enteredBy: 'Mr. Sunil Perera',
        timestamp: new Date().toISOString()
      }

      console.log('Marks saved:', marksData)
      alert('Marks saved successfully!')

      // Reset form
      setMarks({})
      setSelectedAssessment('')

    } catch (error) {
      console.error('Error saving marks:', error)
      alert('Error saving marks. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getCurrentAssessment = () => {
    return assessments.find(a => a.id === parseInt(selectedAssessment))
  }

  const getFilteredAssessments = () => {
    return assessments.filter(a => 
      a.subject === selectedSubject && a.class === selectedClass
    )
  }

  const calculateClassAverage = () => {
    const validMarks = Object.values(marks).filter(mark => mark !== '' && !isNaN(mark))
    if (validMarks.length === 0) return 0
    const sum = validMarks.reduce((acc, mark) => acc + parseFloat(mark), 0)
    return (sum / validMarks.length).toFixed(1)
  }

  const getClassStats = () => {
    const validMarks = Object.values(marks).filter(mark => mark !== '' && !isNaN(mark))
    if (validMarks.length === 0) return { highest: 0, lowest: 0, average: 0 }
    
    const numericMarks = validMarks.map(mark => parseFloat(mark))
    return {
      highest: Math.max(...numericMarks),
      lowest: Math.min(...numericMarks),
      average: parseFloat(calculateClassAverage())
    }
  }

  return (
    <div className="grade-entry-container">
      <div className="grade-entry-header">
        <h2>📊 Grade Entry & Management</h2>
        <p>Enter and manage student marks for assessments</p>
      </div>

      {/* Selection Controls */}
      <div className="selection-controls">
        <div className="control-row">
          <div className="form-group">
            <label>📚 Select Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📖 Select Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-select"
            >
              <option value="">Choose a subject...</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📝 Select Assessment</label>
            <div className="assessment-select-group">
              <select 
                value={selectedAssessment} 
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="form-select"
                disabled={!selectedClass || !selectedSubject}
              >
                <option value="">Choose an assessment...</option>
                {getFilteredAssessments().map(assessment => (
                  <option key={assessment.id} value={assessment.id}>
                    {assessment.name} ({assessment.type}) - {assessment.maxMarks} marks
                  </option>
                ))}
              </select>
              <button 
                className="add-assessment-btn"
                onClick={() => setShowAddAssessment(true)}
                disabled={!selectedClass || !selectedSubject}
                title="Add new assessment"
              >
                ➕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Assessment Modal */}
      {showAddAssessment && (
        <div className="modal-overlay">
          <div className="modal-content add-assessment-modal">
            <div className="modal-header">
              <h3>➕ Add New Assessment</h3>
              <button 
                className="close-modal"
                onClick={() => setShowAddAssessment(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Assessment Name *</label>
                  <input
                    type="text"
                    value={newAssessment.name}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, name: e.target.value
                    }))}
                    placeholder="e.g., Second Term Test"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assessment Type *</label>
                  <select
                    value={newAssessment.type}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, type: e.target.value
                    }))}
                    required
                  >
                    <option value="">Select type...</option>
                    {assessmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Maximum Marks</label>
                  <input
                    type="number"
                    value={newAssessment.maxMarks}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, maxMarks: parseInt(e.target.value) || 100
                    }))}
                    min="1"
                    max="200"
                  />
                </div>
                <div className="form-group">
                  <label>Assessment Date</label>
                  <input
                    type="date"
                    value={newAssessment.date}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, date: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddAssessment(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleAddAssessment}
              >
                Add Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Entry Table */}
      {students.length > 0 && selectedAssessment && (
        <div className="grade-entry-section">
          <div className="assessment-info">
            <div className="assessment-details">
              <h3>{getCurrentAssessment()?.name}</h3>
              <div className="assessment-meta">
                <span className="assessment-type">{getCurrentAssessment()?.type}</span>
                <span className="max-marks">Max: {getCurrentAssessment()?.maxMarks} marks</span>
                <span className="assessment-date">
                  📅 {new Date(getCurrentAssessment()?.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {Object.values(marks).some(mark => mark !== '' && !isNaN(mark)) && (
              <div className="class-stats">
                <h4>📈 Class Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average</span>
                    <span className="stat-value">{getClassStats().average}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Highest</span>
                    <span className="stat-value">{getClassStats().highest}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Lowest</span>
                    <span className="stat-value">{getClassStats().lowest}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grade-table-container">
            <table className="grade-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Admission No</th>
                  <th>Current Grade</th>
                  <th>Marks ({getCurrentAssessment()?.maxMarks})</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const mark = marks[student.id]
                  const maxMarks = getCurrentAssessment()?.maxMarks || 100
                  const percentage = mark && !isNaN(mark) ? ((parseFloat(mark) / maxMarks) * 100).toFixed(1) : '-'
                  const grade = mark && !isNaN(mark) ? getGrade(parseFloat(mark), maxMarks) : '-'
                  
                  return (
                    <tr key={student.id}>
                      <td className="student-name">{student.name}</td>
                      <td className="admission-no">{student.admissionNo}</td>
                      <td className="current-grade">
                        <span className={`grade-badge ${student.currentGrade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                          {student.currentGrade}
                        </span>
                      </td>
                      <td className="marks-input">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={mark}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          placeholder="0"
                          className="mark-input"
                        />
                      </td>
                      <td className="percentage">
                        {percentage !== '-' && `${percentage}%`}
                      </td>
                      <td className="calculated-grade">
                        {grade !== '-' && (
                          <span className={`grade-badge ${grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                            {grade}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grade-entry-actions">
            <div className="action-buttons">
              <button 
                className="preview-btn"
                onClick={() => {
                  const stats = getClassStats()
                  alert(`Class Performance Summary:\nAverage: ${stats.average}\nHighest: ${stats.highest}\nLowest: ${stats.lowest}\nEntries: ${Object.values(marks).filter(m => m !== '' && !isNaN(m)).length}/${students.length}`)
                }}
              >
                👁️ Preview Results
              </button>
              <button 
                className="save-btn primary"
                onClick={handleSaveMarks}
                disabled={isSaving}
              >
                {isSaving ? '💾 Saving...' : '💾 Save Marks'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedClass || !selectedSubject || !selectedAssessment ? (
        <div className="instructions">
          <div className="instruction-card">
            <h3>📋 How to Enter Grades</h3>
            <ol>
              <li>Select the class you want to enter grades for</li>
              <li>Choose the subject from your teaching subjects</li>
              <li>Select an existing assessment or create a new one</li>
              <li>Enter marks for each student in the table</li>
              <li>Review the calculated grades and class statistics</li>
              <li>Save the marks to update student progress</li>
            </ol>
            <div className="grade-scale">
              <h4>🎯 Grading Scale</h4>
              <div className="scale-grid">
                <span>A+: 90-100%</span>
                <span>A: 85-89%</span>
                <span>A-: 80-84%</span>
                <span>B+: 75-79%</span>
                <span>B: 70-74%</span>
                <span>B-: 65-69%</span>
                <span>C+: 60-64%</span>
                <span>C: 55-59%</span>
                <span>C-: 50-54%</span>
                <span>S: 40-49%</span>
                <span>W: Below 40%</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default GradeEntry
