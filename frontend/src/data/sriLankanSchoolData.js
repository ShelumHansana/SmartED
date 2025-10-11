// Sri Lankan School System Data Configuration for O/L and A/L

export const GRADE_LEVELS = {
  PRIMARY: [1, 2, 3, 4, 5],
  JUNIOR_SECONDARY: [6, 7, 8, 9],
  ORDINARY_LEVEL: [10, 11],
  ADVANCED_LEVEL: [12, 13]
}

// O/L Subject Configuration
export const OL_SUBJECTS = {
  CORE_SUBJECTS: [
    'Mathematics',
    'Science',
    'English',
    'Sinhala',
    'History',
    'Geography',
    'Buddhism', // or Christianity/Islam/Hinduism based on student
    'Health & Physical Education'
  ],
  OPTIONAL_SUBJECTS: [
    'Tamil',
    'Art',
    'Dancing',
    'Music',
    'Drama',
    'ICT',
    'Eastern Music',
    'Western Music',
    'Home Economics',
    'Agriculture',
    'Business Studies'
  ]
}

// A/L Stream Configuration
export const AL_STREAMS = {
  PHYSICAL_SCIENCE: {
    code: 'M',
    name: 'Physical Science (Maths Stream)',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    common_subjects: ['English', 'ICT']
  },
  BIOLOGICAL_SCIENCE: {
    code: 'B', 
    name: 'Biological Science (Bio Stream)',
    subjects: ['Biology', 'Chemistry', 'Physics'],
    common_subjects: ['English', 'ICT']
  },
  COMMERCE: {
    code: 'C',
    name: 'Commerce Stream', 
    subjects: ['Economics', 'Business Studies', 'Accounting'],
    common_subjects: ['English', 'ICT']
  },
  ARTS: {
    code: 'A',
    name: 'Arts Stream',
    subjects: ['Economics', 'Geography', 'History'],
    common_subjects: ['English', 'Political Science']
  },
  TECHNOLOGY: {
    code: 'T',
    name: 'Technology Stream',
    subjects: ['Engineering Technology', 'Science for Technology', 'Mathematics'],
    common_subjects: ['English', 'ICT']
  }
}

// O/L Grading System
export const OL_GRADING = {
  A: { min: 75, max: 100, description: 'Excellent' },
  B: { min: 65, max: 74, description: 'Very Good' },
  C: { min: 55, max: 64, description: 'Good' },
  S: { min: 35, max: 54, description: 'Satisfactory' },
  W: { min: 0, max: 34, description: 'Weak' }
}

// A/L Grading System
export const AL_GRADING = {
  A: { min: 75, max: 100, gpa: 4.0, description: 'Excellent' },
  B: { min: 65, max: 74, gpa: 3.0, description: 'Very Good' },
  C: { min: 55, max: 64, gpa: 2.0, description: 'Good' },
  S: { min: 35, max: 54, gpa: 1.0, description: 'Satisfactory' },
  W: { min: 0, max: 34, gpa: 0.0, description: 'Weak' }
}

// Sample O/L Teachers
export const OL_TEACHERS = [
  {
    id: 'T_OL_001',
    name: 'Mrs. Chamari Wickramasinghe',
    subjects: ['Mathematics'],
    grades: [6, 7, 8, 9, 10, 11],
    qualifications: 'B.Sc. Mathematics, PGDE',
    experience: '12 years',
    contact: { email: 'chamari.w@school.lk', phone: '071-2345678' }
  },
  {
    id: 'T_OL_002',
    name: 'Mr. Roshan Perera',
    subjects: ['Science'],
    grades: [6, 7, 8, 9, 10, 11],
    qualifications: 'B.Sc. General Science, PGDE',
    experience: '15 years',
    contact: { email: 'roshan.p@school.lk', phone: '077-8765432' }
  },
  {
    id: 'T_OL_003',
    name: 'Miss. Sandamali Fernando',
    subjects: ['English'],
    grades: [6, 7, 8, 9, 10, 11],
    qualifications: 'BA English, PGDE',
    experience: '8 years',
    contact: { email: 'sandamali.f@school.lk', phone: '076-5432109' }
  },
  {
    id: 'T_OL_004',
    name: 'Mr. Nimal Rathnayake',
    subjects: ['History'],
    grades: [6, 7, 8, 9, 10, 11],
    qualifications: 'BA History, PGDE',
    experience: '18 years',
    contact: { email: 'nimal.r@school.lk', phone: '075-9876543' }
  },
  {
    id: 'T_OL_005',
    name: 'Mrs. Kumudini Silva',
    subjects: ['Geography'],
    grades: [6, 7, 8, 9, 10, 11],
    qualifications: 'BA Geography, PGDE',
    experience: '10 years',
    contact: { email: 'kumudini.s@school.lk', phone: '072-1357924' }
  },
  {
    id: 'T_OL_006',
    name: 'Mr. Priyantha Jayawardena',
    subjects: ['Sinhala'],
    grades: [6, 7, 8, 9, 10, 11],
    qualifications: 'BA Sinhala, PGDE',
    experience: '14 years',
    contact: { email: 'priyantha.j@school.lk', phone: '078-2468013' }
  }
]

