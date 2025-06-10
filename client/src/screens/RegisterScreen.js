

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const RegisterScreen = () => {
    // State for form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // State for validation errors
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [termsError, setTermsError] = useState('');
    const [generalError, setGeneralError] = useState(''); // For backend errors

    const navigate = useNavigate(); // Hook for navigation

    // Client-side validation function
    const validateForm = () => {
        let isValid = true;

        // Reset all errors first
        setUsernameError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setTermsError('');
        setGeneralError('');

        // Username validation
        if (!username) {
            setUsernameError('Username is required.');
            isValid = false;
        }

        // Password validation (at least 8 chars, contains a number)
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            isValid = false;
        } else if (!/\d/.test(password)) {
            setPasswordError('Password must contain a number.');
            isValid = false;
        }

        // Confirm Password validation
        if (password !== confirmPassword) {
            setConfirmPasswordError('The two passwords do not match.');
            isValid = false;
        }

        // Terms and Conditions checkbox validation
        if (!agreeTerms) {
            setTermsError('You must agree to the Terms and Conditions and Privacy Policy.');
            isValid = false;
        }

        return isValid;
    };

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();

        // Perform client-side validation
        if (!validateForm()) {
            return; // Stop if validation fails
        }

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/register',
                { username, password }, // Only send username and password to backend
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // If registration is successful, log the user in immediately 
            // Or just navigate to login page
            localStorage.setItem('userInfo', JSON.stringify(data));
            console.log('Registration successful:', data);
            navigate('/dashboard'); // Redirect to dashboard after successful registration and login

        } catch (err) {
            console.error('Registration error:', err.response ? err.response.data : err.message);
            // Handle specific backend errors
            const errorMessage = err.response && err.response.data.message
                ? err.response.data.message
                : 'Registration failed. Please try again.';

            // Check for specific messages from backend to show appropriate errors
            if (errorMessage.includes('Username already exists')) {
                setUsernameError(errorMessage);
            } else if (errorMessage.includes('Invalid password')) {
                setPasswordError(errorMessage);
            } else {
                setGeneralError(errorMessage); // Catch-all for other errors
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">App Title</h2>
                <h3 className="text-xl font-semibold text-center mb-6 text-gray-700">Register User</h3>

                {generalError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <p className="font-bold">Error!</p>
                        <p className="text-sm">{generalError}</p>
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 ${usernameError ? 'border-red-500' : ''}`}
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setUsernameError(''); // Clear error on change
                            }}
                            required
                        />
                        {usernameError && <p className="text-red-500 text-xs italic mt-2">{usernameError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 ${passwordError ? 'border-red-500' : ''}`}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError(''); // Clear error on change
                            }}
                            required
                        />
                        {passwordError && <p className="text-red-500 text-xs italic mt-2">{passwordError}</p>}
                        <p className="text-gray-600 text-xs italic mt-1">
                            At least 8 characters long and contains a number.
                        </p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
                            Repeat Password
                        </label>
                        <input
                            type="password"
                            id="repeatPassword"
                            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 ${confirmPasswordError ? 'border-red-500' : ''}`}
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setConfirmPasswordError(''); // Clear error on change
                            }}
                            required
                        />
                        {confirmPasswordError && <p className="text-red-500 text-xs italic mt-2">{confirmPasswordError}</p>}
                    </div>
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            className={`mr-2 leading-tight ${termsError ? 'border-red-500 ring-red-500' : ''}`}
                            checked={agreeTerms}
                            onChange={(e) => {
                                setAgreeTerms(e.target.checked);
                                setTermsError(''); // Clear error on change
                            }}
                        />
                        <label
                            htmlFor="agreeTerms"
                            className={`text-sm ${termsError ? 'text-red-500 font-bold' : 'text-gray-700'}`}
                        >
                            I agree to the Terms and Conditions and Privacy Policy
                        </label>
                    </div>
                    {termsError && <p className="text-red-500 text-xs italic mb-4">{termsError}</p>}
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-bold text-blue-600 hover:text-blue-800">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
