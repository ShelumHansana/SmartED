import { useState, useRef } from 'react'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc, setDoc } from 'firebase/firestore'
import { storage, db } from '../utils/firebase'
import { Camera } from 'lucide-react'
import '../styles/ProfileAvatarUploader.css'

/**
 * Universal Profile Avatar & Image Uploader
 * Supports instant image upload with client-side compression and resilient Storage/Firestore fallback.
 */
const ProfileAvatarUploader = ({ 
  userId, 
  currentImageUrl, 
  displayName = 'User', 
  role = 'User',
  onImageUpdated 
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null)
  const fileInputRef = useRef(null)

  // Compress image using HTML Canvas
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 350
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width)
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height)
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          // Export compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          resolve(compressedDataUrl)
        }
        img.onerror = (err) => reject(err)
        img.src = e.target.result
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please choose a smaller image.')
      return
    }

    setIsUploading(true)

    try {
      // 1. Compress image client-side for fast preview and fallback
      const compressedDataUrl = await compressImage(file)
      setPreviewUrl(compressedDataUrl)

      let finalImageUrl = compressedDataUrl

      // 2. Attempt Firebase Storage upload if available
      try {
        const timestamp = Date.now()
        const storageRef = ref(storage, `profile-images/${userId || 'users'}/${timestamp}.jpg`)
        await uploadString(storageRef, compressedDataUrl, 'data_url')
        finalImageUrl = await getDownloadURL(storageRef)
      } catch (storageErr) {
        console.warn('Firebase Storage upload skipped/failed, using compressed image URL directly:', storageErr)
        finalImageUrl = compressedDataUrl
      }

      // 3. Save to Firestore user record if valid user ID exists
      if (userId && !userId.startsWith('admin-hardcoded')) {
        const userRef = doc(db, 'users', userId)
        try {
          await updateDoc(userRef, {
            profileImage: finalImageUrl,
            photoURL: finalImageUrl,
            updatedAt: new Date()
          })
        } catch {
          await setDoc(userRef, {
            profileImage: finalImageUrl,
            photoURL: finalImageUrl,
            updatedAt: new Date()
          }, { merge: true })
        }
      }

      // 4. Update parent component state and local preview
      setPreviewUrl(finalImageUrl)
      if (onImageUpdated) {
        onImageUpdated(finalImageUrl)
      }
    } catch (err) {
      console.error('Error processing profile image:', err)
      alert('Failed to upload image: ' + err.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerSelect = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click()
    }
  }

  const initial = (displayName || role || 'U').charAt(0).toUpperCase()
  const displayImage = previewUrl || currentImageUrl

  return (
    <div className="profile-uploader-wrapper">
      <div 
        className="profile-uploader-avatar"
        onClick={triggerSelect}
        title="Click to change profile picture"
      >
        {displayImage ? (
          <img src={displayImage} alt={displayName} className="profile-avatar-img" />
        ) : (
          <div className="profile-avatar-initial">{initial}</div>
        )}

        {isUploading && (
          <div className="profile-uploader-overlay">
            <span className="profile-spinner"></span>
          </div>
        )}

        <div className="profile-uploader-badge" title="Change photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Camera size={13} color="#ffffff" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ProfileAvatarUploader
