import { useState } from 'react'

const Overview = () => {
  const [selectedSubject, setSelectedSubject] = useState(null)

  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      teacher: 'Mr. Smith',
      progress: 78,
      nextClass: '2025-07-23T10:00:00',
      upcomingTopics: ['Calculus', 'Linear Algebra'],
      pendingAssignments: 2,
      lastGrade: 'A-',
      materials: ['Textbook Ch. 5', 'Practice Worksheets']
    },
    {
      id: 'physics',
      name: 'Physics',
      teacher: 'Dr. Johnson',
      progress: 82,
      nextClass: '2025-07-23T11:30:00',
      upcomingTopics: ['Quantum Mechanics', 'Thermodynamics'],
      pendingAssignments: 1,
      lastGrade: 'B+',
      materials: ['Lab Manual', 'Problem Set 3']
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      teacher: 'Mrs. Davis',
      progress: 85,
      nextClass: '2025-07-24T09:00:00',
      upcomingTopics: ['Organic Chemistry', 'Chemical Bonding'],
      pendingAssignments: 0,
      lastGrade: 'A',
      materials: ['Lab Report Template', 'Periodic Table']
    },
    {
      id: 'biology',
      name: 'Biology',
      teacher: 'Ms. Wilson',
      progress: 90,
      nextClass: '2025-07-24T13:00:00',
      upcomingTopics: ['Cell Biology', 'Genetics'],
      pendingAssignments: 1,
      lastGrade: 'A+',
      materials: ['Lab Safety Guidelines', 'Research Paper']
    },
    {
      id: 'english',
      name: 'English Literature',
      teacher: 'Mr. Brown',
      progress: 75,
      nextClass: '2025-07-25T10:00:00',
      upcomingTopics: ['Shakespeare', 'Modern Poetry'],
      pendingAssignments: 1,
      lastGrade: 'B+',
      materials: ['Novel Analysis', 'Writing Guidelines']
    },
    {
      id: 'history',
      name: 'History',
      teacher: 'Dr. Thompson',
      progress: 88,
      nextClass: '2025-07-25T11:30:00',
      upcomingTopics: ['World War II', 'Cold War'],
      pendingAssignments: 0,
      lastGrade: 'A-',
      materials: ['Timeline Project', 'Source Documents']
    },
    {
      id: 'computer',
      name: 'Computer Science',
      teacher: 'Mr. Anderson',
      progress: 92,
      nextClass: '2025-07-26T09:00:00',
      upcomingTopics: ['Data Structures', 'Algorithms'],
      pendingAssignments: 2,
      lastGrade: 'A',
      materials: ['Coding Examples', 'Project Guidelines']
    },
    {
      id: 'art',
      name: 'Fine Arts',
      teacher: 'Ms. Martinez',
      progress: 95,
      nextClass: '2025-07-26T14:00:00',
      upcomingTopics: ['Renaissance Art', 'Modern Art'],
      pendingAssignments: 1,
      lastGrade: 'A+',
      materials: ['Art Supplies List', 'Gallery Visit Notes']
    },
    {
      id: 'geography',
      name: 'Geography',
      teacher: 'Mrs. White',
      progress: 83,
      nextClass: '2025-07-27T10:00:00',
      upcomingTopics: ['Climate Change', 'Urban Geography'],
      pendingAssignments: 1,
      lastGrade: 'B+',
      materials: ['Map Project', 'Field Trip Form']
    },
    {
      id: 'language',
      name: 'Foreign Language',
      teacher: 'Mr. Garcia',
      progress: 87,
      nextClass: '2025-07-27T11:30:00',
      upcomingTopics: ['Advanced Grammar', 'Cultural Studies'],
      pendingAssignments: 0,
      lastGrade: 'A-',
      materials: ['Vocabulary List', 'Conversation Practice']
    }
  ]

  const stats = {
    overallGPA: 3.8,
    totalAssignments: subjects.reduce((sum, subject) => sum + subject.pendingAssignments, 0),
    upcomingTests: 3,
    averageProgress: subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length
  }

  return (
    <div className="overview-container">
      <h2>Welcome back, Student!</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Overall GPA</h3>
          <p className="stat-number">{stats.overallGPA}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Assignments</h3>
          <p className="stat-number">{stats.totalAssignments}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Tests</h3>
          <p className="stat-number">{stats.upcomingTests}</p>
        </div>
        <div className="stat-card">
          <h3>Average Progress</h3>
          <p className="stat-number">{stats.averageProgress}%</p>
        </div>
      </div>

      <div className="subjects-overview">
        <h3>Subject Overview</h3>
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div
              key={subject.id}
              className={`subject-card ${selectedSubject === subject.id ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject.id === selectedSubject ? null : subject.id)}
            >
              <div className="subject-header">
                <h4>{subject.name}</h4>
                <span className="progress-badge">
                  {subject.progress}%
                </span>
              </div>
              <div className="subject-teacher">
                Teacher: {subject.teacher}
              </div>
              <div className="subject-info">
                <p>Next Class: {new Date(subject.nextClass).toLocaleString()}</p>
                <p>Last Grade: {subject.lastGrade}</p>
                {subject.pendingAssignments > 0 && (
                  <p className="pending-alert">
                    {subject.pendingAssignments} pending assignment(s)
                  </p>
                )}
              </div>
              {selectedSubject === subject.id && (
                <div className="subject-details">
                  <div className="upcoming-topics">
                    <h5>Upcoming Topics</h5>
                    <ul>
                      {subject.upcomingTopics.map(topic => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="materials">
                    <h5>Required Materials</h5>
                    <ul>
                      {subject.materials.map(material => (
                        <li key={material}>{material}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="view-details-btn">
                    View Full Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
