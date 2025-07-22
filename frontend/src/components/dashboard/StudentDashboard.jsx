import { useState } from 'react'
import Overview from './Overview'
import ExamMarks from './ExamMarks'
import Calculator from './Calculator'
import NotesAndTodos from './NotesAndTodos'
import Messages from './Messages'
import Assignments from './Assignments'
import '../../styles/Dashboard.css'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />
      case 'examMarks':
        return <ExamMarks />
      case 'calculator':
        return <Calculator />
      case 'notesAndTodos':
        return <NotesAndTodos />
      case 'messages':
        return <Messages />
      case 'assignments':
        return <Assignments />
      default:
        return <Overview />
    }
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Student Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'examMarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('examMarks')}
          >
            Exam Marks Analysis
          </button>
          <button
            className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            Calculator
          </button>
          <button
            className={`nav-item ${activeTab === 'notesAndTodos' ? 'active' : ''}`}
            onClick={() => setActiveTab('notesAndTodos')}
          >
            Notes & To-Do List
          </button>
          <button
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
        </nav>
      </aside>
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default StudentDashboard
