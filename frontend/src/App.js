import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API = 'https://assignment-2-jfly.onrender.com';

// Navbar Component
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="app-title">Student Manager</div>
      <ul className="nav-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add">Add Student</Link></li>
        <li><Link to="/manage">Manage</Link></li>
      </ul>
    </nav>
  );
};

// Home Page - List of All Students
const Home = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API}/students`);
        setStudents(res.data);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1>All Students</h1>
      <div className="student-list">
        {students.length === 0 ? (
          <p>No students found</p>
        ) : (
          students.map(student => (
            <div className="student-item" key={student._id}>
              <div className="student-details">
                <h3>{student.firstName} {student.lastName}</h3>
                <p>ID: {student.studentId}</p>
                <p>Email: {student.email}</p>
                <p>Department: {student.department || 'N/A'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Add Student Page
const AddStudent = () => {
  const [form, setForm] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/students`, form);
      setMessage('Student added successfully');
      setForm({
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        department: '',
        enrollmentYear: '',
        isActive: true,
      });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMessage('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add New Student</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Student ID</label>
          <input type="text" name="studentId" value={form.studentId} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Department</label>
            <input type="text" name="department" value={form.department} onChange={handleChange} />
          </div>
        </div>

        <div className="form-field">
          <label>Enrollment Year</label>
          <input type="text" name="enrollmentYear" value={form.enrollmentYear} onChange={handleChange} />
        </div>

        <div className="form-field checkbox">
          <label>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active Student
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Student'}</button>
        </div>
      </form>
    </div>
  );
};

// Manage Students Page
const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setLoading(true);
      try {
        await axios.delete(`${API}/students/${id}`);
        setMessage('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        setMessage('Failed to delete student');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && students.length === 0) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1>Manage Students</h1>
      {message && <div className="message">{message}</div>}
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="4">No students found</td></tr>
          ) : (
            students.map(student => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.department || 'N/A'}</td>
                <td>
                  <button className="edit-btn" onClick={() => navigate(`/edit/${student._id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Edit Student Page
const EditStudent = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API}/students/${id}`);
        const student = res.data;
        setForm({
          studentId: student.studentId || '',
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          dob: student.dob ? student.dob.substring(0, 10) : '',
          department: student.department || '',
          enrollmentYear: student.enrollmentYear || '',
          isActive: student.isActive ?? true,
        });
      } catch (error) {
        console.error('Error loading student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.put(`${API}/students/${id}`, form);
      setMessage('Student updated successfully');
      setTimeout(() => navigate('/manage'), 1500);
    } catch (error) {
      setMessage('Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1>Edit Student</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Student ID</label>
          <input type="text" name="studentId" value={form.studentId} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Department</label>
            <input type="text" name="department" value={form.department} onChange={handleChange} />
          </div>
        </div>

        <div className="form-field">
          <label>Enrollment Year</label>
          <input type="text" name="enrollmentYear" value={form.enrollmentYear} onChange={handleChange} />
        </div>

        <div className="form-field checkbox">
          <label>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active Student
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/manage')}>Cancel</button>
          <button type="submit" disabled={submitting}>{submitting ? 'Updating...' : 'Update Student'}</button>
        </div>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddStudent />} />
            <Route path="/manage" element={<ManageStudents />} />
            <Route path="/edit/:id" element={<EditStudent />} />
          </Routes>
        </main>
        <footer>
          <p>Student Management System</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
