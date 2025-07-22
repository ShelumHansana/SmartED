import { useState } from 'react'

const Messages = () => {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const subjects = [
    { id: 'math', name: 'Mathematics', teacher: 'Mr. Smith' },
    { id: 'science', name: 'Science', teacher: 'Mrs. Johnson' },
    { id: 'english', name: 'English', teacher: 'Ms. Williams' },
    { id: 'history', name: 'History', teacher: 'Mr. Brown' }
  ]

  const sendMessage = (e) => {
    e.preventDefault()
    if (selectedSubject && message) {
      const newMessage = {
        id: Date.now(),
        subject: selectedSubject,
        content: message,
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages([newMessage, ...messages])
      setMessage('')
    }
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>Messages</h2>
        <form onSubmit={sendMessage} className="message-form">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} - {subject.teacher}
              </option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="messages-history">
        <h3>Message History</h3>
        <div className="messages-list">
          {messages.map(msg => {
            const subject = subjects.find(s => s.id === msg.subject)
            return (
              <div key={msg.id} className="message-card">
                <div className="message-header">
                  <span className="subject">{subject?.name}</span>
                  <span className="teacher">{subject?.teacher}</span>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="message-content">{msg.content}</p>
                <span className={`status ${msg.status}`}>{msg.status}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Messages
