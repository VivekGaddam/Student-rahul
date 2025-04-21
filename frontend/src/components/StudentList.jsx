import React from 'react';
import PropTypes from 'prop-types';
import StudentCard from './StudentCard.jsx';
import './UserList.css'; // Updated name

const StudentList = ({ students, handleEdit, handleDelete, loading }) => {
  if (loading && students.length === 0) {
    return (
      <div className="user-list-container">
        <h2 className="user-list-title">Students</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">
        <span className="user-list-icon">🎓</span>
        Students
        <span className="user-count">{students.length}</span>
      </h2>

      {students.length === 0 ? (
        <div className="no-users">
          <p>No students found. Add a new one to get started!</p>
        </div>
      ) : (
        <div className="user-list">
          {students.map(student => (
            <StudentCard
              key={student._id}
              student={student}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

StudentList.propTypes = {
  students: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default StudentList;
