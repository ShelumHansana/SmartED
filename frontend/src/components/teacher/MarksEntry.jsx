import React, { useState } from 'react';
import '../../styles/MarksEntry.css';

const MarksEntry = () => {
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [viewMode, setViewMode] = useState('entry'); // 'entry' or 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: '',
    type: 'assignment',
    maxMarks: 100,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Teacher's subjects
  const subjects = [
    { id: 'mathematics', name: 'Mathematics', students: 28 },
    { id: 'physics', name: 'Physics', students: 25 },
    { id: 'chemistry', name: 'Chemistry', students: 22 }
  ];

  // Sample students data
  const [students] = useState([
    { id: 1, name: 'John Smith', rollNo: 'ST001', class: '10A', email: 'john.smith@email.com' },
    { id: 2, name: 'Emma Johnson', rollNo: 'ST002', class: '10A', email: 'emma.johnson@email.com' },
    { id: 3, name: 'Michael Brown', rollNo: 'ST003', class: '10A', email: 'michael.brown@email.com' },
    { id: 4, name: 'Sarah Davis', rollNo: 'ST004', class: '10A', email: 'sarah.davis@email.com' },
    { id: 5, name: 'James Wilson', rollNo: 'ST005', class: '10A', email: 'james.wilson@email.com' },
    { id: 6, name: 'Lisa Anderson', rollNo: 'ST006', class: '10A', email: 'lisa.anderson@email.com' },
    { id: 7, name: 'David Miller', rollNo: 'ST007', class: '10A', email: 'david.miller@email.com' },
    { id: 8, name: 'Jennifer Garcia', rollNo: 'ST008', class: '10A', email: 'jennifer.garcia@email.com' }
  ]);

  // Sample assessments
  const [assessments, setAssessments] = useState({
    mathematics: [
      { id: 1, name: 'Quiz 1 - Algebra', type: 'quiz', maxMarks: 50, date: '2024-06-15', description: 'Basic algebraic expressions and equations' },
      { id: 2, name: 'Assignment 1 - Geometry', type: 'assignment', maxMarks: 100, date: '2024-06-20', description: 'Properties of triangles and circles' },
      { id: 3, name: 'Mid-term Exam', type: 'exam', maxMarks: 200, date: '2024-06-25', description: 'Comprehensive mid-term examination' }
    ],
    physics: [
      { id: 1, name: 'Lab Report - Motion', type: 'lab', maxMarks: 75, date: '2024-06-18', description: 'Analysis of motion and velocity' },
      { id: 2, name: 'Quiz - Forces', type: 'quiz', maxMarks: 40, date: '2024-06-22', description: 'Newton\'s laws of motion' }
    ],
    chemistry: [
      { id: 1, name: 'Practical - Acids & Bases', type: 'practical', maxMarks: 80, date: '2024-06-20', description: 'pH testing and neutralization reactions' },
      { id: 2, name: 'Assignment - Periodic Table', type: 'assignment', maxMarks: 60, date: '2024-06-24', description: 'Trends in the periodic table' }
    ]
  });

  // Sample marks data
  const [marks, setMarks] = useState({
    1: { 1: 45, 2: 88, 3: 165 }, // John Smith
    2: { 1: 42, 2: 92, 3: 175 }, // Emma Johnson
    3: { 1: 38, 2: 85, 3: 155 }, // Michael Brown
    4: { 1: 48, 2: 95, 3: 180 }, // Sarah Davis
    5: { 1: 35, 2: 78, 3: 145 }, // James Wilson
    6: { 1: 46, 2: 90, 3: 170 }, // Lisa Anderson
    7: { 1: 40, 2: 82, 3: 160 }, // David Miller
    8: { 1: 44, 2: 87, 3: 168 }  // Jennifer Garcia
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkChange = (studentId, value) => {
    if (!selectedAssessment) return;
    
    const numValue = parseFloat(value);
    const maxMarks = assessments[selectedSubject].find(a => a.id === parseInt(selectedAssessment))?.maxMarks || 100;
    
    if (isNaN(numValue) || numValue < 0 || numValue > maxMarks) {
      return;
    }
    
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [selectedAssessment]: numValue
      }
    }));
  };

  const handleSaveMarks = () => {
    console.log('Saving marks:', marks);
    alert('Marks saved successfully!');
  };

  const handleAddAssessment = () => {
    if (!newAssessment.name || !newAssessment.maxMarks) return;
    
    const assessment = {
      ...newAssessment,
      id: Date.now(),
      maxMarks: parseInt(newAssessment.maxMarks)
    };
    
    setAssessments(prev => ({
      ...prev,
      [selectedSubject]: [...prev[selectedSubject], assessment]
    }));
    
    setNewAssessment({
      name: '',
      type: 'assignment',
      maxMarks: 100,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    
    setShowAddAssessment(false);
    alert('Assessment added successfully!');
  };

  const calculatePercentage = (studentId, assessmentId) => {
    const mark = marks[studentId]?.[assessmentId];
    const assessment = assessments[selectedSubject]?.find(a => a.id === assessmentId);
    if (mark && assessment) {
      return ((mark / assessment.maxMarks) * 100).toFixed(1);
    }
    return '-';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  return (
    <div className="marks-entry">
      <div className="marks-header">
        <div className="header-left">
          <h2>Marks Entry & Management</h2>
          <p>Manage student assessments and grades</p>
        </div>
        <div className="header-controls">
          <button 
            className={`view-btn ${viewMode === 'entry' ? 'active' : ''}`}
            onClick={() => setViewMode('entry')}
          >
            Enter Marks
          </button>
          <button 
            className={`view-btn ${viewMode === 'history' ? 'active' : ''}`}
            onClick={() => setViewMode('history')}
          >
            View History
          </button>
        </div>
      </div>

      <div className="marks-filters">
        <div className="filter-group">
          <label>Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedAssessment('');
            }}
            className="subject-select"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.students} students)
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Assessment</label>
          <div className="assessment-controls">
            <select 
              value={selectedAssessment} 
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="assessment-select"
            >
              <option value="">Select Assessment</option>
              {assessments[selectedSubject]?.map(assessment => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.name} ({assessment.maxMarks} marks)
                </option>
              ))}
            </select>
            <button 
              className="add-assessment-btn"
              onClick={() => setShowAddAssessment(true)}
            >
              + Add Assessment
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Search Students</label>
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {viewMode === 'entry' && (
        <div className="marks-entry-section">
          {selectedAssessment ? (
            <div className="entry-content">
              <div className="assessment-info">
                {(() => {
                  const assessment = assessments[selectedSubject]?.find(a => a.id === parseInt(selectedAssessment));
                  return assessment ? (
                    <div className="assessment-details">
                      <h3>{assessment.name}</h3>
                      <div className="assessment-meta">
                        <span className={`type-badge ${assessment.type}`}>
                          {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                        </span>
                        <span className="max-marks">Max: {assessment.maxMarks} marks</span>
                        <span className="date">Date: {new Date(assessment.date).toLocaleDateString()}</span>
                      </div>
                      {assessment.description && (
                        <p className="description">{assessment.description}</p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="students-marks-table">
                <div className="table-header">
                  <span>Student</span>
                  <span>Roll No</span>
                  <span>Marks Obtained</span>
                  <span>Percentage</span>
                  <span>Grade</span>
                </div>
                
                {filteredStudents.map(student => {
                  const currentMark = marks[student.id]?.[selectedAssessment] || '';
                  const percentage = calculatePercentage(student.id, parseInt(selectedAssessment));
                  const numPercentage = parseFloat(percentage);
                  
                  return (
                    <div key={student.id} className="table-row">
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-class">{student.class}</span>
                      </div>
                      <span className="roll-no">{student.rollNo}</span>
                      <div className="marks-input-container">
                        <input
                          type="number"
                          value={currentMark}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          className="marks-input"
                          min="0"
                          max={assessments[selectedSubject]?.find(a => a.id === parseInt(selectedAssessment))?.maxMarks || 100}
                          step="0.5"
                        />
                        <span className="max-marks-indicator">
                          / {assessments[selectedSubject]?.find(a => a.id === parseInt(selectedAssessment))?.maxMarks}
                        </span>
                      </div>
                      <span className="percentage">
                        {percentage !== '-' ? `${percentage}%` : '-'}
                      </span>
                      <span className={`grade ${percentage !== '-' ? getGrade(numPercentage).toLowerCase().replace('+', 'plus') : ''}`}>
                        {percentage !== '-' ? getGrade(numPercentage) : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="marks-actions">
                <button className="save-marks-btn" onClick={handleSaveMarks}>
                  Save All Marks
                </button>
                <button className="bulk-action-btn">
                  Import from CSV
                </button>
                <button className="bulk-action-btn">
                  Export to Excel
                </button>
              </div>
            </div>
          ) : (
            <div className="no-assessment-selected">
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>Select an Assessment</h3>
                <p>Choose an assessment from the dropdown above to start entering marks</p>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'history' && (
        <div className="marks-history-section">
          <div className="history-content">
            <h3>Assessment History - {subjects.find(s => s.id === selectedSubject)?.name}</h3>
            <div className="assessments-overview">
              {assessments[selectedSubject]?.map(assessment => (
                <div key={assessment.id} className="assessment-card">
                  <div className="assessment-header">
                    <h4>{assessment.name}</h4>
                    <span className={`type-badge ${assessment.type}`}>
                      {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                    </span>
                  </div>
                  <div className="assessment-stats">
                    <div className="stat-item">
                      <span className="stat-label">Max Marks</span>
                      <span className="stat-value">{assessment.maxMarks}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Date</span>
                      <span className="stat-value">{new Date(assessment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Students</span>
                      <span className="stat-value">
                        {Object.keys(marks).filter(studentId => marks[studentId][assessment.id] !== undefined).length} / {students.length}
                      </span>
                    </div>
                  </div>
                  <div className="assessment-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => {
                        setViewMode('entry');
                        setSelectedAssessment(assessment.id.toString());
                      }}
                    >
                      View Details
                    </button>
                    <button className="edit-assessment-btn">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Assessment Modal */}
      {showAddAssessment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Assessment</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddAssessment(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Assessment Name</label>
                <input
                  type="text"
                  value={newAssessment.name}
                  onChange={(e) => setNewAssessment(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter assessment name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newAssessment.type}
                    onChange={(e) => setNewAssessment(prev => ({...prev, type: e.target.value}))}
                  >
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="lab">Lab Report</option>
                    <option value="practical">Practical</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Maximum Marks</label>
                  <input
                    type="number"
                    value={newAssessment.maxMarks}
                    onChange={(e) => setNewAssessment(prev => ({...prev, maxMarks: e.target.value}))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newAssessment.date}
                  onChange={(e) => setNewAssessment(prev => ({...prev, date: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment(prev => ({...prev, description: e.target.value}))}
                  placeholder="Brief description of the assessment"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddAssessment(false)}
              >
                Cancel
              </button>
              <button 
                className="add-btn"
                onClick={handleAddAssessment}
                disabled={!newAssessment.name || !newAssessment.maxMarks}
              >
                Add Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntry;
