import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, or } from 'firebase/firestore'
import { db } from '../utils/firebase'

export const useMessages = (userId, userRole) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    // Query messages where user is sender or recipient
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(msg => 
          msg.senderId === userId || 
          msg.recipientId === userId || 
          msg.recipientId === null // Broadcast messages
        )

      setMessages(messagesData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching messages:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const sendMessage = async (messageData) => {
    try {
      await addDoc(collection(db, 'messages'), {
        ...messageData,
        senderId: userId,
        createdAt: serverTimestamp(),
        read: false
      })
      return { success: true }
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, error }
    }
  }

  return {
    messages,
    loading,
    sendMessage
  }
}
