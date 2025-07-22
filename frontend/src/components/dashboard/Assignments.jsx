import { useState } from 'react'

const Assignments = () => {
  const [selectedSubject, setSelectedSubject] = useState('all')

  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' }
  ]

  const assignments = [
    {
      id: 1,
      subject: 'math',
      title: 'Quadratic Equations Practice',
      dueDate: '2025-07-25',
      status: 'pending',
      description: 'Complete problems 1-10 from Chapter 5'
    },
    {
      id: 2,
      subject: 'science',
      title: 'Lab Report: Photosynthesis',
      dueDate: '2025-07-28',
      status: 'submitted',
      description: 'Write a detailed lab report on the photosynthesis experiment'
    },
    {
      id: 3,
      subject: 'english',
      title: 'Essay: Modern Literature',
      dueDate: '2025-07-30',
      status: 'pending',
      description: 'Write a 1000-word essay on the assigned novel'
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
