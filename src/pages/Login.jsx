import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Login.css';

const Login = () => {
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call login service
      if (userType === 'student') {
        await authService.studentLogin(email, password);
      } else if (userType === 'teacher') {
        await authService.teacherLogin(email, password);
      }

      // Log and then navigate
      console.log('Login successful, navigating to dashboard');

      // Use setTimeout to ensure logging
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);

    } catch (err) {
      // Set error message
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-primary text-white text-center">
                <h2 className="my-2">Student Portal</h2>
              </div>
              <div className="card-body">
                {/* User Type Selector */}
                <div className="user-type-selector mb-4">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${userType === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setUserType('student')}
                      disabled={isLoading}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      className={`btn ${userType === 'teacher' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setUserType('teacher')}
                      disabled={isLoading}
                    >
                      Teacher
                    </button>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating mb-3 password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                    <button
                      type="button"
                      className="btn btn-outline-secondary password-toggle"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </button>
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <LoadingSpinner size="small" />
                          <span className="ms-2">Logging in...</span>
                        </div>
                      ) : (
                        `Login as ${userType}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small">
                  <a href="#">Forgot Password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Page Overlay Spinner */}
        {isLoading && (
          <div className="spinner-overlay">
            <LoadingSpinner size="large" color="primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;