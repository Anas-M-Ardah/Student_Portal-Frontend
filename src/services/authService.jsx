// src/services/authService.js
import axios from 'axios';

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class AuthService {
    // Student Login

    async studentLogin(email, password) {
        try {
            const response = await api.post('/students/login', { email, password });
            console.log(response.data);

            if (response.data.success) {
                this.setAuthData('student', response.data);
                return response.data;
            }

            throw new Error('Student login failed');
        } catch (error) {
            // Check if error has a response from the server
            if (error.response) {
                // The request was made and the server responded with a status code
                switch (error.response.status) {
                    case 400:
                        throw new Error('Invalid input. Please check your email and password.');

                    case 401:
                        // Unauthorized - could be invalid credentials
                        throw new Error('Invalid email or password. Please try again.');

                    case 403:
                        // Forbidden - could be account not activated or blocked
                        throw new Error('Access denied. Your account may be inactive or blocked.');

                    case 404:
                        // Not found - could be user doesn't exist
                        throw new Error('Student account not found. Please register.');

                    case 422:
                        // Unprocessable Entity - validation errors
                        const validationErrors = error.response.data.errors;
                        if (validationErrors) {
                            const errorMessages = validationErrors.map(err => err.msg).join(', ');
                            throw new Error(`Validation failed: ${errorMessages}`);
                        }
                        throw new Error('Validation failed. Please check your input.');

                    case 429:
                        // Too Many Requests
                        throw new Error('Too many login attempts. Please try again later.');

                    case 500:
                        // Internal Server Error
                        throw new Error('Server error. Please try again later.');

                    case 503:
                        // Service Unavailable
                        throw new Error('Service is currently unavailable. Please try again later.');

                    default:
                        // Generic error for any other status code
                        throw new Error(
                            error.response.data.message ||
                            'An unexpected error occurred during login.'
                        );
                }
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('No response from server. Please check your internet connection.');
            } else {
                // Something happened in setting up the request
                throw new Error('Error setting up the login request. Please try again.');
            }
        }
    }

    // Teacher Login
    async teacherLogin(email, password) {
        try {
            const response = await api.post('/teachers/login', { email, password });

            if (response.data.success) {
                this.setAuthData('teacher', response.data);
                return response.data;
            }

            throw new Error(response.data.message || 'Teacher login failed');
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    // Set Authentication Data
    setAuthData(userType, data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userType', userType);
    }

    // Handle Authentication Errors
    handleAuthError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            throw new Error(
                error.response.data.message ||
                'Authentication failed. Please try again.'
            );
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Something happened in setting up the request
            throw new Error('An unexpected error occurred');
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        window.location.href = '/login';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Get Current User
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Get User Type
    getUserType() {
        return localStorage.getItem('userType');
    }

    // Refresh Token
    async refreshToken() {
        try {
            const response = await api.post('/auth/refresh-token');

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                return response.data.token;
            }

            throw new Error('Token refresh failed');
        } catch (error) {
            this.handleAuthError(error);
            this.logout(); // Logout if refresh fails
        }
    }

    // Password Reset Request
    async requestPasswordReset(email, userType) {
        try {
            const endpoint = userType === 'student'
                ? '/students/forgot-password'
                : '/teachers/forgot-password';

            const response = await api.post(endpoint, { email });

            return response.data;
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    // Verify Password Reset Token
    async verifyPasswordResetToken(token, userType) {
        try {
            const endpoint = userType === 'student'
                ? '/students/verify-reset-token'
                : '/teachers/verify-reset-token';

            const response = await api.post(endpoint, { token });

            return response.data;
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    // Reset Password
    async resetPassword(token, newPassword, userType) {
        try {
            const endpoint = userType === 'student'
                ? '/students/reset-password'
                : '/teachers/reset-password';

            const response = await api.post(endpoint, {
                token,
                newPassword
            });

            return response.data;
        } catch (error) {
            this.handleAuthError(error);
        }
    }
}

// Export a singleton instance
export default new AuthService();