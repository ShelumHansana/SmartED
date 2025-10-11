import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/ParentDashboard.css';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState('sarah');
  const [messageFilter, setMessageFilter] = useState('all');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);

  // Sample data
  const students = [
    { id: 'sarah', name: 'Sarah Johnson', grade: '10th', avatar: '/sarah-avatar.svg' },
    { id: 'mike', name: 'Mike Johnson', grade: '8th', avatar: '/mike-avatar.svg' }
  ];

  const currentStudent = students.find(s => s.id === selectedStudent);

  const subjectsProgress = [
    { subject: 'Mathematics', grade: 92, trend: '+5', color: '#3498db' },
    { subject: 'English', grade: 88, trend: '+2', color: '#2ecc71' },
    { subject: 'Science', grade: 85, trend: '-1', color: '#f39c12' },
    { subject: 'History', grade: 90, trend: '+3', color: '#e74c3c' },
    { subject: 'Physics', grade: 87, trend: '+4', color: '#9b59b6' }
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assignment: 'Algebra Test', grade: 'A+', score: 95, date: '2024-06-20', teacher: 'Mr. Smith' },
    { id: 2, subject: 'English', assignment: 'Essay Writing', grade: 'A', score: 88, date: '2024-06-18', teacher: 'Ms. Johnson' },
    { id: 3, subject: 'Science', assignment: 'Lab Report', grade: 'B+', score: 85, date: '2024-06-15', teacher: 'Dr. Wilson' },
    { id: 4, subject: 'History', assignment: 'Research Project', grade: 'A', score: 92, date: '2024-06-12', teacher: 'Mr. Davis' }
  ];

  const teachers = [
    { id: 1, name: 'Mr. John Smith', subject: 'Mathematics', email: 'j.smith@smarted.com', phone: '+1-555-0101', office: 'Room 101', image: '/teacher1.jpg' },
    { id: 2, name: 'Ms. Emily Johnson', subject: 'English Literature', email: 'e.johnson@smarted.com', phone: '+1-555-0102', office: 'Room 102', image: '/teacher2.jpg' },
    { id: 3, name: 'Dr. Michael Wilson', subject: 'Science', email: 'm.wilson@smarted.com', phone: '+1-555-0103', office: 'Room 103', image: '/teacher3.jpg' },
    { id: 4, name: 'Mr. Robert Davis', subject: 'History', email: 'r.davis@smarted.com', phone: '+1-555-0104', office: 'Room 104', image: '/teacher4.jpg' }
  ];

  const messages = [
    { 
      id: 1, 
      from: 'Mr. Smith', 
      subject: 'Excellent Progress in Math', 
      preview: 'Sarah has shown remarkable improvement...', 
      date: '2024-06-20', 
      priority: 'normal', 
      read: false,
      content: 'Dear Mr. and Mrs. Johnson, I wanted to reach out to commend Sarah on her excellent progress in mathematics this semester. She has consistently demonstrated a strong understanding of algebraic concepts and has improved her problem-solving skills significantly. Keep up the great work!'
    },
    { 
      id: 2, 
      from: 'Ms. Johnson', 
      subject: 'Parent-Teacher Conference', 
      preview: 'Schedule a meeting to discuss...', 
      date: '2024-06-18', 
      priority: 'high', 
      read: false,
      content: 'Hello, I would like to schedule a parent-teacher conference to discuss Sarah\'s creative writing development. She has great potential and I have some suggestions for nurturing her talent further. Please let me know your availability.'
    },
    { 
      id: 3, 
      from: 'Dr. Wilson', 
      subject: 'Science Fair Participation', 
      preview: 'Invitation to participate in...', 
      date: '2024-06-15', 
      priority: 'normal', 
      read: true,
      content: 'Dear Parents, Sarah has been selected to participate in the upcoming Science Fair due to her outstanding performance in our recent lab experiments. This is a great opportunity for her to showcase her scientific skills.'
    }
  ];

  const notifications = [
    { id: 1, title: 'New Grade Posted', message: 'Mathematics - Algebra Test: A+', time: '2 hours ago', type: 'success' },
    { id: 2, title: 'Message from Teacher', message: 'Ms. Johnson sent a message about Sarah', time: '5 hours ago', type: 'info' },
    { id: 3, title: 'Assignment Due', message: 'History Research Project due tomorrow', time: '1 day ago', type: 'warning' }
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'unread') return !message.read;
    if (messageFilter === 'priority') return message.priority === 'high';
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const openMessageDetail = (message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
  };

  const closeMessageDetail = () => {
    setSelectedMessage(null);
    setShowMessageDetail(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="parent-profile">
          <div className="profile-image">
            <img src="/parent-avatar.svg" alt="Parent" />
          </div>
          <h3>Parent Portal</h3>
          <p>Monitor your child's progress</p>
        </div>

        {/* Student Selector */}
        <div className="student-selector">
          <label>Select Student</label>
          <select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="student-select"
          >
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.grade}
              </option>
            ))}
          </select>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Academic Progress
          </button>
          <button 
            className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers
          </button>
          <button 
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h2>Welcome back, Parent!</h2>
            <p>Here's {currentStudent?.name}'s progress overview</p>
          </div>
          <div className="header-actions">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
              Notifications
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div 
              className="overview-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Overall GPA</h3>
                    <p className="stat-value">3.85</p>
                    <span className="stat-trend positive">+0.12</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-info">
                    <h3>Assignments</h3>
                    <p className="stat-value">15/18</p>
                    <span className="stat-trend">Completed</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Attendance</h3>
                    <p className="stat-value">96%</p>
                    <span className="stat-trend positive">Excellent</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <h3>Rank</h3>
                    <p className="stat-value">5th</p>
                    <span className="stat-trend">of 120</span>
                  </div>
                </div>
              </div>

              {/* Subject Performance Chart */}
              <div className="chart-container">
                <h3>Subject Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectsProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="grade" fill="#3498db" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Grades */}
              <div className="recent-grades">
                <h3>Recent Grades</h3>
                <div className="grades-list">
                  {recentGrades.slice(0, 4).map(grade => (
                    <div key={grade.id} className="grade-item">
                      <div className="grade-info">
                        <h4>{grade.subject}</h4>
                        <p>{grade.assignment}</p>
                        <span className="grade-teacher">by {grade.teacher}</span>
                      </div>
                      <div className="grade-result">
                        <span className={`grade-letter ${grade.grade.toLowerCase().replace('+', 'plus')}`}>
                          {grade.grade}
                        </span>
                        <span className="grade-score">{grade.score}%</span>
                        <span className="grade-date">{new Date(grade.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Academic Progress Tab */}
          {activeTab === 'progress' && (
            <motion.div 
              className="progress-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Academic Progress - {currentStudent?.name}</h3>
              
              <div className="progress-overview">
                <div className="progress-stats">
                  <div className="progress-stat">
                    <span className="stat-label">Current GPA</span>
                    <span className="stat-value">3.85</span>
                  </div>
                  <div className="progress-stat">
                    <span className="stat-label">Class Rank</span>
                    <span className="stat-value">5/120</span>
                  </div>
                  <div className="progress-stat">
                    <span className="stat-label">Improvement</span>
                    <span className="stat-value positive">+3.2%</span>
                  </div>
                </div>
              </div>

              <div className="subjects-detailed">
                {subjectsProgress.map((subject, index) => (
                  <div key={index} className="subject-card">
                    <div className="subject-header">
                      <h4>{subject.subject}</h4>
                      <span className={`trend ${subject.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                        {subject.trend}
                      </span>
                    </div>
                    <div className="subject-grade">
                      <span className="grade-value">{subject.grade}%</span>
                      <div className="grade-bar">
                        <div 
                          className="grade-fill" 
                          style={{ width: `${subject.grade}%`, backgroundColor: subject.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="all-grades">
                <h3>All Recent Grades</h3>
                <div className="grades-table">
                  <div className="table-header">
                    <span>Subject</span>
                    <span>Assignment</span>
                    <span>Grade</span>
                    <span>Score</span>
                    <span>Date</span>
                  </div>
                  {recentGrades.map(grade => (
                    <div key={grade.id} className="table-row">
                      <span className="subject-name">{grade.subject}</span>
                      <span className="assignment-name">{grade.assignment}</span>
                      <span className={`grade-letter ${grade.grade.toLowerCase().replace('+', 'plus')}`}>
                        {grade.grade}
                      </span>
                      <span className="grade-score">{grade.score}%</span>
                      <span className="grade-date">{new Date(grade.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Teachers Tab */}
          {activeTab === 'teachers' && (
            <motion.div 
              className="teachers-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="teachers-header">
                <h3>Teachers Directory</h3>
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="teacher-search"
                />
              </div>

              <div className="teachers-grid">
                {filteredTeachers.map(teacher => (
                  <div key={teacher.id} className="teacher-card">
                    <div className="teacher-avatar">
                      <img src={teacher.image} alt={teacher.name} />
                    </div>
                    <div className="teacher-info">
                      <h4>{teacher.name}</h4>
                      <p className="teacher-subject">{teacher.subject}</p>
                      <div className="teacher-contact">
                        <p className="contact-item">📧 {teacher.email}</p>
                        <p className="contact-item">📞 {teacher.phone}</p>
                        <p className="contact-item">🏢 {teacher.office}</p>
                      </div>
                    </div>
                    <div className="teacher-actions">
                      <button className="contact-btn">Send Message</button>
                      <button className="schedule-btn">Schedule Meeting</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div 
              className="messages-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="messages-header">
                <h3>Messages from Teachers</h3>
                <div className="message-filters">
                  <button 
                    className={`filter-btn ${messageFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setMessageFilter('all')}
                  >
                    All Messages
                  </button>
                  <button 
                    className={`filter-btn ${messageFilter === 'unread' ? 'active' : ''}`}
                    onClick={() => setMessageFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button 
                    className={`filter-btn ${messageFilter === 'priority' ? 'active' : ''}`}
                    onClick={() => setMessageFilter('priority')}
                  >
                    Priority
                  </button>
                </div>
              </div>

              <div className="messages-list">
                {filteredMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message-item ${!message.read ? 'unread' : ''} ${message.priority === 'high' ? 'priority' : ''}`}
                    onClick={() => openMessageDetail(message)}
                  >
                    <div className="message-from">
                      <span className="sender-name">{message.from}</span>
                      <span className="message-date">{new Date(message.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="message-subject">{message.subject}</h4>
                    <p className="message-preview">{message.preview}</p>
                    <div className="message-meta">
                      {message.priority === 'high' && <span className="priority-badge">Priority</span>}
                      {!message.read && <span className="unread-badge">New</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Notification Panel */}
      <div className={`notification-panel ${showNotifications ? 'open' : ''}`}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button 
            className="close-notifications"
            onClick={() => setShowNotifications(false)}
          >
            ×
          </button>
        </div>
        <div className="notification-list">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {showNotifications && (
        <div 
          className="notification-overlay"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Message Detail Modal */}
      {showMessageDetail && selectedMessage && (
        <div className="message-detail-modal">
          <div className="message-detail-overlay" onClick={closeMessageDetail} />
          <div className="message-detail-content">
            <div className="message-detail-header">
              <div className="message-detail-title">
                <h2>{selectedMessage.subject}</h2>
                <span className="message-from">From: {selectedMessage.from}</span>
              </div>
              <button className="close-message-detail" onClick={closeMessageDetail}>
                ×
              </button>
            </div>
            <div className="message-detail-body">
              <div className="message-meta">
                <span className="message-date">{new Date(selectedMessage.date).toLocaleDateString()}</span>
                {selectedMessage.priority === 'high' && (
                  <span className="priority-badge">Priority</span>
                )}
              </div>
              <div className="message-content">
                <p>{selectedMessage.content}</p>
              </div>
            </div>
            <div className="message-detail-footer">
              <button className="reply-btn">Reply</button>
              <button className="mark-read-btn">Mark as Read</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
