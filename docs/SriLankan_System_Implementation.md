# Sri Lankan School System Implementation Guide

## Overview
This SmartED system now supports both **Ordinary Level (O/L)** and **Advanced Level (A/L)** education contexts from the Sri Lankan school system.

## Education Levels Supported

### Ordinary Level (O/L) - Grades 6-11
**Target Students**: Students preparing for G.C.E Ordinary Level examination
**Key Features**:
- Core subjects: Mathematics, Science, English, Sinhala, History, Geography, Buddhism, Health & Physical Education
- Optional subjects: ICT, Art, Music, Dancing, Business Studies, etc.
- Grading: A, B, C, S, W (without GPA calculation)
- Assessment types: Unit Tests, Term Tests, Monthly Tests, Assignments, Projects

### Advanced Level (A/L) - Grades 12-13
**Target Students**: Students preparing for G.C.E Advanced Level examination
**Key Features**:
- Stream-based education:
  - **Physical Science (M)**: Mathematics, Physics, Chemistry + English, ICT
  - **Biological Science (B)**: Biology, Chemistry, Physics + English, ICT
  - **Commerce (C)**: Economics, Business Studies, Accounting + English, ICT
  - **Arts (A)**: Economics, Geography, History + English, Political Science
  - **Technology (T)**: Engineering Technology, Science for Technology, Mathematics + English, ICT
- Grading: A, B, C, S, W with GPA calculation (4.0 scale)
- Assessment types: Unit Tests, Term Tests, Practical Tests, Model Papers, Assignments

## Implementation Details

### File Structure
```
src/
├── data/
│   └── sriLankanSchoolData.js     # Core data for both O/L and A/L
├── utils/
│   └── sriLankanSchoolUtils.js    # Utility functions for both levels
└── components/
    ├── dashboard/
    │   ├── Overview.jsx           # Adaptive for O/L and A/L
    │   ├── Assignments.jsx        # Level-specific assignments
    │   └── ExamMarks.jsx         # Grade-appropriate marking
    ├── StudentDashboard.jsx      # Toggle between O/L and A/L
    └── ParentDashboard.jsx       # Support for multiple children
```

### Key Functions

#### Student Level Detection
```javascript
import { getStudentLevel } from '../utils/sriLankanSchoolUtils'

const studentLevel = getStudentLevel(grade) // Returns 'OL', 'AL', or 'PRIMARY'
```

#### Grade Calculation
```javascript
// For O/L students
const olGrade = getOLGrade(marks) // Returns: A, B, C, S, W

// For A/L students  
const alResult = getALGrade(marks) // Returns: { grade: 'A', gpa: 4.0 }
```

#### Subject Assignment
```javascript
const subjects = getSubjectsByGradeAndStream(grade, stream)
// O/L: Returns core + optional subjects
// A/L: Returns stream-specific subjects
```

### Sample Data

#### O/L Student Profile
```javascript
{
  name: 'Tharindu Perera',
  grade: 10,
  class: 'A',
  level: 'O/L',
  subjects: ['Mathematics', 'Science', 'English', 'Sinhala', 'History', 'Geography', 'Buddhism', 'ICT'],
  admissionNo: 'OL2025045'
}
```

#### A/L Student Profile
```javascript
{
  name: 'Kamal Perera', 
  grade: 12,
  stream: 'Physical Science',
  class: 'M1',
  level: 'A/L',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'ICT'],
  admissionNo: 'AL2025001'
}
```

### Teacher Profiles

#### O/L Teachers
- **Mrs. Chamari Wickramasinghe** - Mathematics (Grades 6-11)
- **Mr. Roshan Perera** - Science (Grades 6-11)  
- **Miss. Sandamali Fernando** - English (Grades 6-11)
- **Mr. Nimal Rathnayake** - History (Grades 6-11)
- **Mrs. Kumudini Silva** - Geography (Grades 6-11)
- **Mr. Priyantha Jayawardena** - Sinhala (Grades 6-11)

