import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { collection, query, where, getDocs, addDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import './GradeEntry.css'

const GradeEntry = ({ students: propStudents, teacherId }) => {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedAssessment, setSelectedAssessment] = useState('')
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [showAddAssessment, setShowAddAssessment] = useState(false)
  const [newAssessment, setNewAssessment] = useState({
    name: '',
    type: '',
    maxMarks: 100,
    date: new Date().toISOString().split('T')[0]
  })
  const [isSaving, setIsSaving] = useState(false)
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  const assessmentTypes = [
    'Term Test',
    'Model Paper',
    'Assignment',
    'Practical Exam',
    'Class Test',
    'Project Work',
    'Monthly Test'
  ]

  // Load teacher's classes and subjects
  useEffect(() => {
    const loadTeacherData = async () => {
      if (!user || !user.id) {
        console.log('GradeEntry: No user found');
        return;
      }

      console.log('=== GradeEntry: Loading Teacher Data ===');
      console.log('User object:', user);

      try {
        setLoading(true);

        // Use classes and subjects directly from user object (already flattened in AuthContext)
        const teacherClasses = user.classes || user.teachingClasses || [];
        const teacherSubjects = user.subjects || [];

        console.log('Teacher classes:', teacherClasses);
        console.log('Teacher subjects:', teacherSubjects);

        // Map classes to proper format
        const classesData = teacherClasses.map(cls => ({
          id: cls,
          name: cls,
          level: cls.includes('12') || cls.includes('13') ? 'A/L' : 'O/L'
        }));
        setClasses(classesData);
        console.log('Formatted classes:', classesData);

        // Map subjects to proper format
        const subjectsData = teacherSubjects.map(subject => ({
          id: subject,
          name: subject,
          level: 'A/L' // Default, can be adjusted based on class
        }));
        setSubjects(subjectsData);
        console.log('Formatted subjects:', subjectsData);

        // Set default selections if available
        if (classesData.length > 0 && !selectedClass) {
          setSelectedClass(classesData[0].id);
        }
        if (subjectsData.length > 0 && !selectedSubject) {
          setSelectedSubject(subjectsData[0].id);
        }

        setLoading(false);
        console.log('=== GradeEntry: Teacher Data Loaded ===');
      } catch (error) {
        console.error('Error loading teacher data:', error);
        setLoading(false);
      }
    }

    loadTeacherData();
  }, [user])

  // Load students when class and subject are selected
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      console.log('=== GradeEntry: Filtering Students ===');
      console.log('Selected class:', selectedClass);
      console.log('Selected subject:', selectedSubject);
      console.log('Available students:', propStudents?.length || 0);

      // Use students from props if available
      if (propStudents && propStudents.length > 0) {
        // Filter students by matching class
        const filteredStudents = propStudents.filter(s => {
          const studentClass = s.originalClassInfo || s.class;
          const matches = studentClass === selectedClass;
          console.log(`Student ${s.fullName || s.name}: class=${studentClass}, matches=${matches}`);
          return matches;
        });

        console.log(`Filtered ${filteredStudents.length} students for class ${selectedClass}`);
        setStudents(filteredStudents);
        
        // Initialize marks object
        const initialMarks = {};
        filteredStudents.forEach(student => {
          initialMarks[student.id] = '';
        });
        setMarks(initialMarks);
      } else {
        console.warn('No students available from props');
        setStudents([]);
        setMarks({});
      }
    } else {
      console.log('GradeEntry: Class or subject not selected yet');
      setStudents([]);
      setMarks({});
    }
  }, [selectedClass, selectedSubject, propStudents])

  // Load assessments when class and subject are selected
  useEffect(() => {
    const loadAssessments = async () => {
      if (!selectedClass || !selectedSubject) {
        console.log('GradeEntry: Class or subject not selected, skipping assessment load');
        return;
      }

      console.log('=== GradeEntry: Loading Assessments ===');
      console.log('Class:', selectedClass);
      console.log('Subject:', selectedSubject);
      console.log('Teacher ID:', teacherId || user?.id);

      try {
        const assessmentsQuery = query(
          collection(db, 'assessments'),
          where('class', '==', selectedClass),
          where('subject', '==', selectedSubject),
          where('teacherId', '==', teacherId || user.id)
        );
        const assessmentsSnapshot = await getDocs(assessmentsQuery);
        const assessmentsData = assessmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(`Found ${assessmentsData.length} assessments`);
        console.log('Assessments:', assessmentsData);
        setAssessments(assessmentsData);
      } catch (error) {
        console.error('Error loading assessments:', error);
        setAssessments([]);
      }
    }

    loadAssessments();
  }, [selectedClass, selectedSubject, teacherId, user?.id])

  const handleMarkChange = (studentId, mark) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: mark
    }))
  }

  const getGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 85) return 'A'
    if (percentage >= 80) return 'A-'
    if (percentage >= 75) return 'B+'
    if (percentage >= 70) return 'B'
    if (percentage >= 65) return 'B-'
    if (percentage >= 60) return 'C+'
    if (percentage >= 55) return 'C'
    if (percentage >= 50) return 'C-'
    if (percentage >= 40) return 'S'
    return 'W'
  }

  const handleAddAssessment = async () => {
    if (!newAssessment.name || !newAssessment.type) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('=== GradeEntry: Adding Assessment ===');
    console.log('Assessment data:', newAssessment);
    console.log('Class:', selectedClass);
    console.log('Subject:', selectedSubject);

    try {
      const assessment = {
        name: newAssessment.name,
        type: newAssessment.type,
        maxMarks: parseInt(newAssessment.maxMarks) || 100,
        date: newAssessment.date,
        subject: selectedSubject,
        class: selectedClass,
        teacherId: teacherId || user.id,
        teacherName: user.fullName || user.name,
        createdAt: serverTimestamp()
      };

      console.log('Saving assessment:', assessment);
      const docRef = await addDoc(collection(db, 'assessments'), assessment);
      console.log('Assessment saved with ID:', docRef.id);
      
      setAssessments(prev => [...prev, { id: docRef.id, ...assessment }]);
      setNewAssessment({
        name: '',
        type: '',
        maxMarks: 100,
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddAssessment(false);
      alert('Assessment added successfully!');
    } catch (error) {
      console.error('Error adding assessment:', error);
      alert('Error adding assessment. Please try again.');
    }
  }

  const handleSaveMarks = async () => {
    if (!selectedAssessment) {
      alert('Please select an assessment');
      return;
    }

    console.log('=== GradeEntry: Saving Marks ===');
    console.log('Assessment ID:', selectedAssessment);
    console.log('Students:', students.length);
    console.log('Marks:', marks);

    // Validate that all marks are entered
    const emptyMarks = students.filter(student => 
      marks[student.id] === '' || marks[student.id] === undefined
    );

    if (emptyMarks.length > 0) {
      console.log(`${emptyMarks.length} students without marks`);
      const proceed = window.confirm(
        `${emptyMarks.length} students don't have marks entered. Do you want to save anyway?`
      );
      if (!proceed) return;
    }

    setIsSaving(true);

    try {
      const currentAssessment = getCurrentAssessment();
      console.log('Current assessment:', currentAssessment);
      
      // Save each student's grade to Firestore
      const gradePromises = students.map(async (student) => {
        const mark = marks[student.id];
        if (mark === '' || mark === undefined || isNaN(mark)) {
          console.log(`Skipping student ${student.fullName}: no valid mark`);
          return null;
        }
        
        const numericMark = parseFloat(mark);
        const maxMarks = currentAssessment?.maxMarks || 100;
        const calculatedGrade = getGrade(numericMark, maxMarks);

        const gradeData = {
          studentId: student.id,
          studentName: student.fullName || student.name,
          subject: selectedSubject,
          class: selectedClass,
          grade: student.grade || selectedClass.split('-')[0], // Extract grade from class
          assessmentId: selectedAssessment,
          assessmentName: currentAssessment?.name,
          assessmentType: currentAssessment?.type,
          marks: numericMark,
          maxMarks: maxMarks,
          grade: calculatedGrade,
          percentage: ((numericMark / maxMarks) * 100).toFixed(2),
          teacherId: teacherId || user.id,
          teacherName: user.fullName || user.name,
          date: serverTimestamp(),
          createdAt: serverTimestamp()
        };
        
        console.log(`Saving grade for ${student.fullName}:`, gradeData);
        return addDoc(collection(db, 'grades'), gradeData);
      });

      const results = await Promise.all(gradePromises.filter(Boolean));
      console.log(`Successfully saved ${results.length} grades`);
      
      alert(`Marks saved successfully for ${results.length} students!`);

      // Reset form
      setMarks({});
      setSelectedAssessment('');

    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  const getCurrentAssessment = () => {
    return assessments.find(a => a.id === selectedAssessment)
  }

  const getFilteredAssessments = () => {
    return assessments.filter(a => 
      a.subject === selectedSubject && a.class === selectedClass
    )
  }

  const calculateClassAverage = () => {
    const validMarks = Object.values(marks).filter(mark => mark !== '' && !isNaN(mark))
    if (validMarks.length === 0) return 0
    const sum = validMarks.reduce((acc, mark) => acc + parseFloat(mark), 0)
    return (sum / validMarks.length).toFixed(1)
  }

  const getClassStats = () => {
    const validMarks = Object.values(marks).filter(mark => mark !== '' && !isNaN(mark))
    if (validMarks.length === 0) return { highest: 0, lowest: 0, average: 0 }
    
    const numericMarks = validMarks.map(mark => parseFloat(mark))
    return {
      highest: Math.max(...numericMarks),
      lowest: Math.min(...numericMarks),
      average: parseFloat(calculateClassAverage())
    }
  }

  return (
    <div className="grade-entry-container">
      <div className="grade-entry-header">
        <h2>📊 Grade Entry & Management</h2>
        <p>Enter and manage student marks for assessments</p>
      </div>

      {loading ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '1.2rem'
        }}>
          <div>⏳ Loading teacher data...</div>
        </div>
      ) : (
        <>
          {/* Selection Controls */}
          <div className="selection-controls">
            <div className="control-row">
              <div className="form-group">
                <label>📚 Select Class</label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="form-select"
                >
                  <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {classes.length === 0 && (
                  <small style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                    No classes assigned. Please contact admin.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>📖 Select Subject</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="form-select"
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {subjects.length === 0 && (
                  <small style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                    No subjects assigned. Please contact admin.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>📝 Select Assessment</label>
                <div className="assessment-select-group">
                  <select 
                    value={selectedAssessment} 
                    onChange={(e) => setSelectedAssessment(e.target.value)}
                    className="form-select"
                    disabled={!selectedClass || !selectedSubject}
                  >
                    <option value="">Choose an assessment...</option>
                    {getFilteredAssessments().map(assessment => (
                      <option key={assessment.id} value={assessment.id}>
                        {assessment.name} ({assessment.type}) - {assessment.maxMarks} marks
                      </option>
                    ))}
                  </select>
                  <button 
                    className="add-assessment-btn"
                    onClick={() => setShowAddAssessment(true)}
                    disabled={!selectedClass || !selectedSubject}
                    title="Add new assessment"
                  >
                    ➕
                  </button>
                </div>
                {selectedClass && selectedSubject && getFilteredAssessments().length === 0 && (
                  <small style={{ color: '#3498db', fontSize: '0.85rem' }}>
                    No assessments found. Click ➕ to create one.
                  </small>
                )}
              </div>
            </div>
          </div>

      {/* Add Assessment Modal */}
      {showAddAssessment && (
        <div className="modal-overlay">
          <div className="modal-content add-assessment-modal">
            <div className="modal-header">
              <h3>➕ Add New Assessment</h3>
              <button 
                className="close-modal"
                onClick={() => setShowAddAssessment(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Assessment Name *</label>
                  <input
                    type="text"
                    value={newAssessment.name}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, name: e.target.value
                    }))}
                    placeholder="e.g., Second Term Test"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assessment Type *</label>
                  <select
                    value={newAssessment.type}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, type: e.target.value
                    }))}
                    required
                  >
                    <option value="">Select type...</option>
                    {assessmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Maximum Marks</label>
                  <input
                    type="number"
                    value={newAssessment.maxMarks}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, maxMarks: parseInt(e.target.value) || 100
                    }))}
                    min="1"
                    max="200"
                  />
                </div>
                <div className="form-group">
                  <label>Assessment Date</label>
                  <input
                    type="date"
                    value={newAssessment.date}
                    onChange={(e) => setNewAssessment(prev => ({
                      ...prev, date: e.target.value
                    }))}
                  />
                </div>
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
                className="save-btn"
                onClick={handleAddAssessment}
              >
                Add Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Entry Table */}
      {students.length > 0 && selectedAssessment && (
        <div className="grade-entry-section">
          <div className="assessment-info">
            <div className="assessment-details">
              <h3>{getCurrentAssessment()?.name}</h3>
              <div className="assessment-meta">
                <span className="assessment-type">{getCurrentAssessment()?.type}</span>
                <span className="max-marks">Max: {getCurrentAssessment()?.maxMarks} marks</span>
                <span className="assessment-date">
                  📅 {new Date(getCurrentAssessment()?.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {Object.values(marks).some(mark => mark !== '' && !isNaN(mark)) && (
              <div className="class-stats">
                <h4>📈 Class Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average</span>
                    <span className="stat-value">{getClassStats().average}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Highest</span>
                    <span className="stat-value">{getClassStats().highest}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Lowest</span>
                    <span className="stat-value">{getClassStats().lowest}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grade-table-container">
            <table className="grade-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Admission No</th>
                  <th>Current Grade</th>
                  <th>Marks ({getCurrentAssessment()?.maxMarks})</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const mark = marks[student.id]
                  const maxMarks = getCurrentAssessment()?.maxMarks || 100
                  const percentage = mark && !isNaN(mark) ? ((parseFloat(mark) / maxMarks) * 100).toFixed(1) : '-'
                  const grade = mark && !isNaN(mark) ? getGrade(parseFloat(mark), maxMarks) : '-'
                  
                  return (
                    <tr key={student.id}>
                      <td className="student-name">{student.fullName || student.name}</td>
                      <td className="admission-no">{student.indexNumber || student.admissionNo}</td>
                      <td className="current-grade">
                        <span className={`grade-badge ${(student.currentGrade || 'N/A').toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                          {student.currentGrade || 'N/A'}
                        </span>
                      </td>
                      <td className="marks-input">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={mark}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          placeholder="0"
                          className="mark-input"
                        />
                      </td>
                      <td className="percentage">
                        {percentage !== '-' && `${percentage}%`}
                      </td>
                      <td className="calculated-grade">
                        {grade !== '-' && (
                          <span className={`grade-badge ${grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')}`}>
                            {grade}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grade-entry-actions">
            <div className="action-buttons">
              <button 
                className="preview-btn"
                onClick={() => {
                  const stats = getClassStats()
                  alert(`Class Performance Summary:\nAverage: ${stats.average}\nHighest: ${stats.highest}\nLowest: ${stats.lowest}\nEntries: ${Object.values(marks).filter(m => m !== '' && !isNaN(m)).length}/${students.length}`)
                }}
              >
                👁️ Preview Results
              </button>
              <button 
                className="save-btn primary"
                onClick={handleSaveMarks}
                disabled={isSaving}
              >
                {isSaving ? '💾 Saving...' : '💾 Save Marks'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedClass || !selectedSubject || !selectedAssessment ? (
        <div className="instructions">
          <div className="instruction-card">
            <h3>📋 How to Enter Grades</h3>
            <ol>
              <li>Select the class you want to enter grades for</li>
              <li>Choose the subject from your teaching subjects</li>
              <li>Select an existing assessment or create a new one</li>
              <li>Enter marks for each student in the table</li>
              <li>Review the calculated grades and class statistics</li>
              <li>Save the marks to update student progress</li>
            </ol>
            <div className="grade-scale">
              <h4>🎯 Grading Scale</h4>
              <div className="scale-grid">
                <span>A+: 90-100%</span>
                <span>A: 85-89%</span>
                <span>A-: 80-84%</span>
                <span>B+: 75-79%</span>
                <span>B: 70-74%</span>
                <span>B-: 65-69%</span>
                <span>C+: 60-64%</span>
                <span>C: 55-59%</span>
                <span>C-: 50-54%</span>
                <span>S: 40-49%</span>
                <span>W: Below 40%</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
        </>
      )}
    </div>
  )
}

export default GradeEntry
