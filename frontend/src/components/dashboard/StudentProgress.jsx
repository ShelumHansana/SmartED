import { useState, useEffect } from 'react'
import '../../styles/StudentDashboard.css'

const StudentProgress = ({ studentLevel = 'A/L' }) => {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Sample subjects for different levels
  const subjects = {
    'A/L': [
      { id: 'MATH_AL', name: 'A/L Mathematics', stream: 'Physical Science' },
      { id: 'PHYS_AL', name: 'A/L Physics', stream: 'Physical Science' },
      { id: 'CHEM_AL', name: 'A/L Chemistry', stream: 'Physical Science' },
      { id: 'BIO_AL', name: 'A/L Biology', stream: 'Bio Science' },
      { id: 'ENG_AL', name: 'General English', stream: 'Common' }
    ],
    'O/L': [
      { id: 'MATH_OL', name: 'O/L Mathematics' },
      { id: 'SCI_OL', name: 'O/L Science' },
      { id: 'ENG_OL', name: 'O/L English' },
      { id: 'SIN_OL', name: 'O/L Sinhala' },
      { id: 'HIST_OL', name: 'O/L History' },
      { id: 'GEO_OL', name: 'O/L Geography' }
    ]
  }

  // Sample progress data - in real app, this would come from API based on teacher entered marks
  const sampleProgressData = {
    'A/L': {
      MATH_AL: {
        currentGrade: 'B+',
        currentAverage: 76.8,
        targetGrade: 'A',
        progressPercentage: 78,
        assessments: [
          { name: 'First Term Test', score: 78, maxMarks: 100, date: '2025-09-15', grade: 'B+' },
          { name: 'Calculus Assignment', score: 42, maxMarks: 50, date: '2025-09-20', grade: 'A' },
          { name: 'Model Paper 1', score: 71, maxMarks: 100, date: '2025-09-25', grade: 'B' }
        ],
        monthlyProgress: [
          { month: 'July', average: 72.5 },
          { month: 'August', average: 75.2 },
          { month: 'September', average: 76.8 }
        ],
        strengths: ['Calculus', 'Algebra', 'Coordinate Geometry'],
        weaknesses: ['Statistics', 'Complex Numbers'],
        recommendations: [
          'Focus more on Statistics problems and practice',
          'Review Complex Numbers fundamentals',
          'Maintain strong performance in Calculus'
        ],
        nextAssessment: {
          name: 'Second Term Test',
          date: '2025-10-15',
          topics: ['Differentiation', 'Integration', 'Statistics'],
          preparation: 65
        }
      },
      PHYS_AL: {
        currentGrade: 'A-',
        currentAverage: 82.3,
        targetGrade: 'A',
        progressPercentage: 85,
        assessments: [
          { name: 'First Term Test', score: 85, maxMarks: 100, date: '2025-09-18', grade: 'A' },
          { name: 'Practical Exam', score: 38, maxMarks: 50, date: '2025-09-22', grade: 'B+' },
          { name: 'Wave Motion Test', score: 78, maxMarks: 100, date: '2025-09-28', grade: 'B+' }
        ],
        monthlyProgress: [
          { month: 'July', average: 79.2 },
          { month: 'August', average: 81.5 },
          { month: 'September', average: 82.3 }
        ],
        strengths: ['Mechanics', 'Waves', 'Electricity'],
        weaknesses: ['Modern Physics', 'Quantum Theory'],
        recommendations: [
          'Study Modern Physics concepts thoroughly',
          'Practice more Quantum Theory problems',
          'Continue excellent work in Mechanics'
        ],
        nextAssessment: {
          name: 'Physics Model Paper',
          date: '2025-10-20',
          topics: ['Modern Physics', 'Electronics', 'Atomic Physics'],
          preparation: 72
        }
      }
    },
    'O/L': {
      MATH_OL: {
        currentGrade: 'A',
        currentAverage: 88.5,
        targetGrade: 'A+',
        progressPercentage: 89,
        assessments: [
          { name: 'First Term Test', score: 92, maxMarks: 100, date: '2025-09-12', grade: 'A+' },
          { name: 'Algebra Quiz', score: 18, maxMarks: 20, date: '2025-09-19', grade: 'A' },
          { name: 'Geometry Test', score: 85, maxMarks: 100, date: '2025-09-26', grade: 'A' }
        ],
        monthlyProgress: [
          { month: 'July', average: 86.8 },
          { month: 'August', average: 87.6 },
          { month: 'September', average: 88.5 }
        ],
        strengths: ['Algebra', 'Number Theory', 'Basic Geometry'],
        weaknesses: ['Advanced Geometry', 'Word Problems'],
        recommendations: [
          'Practice more complex geometry problems',
          'Work on word problem solving techniques',
          'Maintain excellent algebra skills'
        ],
        nextAssessment: {
          name: 'Monthly Test October',
          date: '2025-10-10',
          topics: ['Simultaneous Equations', 'Quadratic Equations', 'Geometry'],
          preparation: 78
        }
      }
    }
  }

  useEffect(() => {
    if (selectedSubject) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const data = sampleProgressData[studentLevel]?.[selectedSubject]
        setProgressData(data || null)
        setLoading(false)
      }, 600)
    }
  }, [selectedSubject, studentLevel])

  const getGradeColor = (grade) => {
    const colors = {
      'A+': '#059669', 'A': '#10b981', 'A-': '#3b82f6', 'B+': '#6366f1', 'B': '#8b5cf6',
      'B-': '#f59e0b', 'C+': '#f97316', 'C': '#ef4444', 'C-': '#dc2626', 'S': '#be185d', 'W': '#991b1b'
    }
    return colors[grade] || '#6b7280'
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 85) return '#10b981'
    if (percentage >= 70) return '#3b82f6'
    if (percentage >= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="student-progress-container">
      <div className="progress-header">
        <h2>📈 My Academic Progress</h2>
        <p>Track your performance and improvement over time</p>
      </div>

      {/* Subject Selection */}
      <div className="subject-selection">
        <div className="form-group">
          <label>📚 Select Subject to View Progress</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="form-select"
          >
            <option value="">Choose a subject...</option>
            {subjects[studentLevel]?.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} {subject.stream && `(${subject.stream})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Content */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your progress data...</p>
        </div>
      ) : progressData ? (
        <div className="progress-content">
          {/* Current Performance Overview */}
          <div className="performance-overview">
            <div className="overview-card current-performance">
              <div className="card-header">
                <h3>📊 Current Performance</h3>
              </div>
              <div className="performance-stats">
                <div className="stat-item">
                  <div className="stat-label">Current Grade</div>
                  <div 
                    className="current-grade-display"
                    style={{ backgroundColor: getGradeColor(progressData.currentGrade) }}
                  >
                    {progressData.currentGrade}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Average Score</div>
                  <div className="average-display">{progressData.currentAverage}%</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Target Grade</div>
                  <div 
                    className="target-grade-display"
                    style={{ backgroundColor: getGradeColor(progressData.targetGrade) }}
                  >
                    {progressData.targetGrade}
                  </div>
                </div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-label">Progress to Target</div>
                <div className="progress-bar-wrapper">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${progressData.progressPercentage}%`,
                      backgroundColor: getProgressColor(progressData.progressPercentage)
                    }}
                  ></div>
                  <span className="progress-percentage">{progressData.progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment History */}
          <div className="assessment-history">
            <h3>📝 Recent Assessments</h3>
            <div className="assessments-grid">
              {progressData.assessments.map((assessment, index) => (
                <div key={index} className="assessment-card">
                  <div className="assessment-header">
                    <h4>{assessment.name}</h4>
                    <div className="assessment-date">
                      📅 {new Date(assessment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="assessment-score">
                    <div className="score-display">
                      <span className="score">{assessment.score}</span>
                      <span className="max-score">/{assessment.maxMarks}</span>
                    </div>
                    <div 
                      className="grade-badge"
                      style={{ backgroundColor: getGradeColor(assessment.grade) }}
                    >
                      {assessment.grade}
                    </div>
                  </div>
                  <div className="percentage">
                    {((assessment.score / assessment.maxMarks) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Trend */}
          <div className="progress-trend">
            <h3>📈 Monthly Progress Trend</h3>
            <div className="trend-chart">
              {progressData.monthlyProgress.map((point, index) => (
                <div key={index} className="trend-point">
                  <div className="trend-bar-container">
                    <div 
                      className="trend-bar"
                      style={{
                        height: `${(point.average / 100) * 150}px`,
                        backgroundColor: getProgressColor((point.average / 100) * 100)
                      }}
                    ></div>
                    <div className="trend-value">{point.average}%</div>
                  </div>
                  <div className="trend-month">{point.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="analysis-section">
            <div className="strengths-section">
              <h3>💪 Your Strengths</h3>
              <div className="topics-list">
                {progressData.strengths.map((strength, index) => (
                  <div key={index} className="topic-item strength">
                    <span className="topic-icon">✅</span>
                    <span className="topic-name">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="weaknesses-section">
              <h3>🎯 Areas for Improvement</h3>
              <div className="topics-list">
                {progressData.weaknesses.map((weakness, index) => (
                  <div key={index} className="topic-item weakness">
                    <span className="topic-icon">📚</span>
                    <span className="topic-name">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations">
            <h3>💡 Study Recommendations</h3>
            <div className="recommendation-list">
              {progressData.recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  <span className="recommendation-icon">🎯</span>
                  <span className="recommendation-text">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Assessment */}
          <div className="next-assessment">
            <h3>📅 Upcoming Assessment</h3>
            <div className="assessment-preview">
              <div className="assessment-info">
                <h4>{progressData.nextAssessment.name}</h4>
                <div className="assessment-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(progressData.nextAssessment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Topics:</span>
                    <span className="detail-value">
                      {progressData.nextAssessment.topics.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="preparation-status">
                <div className="preparation-label">Preparation Progress</div>
                <div className="preparation-bar-wrapper">
                  <div 
                    className="preparation-bar"
                    style={{ 
                      width: `${progressData.nextAssessment.preparation}%`,
                      backgroundColor: getProgressColor(progressData.nextAssessment.preparation)
                    }}
                  ></div>
                  <span className="preparation-percentage">
                    {progressData.nextAssessment.preparation}%
                  </span>
                </div>
                <div className="preparation-message">
                  {progressData.nextAssessment.preparation >= 80 
                    ? "You're well prepared! 🎉" 
                    : progressData.nextAssessment.preparation >= 60 
                    ? "Good progress, keep studying! 📚" 
                    : "More preparation needed 💪"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !selectedSubject ? (
        <div className="no-selection">
          <div className="no-selection-icon">📚</div>
          <h3>Select a Subject</h3>
          <p>Choose a subject from the dropdown above to view your academic progress and performance analytics.</p>
        </div>
      ) : (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h3>No Progress Data Available</h3>
          <p>Progress data for this subject will be available once your teachers enter assessment marks.</p>
        </div>
      )}
    </div>
  )
}

export default StudentProgress