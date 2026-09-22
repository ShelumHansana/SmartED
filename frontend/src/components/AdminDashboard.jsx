import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, createFirebaseUserWithoutLoggingOut } from '../utils/firebase'
import ProfileAvatarUploader from './ProfileAvatarUploader'
import { BarChart3, Users, BookOpen, TrendingUp, Settings, X, Menu, Bell, LogOut, Zap, ClipboardList, UserPlus, Search, Plus, User, Edit2, Trash2, RotateCw, GraduationCap, Eye, EyeOff, Save, Download, FileText, Calendar, CreditCard, Check, CheckCircle2, AlertTriangle, Info, Copy } from 'lucide-react'
import '../styles/Dashboard.css'
import '../styles/AdminDashboard.css'

// Credentials generation utilities
const generateIndexNumber = (role = 'student') => {
  const prefixMap = {
    student: 'ST',
    teacher: 'TC',
    parent: 'PR',
    admin: 'AD'
  }
  const prefix = prefixMap[role] || 'ST'
  const year = new Date().getFullYear().toString().slice(-2)
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${year}${randomNum}`
}

const generateNameWithInitials = (fullName = '') => {
  if (!fullName || !fullName.trim()) return ''
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0]
  const lastName = parts[parts.length - 1]
  const initials = parts.slice(0, parts.length - 1).map(p => p[0].toUpperCase() + '.').join(' ')
  return `${initials} ${lastName}`
}

const generateUsername = (fullName = '', nameWithInitials = '', indexNumber = '') => {
  if (nameWithInitials && nameWithInitials.trim()) {
    const cleaned = nameWithInitials
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
    if (cleaned.length >= 3) {
      return cleaned
    }
  }
  if (fullName && fullName.trim()) {
    const cleaned = fullName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .slice(0, 2)
      .join('.')
    if (cleaned.length >= 3) {
      return cleaned
    }
  }
  return indexNumber ? indexNumber.toLowerCase() : `user${Math.floor(1000 + Math.random() * 9000)}`
}

const generatePassword = () => {
  const chars = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  let randomDigits = ''
  for (let i = 0; i < 4; i++) {
    randomDigits += digits.charAt(Math.floor(Math.random() * digits.length))
  }
  let randomChars = ''
  for (let i = 0; i < 2; i++) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `Smart@${randomDigits}${randomChars}`
}

const PRESET_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Sinhala',
  'Tamil',
  'History',
  'Commerce',
  'Information Technology (ICT)',
  'Health & Physical Education',
  'Geography',
  'Art',
  'Music',
  'Dancing',
  'Civic Education',
  'Buddhism',
  'Christianity',
  'Islam'
]

const PRESET_GRADES = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13']
const PRESET_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F']

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())
  const [loading, setLoading] = useState(true)
  
  // User Management States
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userFilter, setUserFilter] = useState('All')
  const [userSearchQuery, setUserSearchQuery] = useState('')

  // Generated Credentials States
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState(null)
  const [copiedCredentials, setCopiedCredentials] = useState(false)
  const [formRole, setFormRole] = useState('student')
  const [formIndexNumber, setFormIndexNumber] = useState('')
  const [formUsername, setFormUsername] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formFullName, setFormFullName] = useState('')
  const [formNameWithInitials, setFormNameWithInitials] = useState('')
  const [studentGrade, setStudentGrade] = useState('Grade 10')
  const [studentClass, setStudentClass] = useState('A')

  // Teacher Registration / Edit Options
  const [teacherSubjects, setTeacherSubjects] = useState([])
  const [customSubjectInput, setCustomSubjectInput] = useState('')
  const [teacherClassAssignments, setTeacherClassAssignments] = useState([])
  const [assignGrade, setAssignGrade] = useState('Grade 10')
  const [assignSection, setAssignSection] = useState('A')
  const [assignSubject, setAssignSubject] = useState('')
  const [teacherInChargeClass, setTeacherInChargeClass] = useState('')

  const openAddUserModal = () => {
    setSelectedUser(null)
    const initialRole = 'student'
    const index = generateIndexNumber(initialRole)
    const pass = generatePassword()
    setFormRole(initialRole)
    setFormIndexNumber(index)
    setFormUsername(index.toLowerCase())
    setFormPassword(pass)
    setShowPassword(false)
    setFormFullName('')
    setFormNameWithInitials('')
    setStudentGrade('Grade 10')
    setStudentClass('A')
    setTeacherSubjects([])
    setCustomSubjectInput('')
    setTeacherClassAssignments([])
    setAssignGrade('Grade 10')
    setAssignSection('A')
    setAssignSubject('')
    setTeacherInChargeClass('')
    setShowUserModal(true)
  }
  
  // Course Management States
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [courseLevel, setCourseLevel] = useState('O/L')
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Settings States
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'Richmond College',
    address: 'Galle, Sri Lanka',
    phone: '+94 11 269 1731',
    email: 'admin@richmondcollege.lk',
    academicYear: '2025',
    terms: 3,
    gradingSystem: 'A/B/C/S/W',
    languages: ['English', 'Sinhala', 'Tamil']
  })

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    activeUsers: 0
  })

  const [recentActivities, _setRecentActivities] = useState([])
  const [notifications, setNotifications] = useState([])

  // Toast Notification States
  const [toasts, setToasts] = useState([])

  // Confirmation Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger' // danger, warning, info
  })

  // Function to show confirmation modal
  const showConfirm = (config) => {
    setConfirmConfig({
      title: config.title || 'Confirm Action',
      message: config.message || 'Are you sure?',
      onConfirm: config.onConfirm,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      type: config.type || 'danger'
    })
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    if (confirmConfig.onConfirm) {
      confirmConfig.onConfirm()
    }
    setShowConfirmModal(false)
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
  }

  // Function to show toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }

  // Function to reload all data from Firestore
  const reloadAllData = async () => {
    if (!user || !user.id) return

    try {
      console.log('Reloading all admin data...')

      // Load all users
      const usersQuery = query(collection(db, 'users'))
      const usersSnapshot = await getDocs(usersQuery)
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().fullName || doc.data().name,
        nameWithInitials: doc.data().nameWithInitials || doc.data().studentData?.nameWithInitials || '',
        joinDate: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toISOString().split('T')[0] : 'N/A'
      }))
      setUsers(usersData)

      // Calculate statistics
      const studentCount = usersData.filter(u => u.role === 'student').length
      const teacherCount = usersData.filter(u => u.role === 'teacher').length
      const activeCount = usersData.filter(u => u.status === 'Active' || !u.status).length

      // Load courses
      const coursesQuery = query(collection(db, 'courses'))
      const coursesSnapshot = await getDocs(coursesQuery)
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCourses(coursesData)

      setStats({
        totalStudents: studentCount,
        totalTeachers: teacherCount,
        totalCourses: coursesData.length,
        activeUsers: activeCount
      })

      console.log('Data reloaded successfully!')
    } catch (error) {
      console.error('Error reloading data:', error)
    }
  }

  // Load all admin data from Firestore
  useEffect(() => {
    const loadAdminData = async () => {
      if (!user || !user.id) return

      try {
        setLoading(true)

        // Load all users
        const usersQuery = query(collection(db, 'users'))
        const usersSnapshot = await getDocs(usersQuery)
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          name: doc.data().fullName || doc.data().name,
          nameWithInitials: doc.data().nameWithInitials || doc.data().studentData?.nameWithInitials || '',
          joinDate: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toISOString().split('T')[0] : 'N/A'
        }))
        setUsers(usersData)

        // Calculate statistics
        const studentCount = usersData.filter(u => u.role === 'student').length
        const teacherCount = usersData.filter(u => u.role === 'teacher').length
        const activeCount = usersData.filter(u => u.status === 'Active' || !u.status).length

        // Load courses
        const coursesQuery = query(collection(db, 'courses'))
        const coursesSnapshot = await getDocs(coursesQuery)
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCourses(coursesData)

        setStats({
          totalStudents: studentCount,
          totalTeachers: teacherCount,
          totalCourses: coursesData.length,
          activeUsers: activeCount
        })

        // Load notifications
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.id)
        )
        const notificationsSnapshot = await getDocs(notificationsQuery)
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          time: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleString() : 'Recently'
        }))
        setNotifications(notificationsData)
        setNotificationCount(notificationsData.filter(n => !n.read).length)

        // Load school settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'school'))
        if (settingsDoc.exists()) {
          setSchoolSettings(settingsDoc.data())
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading admin data:', error)
        setLoading(false)
      }
    }

    loadAdminData()
  }, [user])

  const markAllAsRead = () => {
    setNotificationCount(0)
    setShowNotifications(false)
  }

  const openMessageDetail = (notification) => {
    setSelectedMessage(notification)
    setShowMessageDetail(true)
  }

  const closeMessageDetail = () => {
    setSelectedMessage(null)
    setShowMessageDetail(false)
  }

  const markSingleAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      })
      setReadNotifications(prev => new Set(prev).add(notificationId))
      setNotificationCount(prev => Math.max(0, prev - 1))
      closeMessageDetail()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Teacher Management Helper Functions
  const handleAddTeacherSubject = (subj) => {
    const trimmed = (subj || '').trim()
    if (!trimmed) return
    if (!teacherSubjects.includes(trimmed)) {
      const updated = [...teacherSubjects, trimmed]
      setTeacherSubjects(updated)
      if (!assignSubject) {
        setAssignSubject(trimmed)
      }
    }
    setCustomSubjectInput('')
  }

  const handleRemoveTeacherSubject = (subjToRemove) => {
    const updated = teacherSubjects.filter(s => s !== subjToRemove)
    setTeacherSubjects(updated)
    if (assignSubject === subjToRemove) {
      setAssignSubject(updated[0] || '')
    }
  }

  const handleAddClassAssignment = () => {
    if (!assignGrade || !assignSection) {
      showToast('Please select grade and section.', 'error')
      return
    }
    const gradeNum = assignGrade.replace('Grade ', '').trim()
    const classId = `${gradeNum}-${assignSection}`
    const subject = assignSubject || teacherSubjects[0] || 'General'

    const exists = teacherClassAssignments.some(
      a => a.classId === classId && a.subject.toLowerCase() === subject.toLowerCase()
    )
    if (exists) {
      showToast(`${classId} (${subject}) is already assigned.`, 'error')
      return
    }

    const newAssignment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      grade: assignGrade,
      section: assignSection,
      classId: classId,
      subject: subject
    }

    setTeacherClassAssignments([...teacherClassAssignments, newAssignment])
  }

  const handleRemoveClassAssignment = (assignmentId) => {
    setTeacherClassAssignments(teacherClassAssignments.filter(a => a.id !== assignmentId))
  }

  const openEditUserModal = (userToEdit) => {
    setSelectedUser(userToEdit)
    const role = userToEdit.role || 'student'
    setFormRole(role)
    setFormIndexNumber(userToEdit.indexNumber || userToEdit.studentData?.indexNumber || '')
    setFormUsername(userToEdit.username || '')
    setFormPassword(userToEdit.initialPassword || '')
    setShowPassword(false)
    setFormFullName(userToEdit.fullName || userToEdit.name || '')
    setFormNameWithInitials(userToEdit.nameWithInitials || userToEdit.studentData?.nameWithInitials || '')

    const rawGrade = userToEdit.studentData?.gradeName || (userToEdit.studentData?.grade ? `Grade ${userToEdit.studentData.grade}` : '') || (userToEdit.grade ? (userToEdit.grade.startsWith('Grade') ? userToEdit.grade : `Grade ${userToEdit.grade}`) : 'Grade 10')
    setStudentGrade(PRESET_GRADES.includes(rawGrade) ? rawGrade : 'Grade 10')

    const rawClass = userToEdit.studentData?.className || userToEdit.className || (userToEdit.studentData?.class ? userToEdit.studentData.class.split('-').pop() : '') || (userToEdit.class ? userToEdit.class.split('-').pop() : 'A')
    setStudentClass(PRESET_SECTIONS.includes(rawClass) ? rawClass : 'A')

    if (role === 'teacher') {
      const existingSubjects = Array.isArray(userToEdit.subjects) && userToEdit.subjects.length > 0
        ? [...userToEdit.subjects]
        : Array.isArray(userToEdit.teacherData?.subjects) && userToEdit.teacherData.subjects.length > 0
          ? [...userToEdit.teacherData.subjects]
          : (userToEdit.subject || userToEdit.teacherData?.subject)
            ? [(userToEdit.subject || userToEdit.teacherData?.subject)]
            : []
      setTeacherSubjects(existingSubjects)
      setCustomSubjectInput('')

      let existingAssignments = []
      if (Array.isArray(userToEdit.classAssignments) && userToEdit.classAssignments.length > 0) {
        existingAssignments = [...userToEdit.classAssignments]
      } else if (Array.isArray(userToEdit.teacherData?.classAssignments) && userToEdit.teacherData.classAssignments.length > 0) {
        existingAssignments = [...userToEdit.teacherData.classAssignments]
      } else if (Array.isArray(userToEdit.classes) && userToEdit.classes.length > 0) {
        const primarySub = existingSubjects[0] || userToEdit.subject || userToEdit.teacherData?.subject || 'General'
        existingAssignments = userToEdit.classes.map((cls, idx) => {
          const parts = cls.split('-')
          const gradeNum = parts[0] ? `Grade ${parts[0]}` : 'Grade 10'
          const section = parts[1] || 'A'
          return {
            id: `legacy-${idx}-${cls}`,
            grade: gradeNum,
            section: section,
            classId: cls,
            subject: primarySub
          }
        })
      }
      setTeacherClassAssignments(existingAssignments)
      setAssignGrade('Grade 10')
      setAssignSection('A')
      setAssignSubject(existingSubjects[0] || '')

      const inCharge = userToEdit.inChargeClass || userToEdit.teacherData?.inChargeClass || ''
      setTeacherInChargeClass(inCharge)
    } else {
      setTeacherSubjects([])
      setCustomSubjectInput('')
      setTeacherClassAssignments([])
      setAssignGrade('Grade 10')
      setAssignSection('A')
      setAssignSubject('')
      setTeacherInChargeClass('')
    }

    setShowUserModal(true)
  }

  // ===== ACTION BUTTON HANDLERS =====

  // User Management Actions
  const handleAddUser = async (userData) => {
    try {
      console.log('Adding user with data:', userData)
      
      const username = (userData.username || formUsername || '').trim().toLowerCase()
      const indexNumber = (userData.indexNumber || formIndexNumber || '').trim().toUpperCase()
      const password = (userData.password || formPassword || '').trim()
      const email = (userData.email || '').trim() || `${username}@smarted.school`
      const role = userData.role || formRole || 'student'
      const fullName = (userData.fullName || formFullName || userData.name || 'New User').trim()
      const nameWithInitials = (userData.nameWithInitials || formNameWithInitials || '').trim()

      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error')
        return
      }

      // 1. Create Firebase Auth user without logging out the Admin
      let authUser
      try {
        authUser = await createFirebaseUserWithoutLoggingOut(email, password)
      } catch (authErr) {
        console.error('Firebase Auth creation failed:', authErr)
        let msg = authErr.message
        if (authErr.code === 'auth/email-already-in-use') {
          msg = 'This email address is already in use. Please use a unique email or let system generate one.'
        }
        showToast(`Registration error: ${msg}`, 'error')
        return
      }

      const uid = authUser.uid

      // 2. Prepare user record for Firestore
      const newUser = {
        fullName: fullName,
        nameWithInitials: nameWithInitials,
        email: email,
        username: username,
        indexNumber: indexNumber,
        role: role,
        status: userData.status || 'Active',
        initialPassword: password,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // Add role-specific data
      if (role === 'student') {
        const gradeStr = userData.grade || studentGrade || 'Grade 10'
        const gradeNum = gradeStr.replace('Grade ', '').trim()
        const classSection = userData.className || studentClass || 'A'
        const fullClassId = `${gradeNum}-${classSection}`

        newUser.studentData = { 
          indexNumber: indexNumber,
          admissionNo: indexNumber,
          fullName: fullName,
          nameWithInitials: nameWithInitials,
          grade: gradeNum,
          gradeName: gradeStr,
          className: classSection,
          class: fullClassId,
          classId: fullClassId
        }
        newUser.grade = gradeNum
        newUser.gradeName = gradeStr
        newUser.className = classSection
        newUser.class = fullClassId
      } else if (role === 'teacher') {
        const uniqueClasses = Array.from(new Set(teacherClassAssignments.map(a => a.classId)))
        const primarySubject = teacherSubjects[0] || userData.subject || ''
        const subjectsList = teacherSubjects.length > 0 ? teacherSubjects : (primarySubject ? [primarySubject] : [])

        newUser.teacherData = { 
          employeeId: indexNumber,
          subject: primarySubject,
          subjects: subjectsList,
          classes: uniqueClasses,
          teachingClasses: uniqueClasses,
          classAssignments: teacherClassAssignments,
          inChargeClass: teacherInChargeClass || null,
          isInCharge: !!teacherInChargeClass
        }
        // Mirror top-level for backward compatibility with queries & dashboards
        newUser.subject = primarySubject
        newUser.subjects = subjectsList
        newUser.classes = uniqueClasses
        newUser.inChargeClass = teacherInChargeClass || null
      } else if (role === 'parent') {
        newUser.parentData = { 
          contactNumber: userData.phone || ''
        }
      }
      if (userData.phone) newUser.phone = userData.phone
      
      console.log('Saving new user data to Firestore:', newUser)
      
      await setDoc(doc(db, 'users', uid), newUser)
      
      // Reload all data to ensure consistency
      await reloadAllData()
      
      setShowUserModal(false)
      setSelectedUser(null)

      // Open credentials modal for the Admin
      setCreatedCredentials({
        fullName: fullName,
        nameWithInitials: nameWithInitials,
        grade: role === 'student' ? (userData.grade || studentGrade || 'Grade 10') : '',
        className: role === 'student' ? (userData.className || studentClass || 'A') : '',
        classId: role === 'student' ? `${(userData.grade || studentGrade || '10').replace('Grade ', '').trim()}-${userData.className || studentClass || 'A'}` : '',
        role: role,
        indexNumber: indexNumber,
        username: username,
        password: password,
        email: email
      })
      setShowCredentialsModal(true)
      showToast('User created successfully! Credentials generated.', 'success')
    } catch (error) {
      console.error('Error adding user:', error)
      showToast('Error adding user: ' + error.message, 'error')
    }
  }

  const handleUpdateUser = async (userData) => {
    try {
      console.log('Updating user with data:', userData)
      console.log('Selected user ID:', selectedUser.id)
      
      const effectiveRole = userData.role || selectedUser?.role

      // Prepare update data with proper field mapping
      const updateData = {
        fullName: userData.fullName || userData.name,
        nameWithInitials: userData.nameWithInitials || formNameWithInitials || '',
        email: userData.email,
        role: userData.role,
        status: userData.status,
        updatedAt: serverTimestamp()
      }
      
      // Add role-specific data if needed
      if (effectiveRole === 'student') {
        const gradeStr = userData.grade || studentGrade || 'Grade 10'
        const gradeNum = gradeStr.replace('Grade ', '').trim()
        const classSection = userData.className || studentClass || 'A'
        const fullClassId = `${gradeNum}-${classSection}`

        updateData.studentData = { 
          ...(selectedUser?.studentData || {}),
          fullName: userData.fullName || userData.name,
          nameWithInitials: userData.nameWithInitials || formNameWithInitials || '',
          grade: gradeNum,
          gradeName: gradeStr,
          className: classSection,
          class: fullClassId,
          classId: fullClassId
        }
        updateData.grade = gradeNum
        updateData.gradeName = gradeStr
        updateData.className = classSection
        updateData.class = fullClassId
      }
      
      if (effectiveRole === 'teacher') {
        const uniqueClasses = Array.from(new Set(teacherClassAssignments.map(a => a.classId)))
        const primarySubject = teacherSubjects[0] || userData.subject || selectedUser?.subject || selectedUser?.teacherData?.subject || ''
        const subjectsList = teacherSubjects.length > 0 ? teacherSubjects : (primarySubject ? [primarySubject] : [])

        updateData.teacherData = {
          ...(selectedUser?.teacherData || {}),
          employeeId: selectedUser?.indexNumber || selectedUser?.teacherData?.employeeId || '',
          subject: primarySubject,
          subjects: subjectsList,
          classes: uniqueClasses,
          teachingClasses: uniqueClasses,
          classAssignments: teacherClassAssignments,
          inChargeClass: teacherInChargeClass || null,
          isInCharge: !!teacherInChargeClass
        }
        updateData.subject = primarySubject
        updateData.subjects = subjectsList
        updateData.classes = uniqueClasses
        updateData.inChargeClass = teacherInChargeClass || null
      } else if (userData.subject) {
        updateData.teacherData = { ...(selectedUser?.teacherData || {}), subject: userData.subject }
        updateData.subject = userData.subject
      }
      if (userData.phone) updateData.phone = userData.phone
      
      console.log('Final update data:', updateData)
      
      await updateDoc(doc(db, 'users', selectedUser.id), updateData)
      
      // Reload all data to ensure consistency
      await reloadAllData()
      
      setShowUserModal(false)
      setSelectedUser(null)
      showToast('User updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating user:', error)
      showToast('Error updating user: ' + error.message, 'error')
    }
  }

  const handleDeleteUser = async (userId) => {
    showConfirm({
      title: 'Delete User',
      message: 'Are you sure you want to permanently delete this user? This action cannot be undone and will remove all user data.',
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          console.log('Deleting user with ID:', userId)
          
          // Permanently delete the user document from Firestore
          await deleteDoc(doc(db, 'users', userId))
          
          // Reload all data to ensure consistency
          await reloadAllData()
          
          showToast('User deleted successfully!', 'success')
        } catch (error) {
          console.error('Error deleting user:', error)
          showToast('Error deleting user: ' + error.message, 'error')
        }
      }
    })
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        throw new Error('User not found')
      }
      const currentStatus = userSnap.data().status
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      await reloadAllData()
      showToast(`User status updated to ${newStatus}!`, 'success')
    } catch (error) {
      console.error('Error toggling user status:', error)
      showToast('Error updating user status: ' + error.message, 'error')
    }
  }

  // Course Management Actions
  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = {
        ...courseData,
        students: 0,
        status: 'Active',
        createdAt: serverTimestamp()
      }
      await addDoc(collection(db, 'courses'), newCourse)
      
      // Reload all data to ensure consistency
      await reloadAllData()
      
      setShowCourseModal(false)
      setSelectedCourse(null)
      setCourseLevel('O/L')
      showToast('Course added successfully!', 'success')
    } catch (error) {
      console.error('Error adding course:', error)
      showToast('Error adding course: ' + error.message, 'error')
    }
  }

  const handleUpdateCourse = async (courseData) => {
    try {
      console.log('Updating course with data:', courseData)
      console.log('Selected course ID:', selectedCourse.id)
      
      const updateData = {
        name: courseData.name,
        level: courseData.level,
        teacher: courseData.teacher,
        status: courseData.status,
        updatedAt: serverTimestamp()
      }
      
      // Add stream if it's A/L
      if (courseData.stream) {
        updateData.stream = courseData.stream
      }
      
      console.log('Final course update data:', updateData)
      
      await updateDoc(doc(db, 'courses', selectedCourse.id), updateData)
      
      // Reload all data to ensure consistency
      await reloadAllData()
      
      setShowCourseModal(false)
      setSelectedCourse(null)
      setCourseLevel('O/L')
      showToast('Course updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating course:', error)
      showToast('Error updating course: ' + error.message, 'error')
    }
  }

  const handleDeleteCourse = async (courseId) => {
    showConfirm({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course? This will affect all enrolled students.',
      confirmText: 'Delete Course',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'courses', courseId))
          
          // Reload all data to ensure consistency
          await reloadAllData()
          
          showToast('Course deleted successfully!', 'success')
        } catch (error) {
          console.error('Error deleting course:', error)
          showToast('Error deleting course: ' + error.message, 'error')
        }
      }
    })
  }

  const handleViewCourse = (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
    console.log('Viewing course:', course)
  }

  const handleEditCourse = (course) => {
    setSelectedCourse(course)
    setCourseLevel(course.level || 'O/L')
    setShowCourseModal(true)
    console.log('Editing course:', course)
  }

  // Settings Actions
  const handleSaveSettings = async () => {
    try {
      await updateDoc(doc(db, 'settings', 'school'), schoolSettings)
      showToast('Settings saved successfully!', 'success')
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast('Error saving settings: ' + error.message, 'error')
    }
  }

  const handleResetSettings = async () => {
    showConfirm({
      title: 'Reset Settings',
      message: 'Are you sure you want to reset all settings to defaults? This will overwrite your current configuration.',
      confirmText: 'Reset to Defaults',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {
        const defaultSettings = {
          schoolName: 'Richmond College',
          address: 'Galle, Sri Lanka',
          phone: '+94 11 269 1731',
          email: 'admin@richmondcollege.lk',
          academicYear: '2025',
          terms: 3,
          gradingSystem: 'A/B/C/S/W',
          languages: ['English', 'Sinhala', 'Tamil']
        }
        
        try {
          await updateDoc(doc(db, 'settings', 'school'), defaultSettings)
          setSchoolSettings(defaultSettings)
          showToast('Settings reset to defaults!', 'success')
        } catch (error) {
          console.error('Error resetting settings:', error)
          showToast('Error resetting settings: ' + error.message, 'error')
        }
      }
    })
  }

  const handleCreateBackup = () => {
    // Simulate backup creation
    const backupData = {
      users,
      courses,
      settings: schoolSettings,
      stats,
      timestamp: new Date().toISOString()
    }
    console.log('Backup created:', backupData)
    
    // In a real app, this would trigger a download or send to server
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `smarted-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    showToast('Backup created and downloaded successfully!', 'success')
  }

  // Report Generation Actions
  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType)
    
    let reportData = {
      title: reportType,
      generatedAt: new Date().toISOString(),
      generatedBy: user?.fullName || 'Admin',
      school: schoolSettings.schoolName,
      academicYear: schoolSettings.academicYear,
    }

    // Generate specific report data based on type
    switch (reportType) {
      case 'Student Performance Report':
        reportData.summary = {
          totalStudents: stats.totalStudents,
          activeStudents: users.filter(u => u.role === 'student' && u.status === 'Active').length,
          byGrade: users
            .filter(u => u.role === 'student')
            .reduce((acc, student) => {
              const grade = student.grade || student.className || 'Unassigned'
              acc[grade] = (acc[grade] || 0) + 1
              return acc
            }, {})
        }
        reportData.students = users
          .filter(u => u.role === 'student')
          .map(s => ({
            name: s.name,
            email: s.email,
            grade: s.grade || s.className || 'N/A',
            status: s.status || 'Active',
            joinDate: s.joinDate
          }))
        break
      
      case 'Teacher Performance Report':
        reportData.summary = {
          totalTeachers: stats.totalTeachers,
          activeTeachers: users.filter(u => u.role === 'teacher' && u.status === 'Active').length,
          averageCoursesPerTeacher: (courses.length / Math.max(stats.totalTeachers, 1)).toFixed(2)
        }
        reportData.teachers = users
          .filter(u => u.role === 'teacher')
          .map(t => ({
            name: t.name,
            email: t.email,
            subjects: Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subject || 'N/A',
            classes: Array.isArray(t.classes) ? t.classes.join(', ') : 'N/A',
            status: t.status || 'Active',
            joinDate: t.joinDate
          }))
        break
      
      case 'Grade Analysis Report': {
        const gradeDistribution = users
          .filter(u => u.role === 'student')
          .reduce((acc, student) => {
            const grade = student.grade || student.className || 'Unassigned'
            acc[grade] = (acc[grade] || 0) + 1
            return acc
          }, {})
        
        reportData.summary = {
          totalStudents: stats.totalStudents,
          gradesOffered: Object.keys(gradeDistribution).length,
          largestGrade: Object.entries(gradeDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
          smallestGrade: Object.entries(gradeDistribution).sort((a, b) => a[1] - b[1])[0]?.[0] || 'N/A'
        }
        reportData.gradeDistribution = gradeDistribution
        break
      }
      
      case 'Attendance Report':
        reportData.summary = {
          totalUsers: users.length,
          activeUsers: stats.activeUsers,
          inactiveUsers: users.length - stats.activeUsers,
          attendanceRate: ((stats.activeUsers / Math.max(users.length, 1)) * 100).toFixed(2) + '%'
        }
        reportData.usersByStatus = {
          active: users.filter(u => u.status === 'Active' || !u.status).length,
          inactive: users.filter(u => u.status === 'Inactive').length
        }
        reportData.byRole = users.reduce((acc, user) => {
          const role = user.role || 'unknown'
          const status = user.status === 'Inactive' ? 'inactive' : 'active'
          if (!acc[role]) acc[role] = { active: 0, inactive: 0 }
          acc[role][status]++
          return acc
        }, {})
        break
      
      case 'User Activity Report':
        reportData.summary = {
          totalUsers: users.length,
          students: stats.totalStudents,
          teachers: stats.totalTeachers,
          parents: users.filter(u => u.role === 'parent').length,
          admins: users.filter(u => u.role === 'admin').length
        }
        reportData.usersByRole = users.reduce((acc, user) => {
          const role = user.role || 'unknown'
          acc[role] = (acc[role] || 0) + 1
          return acc
        }, {})
        reportData.recentJoins = users
          .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
          .slice(0, 10)
          .map(u => ({
            name: u.name,
            role: u.role,
            joinDate: u.joinDate,
            status: u.status || 'Active'
          }))
        break
      
      case 'Financial Report':
        reportData.summary = {
          totalCourses: courses.length,
          totalEnrollments: courses.reduce((sum, c) => sum + (c.students || 0), 0),
          averageEnrollmentPerCourse: (courses.reduce((sum, c) => sum + (c.students || 0), 0) / Math.max(courses.length, 1)).toFixed(2),
          activeCourses: courses.filter(c => c.status === 'Active').length,
          inactiveCourses: courses.filter(c => c.status === 'Inactive').length
        }
        reportData.coursesByLevel = courses.reduce((acc, course) => {
          const level = course.level || 'Unknown'
          if (!acc[level]) acc[level] = { count: 0, enrollments: 0 }
          acc[level].count++
          acc[level].enrollments += course.students || 0
          return acc
        }, {})
        reportData.topCourses = courses
          .sort((a, b) => (b.students || 0) - (a.students || 0))
          .slice(0, 5)
          .map(c => ({
            name: c.name,
            level: c.level,
            teacher: c.teacher,
            students: c.students || 0
          }))
        break
      
      default:
        reportData.summary = {
          totalUsers: users.length,
          totalCourses: courses.length,
          activeUsers: stats.activeUsers
        }
    }

    console.log('Report generated:', reportData)
    showToast(`${reportType} generated successfully!`, 'success')
    return reportData
  }

  const handleDownloadReport = (reportType, format) => {
    console.log(`Downloading ${reportType} report in ${format} format`)
    
    // Generate the report data
    const reportData = handleGenerateReport(reportType)
    
    if (format === 'PDF' || format === 'pdf') {
      // Generate PDF and trigger print dialog for PDF
      generateHTMLReportAsPDF(reportData, reportType)
      
    } else if (format === 'Excel' || format === 'excel') {
      // Generate CSV format for Excel
      generateExcelReport(reportData, reportType)
    }
  }

  // Generate PDF as PDF
  const generateHTMLReportAsPDF = (reportData, reportType) => {
    const htmlContent = generateHTMLContent(reportData, reportType)
    
    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe')
    printFrame.style.position = 'absolute'
    printFrame.style.top = '-10000px'
    printFrame.style.left = '-10000px'
    document.body.appendChild(printFrame)
    
    // Write content to iframe
    const frameDoc = printFrame.contentWindow.document
    frameDoc.open()
    frameDoc.write(htmlContent)
    frameDoc.close()
    
    // Wait for content to load, then print
    printFrame.contentWindow.onload = function() {
      setTimeout(() => {
        printFrame.contentWindow.focus()
        printFrame.contentWindow.print()
        
        // Remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(printFrame)
        }, 1000)
      }, 500)
    }
    
    showToast(`${reportType} PDF is ready! Use the print dialog to save.`, 'info')
  }

  // Generate HTML content (separated for reusability)
  const generateHTMLContent = (reportData, reportType) => {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportType}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .report-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e293b;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header .school-name {
      color: #059669;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .header .meta {
      color: #64748b;
      font-size: 14px;
      margin-top: 10px;
    }
    .summary-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .summary-section h2 {
      font-size: 24px;
      margin-bottom: 20px;
      border-bottom: 2px solid rgba(255,255,255,0.3);
      padding-bottom: 10px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .summary-card {
      background: rgba(255,255,255,0.15);
      padding: 15px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
    .summary-card .label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .summary-card .value {
      font-size: 28px;
      font-weight: 700;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      color: #1e293b;
      font-size: 22px;
      margin-bottom: 20px;
      border-left: 4px solid #059669;
      padding-left: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    table thead {
      background: #059669;
      color: white;
    }
    table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    table td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    table tbody tr:hover {
      background: #f8fafc;
    }
    table tbody tr:nth-child(even) {
      background: #f9fafb;
    }
    .chart-container {
      margin: 20px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 15px;
    }
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .bar-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .bar-label {
      min-width: 120px;
      font-weight: 500;
      color: #475569;
      font-size: 14px;
    }
    .bar-wrapper {
      flex: 1;
      background: #e2e8f0;
      border-radius: 4px;
      height: 30px;
      position: relative;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #059669, #10b981);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      color: white;
      font-weight: 600;
      font-size: 12px;
      transition: width 0.5s ease;
    }
    .pie-chart {
      display: flex;
      gap: 30px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pie-visual {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        #059669 0deg,
        #059669 var(--angle1, 180deg),
        #8b5cf6 var(--angle1, 180deg),
        #8b5cf6 var(--angle2, 270deg),
        #ec4899 var(--angle2, 270deg),
        #ec4899 360deg
      );
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .pie-legend {
      flex: 1;
      min-width: 200px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }
    .legend-label {
      flex: 1;
      color: #475569;
    }
    .legend-value {
      font-weight: 600;
      color: #1e293b;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-active {
      background: #d1fae5;
      color: #065f46;
    }
    .status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 13px;
    }
    @media print {
      body { background: white; padding: 0; }
      .report-container { box-shadow: none; padding: 30px; }
      .bar-fill { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .summary-section { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .status-badge { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      table thead { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div class="school-name">${reportData.school}</div>
      <h1>${reportData.title}</h1>
      <div class="meta">
        Academic Year: ${reportData.academicYear} | 
        Generated: ${new Date(reportData.generatedAt).toLocaleString()} | 
        Generated By: ${reportData.generatedBy}
      </div>
    </div>

    <div class="summary-section">
      <h2>Executive Summary</h2>
      <div class="summary-grid">
`

    // Add summary cards based on report type
    Object.entries(reportData.summary).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
      htmlContent += `
        <div class="summary-card">
          <div class="label">${label}</div>
          <div class="value">${value}</div>
        </div>
`
    })

    htmlContent += `
      </div>
    </div>
`

    // Add specific content based on report type
    if (reportType === 'Student Performance Report' && reportData.students) {
      // Grade distribution chart
      if (reportData.summary.byGrade) {
        htmlContent += `
    <div class="section">
      <h2>Grade Distribution</h2>
      <div class="chart-container">
        <div class="chart-title">Students by Grade Level</div>
        <div class="bar-chart">
`
        Object.entries(reportData.summary.byGrade)
          .sort((a, b) => b[1] - a[1])
          .forEach(([grade, count]) => {
            const percentage = (count / reportData.summary.totalStudents * 100).toFixed(1)
            htmlContent += `
          <div class="bar-item">
            <div class="bar-label">Grade ${grade}</div>
            <div class="bar-wrapper">
              <div class="bar-fill" style="width: ${percentage}%">${count} students</div>
            </div>
          </div>
`
          })
        htmlContent += `
        </div>
      </div>
    </div>
`
      }

      // Students table
      htmlContent += `
    <div class="section">
      <h2>Student Details</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
`
      reportData.students.forEach((student, index) => {
        const statusClass = student.status === 'Active' ? 'status-active' : 'status-inactive'
        htmlContent += `
          <tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.grade}</td>
            <td><span class="status-badge ${statusClass}">${student.status}</span></td>
            <td>${student.joinDate}</td>
          </tr>
`
      })
      htmlContent += `
        </tbody>
      </table>
    </div>
`
    }

    if (reportType === 'Teacher Performance Report' && reportData.teachers) {
      htmlContent += `
    <div class="section">
      <h2>Teacher Details</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Teacher Name</th>
            <th>Email</th>
            <th>Subjects</th>
            <th>Classes</th>
            <th>Status</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
`
      reportData.teachers.forEach((teacher, index) => {
        const statusClass = teacher.status === 'Active' ? 'status-active' : 'status-inactive'
        htmlContent += `
          <tr>
            <td>${index + 1}</td>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.subjects}</td>
            <td>${teacher.classes}</td>
            <td><span class="status-badge ${statusClass}">${teacher.status}</span></td>
            <td>${teacher.joinDate}</td>
          </tr>
`
      })
      htmlContent += `
        </tbody>
      </table>
    </div>
`
    }

    if (reportType === 'Grade Analysis Report' && reportData.gradeDistribution) {
      htmlContent += `
    <div class="section">
      <h2>Grade Distribution Analysis</h2>
      <div class="chart-container">
        <div class="chart-title">Student Count by Grade</div>
        <div class="bar-chart">
`
      Object.entries(reportData.gradeDistribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([grade, count]) => {
          const percentage = (count / reportData.summary.totalStudents * 100).toFixed(1)
          htmlContent += `
          <div class="bar-item">
            <div class="bar-label">Grade ${grade}</div>
            <div class="bar-wrapper">
              <div class="bar-fill" style="width: ${percentage}%">${count} (${percentage}%)</div>
            </div>
          </div>
`
        })
      htmlContent += `
        </div>
      </div>
    </div>
`
    }

    if (reportType === 'Attendance Report' && reportData.byRole) {
      htmlContent += `
    <div class="section">
      <h2>Attendance by Role</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Active Users</th>
            <th>Inactive Users</th>
            <th>Total</th>
            <th>Attendance Rate</th>
          </tr>
        </thead>
        <tbody>
`
      Object.entries(reportData.byRole).forEach(([role, stats]) => {
        const total = stats.active + stats.inactive
        const rate = ((stats.active / total) * 100).toFixed(1)
        htmlContent += `
          <tr>
            <td style="text-transform: capitalize; font-weight: 600;">${role}</td>
            <td><span class="status-badge status-active">${stats.active}</span></td>
            <td><span class="status-badge status-inactive">${stats.inactive}</span></td>
            <td>${total}</td>
            <td><strong>${rate}%</strong></td>
          </tr>
`
      })
      htmlContent += `
        </tbody>
      </table>
    </div>
`
    }

    if (reportType === 'User Activity Report' && reportData.usersByRole) {
      htmlContent += `
    <div class="section">
      <h2>Users by Role</h2>
      <div class="chart-container">
        <div class="chart-title">Distribution of Users by Role</div>
        <div class="bar-chart">
`
      Object.entries(reportData.usersByRole)
        .sort((a, b) => b[1] - a[1])
        .forEach(([role, count]) => {
          const percentage = (count / reportData.summary.totalUsers * 100).toFixed(1)
          htmlContent += `
          <div class="bar-item">
            <div class="bar-label" style="text-transform: capitalize;">${role}</div>
            <div class="bar-wrapper">
              <div class="bar-fill" style="width: ${percentage}%">${count} (${percentage}%)</div>
            </div>
          </div>
`
        })
      htmlContent += `
        </div>
      </div>
    </div>
`

      if (reportData.recentJoins) {
        htmlContent += `
    <div class="section">
      <h2>🆕 Recent User Registrations</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Join Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
`
        reportData.recentJoins.forEach((user, index) => {
          const statusClass = user.status === 'Active' ? 'status-active' : 'status-inactive'
          htmlContent += `
          <tr>
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td style="text-transform: capitalize;">${user.role}</td>
            <td>${user.joinDate}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
          </tr>
`
        })
        htmlContent += `
        </tbody>
      </table>
    </div>
`
      }
    }

    if (reportType === 'Financial Report') {
      if (reportData.coursesByLevel) {
        htmlContent += `
    <div class="section">
      <h2>Courses by Level</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Number of Courses</th>
            <th>Total Enrollments</th>
            <th>Average per Course</th>
          </tr>
        </thead>
        <tbody>
`
        Object.entries(reportData.coursesByLevel).forEach(([level, data]) => {
          const avg = (data.enrollments / data.count).toFixed(1)
          htmlContent += `
          <tr>
            <td><strong>${level}</strong></td>
            <td>${data.count}</td>
            <td>${data.enrollments}</td>
            <td>${avg}</td>
          </tr>
`
        })
        htmlContent += `
        </tbody>
      </table>
    </div>
`
      }

      if (reportData.topCourses) {
        htmlContent += `
    <div class="section">
      <h2>Top Performing Courses</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Course Name</th>
            <th>Level</th>
            <th>Teacher</th>
            <th>Enrollments</th>
          </tr>
        </thead>
        <tbody>
`
        reportData.topCourses.forEach((course, index) => {
          htmlContent += `
          <tr>
            <td><strong>${index + 1}</strong></td>
            <td>${course.name}</td>
            <td>${course.level}</td>
            <td>${course.teacher}</td>
            <td><strong>${course.students}</strong></td>
          </tr>
`
        })
        htmlContent += `
        </tbody>
      </table>
    </div>
`
      }
    }

    htmlContent += `
    <div class="footer">
      <p>This report was automatically generated by SmartED Management System</p>
      <p>© ${new Date().getFullYear()} ${reportData.school}. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 11px;">For questions or concerns, please contact the administration office.</p>
    </div>
  </div>
</body>
</html>
`

    return htmlContent
  }

  // Generate PDF and open in new window (for viewing)
  const _generateHTMLReport = (reportData, reportType) => {
    const htmlContent = generateHTMLContent(reportData, reportType)
    
    // Create and download HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    link.click()
    URL.revokeObjectURL(url)

    // Also open in new window for immediate viewing
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    }
  }

  // Generate Excel Report
  const generateExcelReport = (reportData, reportType) => {
    let csvContent = `${reportType}\n`
    csvContent += `School: ${reportData.school}\n`
    csvContent += `Academic Year: ${reportData.academicYear}\n`
    csvContent += `Generated: ${new Date(reportData.generatedAt).toLocaleString()}\n`
    csvContent += `Generated By: ${reportData.generatedBy}\n\n`
    
    csvContent += `EXECUTIVE SUMMARY\n`
    if (reportData.summary) {
      Object.entries(reportData.summary).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        csvContent += `${label},${value}\n`
      })
    }
    
    csvContent += `\nDETAILED DATA\n`
    
    // Add specific data based on report type
    if (reportData.students) {
      csvContent += `\nName,Email,Grade,Status,Join Date\n`
      reportData.students.forEach(s => {
        csvContent += `${s.name},${s.email},${s.grade},${s.status},${s.joinDate}\n`
      })
    } else if (reportData.teachers) {
      csvContent += `\nName,Email,Subjects,Classes,Status,Join Date\n`
      reportData.teachers.forEach(t => {
        csvContent += `${t.name},${t.email},${t.subjects},${t.classes},${t.status},${t.joinDate}\n`
      })
    } else if (reportData.gradeDistribution) {
      csvContent += `\nGrade,Number of Students,Percentage\n`
      const total = Object.values(reportData.gradeDistribution).reduce((sum, val) => sum + val, 0)
      Object.entries(reportData.gradeDistribution).forEach(([grade, count]) => {
        const percentage = ((count / total) * 100).toFixed(2)
        csvContent += `${grade},${count},${percentage}%\n`
      })
    } else if (reportData.byRole) {
      csvContent += `\nRole,Active,Inactive,Total,Attendance Rate\n`
      Object.entries(reportData.byRole).forEach(([role, stats]) => {
        const total = stats.active + stats.inactive
        const rate = ((stats.active / total) * 100).toFixed(2)
        csvContent += `${role},${stats.active},${stats.inactive},${total},${rate}%\n`
      })
    } else if (reportData.usersByRole) {
      csvContent += `\nRole,Count,Percentage\n`
      const total = Object.values(reportData.usersByRole).reduce((sum, val) => sum + val, 0)
      Object.entries(reportData.usersByRole).forEach(([role, count]) => {
        const percentage = ((count / total) * 100).toFixed(2)
        csvContent += `${role},${count},${percentage}%\n`
      })
    } else if (reportData.topCourses) {
      csvContent += `\nCourse Name,Level,Teacher,Students\n`
      reportData.topCourses.forEach(c => {
        csvContent += `${c.name},${c.level},${c.teacher},${c.students}\n`
      })
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Quick Actions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'addUser':
        openAddUserModal()
        break
      case 'createCourse':
        setShowCourseModal(true)
        setSelectedCourse(null)
        break
      case 'generateReport':
        setActiveTab('reports')
        break
      case 'systemSettings':
        setActiveTab('settings')
        break
      default:
        console.log('Quick action:', action)
    }
  }

  // Refresh Actions
  const handleRefreshData = () => {
    // Clear all filters
    setSearchQuery('')
    setLevelFilter('')
    setStatusFilter('')
    setUserFilter('All')
    setUserSearchQuery('')
    
    // Show feedback
    console.log('Data refreshed - all filters cleared')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">Admin Dashboard</h2>
          <p className="loading-text">Loading school management system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container admin-dashboard">
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <button 
          className="mobile-sidebar-close" 
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <div className="admin-profile">
          <ProfileAvatarUploader 
            userId={user?.id || user?.uid}
            currentImageUrl={user?.profileImage || user?.photoURL}
            displayName={user?.fullName || 'System Admin'}
            role="Admin"
            onImageUpdated={(url) => {
              if (user) {
                user.profileImage = url
                user.photoURL = url
              }
              showToast('Profile image updated successfully!', 'success')
            }}
          />
          <h3 className="profile-name">{user?.fullName || 'System Admin'}</h3>
          <span className="profile-role-badge">Administrator</span>
          <p className="profile-school">{schoolSettings.schoolName}</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            <span className="nav-item-icon"><BarChart3 size={18} /></span>
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
          >
            <span className="nav-item-icon"><Users size={18} /></span>
            <span>User Management</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }}
          >
            <span className="nav-item-icon"><BookOpen size={18} /></span>
            <span>Course Management</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
          >
            <span className="nav-item-icon"><TrendingUp size={18} /></span>
            <span>Reports</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
          >
            <span className="nav-item-icon"><Settings size={18} /></span>
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="header-title-group">
              <h2>Admin Dashboard</h2>
              <span className="header-subtitle">Welcome back, {user?.fullName || 'Administrator'}</span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><Bell size={16} /></span>
              <span>Notifications</span>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><LogOut size={16} /></span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-badge icon-students" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} /></div>
                  <div className="stat-info">
                    <span className="stat-label">Total Students</span>
                    <div className="stat-value">{stats.totalStudents || 0}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-badge icon-teachers" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={20} /></div>
                  <div className="stat-info">
                    <span className="stat-label">Total Teachers</span>
                    <div className="stat-value">{stats.totalTeachers || 0}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-badge icon-courses" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={20} /></div>
                  <div className="stat-info">
                    <span className="stat-label">Total Courses</span>
                    <div className="stat-value">{stats.totalCourses || 0}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-badge icon-users" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={20} /></div>
                  <div className="stat-info">
                    <span className="stat-label">Active Users</span>
                    <div className="stat-value">{stats.activeUsers || 0}</div>
                  </div>
                </div>
              </div>

              <div className="recent-activities">
                <div className="section-header-compact">
                  <h3>Recent Activities</h3>
                </div>
                {recentActivities && recentActivities.length > 0 ? (
                  <div className="activities-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-info">
                          <span className="activity-type">{activity.type}</span>
                          <span className="activity-user">{activity.user}</span>
                          <span className="activity-role">{activity.role}</span>
                        </div>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-activities-placeholder">
                    <div className="empty-icon-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={32} color="#94a3b8" /></div>
                    <p className="empty-msg">No recent activity logged yet.</p>
                    <span className="empty-sub">Recent administrative events, registrations, and updates will appear here.</span>
                  </div>
                )}
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('addUser')}
                  >
                    <span className="action-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><UserPlus size={16} /></span>
                    Add New User
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('createCourse')}
                  >
                    <span className="action-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><BookOpen size={16} /></span>
                    Create Course
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('generateReport')}
                  >
                    <span className="action-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><BarChart3 size={16} /></span>
                    Generate Report
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleQuickAction('systemSettings')}
                  >
                    <span className="action-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><Settings size={16} /></span>
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h3>User Management</h3>
                <div className="section-actions">
                  <div className="search-wrapper">
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      className="search-field"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                    <span className="search-icon"><Search size={16} /></span>
                  </div>
                  <select 
                    value={userFilter} 
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Users</option>
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                    <option value="parent">Parents</option>
                  </select>
                  <button className="add-btn" onClick={openAddUserModal}>
                    <span className="btn-icon"><Plus size={15} /></span>
                    Add New User
                  </button>
                </div>
              </div>
              
              <div className="users-grid">
                {(() => {
                  const filteredUsers = users.filter(user => {
                    const matchesRole = userFilter === 'All' || user.role === userFilter
                    const q = userSearchQuery.toLowerCase()
                    const matchesSearch = userSearchQuery === '' || 
                      (user.name && user.name.toLowerCase().includes(q)) ||
                      (user.nameWithInitials && user.nameWithInitials.toLowerCase().includes(q)) ||
                      (user.username && user.username.toLowerCase().includes(q)) ||
                      (user.indexNumber && user.indexNumber.toLowerCase().includes(q)) ||
                      (user.email && user.email.toLowerCase().includes(q))
                    return matchesRole && matchesSearch
                  })
                  
                  if (filteredUsers.length === 0) {
                    return (
                      <div className="empty-state">
                        <div className="empty-icon"><User size={40} color="#94a3b8" /></div>
                        <h4>No users found</h4>
                        <p>
                          {userSearchQuery 
                            ? `No users match your search "${userSearchQuery}"`
                            : userFilter === 'All' 
                              ? 'Get started by adding your first user to the system.'
                              : `No ${userFilter}s found in the system.`
                          }
                        </p>
                        <button 
                          className="empty-action-btn"
                          onClick={openAddUserModal}
                        >
                          <span className="btn-icon"><Plus size={15} /></span>
                          Add New User
                        </button>
                      </div>
                    )
                  }
                  
                  return filteredUsers.map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-header">
                        <div className="user-avatar" style={{ overflow: 'hidden' }}>
                          {user.profileImage || user.photoURL ? (
                            <img 
                              src={user.profileImage || user.photoURL} 
                              alt={user.name || 'User'} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            user.name ? user.name.charAt(0).toUpperCase() : 'U'
                          )}
                        </div>
                        <div className="user-info">
                          <h4>{user.name || 'Unnamed User'}</h4>
                          {user.nameWithInitials && (
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '-2px 0 2px 0' }}>
                              {user.nameWithInitials}
                            </p>
                          )}
                          <p>{user.email}</p>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                            <span className={`role-badge ${user.role ? user.role.toLowerCase() : 'unknown'}`}>
                              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                            </span>
                            {user.username && (
                              <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                @{user.username}
                              </span>
                            )}
                            {(user.indexNumber || user.studentData?.indexNumber) && (
                              <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                ID: {user.indexNumber || user.studentData?.indexNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="user-details">
                        {user.role === 'student' && (
                          <p>
                            <strong>Class:</strong> {user.studentData?.gradeName || (user.studentData?.grade ? `Grade ${user.studentData.grade}` : (user.grade || 'N/A'))} - Section {user.studentData?.className || user.className || (user.studentData?.class ? user.studentData.class.split('-').pop() : 'N/A')}
                          </p>
                        )}
                        {user.role === 'teacher' && (
                          <div className="teacher-info-preview">
                            <p>
                              <strong>Subjects:</strong> {
                                Array.isArray(user.subjects) && user.subjects.length > 0
                                  ? user.subjects.join(', ')
                                  : user.teacherData?.subjects?.join(', ') || user.subject || user.teacherData?.subject || 'Not Assigned'
                              }
                            </p>
                            <p>
                              <strong>Classes:</strong> {
                                Array.isArray(user.classes) && user.classes.length > 0
                                  ? user.classes.join(', ')
                                  : user.teacherData?.classes?.join(', ') || 'None'
                              }
                            </p>
                            {(user.inChargeClass || user.teacherData?.inChargeClass) && (
                              <span className="teacher-incharge-badge">
                                In-Charge: {user.inChargeClass || user.teacherData?.inChargeClass}
                              </span>
                            )}
                          </div>
                        )}
                        {user.role === 'parent' && (
                          <p>Children: {Array.isArray(user.children) ? user.children.length : user.children || 'N/A'}</p>
                        )}
                        <p>Joined: {user.joinDate}</p>
                        <span className={`status ${(user.status || 'active').toLowerCase()}`}>
                          {user.status || 'Active'}
                        </span>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditUserModal(user)
                          }}
                          title="Edit user information"
                        >
                          <span className="btn-icon"><Edit2 size={14} /></span>
                          Edit
                        </button>
                        <button 
                          className="deactivate-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleUserStatus(user.id)
                          }}
                          title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                        >
                          <span className="btn-icon">{user.status === 'Active' ? <X size={14} /> : <Check size={14} />}</span>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteUser(user.id)
                          }}
                          title="Delete user permanently"
                        >
                          <span className="btn-icon"><Trash2 size={14} /></span>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                }
                )()}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-section">
              {/* Top Header Section */}
              <div className="section-top">
                <div className="page-title">
                  <div className="title-with-icon">
                    <div className="page-icon"><BookOpen size={24} color="#059669" /></div>
                    <div>
                      <h2>Course Management</h2>
                      <p>Manage all courses in your institution</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Summary - Enhanced with Icons */}
                <div className="quick-stats">
                  <div className="stat-item total-courses">
                    <div className="stat-icon"><BarChart3 size={20} color="#059669" /></div>
                    <div className="stat-content">
                      <span className="stat-label">Total Courses</span>
                      <span className="stat-value">{courses.length}</span>
                    </div>
                  </div>
                  <div className="stat-item al-courses">
                    <div className="stat-icon"><GraduationCap size={20} color="#059669" /></div>
                    <div className="stat-content">
                      <span className="stat-label">A/L Courses</span>
                      <span className="stat-value">{courses.filter(c => c.level === 'A/L').length}</span>
                    </div>
                  </div>
                  <div className="stat-item ol-courses">
                    <div className="stat-icon"><BookOpen size={20} color="#10b981" /></div>
                    <div className="stat-content">
                      <span className="stat-label">O/L Courses</span>
                      <span className="stat-value">{courses.filter(c => c.level === 'O/L').length}</span>
                    </div>
                  </div>
                  <div className="stat-item total-students">
                    <div className="stat-icon"><Users size={20} color="#8b5cf6" /></div>
                    <div className="stat-content">
                      <span className="stat-label">Total Students</span>
                      <span className="stat-value">{courses.reduce((sum, c) => sum + (c.students || 0), 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Controls Section */}
              <div className="controls-section">
                <div className="controls-left">
                  <div className="search-wrapper">
                    <input 
                      type="text" 
                      placeholder="Search by course name, teacher, or subject..." 
                      className="search-field"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="search-icon"><Search size={16} /></span>
                  </div>
                  <div className="filter-group">
                    <div className="filter-item">
                      <label className="filter-label">Level</label>
                      <select 
                        className="filter-dropdown"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                      >
                        <option value="">All Levels</option>
                        <option value="O/L">O/L Courses</option>
                        <option value="A/L">A/L Courses</option>
                      </select>
                    </div>
                    <div className="filter-item">
                      <label className="filter-label">Status</label>
                      <select 
                        className="filter-dropdown"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="controls-right">
                  <button 
                    className="refresh-btn" 
                    title="Refresh course list and clear filters"
                    onClick={handleRefreshData}
                  >
                    <span className="btn-icon"><RotateCw size={14} /></span>
                    Refresh
                  </button>
                  <button className="add-new-btn" onClick={() => {
                    setSelectedCourse(null)
                    setCourseLevel('O/L')
                    setShowCourseModal(true)
                  }} title="Add a new course">
                    <span className="btn-icon"><Plus size={15} /></span>
                    Add New Course
                  </button>
                </div>
              </div>

              {/* Main Course List */}
              <div className="courses-container">
                <div className="courses-header">
                  <h3>Course Directory</h3>
                  <p>Showing {(() => {
                    const filteredCount = courses.filter(course => {
                      const matchesSearch = searchQuery === '' || 
                        (course.name && course.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (course.teacher && course.teacher.toLowerCase().includes(searchQuery.toLowerCase()));
                      const matchesLevel = levelFilter === '' || course.level === levelFilter;
                      const matchesStatus = statusFilter === '' || course.status === statusFilter;
                      return matchesSearch && matchesLevel && matchesStatus;
                    }).length;
                    return `${filteredCount} course${filteredCount !== 1 ? 's' : ''}`;
                  })()} {(searchQuery || levelFilter || statusFilter) ? `of ${courses.length} total` : ''}</p>
                </div>
                
                <div className="course-list">
                  {(() => {
                    const filteredCourses = courses.filter(course => {
                      const matchesSearch = searchQuery === '' || 
                        (course.name && course.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (course.teacher && course.teacher.toLowerCase().includes(searchQuery.toLowerCase()));
                      const matchesLevel = levelFilter === '' || course.level === levelFilter;
                      const matchesStatus = statusFilter === '' || course.status === statusFilter;
                      return matchesSearch && matchesLevel && matchesStatus;
                    });
                    
                    if (filteredCourses.length === 0) {
                      return (
                        <div className="empty-state">
                          <div className="empty-icon"><BookOpen size={40} color="#94a3b8" /></div>
                          <h4>No courses found</h4>
                          <p>
                            {searchQuery 
                              ? `No courses match your search "${searchQuery}"`
                              : (levelFilter || statusFilter)
                                ? 'No courses match the selected filters.'
                                : 'Get started by adding your first course to the system.'
                            }
                          </p>
                          <button 
                            className="empty-action-btn"
                            onClick={() => {
                              setSelectedCourse(null)
                              setShowCourseModal(true)
                            }}
                          >
                            <span className="btn-icon"><Plus size={15} /></span>
                            Add Your First Course
                          </button>
                        </div>
                      )
                    }
                    
                    return filteredCourses.map(course => (
                    <div key={course.id} className="course-item">
                      <div className="course-avatar">
                        <div className={`subject-icon ${course.level ? course.level.toLowerCase().replace('/', '-') : 'unknown'}`}>
                          <BookOpen size={20} />
                        </div>
                      </div>
                      
                      <div className="course-content">
                        <div className="course-info">
                          <div className="course-header-row">
                            <div className="course-title-group">
                              <h4 className="course-title">{course.name || 'Unnamed Course'}</h4>
                              {course.grade && (
                                <span className="grade-label">{course.grade}</span>
                              )}
                            </div>
                            <div className="course-meta">
                              <span className={`level-tag ${course.level ? course.level.toLowerCase().replace('/', '-') : 'unknown'}`}>
                                {course.level === 'A/L' ? 'A/L' : course.level === 'O/L' ? 'O/L' : course.level || 'N/A'}
                              </span>
                              {course.stream && (
                                <span className="stream-tag">{course.stream}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="course-details-row">
                            <div className="detail-group teacher-info">
                              <span className="detail-icon"><User size={14} /></span>
                              <span className="detail-label">Teacher:</span>
                              <span className="detail-text">{course.teacher || 'Not Assigned'}</span>
                            </div>
                            <div className="detail-group enrollment-info">
                              <span className="detail-icon"><Users size={14} /></span>
                              <span className="detail-label">Students:</span>
                              <span className="detail-text">{course.students || 0} enrolled</span>
                            </div>
                            <div className="detail-group status-info">
                              <span className="detail-icon">
                                {course.status === 'Active' ? <CheckCircle2 size={14} color="#10b981" /> : <AlertTriangle size={14} color="#ef4444" />}
                              </span>
                              <span className="detail-label">Status:</span>
                              <span className={`status-badge ${course.status ? course.status.toLowerCase() : 'active'}`}>
                                {course.status || 'Active'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="course-actions">
                        <button 
                          className="btn-action btn-view"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewCourse(course)
                          }}
                          title="View course details and analytics"
                        >
                          <span className="btn-icon"><Eye size={14} /></span>
                          View
                        </button>
                        <button 
                          className="btn-action btn-edit" 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCourse(course)
                          }}
                          title="Edit course information"
                        >
                          <span className="btn-icon"><Edit2 size={14} /></span>
                          Edit
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCourse(course.id)
                          }}
                          title="Delete course (cannot be undone)"
                        >
                          <span className="btn-icon"><Trash2 size={14} /></span>
                          Delete
                        </button>
                      </div>
                    </div>
                    ))
                  }
                  )()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <div className="section-header">
                <h3>Reports & Analytics</h3>
                <p>Generate comprehensive reports and download them in various formats</p>
              </div>
              
              <div className="reports-grid">
                <div className="report-category">
                  <h4>Academic Reports</h4>
                  <div className="report-cards">
                    <div className="report-card">
                      <div className="report-icon"><GraduationCap size={24} color="#059669" /></div>
                      <h5>Student Performance Report</h5>
                      <p>Comprehensive analysis of student performance by grade, class, and subject with enrollment statistics</p>
                      <div className="report-meta">
                        <span className="meta-item">{stats.totalStudents} Students</span>
                        <span className="meta-item">Active Data</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Student Performance Report')}
                          title="Preview report data"
                        >
                          <span className="btn-icon"><BarChart3 size={14} /></span>
                          Generate
                        </button>
                        <div className="download-group">
                          <button 
                            className="download-btn pdf"
                            onClick={() => handleDownloadReport('Student Performance Report', 'PDF')}
                            title="Generate PDF report with print dialog"
                          >
                            <span className="btn-icon"><FileText size={14} /></span>PDF</button>
                          <button 
                            className="download-btn excel"
                            onClick={() => handleDownloadReport('Student Performance Report', 'Excel')}
                            title="Download as CSV for Excel"
                          >
                            <span className="btn-icon"><Download size={14} /></span>
                            Excel
                          </button>
                </div>
                      </div>
                    </div>
                    
                    <div className="report-card">
                      <div className="report-icon"><User size={24} color="#059669" /></div>
                      <h5>Teacher Performance Report</h5>
                      <p>Teaching effectiveness metrics including subject assignments, class loads, and status overview</p>
                      <div className="report-meta">
                        <span className="meta-item">{stats.totalTeachers} Teachers</span>
                        <span className="meta-item">{courses.length} Courses</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Teacher Performance Report')}
                          title="Preview report data"
                        >
                          <span className="btn-icon"><BarChart3 size={14} /></span>
                          Generate
                        </button>
                        <div className="download-group">
                          <button 
                            className="download-btn pdf"
                            onClick={() => handleDownloadReport('Teacher Performance Report', 'PDF')}
                            title="Generate PDF report with print dialog"
                          >
                            <span className="btn-icon"><FileText size={14} /></span>PDF</button>
                          <button 
                            className="download-btn excel"
                            onClick={() => handleDownloadReport('Teacher Performance Report', 'Excel')}
                            title="Download as CSV for Excel"
                          >
                            <span className="btn-icon"><Download size={14} /></span>
                            Excel
                          </button>
                </div>
                      </div>
                    </div>
                    
                    <div className="report-card">
                      <div className="report-icon"><TrendingUp size={24} color="#10b981" /></div>
                      <h5>Grade Analysis Report</h5>
                      <p>Detailed grade distribution across all levels (A/L and O/L) with comparative analytics</p>
                      <div className="report-meta">
                        <span className="meta-item">A/L: {users.filter(u => u.role === 'student' && (u.grade || '').includes('1')).length}</span>
                        <span className="meta-item">O/L: {users.filter(u => u.role === 'student' && !(u.grade || '').includes('1')).length}</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Grade Analysis Report')}
                          title="Preview report data"
                        >
                          <span className="btn-icon"><BarChart3 size={14} /></span>
                          Generate
                        </button>
                        <div className="download-group">
                          <button 
                            className="download-btn pdf"
                            onClick={() => handleDownloadReport('Grade Analysis Report', 'PDF')}
                            title="Generate PDF report with print dialog"
                          >
                            <span className="btn-icon"><FileText size={14} /></span>PDF</button>
                          <button 
                            className="download-btn excel"
                            onClick={() => handleDownloadReport('Grade Analysis Report', 'Excel')}
                            title="Download as CSV for Excel"
                          >
                            <span className="btn-icon"><Download size={14} /></span>
                            Excel
                          </button>
                </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="report-category">
                  <h4>Administrative Reports</h4>
                  <div className="report-cards">
                    <div className="report-card">
                      <div className="report-icon"><Calendar size={24} color="#f59e0b" /></div>
                      <h5>Attendance Report</h5>
                      <p>Comprehensive attendance statistics for students and teachers with activity status tracking</p>
                      <div className="report-meta">
                        <span className="meta-item">{stats.activeUsers} Active</span>
                        <span className="meta-item">{users.length - stats.activeUsers} Inactive</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Attendance Report')}
                          title="Preview report data"
                        >
                          <span className="btn-icon"><Calendar size={14} /></span>
                          Generate
                        </button>
                        <div className="download-group">
                          <button 
                            className="download-btn pdf"
                            onClick={() => handleDownloadReport('Attendance Report', 'PDF')}
                            title="Generate PDF report with print dialog"
                          >
                            <span className="btn-icon"><FileText size={14} /></span>PDF</button>
                          <button 
                            className="download-btn excel"
                            onClick={() => handleDownloadReport('Attendance Report', 'Excel')}
                            title="Download as CSV for Excel"
                          >
                            <span className="btn-icon"><Download size={14} /></span>
                            Excel
                          </button>
                </div>
                      </div>
                    </div>
                    
                    <div className="report-card">
                      <div className="report-icon"><Users size={24} color="#8b5cf6" /></div>
                      <h5>User Activity Report</h5>
                      <p>System usage metrics and user engagement analytics across all user roles and categories</p>
                      <div className="report-meta">
                        <span className="meta-item">{users.length} Total Users</span>
                        <span className="meta-item">By Role</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('User Activity Report')}
                          title="Preview report data"
                        >
                          <span className="btn-icon"><Users size={14} /></span>
                          Generate
                        </button>
                        <div className="download-group">
                          <button 
                            className="download-btn pdf"
                            onClick={() => handleDownloadReport('User Activity Report', 'PDF')}
                            title="Generate PDF report with print dialog"
                          >
                            <span className="btn-icon"><FileText size={14} /></span>PDF</button>
                          <button 
                            className="download-btn excel"
                            onClick={() => handleDownloadReport('User Activity Report', 'Excel')}
                            title="Download as CSV for Excel"
                          >
                            <span className="btn-icon"><Download size={14} /></span>
                            Excel
                          </button>
                </div>
                      </div>
                    </div>
                    
                    <div className="report-card">
                      <div className="report-icon"><CreditCard size={24} color="#06b6d4" /></div>
                      <h5>Financial Report</h5>
                      <p>Course enrollment summary and financial overview with active/inactive status breakdown</p>
                      <div className="report-meta">
                        <span className="meta-item">{courses.reduce((sum, c) => sum + (c.students || 0), 0)} Enrollments</span>
                        <span className="meta-item">{courses.length} Courses</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="generate-btn"
                          onClick={() => handleGenerateReport('Financial Report')}
                          title="Preview report data"
                        >
                          <span className="btn-icon"><CreditCard size={14} /></span>
                          Generate
                        </button>
                        <div className="download-group">
                          <button 
                            className="download-btn pdf"
                            onClick={() => handleDownloadReport('Financial Report', 'PDF')}
                            title="Generate PDF report with print dialog"
                          >
                            <span className="btn-icon"><FileText size={14} /></span>PDF</button>
                          <button 
                            className="download-btn excel"
                            onClick={() => handleDownloadReport('Financial Report', 'Excel')}
                            title="Download as CSV for Excel"
                          >
                            <span className="btn-icon"><Download size={14} /></span>
                            Excel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="report-category">
                  <h4>Quick Analytics</h4>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h5>Current Month</h5>
                      <div className="analytics-stats">
                        <div className="stat-item">
                          <span>New Registrations</span>
                          <strong>12</strong>
                        </div>
                        <div className="stat-item">
                          <span>Average Attendance</span>
                          <strong>92%</strong>
                        </div>
                        <div className="stat-item">
                          <span>Assignments Submitted</span>
                          <strong>1,248</strong>
                        </div>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h5>Performance Overview</h5>
                      <div className="analytics-stats">
                        <div className="stat-item">
                          <span>A/L Pass Rate</span>
                          <strong>94%</strong>
                        </div>
                        <div className="stat-item">
                          <span>O/L Pass Rate</span>
                          <strong>96%</strong>
                        </div>
                        <div className="stat-item">
                          <span>Teacher Satisfaction</span>
                          <strong>4.8/5</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>System Settings</h3>
              
              <div className="settings-tabs">
                <div className="settings-category">
                  <h4>School Information</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>School Name</label>
                      <input 
                        type="text" 
                        value={schoolSettings.schoolName}
                        onChange={(e) => setSchoolSettings({...schoolSettings, schoolName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input 
                        type="text" 
                        value={schoolSettings.address}
                        onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={schoolSettings.phone}
                        onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={schoolSettings.email}
                        onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="settings-category">
                  <h4>Academic Settings</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Current Academic Year</label>
                      <select 
                        value={schoolSettings.academicYear}
                        onChange={(e) => setSchoolSettings({...schoolSettings, academicYear: e.target.value})}
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Terms</label>
                      <select 
                        value={schoolSettings.terms}
                        onChange={(e) => setSchoolSettings({...schoolSettings, terms: parseInt(e.target.value)})}
                      >
                        <option value="2">2 Terms</option>
                        <option value="3">3 Terms</option>
                        <option value="4">4 Terms</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Grading System</label>
                      <select 
                        value={schoolSettings.gradingSystem}
                        onChange={(e) => setSchoolSettings({...schoolSettings, gradingSystem: e.target.value})}
                      >
                        <option value="A/B/C/S/W">A/B/C/S/W (Sri Lankan)</option>
                        <option value="A+/A/B/C/D/F">A+/A/B/C/D/F (International)</option>
                        <option value="1-9">1-9 (GCSE Style)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="settings-category">
                  <h4>System Configuration</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Default Language</label>
                      <select>
                        <option value="en">English</option>
                        <option value="si">Sinhala</option>
                        <option value="ta">Tamil</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Time Zone</label>
                      <select>
                        <option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Enable Email Notifications
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Allow Parent Portal Access
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" />
                        Enable SMS Notifications
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-category">
                  <h4>Security Settings</h4>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Password Policy</label>
                      <select>
                        <option value="basic">Basic (6+ characters)</option>
                        <option value="medium">Medium (8+ characters, mixed case)</option>
                        <option value="strong">Strong (12+ characters, symbols)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Session Timeout (minutes)</label>
                      <select>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="480">8 hours</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="settings-actions">
                <button 
                  className="save-btn"
                  onClick={handleSaveSettings}
                  title="Save all current settings"
                >
                  <span className="btn-icon"><Save size={15} /></span>
                  Save All Settings
                </button>
                <button 
                  className="reset-btn"
                  onClick={handleResetSettings}
                  title="Reset all settings to default values"
                >
                  <span className="btn-icon"><RotateCw size={15} /></span>
                  Reset to Defaults
                </button>
                <button 
                  className="backup-btn"
                  onClick={handleCreateBackup}
                  title="Create a backup of all system data"
                >
                  <span className="btn-icon"><Download size={15} /></span>
                  Create Backup
                </button>
              </div>
            </div>
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
            <div 
              key={notification.id} 
              className={`notification-item ${notification.type} ${readNotifications.has(notification.id) ? 'read' : ''}`}
              onClick={() => openMessageDetail(notification)}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="notification-footer">
          <button className="mark-all-read" onClick={markAllAsRead}>
            Mark all as read
          </button>
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
                <h2>{selectedMessage.title}</h2>
                <span className={`priority-badge ${selectedMessage.priority.toLowerCase()}`}>
                  {selectedMessage.priority} Priority
                </span>
              </div>
              <button className="close-message-detail" onClick={closeMessageDetail}>
                ×
              </button>
            </div>
            <div className="message-detail-body">
              <div className="message-meta">
                <div className="meta-item">
                  <strong>From:</strong> {selectedMessage.sender}
                </div>
                <div className="meta-item">
                  <strong>Time:</strong> {selectedMessage.time}
                </div>
                <div className="meta-item">
                  <strong>Type:</strong> 
                  <span className={`type-badge ${selectedMessage.type}`}>
                    {selectedMessage.type.charAt(0).toUpperCase() + selectedMessage.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="message-content-detail">
                <p>{selectedMessage.details}</p>
              </div>
            </div>
            <div className="message-detail-footer">
              <button className="reply-btn">Reply</button>
              <button 
                className="mark-read-btn" 
                onClick={() => markSingleAsRead(selectedMessage.id)}
              >
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '740px' }}>
            <div className="modal-header">
              <h3>{selectedUser ? 'Edit User' : (formRole === 'student' ? 'Register Student & Auto-Generate Credentials' : 'Add New User & Generate Credentials')}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                }}
              >
                ×
              </button>
            </div>
            <form className="modal-body" onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const userData = {
                fullName: formFullName.trim() || formData.get('fullName') || '',
                nameWithInitials: formNameWithInitials.trim() || formData.get('nameWithInitials') || '',
                email: formData.get('email'),
                username: formData.get('username') || formUsername,
                indexNumber: formData.get('indexNumber') || formIndexNumber,
                password: formData.get('password') || formPassword,
                role: formData.get('role') || formRole,
                status: formData.get('status') || 'Active',
                phone: formData.get('phone') || '',
                grade: studentGrade || formData.get('grade') || 'Grade 10',
                className: studentClass || formData.get('className') || 'A',
                subject: formData.get('subject') || (teacherSubjects[0] || '')
              }
              
              console.log('Form submitted with data:', userData)
              
              if (selectedUser) {
                handleUpdateUser(userData)
              } else {
                handleAddUser(userData)
              }
            }}>
              {!selectedUser && (
                <div className="admin-form-tip">
                  <strong>Auto-Credential Generation:</strong> Unique Index Number, Username, and Password are automatically generated. You can customize them or click regenerate.
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>Role *</label>
                  <select 
                    name="role"
                    value={formRole}
                    onChange={(e) => {
                      const newRole = e.target.value
                      setFormRole(newRole)
                      if (!selectedUser) {
                        const newIdx = generateIndexNumber(newRole)
                        setFormIndexNumber(newIdx)
                        const genUser = generateUsername(formFullName, formNameWithInitials, newIdx)
                        setFormUsername(genUser)
                      }
                    }}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="e.g. Kasun Kalhara Perera"
                    value={formFullName}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormFullName(val)
                      if (!selectedUser) {
                        const initials = generateNameWithInitials(val)
                        setFormNameWithInitials(initials)
                        const gen = generateUsername(val, initials, formIndexNumber)
                        setFormUsername(gen)
                      }
                    }}
                    required
                  />
                </div>

                {formRole === 'student' && (
                  <div className="form-group">
                    <label>Name with Initials *</label>
                    <input 
                      type="text" 
                      name="nameWithInitials"
                      placeholder="e.g. K. K. Perera"
                      value={formNameWithInitials}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormNameWithInitials(val)
                        if (!selectedUser && val.trim() && !formFullName.trim()) {
                          const gen = generateUsername('', val, formIndexNumber)
                          setFormUsername(gen)
                        }
                      }}
                      required
                    />
                  </div>
                )}

                {formRole === 'student' && (
                  <>
                    <div className="form-group">
                      <label>Grade *</label>
                      <select 
                        name="grade"
                        value={studentGrade}
                        onChange={(e) => setStudentGrade(e.target.value)}
                        required
                      >
                        {PRESET_GRADES.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Class / Section *</label>
                      <select 
                        name="className"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        required
                      >
                        {PRESET_SECTIONS.map(sec => (
                          <option key={sec} value={sec}>
                            Section {sec} ({studentGrade.replace('Grade ', '')}-{sec})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group full-width" style={{ marginTop: '-0.25rem', marginBottom: '0.25rem' }}>
                      <div className="student-class-preview-chip">
                        <GraduationCap size={16} color="#059669" />
                        <span>Enrolling Student to: <strong>{studentGrade} - Section {studentClass}</strong> (Class ID: <strong>{studentGrade.replace('Grade ', '')}-{studentClass}</strong>)</span>
                      </div>
                    </div>
                  </>
                )}

                {!selectedUser && (
                  <>
                    <div className="form-group">
                      <label>Generated Index Number *</label>
                      <div className="generated-input-group">
                        <input 
                          type="text" 
                          name="indexNumber"
                          value={formIndexNumber}
                          onChange={(e) => setFormIndexNumber(e.target.value.toUpperCase())}
                          required
                        />
                        <button 
                          type="button" 
                          className="input-action-btn"
                          title="Regenerate Index Number"
                          onClick={() => {
                            const newIdx = generateIndexNumber(formRole)
                            setFormIndexNumber(newIdx)
                            if (!formFullName.trim()) {
                              setFormUsername(newIdx.toLowerCase())
                            }
                          }}
                        >
                          <RotateCw size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Generated Username *</label>
                      <div className="generated-input-group">
                        <input 
                          type="text" 
                          name="username"
                          value={formUsername}
                          onChange={(e) => setFormUsername(e.target.value.toLowerCase())}
                          required
                        />
                        <button 
                          type="button" 
                          className="input-action-btn"
                          title="Regenerate Username"
                          onClick={() => {
                            setFormUsername(generateUsername(formFullName, formNameWithInitials, formIndexNumber))
                          }}
                        >
                          <RotateCw size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Generated Password *</label>
                      <div className="generated-input-group">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          name="password"
                          value={formPassword}
                          onChange={(e) => setFormPassword(e.target.value)}
                          required
                        />
                        <button 
                          type="button" 
                          className="input-action-btn"
                          title={showPassword ? 'Hide Password' : 'Show Password'}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button 
                          type="button" 
                          className="input-action-btn"
                          title="Regenerate Password"
                          onClick={() => setFormPassword(generatePassword())}
                        >
                          <RotateCw size={13} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Email Address {selectedUser ? '*' : '(Optional)'}</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder={!selectedUser && formUsername ? `${formUsername}@smarted.school` : 'Enter email address'}
                    defaultValue={selectedUser?.email || ''}
                    required={!!selectedUser}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Enter phone number"
                    defaultValue={selectedUser?.phone || ''}
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select 
                    name="status"
                    defaultValue={selectedUser?.status || 'Active'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {formRole === 'teacher' && (
                  <div className="teacher-config-section full-width">
                    <div className="section-divider">
                      <span>Teacher Assignment Settings</span>
                    </div>

                    {/* Part 1: Subjects selection */}
                    <div className="teacher-config-block">
                      <div className="config-block-header">
                        <label className="config-label">
                          1. Subject(s) Taught <span className="req">*</span>
                        </label>
                        <span className="config-hint">Select all subjects this teacher teaches</span>
                      </div>

                      {/* Selected subjects tags */}
                      <div className="selected-tags-container">
                        {teacherSubjects.length === 0 ? (
                          <span className="empty-selection-note">No subjects selected yet. Click from quick select below or type a custom subject.</span>
                        ) : (
                          teacherSubjects.map((subj) => (
                            <span key={subj} className="tag-chip active-chip">
                              <span className="chip-icon"><BookOpen size={12} /></span>
                              <span className="chip-text">{subj}</span>
                              <button
                                type="button"
                                className="tag-remove-btn"
                                onClick={() => handleRemoveTeacherSubject(subj)}
                                title={`Remove ${subj}`}
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      {/* Preset subject pills */}
                      <div className="preset-chips-wrap">
                        <span className="preset-label">Quick select:</span>
                        <div className="preset-chips-list">
                          {PRESET_SUBJECTS.map((subj) => {
                            const isSelected = teacherSubjects.includes(subj)
                            return (
                              <button
                                key={subj}
                                type="button"
                                className={`chip-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                  if (isSelected) {
                                    handleRemoveTeacherSubject(subj)
                                  } else {
                                    handleAddTeacherSubject(subj)
                                  }
                                }}
                              >
                                {isSelected ? <Check size={12} style={{ display: 'inline', marginRight: '4px' }} /> : '+ '}{subj}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Custom subject input */}
                      <div className="custom-input-row">
                        <input
                          type="text"
                          placeholder="Or enter custom subject (e.g. French, Japanese)..."
                          value={customSubjectInput}
                          onChange={(e) => setCustomSubjectInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddTeacherSubject(customSubjectInput)
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="action-pill-btn"
                          onClick={() => handleAddTeacherSubject(customSubjectInput)}
                        >
                          + Add Subject
                        </button>
                      </div>
                    </div>

                    {/* Part 2: Assign Classes with Subject */}
                    <div className="teacher-config-block">
                      <div className="config-block-header">
                        <label className="config-label">
                          2. Assign Classes & Subject Taught
                        </label>
                        <span className="config-hint">Pair each class with the subject taught to them</span>
                      </div>

                      {/* Assignment Builder Controls */}
                      <div className="builder-row">
                        <div className="builder-col">
                          <label>Grade</label>
                          <select
                            value={assignGrade}
                            onChange={(e) => setAssignGrade(e.target.value)}
                          >
                            {PRESET_GRADES.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>

                        <div className="builder-col">
                          <label>Section</label>
                          <select
                            value={assignSection}
                            onChange={(e) => setAssignSection(e.target.value)}
                          >
                            {PRESET_SECTIONS.map(s => (
                              <option key={s} value={s}>Section {s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="builder-col">
                          <label>Subject</label>
                          <select
                            value={assignSubject || (teacherSubjects[0] || '')}
                            onChange={(e) => setAssignSubject(e.target.value)}
                          >
                            {teacherSubjects.length > 0 ? (
                              teacherSubjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))
                            ) : (
                              <option value="">(Select a subject first)</option>
                            )}
                          </select>
                        </div>

                        <div className="builder-btn-col">
                          <button
                            type="button"
                            className="assign-add-btn"
                            onClick={handleAddClassAssignment}
                          >
                            + Assign Class
                          </button>
                        </div>
                      </div>

                      {/* Current assignments list */}
                      <div className="assignments-table-wrap">
                        {teacherClassAssignments.length === 0 ? (
                          <div className="empty-assignments-msg">
                            No classes assigned yet. Select a grade, section, and subject above, then click "+ Assign Class".
                          </div>
                        ) : (
                          <div className="assignment-cards-grid">
                            {teacherClassAssignments.map((assignment) => (
                              <div key={assignment.id} className="assignment-badge-card">
                                <div className="badge-class-icon"><GraduationCap size={15} color="#059669" /></div>
                                <div className="badge-details">
                                  <span className="badge-class-name">{assignment.classId}</span>
                                  <span className="badge-subject-name">{assignment.subject}</span>
                                </div>
                                <button
                                  type="button"
                                  className="remove-assignment-btn"
                                  title="Remove assignment"
                                  onClick={() => handleRemoveClassAssignment(assignment.id)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Part 3: Class In-Charge */}
                    <div className="teacher-config-block">
                      <div className="config-block-header">
                        <label className="config-label">
                          3. Class In-Charge (Homeroom Teacher)
                        </label>
                        <span className="config-hint">Select a class if this teacher is the designated class/homeroom in-charge</span>
                      </div>

                      <div className="incharge-select-row">
                        <select
                          value={teacherInChargeClass}
                          onChange={(e) => setTeacherInChargeClass(e.target.value)}
                          className="incharge-dropdown"
                        >
                          <option value="">None (Not a class in-charge)</option>
                          {teacherClassAssignments.length > 0 && (
                            <optgroup label="From Assigned Classes">
                              {Array.from(new Set(teacherClassAssignments.map(a => a.classId))).map(cls => (
                                <option key={`assigned-${cls}`} value={cls}>Class In-Charge: {cls}</option>
                              ))}
                            </optgroup>
                          )}
                          <optgroup label="All Classes">
                            {PRESET_GRADES.flatMap(g => 
                              PRESET_SECTIONS.map(s => {
                                const id = `${g.replace('Grade ', '').trim()}-${s}`
                                return (
                                  <option key={`all-${id}`} value={id}>Class In-Charge: {id}</option>
                                )
                              })
                            )}
                          </optgroup>
                        </select>
                        {teacherInChargeClass && (
                          <span className="incharge-active-indicator">
                            Class Teacher: <strong>{teacherInChargeClass}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                }}
              >
                <span className="btn-icon"><X size={14} /></span>
                Cancel
              </button>
              <button 
                className="save-btn"
                type="button"
                onClick={() => {
                  const form = document.querySelector('.modal-content form')
                  if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                  }
                }}
              >
                <span className="btn-icon">{selectedUser ? <Edit2 size={14} /> : <Plus size={14} />}</span>
                {selectedUser ? 'Update User' : 'Register User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Created Popup Modal */}
      {showCredentialsModal && createdCredentials && (
        <div className="modal-overlay credentials-modal-overlay">
          <div className="modal-content credentials-modal-content">
            <div className="modal-header credentials-modal-header">
              <div className="credentials-success-badge"><CheckCircle2 size={16} /> User Registered Successfully</div>
              <button 
                className="close-modal"
                onClick={() => setShowCredentialsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body credentials-modal-body">
              <p className="credentials-intro">
                New user registered by Administrator. Please share the generated credentials with the user:
              </p>

              <div className="credentials-card">
                <div className="credential-row">
                  <span className="credential-label">Full Name:</span>
                  <span className="credential-value">{createdCredentials.fullName}</span>
                </div>
                {createdCredentials.nameWithInitials && (
                  <div className="credential-row">
                    <span className="credential-label">Name with Initials:</span>
                    <span className="credential-value">{createdCredentials.nameWithInitials}</span>
                  </div>
                )}
                {createdCredentials.role === 'student' && (
                  <div className="credential-row">
                    <span className="credential-label">Grade & Class:</span>
                    <span className="credential-value">
                      {createdCredentials.grade} - Section {createdCredentials.className} ({createdCredentials.classId})
                    </span>
                  </div>
                )}
                <div className="credential-row">
                  <span className="credential-label">Role:</span>
                  <span className="credential-value role-tag">{createdCredentials.role.toUpperCase()}</span>
                </div>
                <div className="credential-row highlight-row">
                  <span className="credential-label">Index Number:</span>
                  <span className="credential-value credential-code">{createdCredentials.indexNumber}</span>
                </div>
                <div className="credential-row highlight-row">
                  <span className="credential-label">Username:</span>
                  <span className="credential-value credential-code">{createdCredentials.username}</span>
                </div>
                <div className="credential-row highlight-row">
                  <span className="credential-label">Password:</span>
                  <span className="credential-value credential-code">{createdCredentials.password}</span>
                </div>
                <div className="credential-row">
                  <span className="credential-label">Email:</span>
                  <span className="credential-value">{createdCredentials.email}</span>
                </div>
              </div>

              <div className="credentials-tip">
                The user can now log in at the home page using their <strong>Username</strong> (or Index Number) and <strong>Password</strong>.
              </div>
            </div>
            <div className="modal-footer credentials-modal-footer">
              <button 
                className="copy-credentials-btn"
                type="button"
                onClick={() => {
                  const textToCopy = `SmartED Login Credentials:
Full Name: ${createdCredentials.fullName}
${createdCredentials.nameWithInitials ? `Name with Initials: ${createdCredentials.nameWithInitials}\n` : ''}${createdCredentials.role === 'student' ? `Grade & Class: ${createdCredentials.grade} - Section ${createdCredentials.className} (${createdCredentials.classId})\n` : ''}Role: ${createdCredentials.role}
Index Number: ${createdCredentials.indexNumber}
Username: ${createdCredentials.username}
Password: ${createdCredentials.password}
Email: ${createdCredentials.email}
Portal: ${window.location.origin}`
                  navigator.clipboard.writeText(textToCopy)
                  setCopiedCredentials(true)
                  showToast('Credentials copied to clipboard!', 'success')
                  setTimeout(() => setCopiedCredentials(false), 2500)
                }}
              >
                <span className="btn-icon">{copiedCredentials ? <Check size={14} /> : <Copy size={14} />}</span>
                {copiedCredentials ? 'Copied to Clipboard!' : 'Copy All Credentials'}
              </button>
              <button 
                className="save-btn"
                type="button"
                onClick={() => setShowCredentialsModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowCourseModal(false)
                  setSelectedCourse(null)
                  setCourseLevel('O/L')
                }}
              >
                ×
              </button>
            </div>
            <form className="modal-body" onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const courseData = {
                name: formData.get('name'),
                level: formData.get('level'),
                teacher: formData.get('teacher'),
                status: formData.get('status')
              }
              
              // Only add stream for A/L courses
              if (courseData.level === 'A/L') {
                courseData.stream = formData.get('stream') || ''
              }
              
              console.log('Course form submitted with data:', courseData)
              
              if (selectedCourse) {
                handleUpdateCourse(courseData)
              } else {
                handleAddCourse(courseData)
              }
            }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter course name"
                    defaultValue={selectedCourse?.name || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Level *</label>
                  <select 
                    name="level"
                    defaultValue={selectedCourse?.level || 'O/L'}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    required
                  >
                    <option value="O/L">O/L (Ordinary Level)</option>
                    <option value="A/L">A/L (Advanced Level)</option>
                  </select>
                </div>
                {courseLevel === 'A/L' && (
                  <div className="form-group">
                    <label>Stream *</label>
                    <select 
                      name="stream"
                      defaultValue={selectedCourse?.stream || ''}
                      required={courseLevel === 'A/L'}
                    >
                      <option value="">Select Stream</option>
                      <option value="Physical Science">Physical Science</option>
                      <option value="Biological Science">Biological Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Teacher *</label>
                  <select 
                    name="teacher"
                    defaultValue={selectedCourse?.teacher || ''}
                    required
                  >
                    <option value="">Select Teacher</option>
                    <option value="Mr. Sunil Perera">Mr. Sunil Perera</option>
                    <option value="Dr. Amara Silva">Dr. Amara Silva</option>
                    <option value="Mrs. Kushani Jayawardena">Mrs. Kushani Jayawardena</option>
                    <option value="Mrs. Chamari Wickramasinghe">Mrs. Chamari Wickramasinghe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select 
                    name="status"
                    defaultValue={selectedCourse?.status || 'Active'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {selectedCourse && (
                <div className="course-stats-detail">
                  <h4>Course Statistics</h4>
                  <div className="stats-row">
                    <div className="stat-item">
                      <span>Enrolled Students:</span>
                      <strong>{selectedCourse.students || 0}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Level:</span>
                      <strong>{selectedCourse.level}</strong>
                    </div>
                    {selectedCourse.stream && (
                      <div className="stat-item">
                        <span>Stream:</span>
                        <strong>{selectedCourse.stream}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setShowCourseModal(false)
                  setSelectedCourse(null)
                  setCourseLevel('O/L')
                }}
              >
                <span className="btn-icon"><X size={14} /></span>
                Cancel
              </button>
              <button 
                className="save-btn"
                type="button"
                onClick={() => {
                  const form = document.querySelector('.modal-content form')
                  if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                  }
                }}
              >
                <span className="btn-icon">{selectedCourse ? <Edit2 size={14} /> : <Plus size={14} />}</span>
                {selectedCourse ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay confirm-overlay">
          <div className="modal-content confirm-modal">
            <div className="modal-header">
              <h3>{confirmConfig.title}</h3>
            </div>
            <div className="modal-body">
              <div className={`confirm-icon confirm-icon-${confirmConfig.type}`}>
                {confirmConfig.type === 'danger' && <AlertTriangle size={24} color="#ef4444" />}
                {confirmConfig.type === 'warning' && <AlertTriangle size={24} color="#f59e0b" />}
                {confirmConfig.type === 'info' && <Info size={24} color="#059669" />}
              </div>
              <p className="confirm-message">{confirmConfig.message}</p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={handleCancelConfirm}
              >
                <span className="btn-icon"><X size={14} /></span>
                {confirmConfig.cancelText}
              </button>
              <button 
                className={`confirm-btn confirm-btn-${confirmConfig.type}`}
                onClick={handleConfirm}
              >
                <span className="btn-icon">
                  {confirmConfig.type === 'danger' && <Trash2 size={14} />}
                  {confirmConfig.type === 'warning' && <AlertTriangle size={14} />}
                  {confirmConfig.type === 'info' && <Check size={14} />}
                </span>
                {confirmConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && <Check size={14} />}
              {toast.type === 'error' && <X size={14} />}
              {toast.type === 'info' && <Info size={14} />}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard



