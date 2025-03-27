// pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <h2>Welcome to {userType === 'student' ? 'Student' : 'Teacher'} Dashboard</h2>
        
        {userType === 'student' && (
          <div className="student-dashboard">
            <h3>Student Information</h3>
            {/* Add student-specific content */}
            <div className="dashboard-section">
              <h4>Current Courses</h4>
              {/* List of courses */}
            </div>
            
            <div className="dashboard-section">
              <h4>Recent Grades</h4>
              {/* Recent grades or assessments */}
            </div>
          </div>
        )}
        
        {userType === 'teacher' && (
          <div className="teacher-dashboard">
            <h3>Teacher Dashboard</h3>
            {/* Add teacher-specific content */}
            <div className="dashboard-section">
              <h4>Your Classes</h4>
              {/* List of classes */}
            </div>
            
            <div className="dashboard-section">
              <h4>Upcoming Assessments</h4>
              {/* List of upcoming assessments */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;