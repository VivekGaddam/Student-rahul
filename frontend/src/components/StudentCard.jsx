import React, { useState } from 'react';
import './UserCard.css'; // you can rename to StudentCard.css later

const StudentCard = ({ student, handleEdit, handleDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    await handleDelete(student._id);
    setIsDeleting(false);
  };

  return (
    <div className={`user-card ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="user-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="user-photo-container">
          {student.profilePhoto ? (
            <img
              src={student.profilePhoto}
              alt={`${student.firstName}'s profile`}
              className="user-photo"
            />
          ) : (
            <div className="user-photo-placeholder">
              {student.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="user-summary">
          <h3 className="user-name">
            {student.firstName} {student.lastName}
          </h3>
          <p className="user-email">{student.email}</p>
        </div>

        <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
      </div>

      <div className="user-card-details">
        <div className="detail-row">
          <span className="detail-label">Student ID:</span>
          <span className="detail-value">{student.studentId}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">DOB:</span>
          <span className="detail-value">{student.dob?.substring(0, 10)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Department:</span>
          <span className="detail-value">{student.department}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Enrollment Year:</span>
          <span className="detail-value">{student.enrollmentYear}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Active:</span>
          <span className="detail-value">{student.isActive ? 'Yes' : 'No'}</span>
        </div>

        <div className="user-card-actions">
          <button className="edit-btn" onClick={() => handleEdit(student)}>
            <span className="btn-icon">✏️</span>
            Edit
          </button>

          <button
            className={`delete-btn ${isDeleting ? 'deleting' : ''}`}
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <span className="btn-icon">🗑️</span>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
