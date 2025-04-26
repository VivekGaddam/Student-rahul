import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API = '';

// Sidebar Component - replaces the Navbar for a vertical layout
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">SM</div>
        <h2 className="app-name">Student Portal</h2>
      </div>
      <div className="menu-divider">Main Menu</div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/">
            <span className="menu-icon">📊</span>
            <span className="menu-text">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/add">
            <span className="menu-icon">➕</span>
            <span className="menu-text">Register Student</span>
          </Link>
        </li>
        <li>
          <Link to="/manage">
            <span className="menu-icon">📝</span>
            <span className="menu-text">Student Records</span>
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <p>Version 2.0</p>
        <p>© 2025 Student Portal</p>
      </div>
    </div>
  );
};

// Dashboard (formerly Home page) - Redesigned student list view
const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, departments: 0 });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API}/students`);
        setStudents(res.data);
        
        // Calculate stats
        const active = res.data.filter(s => s.isActive).length;
        const departments = new Set(res.data.map(s => s.department)).size;
        setStats({
          total: res.data.length,
          active: active,
          departments: departments
        });
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading student data...</p>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Student Dashboard</h1>
        <div className="header-actions">
          <Link to="/add" className="button primary">Register New Student</Link>
        </div>
      </header>

      <div className="section-header">
        <h2>Recent Students</h2>
        <Link to="/manage" className="view-all">View All Records</Link>
      </div>

      <div className="student-grid">
        {students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Student Records Found</h3>
            <p>Add your first student to get started</p>
            <Link to="/add" className="button primary">Add Student Now</Link>
          </div>
        ) : (
          students.slice(0, 6).map(student => (
            <div className="student-card" key={student._id}>
              <div className="student-card-header">
                <div className="avatar">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                <div className="status-badge">
                  {student.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="student-card-body">
                <h3>{student.firstName} {student.lastName}</h3>
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{student.studentId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{student.department || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{student.email}</span>
                </div>
              </div>
              <div className="student-card-footer">
                <Link to={`/edit/${student._id}`} className="card-action edit">Edit</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Register Student Page (formerly Add Student)
const RegisterStudent = () => {
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
  const [message, setMessage] = useState({ text: '', type: '' });
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
      setMessage({ text: 'Student registered successfully!', type: 'success' });
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
      setMessage({ text: 'Failed to register student. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts',
    'Science',
    'Mathematics',
    'Medicine',
    'Law'
  ];

  return (
    <div className="content-wrapper">
      <header className="page-header">
        <h1>Register New Student</h1>
        <Link to="/" className="button secondary">Back to Dashboard</Link>
      </header>

      {message.text && (
        <div className={`notification ${message.type}`}>
          <div className="notification-icon">
            {message.type === 'success' ? '✅' : '❌'}
          </div>
          <div className="notification-message">{message.text}</div>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={form.firstName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={form.lastName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="student@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  name="dob" 
                  value={form.dob} 
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2 className="section-title">Academic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input 
                  type="text" 
                  id="studentId" 
                  name="studentId" 
                  value={form.studentId} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter student ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select 
                  id="department" 
                  name="department" 
                  value={form.department} 
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="enrollmentYear">Enrollment Year</label>
                <input 
                  type="text" 
                  id="enrollmentYear" 
                  name="enrollmentYear" 
                  value={form.enrollmentYear} 
                  onChange={handleChange} 
                  placeholder="YYYY"
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={form.isActive} 
                    onChange={handleChange} 
                  />
                  <span className="checkbox-label">Active Student</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="button secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Student Records Page (formerly Manage Students)
const StudentRecords = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
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
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      setLoading(true);
      try {
        await axios.delete(`${API}/students/${id}`);
        setMessage({ text: 'Student record deleted successfully', type: 'success' });
        fetchStudents();
      } catch (error) {
        setMessage({ text: 'Failed to delete student record', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && student.isActive;
    if (filter === 'inactive') return matchesSearch && !student.isActive;
    return matchesSearch;
  });

  if (loading && students.length === 0) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading student records...</p>
    </div>
  );

  return (
    <div className="content-wrapper">
      <header className="page-header">
        <h1>Student Records</h1>
        <Link to="/add" className="button primary">Register New Student</Link>
      </header>

      {message.text && (
        <div className={`notification ${message.type}`}>
          <div className="notification-icon">
            {message.type === 'success' ? '✅' : '❌'}
          </div>
          <div className="notification-message">{message.text}</div>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="records-table-container">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No matching records found</h3>
            <p>{searchTerm ? 'Try adjusting your search' : 'No student records available'}</p>
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>
                    <div className="student-name-cell">
                      <div className="mini-avatar">{student.firstName.charAt(0)}</div>
                      <span>{student.firstName} {student.lastName}</span>
                    </div>
                  </td>
                  <td>{student.department || 'N/A'}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className={`status-indicator ${student.isActive ? 'active' : 'inactive'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit" 
                        onClick={() => navigate(`/edit/${student._id}`)}
                        title="Edit student"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDelete(student._id)}
                        title="Delete student"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Edit Student Profile Page
const EditStudentProfile = () => {
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
  const [message, setMessage] = useState({ text: '', type: '' });
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
      setMessage({ text: 'Student profile updated successfully', type: 'success' });
      setTimeout(() => navigate('/manage'), 1500);
    } catch (error) {
      setMessage({ text: 'Failed to update student profile', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const departmentOptions = [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts',
    'Science',
    'Mathematics',
    'Medicine',
    'Law'
  ];

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading student profile...</p>
    </div>
  );

  return (
    <div className="content-wrapper">
      <header className="page-header">
        <h1>Edit Student Profile</h1>
        <Link to="/manage" className="button secondary">Back to Records</Link>
      </header>

      {message.text && (
        <div className={`notification ${message.type}`}>
          <div className="notification-icon">
            {message.type === 'success' ? '✅' : '❌'}
          </div>
          <div className="notification-message">{message.text}</div>
        </div>
      )}

      <div className="profile-header">
        <div className="profile-avatar">
          {form.firstName.charAt(0)}{form.lastName.charAt(0)}
        </div>
        <div className="profile-title">
          <h2>{form.firstName} {form.lastName}</h2>
          <span className={`profile-status ${form.isActive ? 'active' : 'inactive'}`}>
            {form.isActive ? 'Active Student' : 'Inactive Student'}
          </span>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={form.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={form.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  name="dob" 
                  value={form.dob} 
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2 className="section-title">Academic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input 
                  type="text" 
                  id="studentId" 
                  name="studentId" 
                  value={form.studentId} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select 
                  id="department" 
                  name="department" 
                  value={form.department} 
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="enrollmentYear">Enrollment Year</label>
                <input 
                  type="text" 
                  id="enrollmentYear" 
                  name="enrollmentYear" 
                  value={form.enrollmentYear} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={form.isActive} 
                    onChange={handleChange} 
                  />
                  <span className="checkbox-label">Active Student</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="button danger" onClick={() => navigate('/manage')}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<RegisterStudent />} />
            <Route path="/manage" element={<StudentRecords />} />
            <Route path="/edit/:id" element={<EditStudentProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;