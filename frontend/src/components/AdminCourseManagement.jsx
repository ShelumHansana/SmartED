import React, { useState } from 'react';
import '../styles/AdminCourseManagement.css';

const initialCourses = [
  { id: 1, title: 'Introduction to Mathematics', code: 'MATH101', instructor: 'Dr. Smith', students: 25, status: 'Active' },
  { id: 2, title: 'English Literature', code: 'ENG201', instructor: 'Prof. Johnson', students: 30, status: 'Active' },
  { id: 3, title: 'Physics Fundamentals', code: 'PHY101', instructor: 'Dr. Wilson', students: 20, status: 'Inactive' },
  { id: 4, title: 'Computer Science Basics', code: 'CS101', instructor: 'Prof. Davis', students: 35, status: 'Active' },
  { id: 5, title: 'World History', code: 'HIST301', instructor: 'Dr. Brown', students: 28, status: 'Active' },
];

const statuses = ['Active', 'Inactive', 'Draft'];

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    code: '', 
    instructor: '', 
    students: 0, 
    status: 'Active' 
  });

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (course) => {
    setEditing(course.id);
    setForm({ 
      title: course.title, 
      code: course.code, 
      instructor: course.instructor, 
      students: course.students, 
      status: course.status 
    });
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleSave = () => {
    if (editing) {
      setCourses(courses.map(c => c.id === editing ? { ...c, ...form } : c));
      setEditing(null);
    } else {
      setCourses([...courses, { ...form, id: Date.now() }]);
    }
    setForm({ title: '', code: '', instructor: '', students: 0, status: 'Active' });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ title: '', code: '', instructor: '', students: 0, status: 'Active' });
  };

  return (
    <div className="admin-course-management">
      <div className="acm-header">
        <h2>Course Management</h2>
        <input
          type="text"
          className="acm-search"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      <div className="acm-stats">
        <div className="stat-item">
          <span className="stat-number">{courses.filter(c => c.status === 'Active').length}</span>
          <span className="stat-label">Active Courses</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{courses.reduce((sum, c) => sum + c.students, 0)}</span>
          <span className="stat-label">Total Enrollments</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{new Set(courses.map(c => c.instructor)).size}</span>
          <span className="stat-label">Instructors</span>
        </div>
      </div>

      <table className="acm-table">
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Code</th>
            <th>Instructor</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map(course => (
            <tr key={course.id} className={editing === course.id ? 'acm-editing' : ''}>
              <td>{editing === course.id ? (
                <input 
                  value={form.title} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                  placeholder="Course Title"
                />
              ) : course.title}</td>
              <td>{editing === course.id ? (
                <input 
                  value={form.code} 
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))} 
                  placeholder="Course Code"
                />
              ) : course.code}</td>
              <td>{editing === course.id ? (
                <input 
                  value={form.instructor} 
                  onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} 
                  placeholder="Instructor Name"
                />
              ) : course.instructor}</td>
              <td>{editing === course.id ? (
                <input 
                  type="number" 
                  value={form.students} 
                  onChange={e => setForm(f => ({ ...f, students: parseInt(e.target.value) || 0 }))} 
                  min="0"
                />
              ) : course.students}</td>
              <td>{editing === course.id ? (
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <span className={`status-badge ${course.status.toLowerCase()}`}>
                  {course.status}
                </span>
              )}</td>
              <td>
                {editing === course.id ? (
                  <>
                    <button className="acm-btn save" onClick={handleSave}>Save</button>
                    <button className="acm-btn cancel" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="acm-btn edit" onClick={() => handleEdit(course)}>Edit</button>
                    <button className="acm-btn delete" onClick={() => handleDelete(course.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr className="acm-add-row">
            <td>
              <input 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                placeholder="Course Title" 
              />
            </td>
            <td>
              <input 
                value={form.code} 
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))} 
                placeholder="Course Code" 
              />
            </td>
            <td>
              <input 
                value={form.instructor} 
                onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} 
                placeholder="Instructor Name" 
              />
            </td>
            <td>
              <input 
                type="number" 
                value={form.students} 
                onChange={e => setForm(f => ({ ...f, students: parseInt(e.target.value) || 0 }))} 
                placeholder="0"
                min="0"
              />
            </td>
            <td>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </td>
            <td>
              <button 
                className="acm-btn add" 
                onClick={handleSave} 
                disabled={!form.title || !form.code || !form.instructor}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