// Sample A/L Teachers
export const AL_TEACHERS = [
  {
    id: 'T_AL_001',
    name: 'Mr. Sunil Perera',
    subjects: ['Mathematics'],
    streams: ['Physical Science'],
    qualifications: 'B.Sc. Mathematics (Hons), PGDE',
    experience: '15 years',
    classes: ['Grade 12 M1', 'Grade 13 M1', 'Grade 13 M2'],
    contact: { email: 'sunil.perera@school.lk', phone: '071-2345678' }
  },
  {
    id: 'T_AL_002', 
    name: 'Dr. Amara Silva',
    subjects: ['Physics'],
    streams: ['Physical Science', 'Biological Science'],
    qualifications: 'Ph.D. Physics, B.Sc. Physics (Hons)',
    experience: '12 years',
    classes: ['Grade 12 M1', 'Grade 12 B1'],
    contact: { email: 'amara.silva@school.lk', phone: '077-8765432' }
  },
  {
    id: 'T_AL_003',
    name: 'Mrs. Kushani Jayawardena', 
    subjects: ['Chemistry'],
    streams: ['Physical Science', 'Biological Science'],
    qualifications: 'M.Sc. Chemistry, B.Sc. Chemistry (Hons)',
    experience: '10 years',
    classes: ['Grade 12 M1', 'Grade 12 B1', 'Grade 13 M1'],
    contact: { email: 'kushani.j@school.lk', phone: '076-5432109' }
  },
  {
    id: 'T_AL_004',
    name: 'Ms. Malani Fernando',
    subjects: ['Biology'],
    streams: ['Biological Science'],
    qualifications: 'M.Sc. Botany, B.Sc. Biology (Hons)',
    experience: '8 years',
    classes: ['Grade 12 B1', 'Grade 13 B1'],
    contact: { email: 'malani.fernando@school.lk', phone: '078-9876543' }
  }
]

// Sample O/L Students
export const OL_STUDENTS = [
  {
    id: 'OL2025001',
    name: 'Tharindu Lakmal Perera',
    grade: 10,
    class: 'A',
    subjects: ['Mathematics', 'Science', 'English', 'Sinhala', 'History', 'Geography', 'Buddhism', 'ICT', 'Art'],
    address: 'No. 12, Temple Road, Kandy',
    parent: { name: 'Mr. Lakmal Perera', contact: '071-1234567', email: 'lakmal.perera@gmail.com' }
  },
  {
    id: 'OL2025002', 
    name: 'Himashi Dilrukshi Silva',
    grade: 11,
    class: 'A',
    subjects: ['Mathematics', 'Science', 'English', 'Sinhala', 'History', 'Geography', 'Buddhism', 'ICT', 'Home Economics'],
    address: 'No. 45, School Lane, Galle',
    parent: { name: 'Mrs. Dilrukshi Silva', contact: '077-2345678', email: 'dilrukshi.silva@yahoo.com' }
  },
  {
    id: 'OL2025003',
    name: 'Kasun Chamara Wickramasinghe',
    grade: 9,
    class: 'B',
    subjects: ['Mathematics', 'Science', 'English', 'Sinhala', 'History', 'Geography', 'Buddhism', 'Art'],
    address: 'No. 78, Main Street, Colombo 05',
    parent: { name: 'Mr. Chamara Wickramasinghe', contact: '076-3456789', email: 'chamara.w@hotmail.com' }
  }
]

// Sample A/L Students
export const AL_STUDENTS = [
  {
    id: 'AL2025001',
    name: 'Kamal Bandara Perera',
    grade: 12,
    stream: 'Physical Science',
    class: 'M1',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'ICT'],
    address: 'No. 45, Galle Road, Colombo 03',
    parent: { name: 'Mr. Sunil Perera', contact: '071-2345678', email: 'sunil.perera@gmail.com' }
  },
  {
    id: 'AL2025002', 
    name: 'Sanduni Malsha Silva',
    grade: 12,
    stream: 'Biological Science',
    class: 'B1',
    subjects: ['Biology', 'Chemistry', 'Physics', 'English', 'ICT'],
    address: 'No. 23, Kandy Road, Peradeniya',
    parent: { name: 'Mrs. Kumari Silva', contact: '077-8765432', email: 'kumari.silva@gmail.com' }
  },
  {
    id: 'AL2025003',
    name: 'Thilina Chamara Jayawardena',
    grade: 13,
    stream: 'Physical Science',
    class: 'M1', 
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    address: 'No. 67, Negombo Road, Gampaha',
    parent: { name: 'Mr. Asanka Jayawardena', contact: '076-5432109', email: 'asanka.j@yahoo.com' }
  }
]

export const SCHOOL_INFO = {
  name: 'Mahinda College',
  address: 'No. 123, Education Lane, Colombo 07, Sri Lanka',
  phone: '+94 11 2345678',
  email: 'info@mahindacollege.lk',
  website: 'www.mahindacollege.lk',
  established: '1876',
  principal: 'Mr. Chandana Wickramasinghe',
  vice_principals: {
    academic: 'Mrs. Sumana Rathnayake',
    administration: 'Mr. Ranjith Fernando'
  },
  motto: 'Wisdom is Light',
  academic_year: '2025'
}

export const TERM_STRUCTURE = {
  TERM_1: { name: 'First Term', start: '2025-01-15', end: '2025-05-15' },
  TERM_2: { name: 'Second Term', start: '2025-05-16', end: '2025-08-15' },
  TERM_3: { name: 'Third Term', start: '2025-08-16', end: '2025-12-15' }
}
