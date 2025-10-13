import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '../utils/firebase'
import './FileUpload.css'

const FileUpload = ({ userId, userRole, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileDetails, setFileDetails] = useState({
    title: '',
    description: '',
    category: 'activity',
    forClass: '',
    subject: ''
  })

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileDetails.title) {
      alert('Please provide a title and select a file')
      return
    }

    setUploading(true)

    try {
      // Create storage reference
      const timestamp = Date.now()
      const folderPath = userRole === 'teacher' ? 'resources' : 'submissions'
      const storageRef = ref(storage, `${folderPath}/${userId}/${timestamp}_${selectedFile.name}`)

      // Upload file
      await uploadBytes(storageRef, selectedFile)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Save metadata to Firestore
      const fileData = {
        ...fileDetails,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileURL: downloadURL,
        uploadedBy: userId,
        uploaderRole: userRole,
        createdAt: serverTimestamp()
      }

      const collectionName = userRole === 'teacher' ? 'activities' : 'submissions'
      await addDoc(collection(db, collectionName), fileData)

      setUploading(false)
      alert('File uploaded successfully!')
      
      // Reset form
      setSelectedFile(null)
      setFileDetails({
        title: '',
        description: '',
        category: 'activity',
        forClass: '',
        subject: ''
      })
      
      if (onUploadComplete) {
        onUploadComplete(fileData)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploading(false)
      alert('Error uploading file. Please try again.')
    }
  }

  return (
    <div className="file-upload-container">
      <h3>📤 Upload File</h3>
      
      <div className="upload-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={fileDetails.title}
            onChange={(e) => setFileDetails({ ...fileDetails, title: e.target.value })}
            placeholder="Enter file title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={fileDetails.description}
            onChange={(e) => setFileDetails({ ...fileDetails, description: e.target.value })}
            placeholder="Brief description (optional)"
            rows="3"
          />
        </div>

        {userRole === 'teacher' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Class</label>
                <input
                  type="text"
                  value={fileDetails.forClass}
                  onChange={(e) => setFileDetails({ ...fileDetails, forClass: e.target.value })}
                  placeholder="e.g., Grade 12 M1"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={fileDetails.subject}
                  onChange={(e) => setFileDetails({ ...fileDetails, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={fileDetails.category}
                onChange={(e) => setFileDetails({ ...fileDetails, category: e.target.value })}
              >
                <option value="activity">Activity/Assignment</option>
                <option value="resource">Study Resource</option>
                <option value="notes">Notes</option>
                <option value="past-paper">Past Paper</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Select File *</label>
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
          />
          {selectedFile && (
            <div className="file-info">
              <span>📎 {selectedFile.name}</span>
              <span className="file-size">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading || !selectedFile || !fileDetails.title}
        >
          {uploading ? '⏳ Uploading...' : '✓ Upload File'}
        </button>
      </div>

      <div className="upload-hints">
        <p><strong>Accepted formats:</strong> PDF, Word, PowerPoint, Excel, Text, Images</p>
        <p><strong>Max size:</strong> 10MB</p>
      </div>
    </div>
  )
}

export default FileUpload
