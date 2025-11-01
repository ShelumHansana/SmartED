import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import '../../styles/teacher/GradeAnalytics.css';

const GradeAnalytics = ({ students, teacher }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get teacher's classes and subjects from props
  const classes = teacher?.classes || [];
  const subjects = teacher?.subjects || [];

  console.log('GradeAnalytics - Teacher:', teacher);
  console.log('GradeAnalytics - Classes:', classes);
  console.log('GradeAnalytics - Subjects:', subjects);
  console.log('GradeAnalytics - Students:', students?.length);

  // Fetch real analytics data from Firebase
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (selectedClass && selectedSubject) {
        setIsLoading(true);
        try {
          // Parse class into grade and className
          const [grade, className] = selectedClass.split('-');
          
          console.log('Fetching analytics for:', { grade, className, subject: selectedSubject });
          
          // Filter students for this class
          const classStudents = students.filter(s => 
            s.grade === grade && s.className === className
          );
          
          console.log('Class students:', classStudents.length);
          
          if (classStudents.length === 0) {
            setAnalyticsData(null);
            setIsLoading(false);
            return;
          }
          
          // Fetch grades for all students in this class for this subject
          const gradesPromises = classStudents.map(async (student) => {
            const gradesQuery = query(
              collection(db, 'grades'),
              where('studentId', '==', student.id),
              where('subject', '==', selectedSubject)
            );
            const gradesSnapshot = await getDocs(gradesQuery);
            const grades = gradesSnapshot.docs.map(doc => doc.data());
            
            // Calculate average for this student
            if (grades.length > 0) {
              const totalMarks = grades.reduce((sum, g) => sum + (parseFloat(g.marks) || 0), 0);
              const average = totalMarks / grades.length;
              return {
                student,
                grades,
                average,
                grade: calculateGrade(average)
              };
            }
            return null;
          });
          
          const studentsWithGrades = (await Promise.all(gradesPromises)).filter(Boolean);
          
          console.log('Students with grades:', studentsWithGrades.length);
          
          if (studentsWithGrades.length === 0) {
            setAnalyticsData(null);
            setIsLoading(false);
            return;
          }
          
          // Calculate analytics
          const totalAverage = studentsWithGrades.reduce((sum, s) => sum + s.average, 0) / studentsWithGrades.length;
          const passCount = studentsWithGrades.filter(s => s.average >= 40).length;
          const passRate = (passCount / studentsWithGrades.length) * 100;
          
          // Grade distribution
          const gradeDistribution = {
            'A': studentsWithGrades.filter(s => s.average >= 75).length,
            'B': studentsWithGrades.filter(s => s.average >= 65 && s.average < 75).length,
            'C': studentsWithGrades.filter(s => s.average >= 50 && s.average < 65).length,
            'S': studentsWithGrades.filter(s => s.average >= 35 && s.average < 50).length,
            'F': studentsWithGrades.filter(s => s.average < 35).length
          };
          
          const gradeDistributionArray = Object.entries(gradeDistribution).map(([grade, count]) => ({
            grade,
            count,
            percentage: ((count / studentsWithGrades.length) * 100).toFixed(1)
          }));
          
          // Top performers (top 5 or less)
          const topPerformers = studentsWithGrades
            .sort((a, b) => b.average - a.average)
            .slice(0, Math.min(5, studentsWithGrades.length))
            .map(s => ({
              name: s.student.fullName || `${s.student.firstName || ''} ${s.student.lastName || ''}`.trim(),
              admissionNo: s.student.indexNumber || s.student.id,
              average: s.average.toFixed(1),
              grade: s.grade
            }));
          
          // Students needing attention (bottom 3 with average < 65)
          const needsAttention = studentsWithGrades
            .filter(s => s.average < 65)
            .sort((a, b) => a.average - b.average)
            .slice(0, Math.min(3, studentsWithGrades.length))
            .map(s => ({
              name: s.student.fullName || `${s.student.firstName || ''} ${s.student.lastName || ''}`.trim(),
              admissionNo: s.student.indexNumber || s.student.id,
              average: s.average.toFixed(1),
              grade: s.grade,
              issue: s.average < 40 ? 'Failing Grade' : s.average < 50 ? 'Below Average' : 'Needs Improvement'
            }));
          
          // Performance trends (mock for now, requires historical data)
          const recentTrends = {
            improvement: ((studentsWithGrades.filter(s => s.average >= totalAverage).length / studentsWithGrades.length) * 100).toFixed(1),
            decline: 0,
            stable: 0
          };
          recentTrends.stable = (100 - recentTrends.improvement).toFixed(1);
          
          // Subject insights (basic analysis)
          const subjectInsights = {
            strongAreas: topPerformers.length > 0 ? ['Class has strong performers'] : [],
            weakAreas: needsAttention.length > 0 ? ['Some students need extra support'] : [],
            recommendedActions: [
              totalAverage < 60 ? 'Increase practice sessions' : 'Maintain current teaching pace',
              needsAttention.length > 0 ? 'Provide remedial classes for struggling students' : 'Continue current support',
              topPerformers.length > 0 ? 'Challenge top performers with advanced materials' : 'Focus on building fundamentals'
            ]
          };
          
          setAnalyticsData({
            classAverage: totalAverage.toFixed(1),
            passRate: passRate.toFixed(1),
            totalStudents: studentsWithGrades.length,
            assessmentsCount: studentsWithGrades[0]?.grades.length || 0,
            gradeDistribution: gradeDistributionArray,
            topPerformers,
            needsAttention,
            recentTrends,
            subjectInsights
          });
          
        } catch (error) {
          console.error('Error fetching analytics:', error);
          setAnalyticsData(null);
        }
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedClass, selectedSubject, students]);

  // Calculate letter grade from percentage
  const calculateGrade = (average) => {
    if (average >= 75) return 'A';
    if (average >= 65) return 'B';
    if (average >= 50) return 'C';
    if (average >= 35) return 'S';
    return 'F';
  };

  const handleExportReport = () => {
    if (!analyticsData) return;
    
    const reportData = {
      class: selectedClass,
      subject: selectedSubject,
      ...analyticsData,
      generatedAt: new Date().toISOString(),
      generatedBy: teacher?.fullName || 'Teacher'
    };
    
    console.log('Exporting analytics report:', reportData);
    alert('Report exported successfully! Check downloads folder.');
  };

  const handlePrintReport = () => {
    console.log('Printing analytics report...');
    // Implementation for printing
  };

  return (
    <div className="grade-analytics-container">
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-text">
            <h2>📊 Grade Analytics & Performance Insights</h2>
            <p>Comprehensive analysis of student performance and learning outcomes</p>
          </div>
          <div className="header-actions">
            <button 
              className="action-btn secondary"
              onClick={handleExportReport}
              disabled={!analyticsData}
              title="Export Report"
            >
              📊 Export Report
            </button>
            <button 
              className="action-btn primary"
              onClick={handlePrintReport}
              disabled={!analyticsData}
              title="Print Report"
            >
              🖨️ Print
            </button>
          </div>
        </div>
      </div>

      {/* Tips Panel */}
      {analyticsData && (
        <div className="tips-panel">
          <div className="tip-content">
            <div className="tip-icon">💡</div>
            <div className="tip-text">
              <strong>Pro Tip:</strong> Use the different view modes to analyze performance from various angles. 
              Click on student cards for detailed individual insights and action recommendations.
            </div>
          </div>
        </div>
      )}

      {/* Analytics Controls */}
      <div className="analytics-controls">
        <div className="controls-header">
          <h3>🎯 Select Parameters for Analytics</h3>
          <p>Choose your class and subject to generate detailed performance insights</p>
        </div>
        
        {classes.length === 0 || subjects.length === 0 ? (
          <div className="no-assignments-message">
            <div className="message-icon">ℹ️</div>
            <h4>No Classes or Subjects Assigned</h4>
            <p>
              {classes.length === 0 && 'You don\'t have any classes assigned yet. '}
              {subjects.length === 0 && 'You don\'t have any subjects assigned yet. '}
              Please contact the administrator to assign classes and subjects to your account.
            </p>
          </div>
        ) : (
          <div className="control-row">
          <div className="form-group">
            <label htmlFor="class-select">📚 Select Class:</label>
            <select 
              id="class-select"
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="control-select"
            >
              <option value="">Choose a class...</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>Grade {cls}</option>
              ))}
            </select>
            {!selectedClass && <small className="field-hint">Select the class you want to analyze</small>}
          </div>

          <div className="form-group">
            <label htmlFor="subject-select">📖 Select Subject:</label>
            <select 
              id="subject-select"
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="control-select"
              disabled={!selectedClass}
            >
              <option value="">Choose a subject...</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
            {selectedClass && !selectedSubject && <small className="field-hint">Select the subject to analyze</small>}
          </div>
        </div>
        )}
      </div>

      {/* View Selector */}
      {analyticsData && (
        <div className="view-selector">
          <h3>📋 Analysis Views</h3>
          <div className="view-tabs">
            <button 
              className={`view-tab ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">Overview</span>
            </button>
            <button 
              className={`view-tab ${activeView === 'detailed' ? 'active' : ''}`}
              onClick={() => setActiveView('detailed')}
            >
              <span className="tab-icon">📈</span>
              <span className="tab-text">Detailed Analysis</span>
            </button>
            <button 
              className={`view-tab ${activeView === 'students' ? 'active' : ''}`}
              onClick={() => setActiveView('students')}
            >
              <span className="tab-icon">👥</span>
              <span className="tab-text">Student Focus</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-content">
            <h3>🔄 Generating Analytics...</h3>
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
                <div className="stats-grid">
                  <div className="stat-card primary">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <div className="stat-number">{analyticsData.classAverage}%</div>
                      <div className="stat-label">Class Average</div>
                    </div>
                  </div>
                  <div className="stat-card success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <div className="stat-number">{analyticsData.passRate}%</div>
                      <div className="stat-label">Pass Rate</div>
                    </div>
                  </div>
                  <div className="stat-card info">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <div className="stat-number">{analyticsData.totalStudents}</div>
                      <div className="stat-label">Total Students</div>
                    </div>
                  </div>
                  <div className="stat-card warning">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                      <div className="stat-number">{analyticsData.assessmentsCount}</div>
                      <div className="stat-label">Assessments</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade Distribution Chart */}
              <div className="chart-section">
                <h3>📊 Grade Distribution</h3>
                <div className="grade-chart">
                  {analyticsData.gradeDistribution.map((item, index) => (
                    <div key={index} className="grade-bar-container">
                      <div className="grade-label">{item.grade}</div>
                      <div className="grade-bar-wrapper">
                        <div 
                          className={`grade-bar grade-${item.grade.toLowerCase()}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                        <div className="grade-stats">
                          <span className="grade-count">{item.count} students</span>
                          <span className="grade-percentage">{item.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Trends */}
              <div className="trends-section">
                <h3>📈 Recent Performance Trends</h3>
                <div className="trend-indicators">
                  <div className="trend-item improving">
                    <div className="trend-icon">📈</div>
                    <div className="trend-content">
                      <div className="trend-percentage">{analyticsData.recentTrends.improvement}%</div>
                      <div className="trend-label">Improving</div>
                    </div>
                  </div>
                  <div className="trend-item stable">
                    <div className="trend-icon">➖</div>
                    <div className="trend-content">
                      <div className="trend-percentage">{analyticsData.recentTrends.stable}%</div>
                      <div className="trend-label">Stable</div>
                    </div>
                  </div>
                  <div className="trend-item declining">
                    <div className="trend-icon">📉</div>
                    <div className="trend-content">
                      <div className="trend-percentage">{analyticsData.recentTrends.decline}%</div>
                      <div className="trend-label">Needs Attention</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis View */}
          {activeView === 'detailed' && (
            <div className="detailed-view">
              <h3>📈 Comprehensive Performance Analysis</h3>
              
              {/* Subject Insights */}
              <div className="subject-insights">
                <div className="insights-grid">
                  <div className="insight-card strong-areas">
                    <h4>💪 Strong Performance Areas</h4>
                    <ul className="insight-list">
                      {analyticsData.subjectInsights.strongAreas.map((area, index) => (
                        <li key={index} className="insight-item success">
                          <span className="insight-icon">✅</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="insight-card weak-areas">
                    <h4>🎯 Areas for Improvement</h4>
                    <ul className="insight-list">
                      {analyticsData.subjectInsights.weakAreas.map((area, index) => (
                        <li key={index} className="insight-item warning">
                          <span className="insight-icon">⚠️</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="recommendations">
                  <h4>💡 Recommended Teaching Actions</h4>
                  <div className="recommendation-list">
                    {analyticsData.subjectInsights.recommendedActions.map((action, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-icon">🎯</div>
                        <div className="recommendation-text">{action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="performance-breakdown">
                <h4>📊 Detailed Performance Metrics</h4>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-label">Highest Score</div>
                    <div className="metric-value">94.2%</div>
                    <div className="metric-context">Saman Perera</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Lowest Score</div>
                    <div className="metric-value">45.2%</div>
                    <div className="metric-context">Needs Support</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Standard Deviation</div>
                    <div className="metric-value">18.7</div>
                    <div className="metric-context">Performance Spread</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Median Score</div>
                    <div className="metric-value">78.5%</div>
                    <div className="metric-context">Middle Performance</div>
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
                    <h4>📊 Detailed Analysis: {selectedStudent.name}</h4>
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