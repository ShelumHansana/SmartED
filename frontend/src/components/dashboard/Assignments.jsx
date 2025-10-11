import { useState } from 'react'
import { getStudentLevel } from '../../utils/sriLankanSchoolUtils'

const Assignments = () => {
  const [selectedSubject, setSelectedSubject] = useState('all')

  // Student context - can be changed to test O/L vs A/L
  const studentInfo = {
    grade: 12, // Change to 10 for O/L student
    stream: 'Physical Science'
  }
  
  const studentLevel = getStudentLevel(studentInfo.grade)

  // Subjects based on student level
  const subjects = studentLevel === 'AL' ? [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'english', name: 'English' },
    { id: 'ict', name: 'ICT' }
  ] : [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'sinhala', name: 'Sinhala' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'buddhism', name: 'Buddhism' },
    { id: 'ict', name: 'ICT' }
  ]

  // Assignments based on student level
  const assignments = studentLevel === 'AL' ? [
    // A/L assignments
    {
      id: 1,
      subject: 'mathematics',
      title: 'Advanced Algebra - Quadratic Functions',
      dueDate: '2025-07-25',
      status: 'pending',
      description: 'Complete Exercise 8.2 from G.C.E A/L Mathematics textbook (Questions 1-15)'
    },
    {
      id: 2,
      subject: 'physics',
      title: 'Practical Report: Wave Motion',
      dueDate: '2025-07-28',
      status: 'submitted',
      description: 'Submit detailed observations from wave interference experiment'
    },
    {
      id: 3,
      subject: 'chemistry',
      title: 'Organic Chemistry Assignment',
      dueDate: '2025-07-30',
      status: 'pending',
      description: 'Analyze the structure and properties of benzene derivatives'
    },
    {
      id: 4,
      subject: 'english',
      title: 'Essay: Contemporary Literature',
      dueDate: '2025-08-02',
      status: 'pending',
      description: 'Write a 1000-word critical analysis on modern Sri Lankan literature'
    },
    {
      id: 5,
      subject: 'ict',
      title: 'Database Design Project',
      dueDate: '2025-08-05',
      status: 'submitted',
      description: 'Create a database system for school library management using MySQL'
    }
  ] : [
    // O/L assignments
    {
      id: 1,
      subject: 'mathematics',
      title: 'Algebra Practice Problems',
      dueDate: '2025-07-25',
      status: 'pending',
      description: 'Complete exercises 4.1 to 4.3 from Mathematics textbook'
    },
    {
      id: 2,
      subject: 'science',
      title: 'Science Project: Plant Growth',
      dueDate: '2025-07-28',
      status: 'submitted',
      description: 'Observe and record plant growth under different conditions over 2 weeks'
    },
    {
      id: 3,
      subject: 'english',
      title: 'Composition: My Hometown',
      dueDate: '2025-07-30',
      status: 'pending',
      description: 'Write a 300-word composition describing your hometown and its features'
    },
    {
      id: 4,
      subject: 'sinhala',
      title: 'Kavya Parichaya (Poetry Analysis)',
      dueDate: '2025-08-01',
      status: 'pending',
      description: 'Analyze the themes and literary devices in selected poems'
    },
    {
      id: 5,
      subject: 'history',
      title: 'Ancient Sri Lankan Civilization',
      dueDate: '2025-08-03',
      status: 'submitted',
      description: 'Research project on Anuradhapura and Polonnaruwa periods'
    }
  ]

  const filteredAssignments = selectedSubject === 'all'
    ? assignments
    : assignments.filter(assignment => assignment.subject === selectedSubject)

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h2>Assignments</h2>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="subject-filter"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div className="assignments-grid">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <h3>{assignment.title}</h3>
              <span className={`status ${assignment.status}`}>
                {assignment.status}
              </span>
            </div>
            <div className="assignment-details">
              <p><strong>Subject:</strong> {
                subjects.find(s => s.id === assignment.subject)?.name
              }</p>
              <p><strong>Due Date:</strong> {
                new Date(assignment.dueDate).toLocaleDateString()
              }</p>
              <p className="description">{assignment.description}</p>
            </div>
            {assignment.status === 'pending' && (
              <div className="assignment-actions">
                <button className="submit-btn">Submit Assignment</button>
                <button className="view-btn">View Details</button>
              </div>
            )}
            {assignment.status === 'submitted' && (
              <div className="assignment-actions">
                <button className="view-btn">View Submission</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Assignments
