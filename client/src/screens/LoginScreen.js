

import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Hook for programmatic navigation

    // Check if user is already logged in on component load
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            navigate('/dashboard'); // Redirect to dashboard if already logged in
        }
    }, [navigate]); 

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login',
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            console.log('Login successful:', data);
            navigate('/dashboard'); // Redirect to dashboard after successful login

        } catch (err) {
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

                        <Link
                            to="/register"
                            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
                        >
                            Don't have an account? Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
