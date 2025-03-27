// components/login/UserTypeSelector.jsx
import React from 'react';

const UserTypeSelector = ({ selectedType, onSelectType }) => {
  return (
    <div className="user-type-selector">
      <button
        className={`user-type-btn ${selectedType === 'student' ? 'active' : ''}`}
        onClick={() => onSelectType('student')}
      >
        Student Login
      </button>
      <button
        className={`user-type-btn ${selectedType === 'teacher' ? 'active' : ''}`}
        onClick={() => onSelectType('teacher')}
      >
        Teacher Login
      </button>
    </div>
  );
};

export default UserTypeSelector;