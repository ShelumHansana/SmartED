import { useState } from 'react'

const Notepad = () => {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState('')
  const [title, setTitle] = useState('')

  const saveNote = () => {
    if (currentNote.trim() && title.trim()) {
      setNotes([...notes, { title, content: currentNote, date: new Date().toLocaleString() }])
      setCurrentNote('')
      setTitle('')
    }
  }

  return (
    <div className="notepad-widget">
      <h3>Quick Notes</h3>
      <div className="notepad">
        <div className="note-form">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="note-title"
          />
          <textarea
            placeholder="Write your note here..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="note-content"
          />
          <button onClick={saveNote} className="save-note">Save Note</button>
        </div>
        <div className="notes-list">
          {notes.map((note, index) => (
            <div key={index} className="note-card">
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <span className="note-date">{note.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notepad
