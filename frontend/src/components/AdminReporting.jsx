import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '../styles/AdminReporting.css';

const AdminReporting = () => {
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Sample data for charts
  const enrollmentData = [
    { month: 'Jan', students: 120, teachers: 8, courses: 15 },
    { month: 'Feb', students: 135, teachers: 10, courses: 18 },
    { month: 'Mar', students: 148, teachers: 12, courses: 20 },
    { month: 'Apr', students: 156, teachers: 12, courses: 24 },
    { month: 'May', students: 165, teachers: 14, courses: 26 },
    { month: 'Jun', students: 178, teachers: 15, courses: 28 }
  ];

  const gradeDistribution = [
    { grade: 'A+', count: 45, percentage: 25 },
    { grade: 'A', count: 38, percentage: 21 },
    { grade: 'B+', count: 32, percentage: 18 },
    { grade: 'B', count: 28, percentage: 16 },
    { grade: 'C+', count: 20, percentage: 11 },
    { grade: 'C', count: 15, percentage: 8 },
    { grade: 'F', count: 2, percentage: 1 }
  ];

  const coursePerformance = [
    { name: 'Mathematics', enrolled: 45, completed: 38, passRate: 84 },
    { name: 'English', enrolled: 42, completed: 40, passRate: 95 },
    { name: 'Physics', enrolled: 35, completed: 28, passRate: 80 },
    { name: 'Chemistry', enrolled: 38, completed: 32, passRate: 84 },
    { name: 'History', enrolled: 30, completed: 29, passRate: 97 }
  ];

  const activityData = [
    { name: 'Student Logins', value: 1240, color: '#3498db' },
    { name: 'Assignment Submissions', value: 856, color: '#2ecc71' },
    { name: 'Course Completions', value: 234, color: '#f39c12' },
    { name: 'Messages Sent', value: 445, color: '#e74c3c' }
  ];

  const attendanceData = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 94 },
    { day: 'Thu', attendance: 89 },
    { day: 'Fri', attendance: 85 },
    { day: 'Sat', attendance: 78 },
    { day: 'Sun', attendance: 45 }
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Enrollment Report', date: '2024-06-15', type: 'PDF', size: '2.3 MB' },
    { id: 2, name: 'Grade Analysis Q2', date: '2024-06-10', type: 'Excel', size: '1.8 MB' },
    { id: 3, name: 'Teacher Performance Review', date: '2024-06-08', type: 'PDF', size: '3.1 MB' },
    { id: 4, name: 'Course Completion Statistics', date: '2024-06-05', type: 'Excel', size: '2.7 MB' }
  ];

  const generateReport = (reportType) => {
    console.log(`Generating ${reportType} report...`);
    // In a real application, this would trigger report generation
    alert(`${reportType} report generation started. You will receive an email when it's ready.`);
  };

  const exportData = (format) => {
    console.log(`Exporting data as ${format}...`);
    alert(`Data exported as ${format} format`);
  };

  const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];

  return (
    <div className="admin-reporting">
      <div className="reporting-header">
        <h2>Reports & Analytics</h2>
        <div className="header-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Last 3 Months</option>
            <option value="lastyear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="export-btn" onClick={() => exportData('PDF')}>
            Export PDF
          </button>
          <button className="export-btn" onClick={() => exportData('Excel')}>
            Export Excel
          </button>
        </div>
      </div>

      <div className="reporting-nav">
        <button 
          className={`nav-btn ${activeReport === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveReport('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeReport === 'enrollment' ? 'active' : ''}`}
          onClick={() => setActiveReport('enrollment')}
        >
          Enrollment
        </button>
        <button 
          className={`nav-btn ${activeReport === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveReport('performance')}
        >
          Performance
        </button>
        <button 
          className={`nav-btn ${activeReport === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveReport('attendance')}
        >
          Attendance
        </button>
        <button 
          className={`nav-btn ${activeReport === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveReport('custom')}
        >
          Custom Reports
        </button>
      </div>

      <div className="reporting-content">
        {activeReport === 'overview' && (
          <div className="overview-reports">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">$127,543</p>
                <span className="stat-change positive">+12.5%</span>
              </div>
              <div className="stat-card">
                <h3>Active Students</h3>
                <p className="stat-value">1,245</p>
                <span className="stat-change positive">+8.2%</span>
              </div>
              <div className="stat-card">
                <h3>Course Completion</h3>
                <p className="stat-value">87.5%</p>
                <span className="stat-change positive">+5.1%</span>
              </div>
              <div className="stat-card">
                <h3>User Satisfaction</h3>
                <p className="stat-value">4.8/5</p>
                <span className="stat-change positive">+0.3</span>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h3>Enrollment Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#3498db" strokeWidth={3} />
                    <Line type="monotone" dataKey="teachers" stroke="#2ecc71" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Activity Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'enrollment' && (
          <div className="enrollment-reports">
            <div className="chart-container full-width">
              <h3>Monthly Enrollment Growth</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#3498db" name="Students" />
                  <Bar dataKey="teachers" fill="#2ecc71" name="Teachers" />
                  <Bar dataKey="courses" fill="#f39c12" name="Courses" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="enrollment-summary">
              <h3>Enrollment Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">New Students This Month</span>
                  <span className="summary-value">23</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Enrollments</span>
                  <span className="summary-value">1,245</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Drop Rate</span>
                  <span className="summary-value">3.2%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Retention Rate</span>
                  <span className="summary-value">96.8%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'performance' && (
          <div className="performance-reports">
            <div className="charts-grid">
              <div className="chart-container">
                <h3>Grade Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Course Performance</h3>
                <div className="performance-list">
                  {coursePerformance.map((course, index) => (
                    <div key={index} className="performance-item">
                      <div className="course-info">
                        <span className="course-name">{course.name}</span>
                        <span className="course-stats">
                          {course.completed}/{course.enrolled} completed
                        </span>
                      </div>
                      <div className="pass-rate">
                        <span className="rate-value">{course.passRate}%</span>
                        <div className="rate-bar">
                          <div 
                            className="rate-fill" 
                            style={{ width: `${course.passRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'attendance' && (
          <div className="attendance-reports">
            <div className="chart-container full-width">
              <h3>Weekly Attendance Patterns</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#2ecc71" 
                    strokeWidth={4}
                    dot={{ fill: '#2ecc71', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="attendance-insights">
              <h3>Attendance Insights</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <h4>Average Attendance</h4>
                  <p className="insight-value">82.3%</p>
                  <p className="insight-desc">Across all days</p>
                </div>
                <div className="insight-item">
                  <h4>Best Day</h4>
                  <p className="insight-value">Wednesday</p>
                  <p className="insight-desc">94% attendance</p>
                </div>
                <div className="insight-item">
                  <h4>Lowest Day</h4>
                  <p className="insight-value">Sunday</p>
                  <p className="insight-desc">45% attendance</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'custom' && (
          <div className="custom-reports">
            <div className="report-generators">
              <h3>Generate Custom Reports</h3>
              <div className="generators-grid">
                <div className="generator-card">
                  <h4>Student Progress Report</h4>
                  <p>Detailed analysis of individual student performance and progress tracking.</p>
                  <button 
                    className="generate-btn"
                    onClick={() => generateReport('Student Progress')}
                  >
                    Generate Report
                  </button>
                </div>
                <div className="generator-card">
                  <h4>Financial Summary</h4>
                  <p>Revenue, expenses, and financial performance overview for the selected period.</p>
                  <button 
                    className="generate-btn"
                    onClick={() => generateReport('Financial Summary')}
                  >
                    Generate Report
                  </button>
                </div>
                <div className="generator-card">
                  <h4>Teacher Performance</h4>
                  <p>Comprehensive evaluation of teaching effectiveness and student feedback.</p>
                  <button 
                    className="generate-btn"
                    onClick={() => generateReport('Teacher Performance')}
                  >
                    Generate Report
                  </button>
                </div>
                <div className="generator-card">
                  <h4>System Usage Analytics</h4>
                  <p>Platform usage statistics, peak times, and user engagement metrics.</p>
                  <button 
                    className="generate-btn"
                    onClick={() => generateReport('System Usage')}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            <div className="recent-reports">
              <h3>Recent Generated Reports</h3>
              <div className="reports-table">
                <div className="table-header">
                  <span>Report Name</span>
                  <span>Date</span>
                  <span>Type</span>
                  <span>Size</span>
                  <span>Actions</span>
                </div>
                {recentReports.map(report => (
                  <div key={report.id} className="table-row">
                    <span className="report-name">{report.name}</span>
                    <span className="report-date">{report.date}</span>
                    <span className="report-type">{report.type}</span>
                    <span className="report-size">{report.size}</span>
                    <div className="report-actions">
                      <button className="action-btn download">Download</button>
                      <button className="action-btn share">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReporting;
