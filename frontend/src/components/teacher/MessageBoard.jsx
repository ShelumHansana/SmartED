import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const MessageBoard = () => {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  // Get teacher's classes dynamically
  const teacherClasses = user?.classes || []
  const classes = teacherClasses.map((cls, index) => ({
    id: `class-${index}`,
    value: cls,
    name: cls
  }))

  // Set default selected class
  useState(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id)
    }
  }, [classes])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && selectedClass) {
      const selectedClassName = classes.find(cls => cls.id === selectedClass)?.name || selectedClass
      setMessages([
        {
          id: messages.length + 1,
          class: selectedClass,
          className: selectedClassName,
          content: message,
          date: new Date().toISOString().split('T')[0]
        },
        ...messages
      ])
      setMessage('')
    }
  }

  if (!user || !user.classes || user.classes.length === 0) {
    return (
      <div className="message-board">
        <div className="no-classes-message">
          <h3>No Classes Assigned</h3>
          <p>You don't have any classes assigned yet. Please contact the administrator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="message-board">
      <div className="message-form">
        <h3>Post New Message</h3>
        <div className="class-selector">
          <label>Select Class:</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.length === 0 && <option value="">No classes assigned</option>}
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
          />
          <button type="submit" className="submit-btn">
            Post Message
          </button>
        </form>
      </div>

      <div className="message-list">
        <h3>Previous Messages</h3>
        {messages.length === 0 ? (
          <p className="no-messages">No messages posted yet. Post your first message above!</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <span className="class-tag">
                  {msg.className}
                </span>
                <span className="message-date">{msg.date}</span>
              </div>
              <p className="message-content">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MessageBoard
