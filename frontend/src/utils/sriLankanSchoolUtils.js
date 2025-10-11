// Utility functions for Sri Lankan O/L and A/L school systems

// O/L Grade Calculation
export const getOLGrade = (marks) => {
  if (marks >= 75) return 'A';
  if (marks >= 65) return 'B';
  if (marks >= 55) return 'C';
  if (marks >= 35) return 'S';
  return 'W';
};

// A/L Grade Calculation with GPA
export const getALGrade = (marks) => {
  if (marks >= 75) return { grade: 'A', gpa: 4.0 };
  if (marks >= 65) return { grade: 'B', gpa: 3.0 };
  if (marks >= 55) return { grade: 'C', gpa: 2.0 };
  if (marks >= 35) return { grade: 'S', gpa: 1.0 };
  return { grade: 'W', gpa: 0.0 };
};

// Determine if student is O/L or A/L
export const getStudentLevel = (grade) => {
  if (grade >= 6 && grade <= 11) return 'OL';
  if (grade >= 12 && grade <= 13) return 'AL';
  if (grade >= 1 && grade <= 5) return 'PRIMARY';
  return 'UNKNOWN';
};

// Get subjects by grade and stream
export const getSubjectsByGradeAndStream = (grade, stream = null) => {
  const level = getStudentLevel(grade);
  
  if (level === 'OL') {
    // O/L subjects (grades 6-11)
    const coreSubjects = [
      'Mathematics', 'Science', 'English', 'Sinhala', 
      'History', 'Geography', 'Buddhism', 'Health & Physical Education'
    ];
    
    // Optional subjects can be added based on grade
    if (grade >= 10) {
      return [...coreSubjects, 'ICT', 'Art', 'Business Studies'];
    }
    return coreSubjects;
  }
  
  if (level === 'AL' && stream) {
    // A/L subjects based on stream
    const streamSubjects = {
      'Physical Science': ['Mathematics', 'Physics', 'Chemistry', 'English', 'ICT'],
      'M': ['Mathematics', 'Physics', 'Chemistry', 'English', 'ICT'],
      'Biological Science': ['Biology', 'Chemistry', 'Physics', 'English', 'ICT'],
      'B': ['Biology', 'Chemistry', 'Physics', 'English', 'ICT'],
      'Commerce': ['Economics', 'Business Studies', 'Accounting', 'English', 'ICT'],
      'C': ['Economics', 'Business Studies', 'Accounting', 'English', 'ICT'],
      'Arts': ['Economics', 'Geography', 'History', 'English', 'Political Science'],
      'A': ['Economics', 'Geography', 'History', 'English', 'Political Science'],
      'Technology': ['Engineering Technology', 'Science for Technology', 'Mathematics', 'English', 'ICT'],
      'T': ['Engineering Technology', 'Science for Technology', 'Mathematics', 'English', 'ICT']
    };
    
    return streamSubjects[stream] || [];
  }
  
  return [];
};

// Get classes by grade and stream
export const getClassesByGradeAndStream = (grade, stream = null) => {
  const level = getStudentLevel(grade);
  
  if (level === 'OL') {
    // O/L classes (A, B, C, D, E, F, G, H, I)
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  }
  
  if (level === 'AL' && stream) {
    // A/L classes based on stream
    switch(stream) {
      case 'Physical Science':
      case 'M':
        return ['M1', 'M2', 'M3'];
      case 'Biological Science': 
      case 'B':
        return ['B1', 'B2', 'B3'];
      case 'Commerce':
      case 'C':
        return ['C1', 'C2'];
      case 'Arts':
      case 'A':
        return ['A1', 'A2', 'A3'];
      case 'Technology':
      case 'T':
        return ['T1', 'T2'];
      default:
        return ['1', '2', '3'];
    }
  }
  
  return ['A', 'B', 'C'];
};

// Generate admission numbers
export const generateAdmissionNumber = (year, level, stream, sequence) => {
  if (level === 'OL') {
    return `OL${year}${sequence.toString().padStart(3, '0')}`;
  }
  if (level === 'AL') {
    const streamCode = stream ? stream.charAt(0).toUpperCase() : 'G';
    return `AL${year}${streamCode}${sequence.toString().padStart(3, '0')}`;
  }
  return `ST${year}${sequence.toString().padStart(3, '0')}`;
};

// Get grade color for styling
export const getGradeColor = (grade) => {
  const colors = {
    'A': '#27ae60',  // Green
    'B': '#3498db',  // Blue  
    'C': '#f39c12',  // Orange
    'S': '#e67e22',  // Dark Orange
    'W': '#e74c3c'   // Red
  };
  return colors[grade] || '#95a5a6';
};

// Calculate overall performance
export const calculateOverallPerformance = (subjects) => {
  if (!subjects || subjects.length === 0) return { grade: 'W', percentage: 0 };
  
  const totalMarks = subjects.reduce((sum, subject) => sum + (subject.marks || 0), 0);
  const averageMarks = totalMarks / subjects.length;
  
  const level = getStudentLevel(subjects[0]?.grade || 10);
  
  if (level === 'AL') {
    const gradeInfo = getALGrade(averageMarks);
    return { ...gradeInfo, percentage: averageMarks };
  } else {
    const grade = getOLGrade(averageMarks);
    return { grade, percentage: averageMarks };
  }
};

// Format Sri Lankan date
export const formatSriLankanDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format Sri Lankan time
export const formatSriLankanTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-LK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Validate Sri Lankan phone number
export const validateSriLankanPhone = (phone) => {
  // Remove spaces and hyphens
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Sri Lankan mobile: 07x-xxxxxxx or +94 7x xxxxxxx
  const mobileRegex = /^(\+94|0)?7[0-9]{8}$/;
  // Sri Lankan landline: 0xx-xxxxxxx or +94 xx xxxxxxx  
  const landlineRegex = /^(\+94|0)?[1-9][0-9]{8}$/;
  
  return mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone);
};

// Get current term
export const getCurrentTerm = (date = new Date()) => {
  const month = date.getMonth() + 1;
  
  if (month >= 1 && month <= 5) return 'First Term';
  if (month >= 5 && month <= 8) return 'Second Term';
  return 'Third Term';
};

// Get next exam date
export const getNextExamDate = (currentTerm) => {
  const currentYear = new Date().getFullYear();
  
  switch (currentTerm) {
    case 'First Term':
      return new Date(currentYear, 4, 15); // May 15
    case 'Second Term':
      return new Date(currentYear, 7, 15); // August 15  
    case 'Third Term':
      return new Date(currentYear, 11, 15); // December 15
    default:
      return new Date();
  }
};

// Get stream full name
export const getStreamFullName = (streamCode) => {
  const streams = {
    'M': 'Physical Science (Mathematics Stream)',
    'B': 'Biological Science Stream',
    'C': 'Commerce Stream',
    'A': 'Arts Stream',
    'T': 'Technology Stream'
  };
  return streams[streamCode] || streamCode;
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Get appropriate assessment types by level
export const getAssessmentTypes = (level) => {
  const commonTypes = ['Assignment', 'Quiz', 'Project'];
  
  if (level === 'OL') {
    return [...commonTypes, 'Unit Test', 'Term Test', 'Monthly Test'];
  }
  
  if (level === 'AL') {
    return [...commonTypes, 'Unit Test', 'Term Test', 'Practical Test', 'Model Paper'];
  }
  
  return commonTypes;
};

// Format currency in LKR
export const formatLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(amount);
};
