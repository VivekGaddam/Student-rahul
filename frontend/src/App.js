import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import StudentForm from './components/StudentForm.jsx';
import StudentList from './components/StudentList.jsx';
import Toast from './components/Toast.jsx';
import './App.css';

const API = 'http://localhost:3000';

const App = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: '',
    isActive: true,
    profilePhoto: null,
  });

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/students`);
      setStudents(res.data);
    } catch (error) {
      showToast('Failed to fetch students', 'error');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFile = (e) => {
    setForm(prev => ({ ...prev, profilePhoto: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value !== null) formData.append(key, value);
      });

      if (editingStudentId) {
        await axios.put(`${API}/students/${editingStudentId}`, formData);
        showToast('Student updated successfully', 'success');
      } else {
        await axios.post(`${API}/students`, formData);
        showToast('Student added successfully', 'success');
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      showToast(editingStudentId ? 'Failed to update student' : 'Failed to add student', 'error');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setLoading(true);
      try {
        await axios.delete(`${API}/students/${id}`);
        showToast('Student deleted successfully', 'success');
        fetchStudents();
      } catch (error) {
        showToast('Failed to delete student', 'error');
        console.error('Error deleting student:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      dob: student.dob ? student.dob.substring(0, 10) : '',
      department: student.department,
      enrollmentYear: student.enrollmentYear,
      isActive: student.isActive,
      profilePhoto: null,
    });
    setEditingStudentId(student._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setForm({
      studentId: '',
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      department: '',
      enrollmentYear: '',
      isActive: true,
      profilePhoto: null,
    });
    setEditingStudentId(null);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <StudentForm
          form={form}
          editingStudentId={editingStudentId}
          handleChange={handleChange}
          handleFile={handleFile}
          handleSubmit={handleSubmit}
          handleCancelEdit={handleCancelEdit}
          loading={loading}
        />
        <StudentList
          students={students}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          apiUrl={API}
          loading={loading}
        />
      </main>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default App;