#### A/L Teachers
- **Mr. Sunil Perera** - Mathematics (A/L Physical Science)
- **Dr. Amara Silva** - Physics (A/L Physical Science, Bio Science)
- **Mrs. Kushani Jayawardena** - Chemistry (A/L Physical Science, Bio Science)
- **Ms. Malani Fernando** - Biology (A/L Bio Science)
- **Mr. Nimal Rajapaksa** - English (All A/L streams)
- **Mr. Ravi Wickramasinghe** - ICT (All levels)

## Component Usage

### Overview Component
Automatically adapts based on student grade:
```jsx
// Detects student level and shows appropriate content
const studentLevel = getStudentLevel(studentInfo.grade)

// Shows different stats for O/L vs A/L
{studentLevel === 'AL' ? 'Overall GPA' : 'Overall Grade'}
```

### Assignments Component  
Shows level-appropriate assignments:
```jsx
// O/L assignments: Simpler, curriculum-based
// A/L assignments: Advanced, stream-specific
const assignments = studentLevel === 'AL' ? alAssignments : olAssignments
```

### Student Dashboard
Includes toggle functionality for testing:
```jsx
const [isALStudent, setIsALStudent] = useState(true)
// Switch between O/L and A/L student contexts
```

### Parent Dashboard
Supports multiple children at different levels:
```jsx
const students = [
  { name: 'Kamal', level: 'A/L', grade: 'Grade 12' },
  { name: 'Sanduni', level: 'O/L', grade: 'Grade 10' }
]
```

## Assessment Types

### O/L Assessments
- **Unit Tests**: Subject-specific regular assessments
- **Term Tests**: Comprehensive end-of-term examinations  
- **Monthly Tests**: Regular progress monitoring
- **Assignments**: Homework and project work
- **School Projects**: Research and creative work

### A/L Assessments
- **Unit Tests**: Advanced subject-specific tests
- **Term Tests**: Comprehensive examinations
- **Practical Tests**: Laboratory and hands-on assessments
- **Model Papers**: G.C.E A/L exam preparation
- **Assignments**: Research and analytical work

## Grading Display

### O/L Grading
- Visual grade letters (A, B, C, S, W)
- Percentage scores
- Color-coded performance indicators
- Simple progress tracking

### A/L Grading  
- Grade letters with GPA values
- Advanced analytics and predictions
- Stream-based performance comparison
- University entrance preparation metrics

## Usage Examples

### Testing Different Student Levels
1. **For O/L Student**: Set `grade: 10` in student info
2. **For A/L Student**: Set `grade: 12` and `stream: 'Physical Science'`
3. **Toggle in Dashboard**: Use the "Switch to O/L/A/L Student" button

### Adding New Subjects
```javascript
// In sriLankanSchoolData.js
export const OL_SUBJECTS = {
  CORE_SUBJECTS: [..., 'New Subject'],
  OPTIONAL_SUBJECTS: [..., 'Optional Subject']
}
```

### Customizing Streams
```javascript
// Add new A/L stream
export const AL_STREAMS = {
  // ... existing streams
  NEW_STREAM: {
    code: 'N',
    name: 'New Stream',
    subjects: ['Subject1', 'Subject2', 'Subject3']
  }
}
```

## Cultural Context

### Sri Lankan Names
- Students: Kamal Perera, Sanduni Silva, Tharindu Wickramasinghe
- Teachers: Mr. Sunil Perera, Mrs. Kushani Jayawardena, Dr. Amara Silva
- Traditional titles: Ven. Mahinda Thero (Buddhism teacher)

### School Context
- **School**: Mahinda College (established 1876)
- **Location**: Colombo 07, Sri Lanka
- **Terms**: Three terms per academic year
- **Admission Numbers**: OL2025045, AL2025001 format
- **Contact**: Sri Lankan phone numbers and .lk email domains

## Future Enhancements
- Sinhala/Tamil interface translations
- Integration with Department of Education standards
- A/L university entrance prediction algorithms
- Mobile app for rural connectivity
- Offline functionality for areas with limited internet

This implementation provides a comprehensive, culturally appropriate learning management system for Sri Lankan schools, supporting both O/L and A/L educational contexts with authentic data and realistic scenarios.