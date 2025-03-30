// pages/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const name = localStorage.getItem('name');
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const menuItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { id: 'courses', label: 'My Courses', icon: 'fa-book' },
      { id: 'grades', label: 'Grades', icon: 'fa-chart-bar' },
      { id: 'profile', label: 'Profile', icon: 'fa-user' }
    ],
    teacher: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { id: 'classes', label: 'My Classes', icon: 'fa-chalkboard-teacher' },
      { id: 'assignments', label: 'Assignments', icon: 'fa-file-alt' },
      { id: 'students', label: 'Students', icon: 'fa-users' }
    ]
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Model Playground</h2>
        </div>
        <nav className="sidebar-menu">
          {menuItems[userType].map((item) => (
            <Link 
              key={item.id}
              to="#"
              className={`sidebar-menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>
            {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
          </h1>
          <div className="user-info">
            <span>Welcome, {userType === 'student' ? `Student: ${name}` : `Teacher: ${name}`}</span>
          </div>
        </div>

        {/* Conditional Rendering Based on Active Menu */}
        {activeMenu === 'dashboard' && (
          <div className="dashboard-main">
            {userType === 'student' ? (
              <div className="student-dashboard">
                <div className="dashboard-card">
                  <h3>Current Courses</h3>
                  {/* Course list */}
                </div>
                <div className="dashboard-card">
                  <h3>Recent Grades</h3>
                  {/* Grades list */}
                </div>
              </div>
            ) : (
              <div className="teacher-dashboard">
                <div className="dashboard-card">
                  <h3>Your Classes</h3>
                  {/* Classes list */}
                </div>
                <div className="dashboard-card">
                  <h3>Upcoming Assessments</h3>
                  {/* Assessments list */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;