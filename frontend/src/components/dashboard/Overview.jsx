import { useState } from 'react'
import { getStudentLevel, getALGrade, getOLGrade } from '../../utils/sriLankanSchoolUtils'

const Overview = () => {
  const [selectedSubject, setSelectedSubject] = useState(null)
  
  // Student info - can be O/L or A/L
  const studentInfo = {
    name: 'Kamal Perera',
    grade: 12, // Change this to 10 for O/L student
    stream: 'Physical Science', // Only for A/L students
    class: 'M1'
  }
  
  const studentLevel = getStudentLevel(studentInfo.grade)
  
  // Subjects based on student level
  const subjects = studentLevel === 'AL' ? [
    // A/L Physical Science Stream subjects
    {
      id: 'mathematics',
      name: 'Mathematics',
      teacher: 'Mr. Sunil Perera',
      progress: 78,
      nextClass: '2025-07-23T08:00:00',
      upcomingTopics: ['Advanced Algebra', 'Coordinate Geometry'],
      pendingAssignments: 2,
      lastGrade: 'A',
      materials: ['G.C.E A/L Mathematics Past Papers', 'Additional Mathematics Worksheets']
    },
    {
      id: 'physics',
      name: 'Physics',
      teacher: 'Dr. Amara Silva',
      progress: 82,
      nextClass: '2025-07-23T09:30:00',
      upcomingTopics: ['Mechanics', 'Wave Motion'],
      pendingAssignments: 1,
      lastGrade: 'B',
      materials: ['Physics Practical Manual', 'Wave Theory Notes']
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      teacher: 'Mrs. Kushani Jayawardena',
      progress: 85,
      nextClass: '2025-07-24T08:00:00',
      upcomingTopics: ['Organic Chemistry', 'Chemical Equilibrium'],
      pendingAssignments: 0,
      lastGrade: 'A',
      materials: ['Organic Chemistry Booklet', 'Laboratory Safety Guide']
    },
    {
      id: 'english',
      name: 'English',
      teacher: 'Mr. Nimal Rajapaksa',
      progress: 75,
      nextClass: '2025-07-25T07:30:00',
      upcomingTopics: ['Essay Writing', 'Poetry Analysis'],
      pendingAssignments: 1,
      lastGrade: 'B',
      materials: ['English Language Textbook', 'Creative Writing Guide']
    },
    {
      id: 'ict',
      name: 'ICT',
      teacher: 'Mr. Ravi Wickramasinghe',
      progress: 92,
      nextClass: '2025-07-26T10:00:00',
      upcomingTopics: ['Database Management', 'Programming Concepts'],
      pendingAssignments: 2,
      lastGrade: 'A',
      materials: ['ICT Practical Guide', 'Programming Exercises']
    }
  ] : [
    // O/L subjects for grades 6-11
    {
      id: 'mathematics',
      name: 'Mathematics',
      teacher: 'Mrs. Chamari Wickramasinghe',
      progress: 82,
      nextClass: '2025-07-23T08:00:00',
      upcomingTopics: ['Algebra', 'Geometry'],
      pendingAssignments: 1,
      lastGrade: 'A',
      materials: ['Mathematics Textbook', 'Practice Worksheets']
    },
    {
      id: 'science',
      name: 'Science',
      teacher: 'Mr. Roshan Perera',
      progress: 78,
      nextClass: '2025-07-23T09:30:00',
      upcomingTopics: ['Biology - Human Body', 'Chemistry - Acids & Bases'],
      pendingAssignments: 2,
      lastGrade: 'B',
      materials: ['Science Textbook', 'Laboratory Manual']
    },
    {
      id: 'english',
      name: 'English',
      teacher: 'Miss. Sandamali Fernando',
      progress: 75,
      nextClass: '2025-07-24T08:00:00',
      upcomingTopics: ['Grammar', 'Composition Writing'],
      pendingAssignments: 1,
      lastGrade: 'B',
      materials: ['English Textbook', 'Grammar Guide']
    },
    {
      id: 'sinhala',
      name: 'Sinhala',
      teacher: 'Mr. Priyantha Jayawardena',
      progress: 88,
      nextClass: '2025-07-24T10:30:00',
      upcomingTopics: ['Sahitya', 'Vyakarana'],
      pendingAssignments: 0,
      lastGrade: 'A',
      materials: ['Sinhala Textbook', 'Literature Collection']
    },
    {
      id: 'history',
      name: 'History',
      teacher: 'Mr. Nimal Rathnayake',
      progress: 80,
      nextClass: '2025-07-25T09:00:00',
      upcomingTopics: ['Ancient Sri Lanka', 'Medieval Period'],
      pendingAssignments: 1,
      lastGrade: 'B',
      materials: ['History Textbook', 'Historical Maps']
    },
    {
      id: 'geography',
      name: 'Geography',
      teacher: 'Mrs. Kumudini Silva',
      progress: 85,
      nextClass: '2025-07-25T11:00:00',
      upcomingTopics: ['Physical Geography', 'Climate of Sri Lanka'],
      pendingAssignments: 1,
      lastGrade: 'A',
      materials: ['Geography Atlas', 'Climate Charts']
    },
    {
      id: 'buddhism',
      name: 'Buddhism',
      teacher: 'Ven. Mahinda Thero',
      progress: 90,
      nextClass: '2025-07-26T13:00:00',
      upcomingTopics: ['Buddha Dharma', 'Jathaka Stories'],
      pendingAssignments: 0,
      lastGrade: 'A',
      materials: ['Dhamma Padaya', 'Buddhist Stories']
    },
    {
      id: 'ict',
      name: 'ICT',
      teacher: 'Mr. Ravi Wickramasinghe',
      progress: 87,
      nextClass: '2025-07-27T10:00:00',
      upcomingTopics: ['Computer Basics', 'Internet Safety'],
      pendingAssignments: 1,
      lastGrade: 'A',
      materials: ['ICT Textbook', 'Computer Lab Manual']
    }
  ]

  const stats = {
    overallGPA: studentLevel === 'AL' ? 3.2 : null, // GPA only for A/L students
    overallGrade: studentLevel === 'OL' ? 'A' : null, // Grade for O/L students
    totalAssignments: subjects.reduce((sum, subject) => sum + subject.pendingAssignments, 0),
    upcomingTests: studentLevel === 'AL' ? 2 : 3, // Different test counts
    averageProgress: Math.round(subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length),
    nextExam: studentLevel === 'AL' ? 'A/L Trial Examination' : 'O/L Trial Examination'
  }

  return (
    <div className="overview-container">
      <h2>Welcome back, {studentInfo.name}!</h2>
      <p className="student-info">
        {studentLevel === 'AL' 
          ? `Grade ${studentInfo.grade} - ${studentInfo.stream} Stream (${studentInfo.class})`
          : `Grade ${studentInfo.grade} - ${studentInfo.class}`
        }
      </p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{studentLevel === 'AL' ? 'Overall GPA' : 'Overall Grade'}</h3>
          <p className="stat-number">
            {studentLevel === 'AL' ? stats.overallGPA : stats.overallGrade}
          </p>
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
