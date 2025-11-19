import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const MessageBoard = ({ showToast }) => {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  // Get teacher's classes dynamically
  const teacherClasses = user?.classes || []
  const classes = teacherClasses.map((cls, index) => ({
    id: `class-${index}`,
    value: cls,
    name: cls
  }))

  // Set default selected class
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].value)
    }
  }, [classes])

  // Fetch messages when class changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedClass || !user?.id) return

      try {
        const messagesQuery = query(
          collection(db, 'messages'),
          where('class', '==', selectedClass),
          where('teacherId', '==', user.id)
        )
        const messagesSnapshot = await getDocs(messagesQuery)
        const messagesData = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          timestamp: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().getTime() : 0
        }))
        // Sort client-side by timestamp descending
        messagesData.sort((a, b) => b.timestamp - a.timestamp)
        setMessages(messagesData)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [selectedClass, user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (message.trim() && selectedClass && user?.id) {
      setLoading(true)
      try {
        // Parse the selected class format (e.g., "10-D" -> grade: 10, className: D)
        let grade, className
        if (selectedClass.includes('-')) {
          [grade, className] = selectedClass.split('-')
        } else {
          className = selectedClass
          grade = null
        }

        // Get all students in the selected class
        let studentsQuery
        if (grade && className) {
          studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('studentData.grade', '==', grade),
            where('studentData.className', '==', className)
          )
        } else {
          studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('studentData.className', '==', className)
          )
        }
        
        const studentsSnapshot = await getDocs(studentsQuery)
        const studentIds = studentsSnapshot.docs.map(doc => doc.id)

        console.log(`Found ${studentIds.length} students in class ${selectedClass}`)

        // Save message to Firestore
        const messageData = {
          class: selectedClass,
          content: message,
          teacherId: user.id,
          teacherName: user.fullName || user.name || 'Teacher',
          subject: user.subjects?.[0] || 'General',
          createdAt: serverTimestamp(),
          studentIds: studentIds
        }
        
        const messageDoc = await addDoc(collection(db, 'messages'), messageData)

        // Create notification for each student in the class
        const notificationPromises = studentIds.map(studentId => {
          return addDoc(collection(db, 'notifications'), {
            recipientId: studentId,
            type: 'message',
            title: `New Message from ${user.fullName || user.name || 'Teacher'}`,
            message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
            class: selectedClass,
            subject: user.subjects?.[0] || 'General',
            teacherId: user.id,
            teacherName: user.fullName || user.name || 'Teacher',
            read: false,
            createdAt: serverTimestamp(),
            messageId: messageDoc.id
          })
        })

        await Promise.all(notificationPromises)

        console.log(`✅ Created ${notificationPromises.length} notifications for message`)
        console.log('Notification details:', {
          type: 'message',
          recipientCount: studentIds.length,
          class: selectedClass,
          subject: user.subjects?.[0] || 'General',
          teacherName: user.fullName || user.name || 'Teacher'
        })

        // Refresh messages list
        const updatedMessagesQuery = query(
          collection(db, 'messages'),
          where('class', '==', selectedClass),
          where('teacherId', '==', user.id)
        )
        const updatedMessagesSnapshot = await getDocs(updatedMessagesQuery)
        const updatedMessagesData = updatedMessagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          timestamp: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().getTime() : 0
        }))
        // Sort client-side by timestamp descending
        updatedMessagesData.sort((a, b) => b.timestamp - a.timestamp)
        setMessages(updatedMessagesData)

        setMessage('')
        if (showToast) {
          showToast(`Message sent to ${studentIds.length} students successfully!`, 'success')
        }
      } catch (error) {
        console.error('Error posting message:', error)
        if (showToast) {
          showToast('Failed to send message. Please try again.', 'error')
        }
      } finally {
        setLoading(false)
      }
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
              <option key={cls.id} value={cls.value}>
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
            disabled={loading}
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post Message'}
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
                  {msg.class}
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
