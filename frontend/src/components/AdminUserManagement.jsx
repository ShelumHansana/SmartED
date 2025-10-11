import React, { useState } from 'react';
import '../styles/AdminUserManagement.css';

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@smarted.com', role: 'Student', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@smarted.com', role: 'Teacher', status: 'Active' },
  { id: 3, name: 'Carol Lee', email: 'carol@smarted.com', role: 'Parent', status: 'Inactive' },
  { id: 4, name: 'David Kim', email: 'david@smarted.com', role: 'Admin', status: 'Active' },
];

const roles = ['Student', 'Teacher', 'Parent', 'Admin'];

export default function AdminUserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Student', status: 'Active' });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditing(user.id);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleSave = () => {
    if (editing) {
      setUsers(users.map(u => u.id === editing ? { ...u, ...form } : u));
      setEditing(null);
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    setForm({ name: '', email: '', role: 'Student', status: 'Active' });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'Student', status: 'Active' });
  };

  return (
    <div className="admin-user-management">
      <div className="aum-header">
        <h2>User Management</h2>
        <input
          type="text"
          className="aum-search"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className="aum-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className={editing === user.id ? 'aum-editing' : ''}>
              <td>{editing === user.id ? (
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              ) : user.name}</td>
              <td>{editing === user.id ? (
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              ) : user.email}</td>
              <td>{editing === user.id ? (
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
              ) : user.role}</td>
              <td>{editing === user.id ? (
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              ) : user.status}</td>
              <td>
                {editing === user.id ? (
                  <>
                    <button className="aum-btn save" onClick={handleSave}>Save</button>
                    <button className="aum-btn cancel" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="aum-btn edit" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="aum-btn delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr className="aum-add-row">
            <td><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" /></td>
            <td><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" /></td>
            <td>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </td>
            <td>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </td>
            <td>
              <button className="aum-btn add" onClick={handleSave} disabled={!form.name || !form.email}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
