import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { storage, db } from '../utils/firebase'
import './ImageUpload.css'

const ImageUpload = ({ userId, currentImageUrl, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImageUrl || null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setUploading(true)

    try {
      // Create storage reference
      const timestamp = Date.now()
      const storageRef = ref(storage, `profile-images/${userId}/${timestamp}_${selectedFile.name}`)

      // Upload file
      await uploadBytes(storageRef, selectedFile)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update user document with photo URL
      await updateDoc(doc(db, 'users', userId), {
        photoURL: downloadURL,
        updatedAt: new Date()
      })

      setUploading(false)
      alert('Profile image updated successfully!')
      
      if (onUploadComplete) {
        onUploadComplete(downloadURL)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploading(false)
      alert('Error uploading image. Please try again.')
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(currentImageUrl || null)
  }

  return (
    <div className="image-upload-container">
      <div className="image-preview">
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="no-image">
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {!selectedFile ? (
          <label htmlFor="imageInput" className="select-button">
            📷 Choose Image
          </label>
        ) : (
          <div className="action-buttons">
            <button 
              className="upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? '⏳ Uploading...' : '✓ Upload'}
            </button>
            <button 
              className="cancel-button"
              onClick={handleCancel}
              disabled={uploading}
            >
              ✕ Cancel
            </button>
          </div>
        )}
      </div>

      <p className="upload-hint">
        Max size: 5MB. Formats: JPEG, PNG, GIF
      </p>
    </div>
  )
}

export default ImageUpload
