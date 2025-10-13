// Database Initialization Service
// Creates initial collections and sample data for testing

import { 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase/config.js';

// ==================== INITIALIZE COLLECTIONS ====================

/**
 * Initialize all database collections with structure
 * @returns {Promise<void>}
 */
export const initializeCollections = async () => {
  try {
    console.log('Initializing database collections...');

    const batch = writeBatch(db);

    // Initialize each collection with a placeholder document
    const collections = [
      'users',
      'courses',
      'subjects',
      'assessments',
      'grades',
      'studentProgress',
      'activities',
      'notifications',
      'messages',
      'attendance',
      'achievements',
      'settings'
    ];

    for (const collectionName of collections) {
      const docRef = doc(db, collectionName, '_placeholder');
      batch.set(docRef, {
        initialized: true,
        createdAt: serverTimestamp()
      });
    }

    await batch.commit();

    console.log('Database collections initialized successfully');
    return { success: true };

  } catch (error) {
    console.error('Error initializing collections:', error);
    throw error;
  }
};

// ==================== INITIALIZE SUBJECTS ====================

/**
 * Initialize default subjects
 * @returns {Promise<void>}
 */
export const initializeSubjects = async () => {
  try {
    console.log('Initializing subjects...');

    const subjects = [
      // O/L Subjects
      { code: 'MATH_OL', name: 'Mathematics', level: 'O/L', stream: null },
      { code: 'SCI_OL', name: 'Science', level: 'O/L', stream: null },
      { code: 'ENG_OL', name: 'English', level: 'O/L', stream: null },
      { code: 'SIN_OL', name: 'Sinhala', level: 'O/L', stream: null },
      { code: 'TAM_OL', name: 'Tamil', level: 'O/L', stream: null },
      { code: 'HIS_OL', name: 'History', level: 'O/L', stream: null },
      { code: 'GEO_OL', name: 'Geography', level: 'O/L', stream: null },
      { code: 'BUD_OL', name: 'Buddhism', level: 'O/L', stream: null },
      { code: 'CHR_OL', name: 'Christianity', level: 'O/L', stream: null },
      { code: 'ISL_OL', name: 'Islam', level: 'O/L', stream: null },
      { code: 'ART_OL', name: 'Art', level: 'O/L', stream: null },
      { code: 'MUS_OL', name: 'Music', level: 'O/L', stream: null },
      { code: 'PE_OL', name: 'Health & PE', level: 'O/L', stream: null },
      
      // A/L Subjects - Physical Science
      { code: 'MATH_AL', name: 'A/L Mathematics', level: 'A/L', stream: 'Physical Science' },
      { code: 'PHYS_AL', name: 'A/L Physics', level: 'A/L', stream: 'Physical Science' },
      { code: 'CHEM_AL', name: 'A/L Chemistry', level: 'A/L', stream: 'Physical Science' },
      
      // A/L Subjects - Bio Science
      { code: 'BIO_AL', name: 'A/L Biology', level: 'A/L', stream: 'Bio Science' },
      { code: 'CHEM_AL_BIO', name: 'A/L Chemistry', level: 'A/L', stream: 'Bio Science' },
      { code: 'PHYS_AL_BIO', name: 'A/L Physics', level: 'A/L', stream: 'Bio Science' },
      
      // A/L Common Subjects
      { code: 'ENG_AL', name: 'A/L English', level: 'A/L', stream: 'All' },
      { code: 'ICT_AL', name: 'A/L ICT', level: 'A/L', stream: 'All' },
      { code: 'GIT_AL', name: 'A/L General IT', level: 'A/L', stream: 'All' },
      
      // A/L Arts Stream
      { code: 'LIT_AL', name: 'A/L Literature', level: 'A/L', stream: 'Arts' },
      { code: 'ECO_AL', name: 'A/L Economics', level: 'A/L', stream: 'Arts' },
      { code: 'POL_AL', name: 'A/L Political Science', level: 'A/L', stream: 'Arts' },
      
      // A/L Technology Stream
      { code: 'ET_AL', name: 'A/L Engineering Technology', level: 'A/L', stream: 'Technology' },
      { code: 'SCI_AL', name: 'A/L Science for Technology', level: 'A/L', stream: 'Technology' }
    ];

    const batch = writeBatch(db);

    subjects.forEach((subject, index) => {
      const docRef = doc(db, 'subjects', subject.code);
      batch.set(docRef, {
        ...subject,
        description: `${subject.name} for ${subject.level} level`,
        createdAt: serverTimestamp()
      });
    });

    await batch.commit();

    console.log(`${subjects.length} subjects initialized successfully`);
    return { success: true, count: subjects.length };

  } catch (error) {
    console.error('Error initializing subjects:', error);
    throw error;
  }
};

// ==================== INITIALIZE SCHOOL SETTINGS ====================

/**
 * Initialize school settings with default values
 * @returns {Promise<void>}
 */
export const initializeSchoolSettings = async () => {
  try {
    console.log('Initializing school settings...');

    const settings = {
      schoolInfo: {
        schoolName: 'Mahinda College',
        address: 'Colombo 07, Sri Lanka',
        phone: '+94 11 269 1731',
        email: 'admin@mahindacollege.lk',
        academicYear: '2025',
        terms: 3,
        gradingSystem: 'A/B/C/S/W',
        languages: ['English', 'Sinhala', 'Tamil'],
        timezone: 'Asia/Colombo'
      },
      academicSettings: {
        termDates: {
          term1: { start: '2025-01-15', end: '2025-04-15' },
          term2: { start: '2025-05-01', end: '2025-08-15' },
          term3: { start: '2025-09-01', end: '2025-12-15' }
        },
        gradingScale: {
          'A+': { min: 90, max: 100 },
          'A': { min: 85, max: 89 },
          'A-': { min: 80, max: 84 },
          'B+': { min: 75, max: 79 },
          'B': { min: 70, max: 74 },
          'B-': { min: 65, max: 69 },
          'C+': { min: 60, max: 64 },
          'C': { min: 55, max: 59 },
          'C-': { min: 50, max: 54 },
          'S': { min: 40, max: 49 },
          'W': { min: 0, max: 39 }
        }
      },
      systemSettings: {
        enableEmailNotifications: true,
        enableParentPortal: true,
        enableSMSNotifications: false,
        sessionTimeout: 60,
        passwordPolicy: 'medium',
        twoFactorAuth: false
      },
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'settings', 'schoolSettings'), settings);

    console.log('School settings initialized successfully');
    return { success: true };

  } catch (error) {
    console.error('Error initializing school settings:', error);
    throw error;
  }
};

// ==================== CREATE SAMPLE DATA ====================

/**
 * Create sample data for testing (optional)
 * @returns {Promise<void>}
 */
export const createSampleData = async () => {
  try {
    console.log('Creating sample data...');

    // This would create sample students, teachers, courses, etc.
    // Only use this for testing/development
    
    console.log('Sample data creation - Implement as needed');
    return { success: true, message: 'Sample data creation ready to implement' };

  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};

// ==================== MASTER INITIALIZATION ====================

/**
 * Run all initialization functions
 * @returns {Promise<void>}
 */
export const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    await initializeCollections();
    await initializeSubjects();
    await initializeSchoolSettings();

    console.log('Database initialized successfully!');
    return { 
      success: true, 
      message: 'Database initialized successfully' 
    };

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
