import React, { createContext, useContext, useState } from 'react';

// Create Context
const ParentContext = createContext();

// Provider Component
export const ParentProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all');
  const [teacherSearch, setTeacherSearch] = useState('');

  // Mock data
  const students = [
    {
      id: 1,
      name: 'Sarah Johnson',
      grade: '10th Grade',
      class: 'Class A',
      studentId: 'STU001',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c33e-cce5?w=100&h=100&fit=crop&crop=face',
      overallGrade: 'A',
      attendance: 95,
      subjects: 6
    },
    {
      id: 2,
      name: 'Michael Johnson',
      grade: '8th Grade',
      class: 'Class B',
      studentId: 'STU002',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      overallGrade: 'B+',
      attendance: 92,
      subjects: 5
    }
  ];

  const teachers = [
    {
      id: 1,
      name: 'Dr. Emily Davis',
      subject: 'Mathematics',
      email: 'emily.davis@smarted.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c33e-cce5?w=100&h=100&fit=crop&crop=face',
      experience: '8 years',
      availability: 'Mon-Fri 9AM-4PM'
    },
    {
      id: 2,
      name: 'Prof. John Smith',
      subject: 'Physics',
      email: 'john.smith@smarted.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      experience: '12 years',
      availability: 'Mon-Fri 8AM-3PM'
    },
    {
      id: 3,
      name: 'Ms. Lisa Brown',
      subject: 'English Literature',
      email: 'lisa.brown@smarted.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      experience: '6 years',
      availability: 'Mon-Fri 10AM-5PM'
    },
    {
      id: 4,
      name: 'Mr. David Wilson',
      subject: 'Chemistry',
      email: 'david.wilson@smarted.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      experience: '10 years',
      availability: 'Tue-Sat 9AM-4PM'
    }
  ];

  const subjectsProgress = [
    { subject: 'Mathematics', grade: 'A', progress: 92, score: 98 },
    { subject: 'Physics', grade: 'A-', progress: 88, score: 94 },
    { subject: 'Chemistry', grade: 'B+', progress: 85, score: 91 },
    { subject: 'English Literature', grade: 'A', progress: 94, score: 96 }
  ];

  const messages = [
    {
      id: 1,
      from: 'Dr. Emily Davis',
      fromAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c33e-cce5?w=50&h=50&fit=crop&crop=face',
      student: 'Sarah Johnson',
      subject: 'Excellent Progress in Mathematics',
      content: 'Sarah has been performing exceptionally well in her mathematics classes. She scored 98% on her recent calculus test and shows great understanding of complex concepts.',
      date: '2024-01-15',
      time: '10:30 AM',
      priority: 'normal',
      read: false,
      category: 'academic'
    },
    {
      id: 2,
      from: 'Prof. John Smith',
      fromAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      student: 'Sarah Johnson',
      subject: 'Physics Lab Assignment Due',
      content: 'Just a reminder that the physics lab assignment on electromagnetic fields is due this Friday. Please ensure Sarah completes the experiment report.',
      date: '2024-01-14',
      time: '2:45 PM',
      priority: 'high',
      read: true,
      category: 'assignment'
    }
  ];

  const recentGrades = [
    { subject: 'Mathematics', score: '98%', date: '2024-01-10', grade: 'A+' },
    { subject: 'Physics', score: '94%', date: '2024-01-08', grade: 'A' },
    { subject: 'Chemistry', score: '91%', date: '2024-01-05', grade: 'A-' },
    { subject: 'English', score: '96%', date: '2024-01-03', grade: 'A' }
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'unread') return !message.read;
    if (messageFilter === 'priority') return message.priority === 'high';
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const value = {
    activeTab,
    setActiveTab,
    selectedStudent,
    setSelectedStudent,
    messageFilter,
    setMessageFilter,
    teacherSearch,
    setTeacherSearch,
    students,
    teachers: filteredTeachers,
    subjectsProgress,
    messages: filteredMessages,
    recentGrades,
    unreadCount
  };

  return (
    <ParentContext.Provider value={value}>
      {children}
    </ParentContext.Provider>
  );
};

// Custom hook to use the context
export const useParent = () => {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error('useParent must be used within a ParentProvider');
  }
  return context;
};
