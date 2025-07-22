import { useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'

const ExamMarks = () => {
  const [selectedSubject, setSelectedSubject] = useState('all')
  
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' }
  ]

  const marksData = {
    labels: ['Test 1', 'Test 2', 'Midterm', 'Test 3', 'Final'],
    datasets: [
      {
        label: 'Your Score',
        data: [85, 78, 92, 88, 90],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Class Average',
        data: [75, 72, 80, 82, 85],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="exam-marks-container">
      <div className="marks-header">
        <h2>Exam Marks Analysis</h2>
        <select 
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="subject-select"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Progress Over Time</h3>
          <Line data={marksData} />
        </div>
        
        <div className="chart-card">
          <h3>Subject-wise Performance</h3>
          <Bar
            data={{
              labels: subjects.map(s => s.name),
              datasets: [{
                label: 'Average Score',
                data: [88, 85, 92, 78],
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
              }]
            }}
          />
        </div>
      </div>

      <div className="performance-metrics">
        <div className="metric-card">
          <h4>Overall Average</h4>
          <p className="metric-value">85.8%</p>
        </div>
        <div className="metric-card">
          <h4>Highest Score</h4>
          <p className="metric-value">92%</p>
        </div>
        <div className="metric-card">
          <h4>Areas for Improvement</h4>
          <ul className="improvement-list">
            <li>History: Time Management</li>
            <li>Mathematics: Complex Problems</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ExamMarks
