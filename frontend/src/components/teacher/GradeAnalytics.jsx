import { useState, useEffect } from 'react'
import './GradeAnalytics.css'

const GradeAnalytics = () => {
  const [selectedClass, setSelectedClass] = useState('AL_M1')
  const [selectedSubject, setSelectedSubject] = useState('MATH_AL')
  const [selectedPeriod, setSelectedPeriod] = useState('term1')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const periods = [
    { id: 'term1', name: 'First Term 2025' },
    { id: 'term2', name: 'Second Term 2025' },
    { id: 'term3', name: 'Third Term 2025' },
    { id: 'overall', name: 'Overall Performance' }
  ]

  // Sample analytics data
  const sampleAnalytics = {
    AL_M1: {
      MATH_AL: {
        term1: {
          classAverage: 78.5,
          totalStudents: 28,
          assessments: [
            { name: 'First Term Test', average: 76.2, maxMarks: 100, date: '2025-09-15' },
            { name: 'Calculus Assignment', average: 82.5, maxMarks: 50, date: '2025-09-20' },
            { name: 'Model Paper 1', average: 74.8, maxMarks: 100, date: '2025-09-25' }
          ],
          gradeDistribution: {
            'A+': 3, 'A': 5, 'A-': 4, 'B+': 6, 'B': 4, 'B-': 3, 'C+': 2, 'C': 1, 'C-': 0, 'S': 0, 'W': 0
          },
          topPerformers: [
            { name: 'Sanduni Silva', average: 94.2, grade: 'A+', admissionNo: 'AL2025002' },
            { name: 'Ishara Fernando', average: 91.8, grade: 'A+', admissionNo: 'AL2025006' },
            { name: 'Nethmini Perera', average: 89.5, grade: 'A', admissionNo: 'AL2025004' }
          ],
          needsAttention: [
            { name: 'Chamara Perera', average: 62.3, grade: 'C+', admissionNo: 'AL2025008', issue: 'Declining performance' },
            { name: 'Kamal Perera', average: 68.7, grade: 'B-', admissionNo: 'AL2025001', issue: 'Inconsistent results' }
          ],
          progressTrend: [
            { assessment: 'First Term Test', average: 76.2 },
            { assessment: 'Calculus Assignment', average: 82.5 },
            { assessment: 'Model Paper 1', average: 74.8 }
          ]
        }
      }
    }
  }

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedPeriod) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const data = sampleAnalytics[selectedClass]?.[selectedSubject]?.[selectedPeriod]
        setAnalyticsData(data || null)
        setLoading(false)
      }, 800)
    }
  }, [selectedClass, selectedSubject, selectedPeriod])

  const getGradeColor = (grade) => {
    const colors = {
      'A+': '#059669', 'A': '#10b981', 'A-': '#3b82f6', 'B+': '#6366f1', 'B': '#8b5cf6',
      'B-': '#f59e0b', 'C+': '#f97316', 'C': '#ef4444', 'C-': '#dc2626', 'S': '#be185d', 'W': '#991b1b'
    }
    return colors[grade] || '#6b7280'
  }

  const exportReport = () => {
    if (!analyticsData) return
    
    const reportData = {
      class: classes.find(c => c.id === selectedClass)?.name,
      subject: subjects.find(s => s.id === selectedSubject)?.name,
      period: periods.find(p => p.id === selectedPeriod)?.name,
      ...analyticsData,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Mr. Sunil Perera'
    }
    
    console.log('Exporting report:', reportData)
    alert('Report exported successfully! Check downloads folder.')
  }

  return (
    <div className="grade-analytics-container">
      <div className="analytics-header">
        <h2>📈 Grade Analytics & Student Progress</h2>
        <p>Analyze student performance and track academic progress</p>
      </div>

      {/* Selection Controls */}
      <div className="analytics-controls">
        <div className="control-row">
          <div className="form-group">
            <label>📚 Select Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
            >
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
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📅 Select Period</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-select"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button 
              className="export-btn"
              onClick={exportReport}
              disabled={!analyticsData}
            >
              📊 Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : analyticsData ? (
        <div className="analytics-content">
          {/* Overview Cards */}
          <div className="overview-cards">
            <div className="overview-card class-average">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>Class Average</h3>
                <div className="average-score">{analyticsData.classAverage}%</div>
                <p>{analyticsData.totalStudents} students</p>
              </div>
            </div>

            <div className="overview-card assessments">
              <div className="card-icon">📝</div>
              <div className="card-content">
                <h3>Assessments</h3>
                <div className="assessment-count">{analyticsData.assessments.length}</div>
                <p>Completed this term</p>
              </div>
            </div>

            <div className="overview-card top-performers">
              <div className="card-icon">🏆</div>
              <div className="card-content">
                <h3>Top Performers</h3>
                <div className="performer-count">{analyticsData.topPerformers.length}</div>
                <p>Above 85% average</p>
              </div>
            </div>

            <div className="overview-card needs-attention">
              <div className="card-icon">⚠️</div>
              <div className="card-content">
                <h3>Needs Attention</h3>
                <div className="attention-count">{analyticsData.needsAttention.length}</div>
                <p>Requires support</p>
              </div>
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className="analytics-section">
            <h3>📊 Grade Distribution</h3>
            <div className="grade-distribution">
              {Object.entries(analyticsData.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="grade-bar-container">
                  <div className="grade-label">{grade}</div>
                  <div className="grade-bar-wrapper">
                    <div 
                      className="grade-bar"
                      style={{
                        width: `${(count / analyticsData.totalStudents) * 100}%`,
                        backgroundColor: getGradeColor(grade)
                      }}
                    ></div>
                    <span className="grade-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trend */}
          <div className="analytics-section">
            <h3>📈 Performance Trend</h3>
            <div className="trend-chart">
              {analyticsData.progressTrend.map((point, index) => (
                <div key={index} className="trend-point">
                  <div className="trend-bar-container">
                    <div 
                      className="trend-bar"
                      style={{
                        height: `${(point.average / 100) * 200}px`,
                        backgroundColor: point.average >= 75 ? '#10b981' : point.average >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                    <div className="trend-value">{point.average}%</div>
                  </div>
                  <div className="trend-label">{point.assessment}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Breakdown */}
          <div className="analytics-section">
            <h3>📝 Assessment Breakdown</h3>
            <div className="assessment-breakdown">
              {analyticsData.assessments.map((assessment, index) => (
                <div key={index} className="assessment-card">
                  <div className="assessment-header">
                    <h4>{assessment.name}</h4>
                    <div className="assessment-meta">
                      <span className="assessment-date">
                        📅 {new Date(assessment.date).toLocaleDateString()}
                      </span>
                      <span className="max-marks">Max: {assessment.maxMarks}</span>
                    </div>
                  </div>
                  <div className="assessment-stats">
                    <div className="stat">
                      <span className="stat-label">Class Average</span>
                      <span className="stat-value">{assessment.average}%</span>
                    </div>
                    <div className="performance-indicator">
                      <div 
                        className="performance-bar"
                        style={{
                          width: `${assessment.average}%`,
                          backgroundColor: assessment.average >= 75 ? '#10b981' : assessment.average >= 60 ? '#f59e0b' : '#ef4444'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Lists */}
          <div className="student-lists">
            {/* Top Performers */}
            <div className="student-list-section">
              <h3>🏆 Top Performers</h3>
              <div className="student-cards">
                {analyticsData.topPerformers.map((student, index) => (
                  <div key={index} className="student-card top-performer">
                    <div className="student-rank">#{index + 1}</div>
                    <div className="student-info">
                      <h4>{student.name}</h4>
                      <p>{student.admissionNo}</p>
                    </div>
                    <div className="student-performance">
                      <div className="average-score">{student.average}%</div>
                      <div className={`grade-badge ${student.grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                        {student.grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            <div className="student-list-section">
              <h3>⚠️ Students Needing Attention</h3>
              <div className="student-cards">
                {analyticsData.needsAttention.map((student, index) => (
                  <div key={index} className="student-card needs-attention">
                    <div className="student-info">
                      <h4>{student.name}</h4>
                      <p>{student.admissionNo}</p>
                      <div className="issue-tag">{student.issue}</div>
                    </div>
                    <div className="student-performance">
                      <div className="average-score warning">{student.average}%</div>
                      <div className={`grade-badge ${student.grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                        {student.grade}
                      </div>
                    </div>
                    <button className="action-btn">
                      📞 Contact Parent
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h3>No Analytics Data Available</h3>
          <p>Please select a class, subject, and period to view analytics data.</p>
        </div>
      )}
    </div>
  )
}

export default GradeAnalytics
