

import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls

const LoginScreen = () => {
    // State to hold username and password input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // State to hold any error messages from login attempts
    const [error, setError] = useState('');

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        setError(''); // Clear previous errors

        try {
            // Make a POST request to your backend login API
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login', // Your backend login endpoint
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // If login is successful, store user data (e.g., token) in local storage
            localStorage.setItem('userInfo', JSON.stringify(data));
            console.log('Login successful:', data);

            // TODO: Redirect to Dashboard after successful login   
        } catch (err) {
            // Handle errors from the backend (e.g., invalid credentials)
            console.error('Login error:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">App Title</h2>
                <h3 className="text-xl font-semibold text-center mb-6 text-gray-700">Login</h3>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <p className="font-bold">Error!</p>
                        <p className="text-sm">{error}</p>
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
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
                        >
                            Login
                        </button>
                        {/* TODO: Add Register Link here later */}
                        <a href="#" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
                            Don't have an account? Register
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
