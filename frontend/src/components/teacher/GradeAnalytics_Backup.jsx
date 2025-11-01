import { useState, useEffect } from 'react'
import './GradeAnalytics.css'

const GradeAnalytics = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('term1')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showTips, setShowTips] = useState(true)

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
        <div className="header-content">
          <div className="header-text">
            <h2>📈 Grade Analytics & Student Progress</h2>
            <p>Comprehensive insights into your students' academic performance</p>
          </div>
          <div className="header-actions">
            <button 
              className={`tips-toggle ${showTips ? 'active' : ''}`}
              onClick={() => setShowTips(!showTips)}
              title="Toggle helpful tips"
            >
              💡 Tips
            </button>
            <button 
              className="refresh-btn"
              onClick={() => window.location.reload()}
              title="Refresh data"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Tips */}
      {showTips && (
        <div className="tips-panel">
          <div className="tip-content">
            <h3>💡 Quick Tips</h3>
            <ul>
              <li>📊 Select your class and subject to view detailed analytics</li>
              <li>🎯 Use the overview for quick insights, detailed view for comprehensive analysis</li>
              <li>👥 Click on student cards to see individual performance details</li>
              <li>📤 Export reports for parent meetings and administrative records</li>
            </ul>
          </div>
          <button className="close-tips" onClick={() => setShowTips(false)}>✕</button>
        </div>
      )}

      {/* Selection Controls */}
      <div className="analytics-controls">
        <div className="controls-header">
          <h3>🎯 Select Your Analysis Parameters</h3>
          <p>Choose your class, subject, and time period to generate insights</p>
        </div>
        
        <div className="control-row">
          <div className="form-group">
            <label>📚 Select Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
            >
              <option value="">-- Choose your class --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {!selectedClass && <small className="field-hint">Select the class you want to analyze</small>}
          </div>

          <div className="form-group">
            <label>📖 Select Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-select"
              disabled={!selectedClass}
            >
              <option value="">-- Choose your subject --</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {selectedClass && !selectedSubject && <small className="field-hint">Select the subject to analyze</small>}
          </div>

          <div className="form-group">
            <label>📅 Select Period</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-select"
              disabled={!selectedClass || !selectedSubject}
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
            {selectedClass && selectedSubject && <small className="field-hint">Time period for analysis</small>}
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <div className="action-buttons-group">
              <button 
                className="analyze-btn"
                onClick={() => {/* Analysis is automatic */}}
                disabled={!selectedClass || !selectedSubject}
              >
                📊 Analyze
              </button>
              <button 
                className="export-btn"
                onClick={exportReport}
                disabled={!analyticsData}
                title="Export detailed report"
              >
                � Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      {analyticsData && (
        <div className="view-selector">
          <div className="view-tabs">
            <button 
              className={`view-tab ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`view-tab ${activeView === 'detailed' ? 'active' : ''}`}
              onClick={() => setActiveView('detailed')}
            >
              📈 Detailed Analysis
            </button>
            <button 
              className={`view-tab ${activeView === 'students' ? 'active' : ''}`}
              onClick={() => setActiveView('students')}
            >
              👥 Student Focus
            </button>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h3>Analyzing Performance Data...</h3>
            <p>Please wait while we process your students' performance metrics</p>
          </div>
        </div>
      ) : analyticsData ? (
        <div className="analytics-content">
          {/* Overview View */}
          {activeView === 'overview' && (
            <div className="overview-view">
              {/* Quick Stats Cards */}
              <div className="quick-stats">
                <h3>📊 Quick Performance Overview</h3>
                <div className="stats-row">
                  <div className="overview-card class-average">
                    <div className="card-icon">📊</div>
                    <div className="card-content">
                      <h3>Class Average</h3>
                      <div className="average-score">{analyticsData.classAverage}%</div>
                      <p>{analyticsData.totalStudents} students</p>
                      <div className="card-insight">
                        {analyticsData.classAverage >= 80 ? "🟢 Excellent performance!" : 
                         analyticsData.classAverage >= 70 ? "🟡 Good progress" : "🔴 Needs improvement"}
                      </div>
                    </div>
                  </div>

                  <div className="overview-card assessments">
                    <div className="card-icon">📝</div>
                    <div className="card-content">
                      <h3>Assessments</h3>
                      <div className="assessment-count">{analyticsData.assessments.length}</div>
                      <p>Completed this term</p>
                      <div className="card-insight">
                        📈 Track progress over time
                      </div>
                    </div>
                  </div>

                  <div className="overview-card top-performers">
                    <div className="card-icon">🏆</div>
                    <div className="card-content">
                      <h3>Top Performers</h3>
                      <div className="performer-count">{analyticsData.topPerformers.length}</div>
                      <p>Above 85% average</p>
                      <div className="card-insight">
                        🎯 Maintain excellence
                      </div>
                    </div>
                  </div>

                  <div className="overview-card needs-attention">
                    <div className="card-icon">⚠️</div>
                    <div className="card-content">
                      <h3>Needs Attention</h3>
                      <div className="attention-count">{analyticsData.needsAttention.length}</div>
                      <p>Requires support</p>
                      <div className="card-insight">
                        🤝 Provide extra help
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Performance Summary */}
              <div className="visual-summary">
                <div className="summary-left">
                  <h4>📈 Grade Distribution</h4>
                  <div className="grade-distribution-compact">
                    {Object.entries(analyticsData.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="grade-item">
                        <span className="grade-label">{grade}</span>
                        <div className="grade-bar-mini">
                          <div 
                            className="grade-fill"
                            style={{
                              width: `${(count / analyticsData.totalStudents) * 100}%`,
                              backgroundColor: getGradeColor(grade)
                            }}
                          ></div>
                        </div>
                        <span className="grade-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="summary-right">
                  <h4>🎯 Key Insights</h4>
                  <div className="insights-list">
                    <div className="insight-item">
                      <span className="insight-icon">📊</span>
                      <span>Class average: {analyticsData.classAverage}%</span>
                    </div>
                    <div className="insight-item">
                      <span className="insight-icon">🏆</span>
                      <span>Top score: {Math.max(...analyticsData.assessments.map(a => a.average))}%</span>
                    </div>
                    <div className="insight-item">
                      <span className="insight-icon">📈</span>
                      <span>Improvement trend: {analyticsData.progressTrend.length > 1 ? 
                        (analyticsData.progressTrend[analyticsData.progressTrend.length - 1].average > 
                         analyticsData.progressTrend[0].average ? "Improving ↗️" : "Stable ➡️") : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis View */}
          {activeView === 'detailed' && (
            <div className="detailed-view">
              <h3>🔍 Comprehensive Performance Analysis</h3>

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
          </div>
        </div>
      )}

      {/* Student Focus View */}
      {activeView === 'students' && (
            <div className="students-view">
              <h3>👥 Individual Student Performance</h3>
              
              {/* Top Performers */}
              <div className="student-section">
                <div className="section-header">
                  <h4>🏆 Top Performers</h4>
                  <p>Students excelling in this subject - maintain their motivation!</p>
                </div>
                <div className="student-cards enhanced">
                  {analyticsData.topPerformers.map((student, index) => (
                    <div 
                      key={index} 
                      className={`student-card top-performer ${selectedStudent === student ? 'selected' : ''}`}
                      onClick={() => setSelectedStudent(selectedStudent === student ? null : student)}
                    >
                      <div className="student-rank">#{index + 1}</div>
                      <div className="student-info">
                        <h5>{student.name}</h5>
                        <p>{student.admissionNo}</p>
                      </div>
                      <div className="student-performance">
                        <div className="average-score">{student.average}%</div>
                        <div className={`grade-badge ${student.grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                          {student.grade}
                        </div>
                      </div>
                      <div className="student-actions">
                        <button className="action-btn small">👁️ View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Students Needing Attention */}
              <div className="student-section">
                <div className="section-header">
                  <h4>⚠️ Students Needing Support</h4>
                  <p>Focus your attention on these students for improved outcomes</p>
                </div>
                <div className="student-cards enhanced">
                  {analyticsData.needsAttention.map((student, index) => (
                    <div 
                      key={index} 
                      className={`student-card needs-attention ${selectedStudent === student ? 'selected' : ''}`}
                      onClick={() => setSelectedStudent(selectedStudent === student ? null : student)}
                    >
                      <div className="student-info">
                        <h5>{student.name}</h5>
                        <p>{student.admissionNo}</p>
                        <div className="issue-tag">{student.issue}</div>
                      </div>
                      <div className="student-performance">
                        <div className="average-score warning">{student.average}%</div>
                        <div className={`grade-badge ${student.grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                          {student.grade}
                        </div>
                      </div>
                      <div className="student-actions">
                        <button className="action-btn small primary">📞 Contact Parent</button>
                        <button className="action-btn small">📝 Add Note</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Detail Panel */}
              {selectedStudent && (
                <div className="student-detail-panel">
                  <div className="panel-header">
                    <h4>� Detailed Analysis: {selectedStudent.name}</h4>
                    <button className="close-panel" onClick={() => setSelectedStudent(null)}>✕</button>
                  </div>
                  <div className="panel-content">
                    <div className="detail-stats">
                      <div className="detail-stat">
                        <span className="detail-label">Current Average</span>
                        <span className="detail-value">{selectedStudent.average}%</span>
                      </div>
                      <div className="detail-stat">
                        <span className="detail-label">Current Grade</span>
                        <span className="detail-value">{selectedStudent.grade}</span>
                      </div>
                      <div className="detail-stat">
                        <span className="detail-label">Admission Number</span>
                        <span className="detail-value">{selectedStudent.admissionNo}</span>
                      </div>
                    </div>
                    <div className="action-recommendations">
                      <h5>💡 Recommended Actions</h5>
                      <ul>
                        {selectedStudent.average >= 85 ? (
                          <>
                            <li>🌟 Provide advanced challenges to maintain engagement</li>
                            <li>👥 Consider peer tutoring opportunities</li>
                            <li>🎯 Set stretch goals for continued excellence</li>
                          </>
                        ) : (
                          <>
                            <li>📚 Schedule additional practice sessions</li>
                            <li>👥 Arrange peer support or study groups</li>
                            <li>📞 Communicate with parents about support strategies</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : !selectedClass || !selectedSubject ? (
        <div className="selection-prompt">
          <div className="prompt-icon">🎯</div>
          <h3>Ready to Analyze Performance?</h3>
          <p>Select your class and subject above to generate comprehensive analytics and insights.</p>
          <div className="selection-checklist">
            <div className={`checklist-item ${selectedClass ? 'completed' : ''}`}>
              <span className="check-icon">{selectedClass ? '✅' : '⭕'}</span>
              <span>Select Class</span>
            </div>
            <div className={`checklist-item ${selectedSubject ? 'completed' : ''}`}>
              <span className="check-icon">{selectedSubject ? '✅' : '⭕'}</span>
              <span>Select Subject</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h3>No Analytics Data Available</h3>
          <p>No performance data found for the selected parameters. Please check your selections or ensure assessments have been completed.</p>
        </div>
      )}
    </div>
  );
};

export default GradeAnalytics;
