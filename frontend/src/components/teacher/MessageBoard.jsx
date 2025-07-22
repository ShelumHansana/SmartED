import { useState } from 'react'

const MessageBoard = () => {
  const [selectedClass, setSelectedClass] = useState('class-1')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      class: 'class-1',
      content: 'Remember to submit your mathematics homework by Friday!',
      date: '2025-07-21'
    },
    {
      id: 2,
      class: 'class-2',
      content: 'Quiz on Algebra next Monday. Be prepared!',
      date: '2025-07-20'
    }
  ])

  const classes = [
    { id: 'class-1', name: 'Class 10-A' },
    { id: 'class-2', name: 'Class 10-B' },
    { id: 'class-3', name: 'Class 11-A' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      setMessages([
        {
          id: messages.length + 1,
          class: selectedClass,
          content: message,
          date: new Date().toISOString().split('T')[0]
        },
        ...messages
      ])
      setMessage('')
    }
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
        {messages.map(msg => (
          <div key={msg.id} className="message-card">
            <div className="message-header">
              <span className="class-tag">
                {classes.find(cls => cls.id === msg.class)?.name}
              </span>
              <span className="message-date">{msg.date}</span>
            </div>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessageBoard
