import { useState } from 'react'

const NotesAndTodos = () => {
  const [notes, setNotes] = useState([])
  const [todos, setTodos] = useState([])
  const [activeTab, setActiveTab] = useState('notes')
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [newTodo, setNewTodo] = useState('')

  const addNote = (e) => {
    e.preventDefault()
    if (newNote.title && newNote.content) {
      setNotes([...notes, { ...newNote, id: Date.now() }])
      setNewNote({ title: '', content: '' })
    }
  }

  const addTodo = (e) => {
    e.preventDefault()
    if (newTodo) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="notes-todos-container">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button
          className={`tab-button ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          To-Do List
        </button>
      </div>

      {activeTab === 'notes' ? (
        <div className="notes-section">
          <form onSubmit={addNote} className="note-form">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <button type="submit">Add Note</button>
          </form>
          <div className="notes-grid">
            {notes.map(note => (
              <div key={note.id} className="note-card">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => deleteNote(note.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="todos-section">
          <form onSubmit={addTodo} className="todo-form">
            <input
              type="text"
              placeholder="Add a new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button type="submit">Add Task</button>
          </form>
          <div className="todos-list">
            {todos.map(todo => (
              <div key={todo.id} className="todo-item">
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? 'completed' : ''}>
                    {todo.text}
                  </span>
                </label>
                <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesAndTodos
