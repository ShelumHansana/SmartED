import { useState } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('teaching')

  const categories = [
    { id: 'teaching', name: 'Teaching' },
    { id: 'grading', name: 'Grading' },
    { id: 'meetings', name: 'Meetings' },
    { id: 'other', name: 'Other' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          category: selectedCategory,
          completed: false,
          date: new Date().toISOString().split('T')[0]
        }
      ])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="todo-widget">
      <h3>Todo List</h3>
      <div className="todo-container">
        <form onSubmit={handleSubmit} className="todo-form">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-todo">Add</button>
        </form>

        <div className="todos-list">
          {todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
                <span className="todo-category">{
                  categories.find(cat => cat.id === todo.category)?.name
                }</span>
              </div>
              <div className="todo-actions">
                <span className="todo-date">{todo.date}</span>
                <button
                  className="delete-todo"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TodoList
