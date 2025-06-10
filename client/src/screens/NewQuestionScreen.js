

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const NewQuestionScreen = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // State for question content
    const [content, setContent] = useState('');
    const [title, setTitle] = useState(''); // Optional title field
    // State for error messages
    const [contentError, setContentError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [categoryName, setCategoryName] = useState(''); // To display category name in breadcrumb
    const [userInfo, setUserInfo] = useState(null); // ADDED: State to store user info

    // Fetch user info from localStorage and set to state
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            // If no user info, redirect to login (should be handled by ProtectedRoute too)
            navigate('/login');
        }
    }, [navigate]);

    // Fetch category name to display in the breadcrumb
    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/categories`);
                const currentCategory = data.find(cat => cat.id === parseInt(categoryId));
                if (currentCategory) {
                    setCategoryName(currentCategory.name);
                } else {
                    // If category not found, navigate back to dashboard or show error
                    setGeneralError('Category not found.');
                    // Optionally navigate back after a delay
                    setTimeout(() => navigate('/dashboard'), 3000);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setGeneralError('Failed to load category information.');
            }
        };
        fetchCategoryName();
    }, [categoryId, navigate]);


    // Client-side validation function
    const validateForm = () => {
        let isValid = true;
        setContentError('');
        setGeneralError('');

        if (!content.trim()) {
            setContentError('Question content cannot be empty.');
            isValid = false;
        } else if (!content.trim().endsWith('?')) {
            setContentError('Question content must end with a question mark.');
            isValid = false;
        }
        return isValid;
    };

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop if client-side validation fails
        }

        try {
            // Now userInfo is available from component state
            if (!userInfo || !userInfo.token) {
                navigate('/login'); // Redirect to login if no token
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // Send question to backend
            await axios.post(
                'http://localhost:5000/api/questions',
                { title, content, categoryId: parseInt(categoryId) }, // Ensure categoryId is an integer
                config
            );

            setSuccessMessage('Question submitted successfully!');
            setTimeout(() => {
                navigate(`/dashboard`); // Navigate back to dashboard, which will load the last selected category or prompt selection
            }, 1500); // Redirect after a short delay

        } catch (err) {
            console.error('Error submitting question:', err.response ? err.response.data : err.message);
            setGeneralError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Failed to submit question. Please try again.'
            );
        }
    };

    // Handle "Back to Questions" button click
    const backToQuestionsHandler = () => {
        navigate(`/dashboard`); // Navigate back to dashboard, which will load the last selected category or prompt selection
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header - Replicated from Dashboard or create a common Header component */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">App Title</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Welcome, <span className="font-semibold">{userInfo?.username || 'Guest'}</span></span>
                    <button
                        onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow p-6 bg-gray-50 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                    {/* Breadcrumb / Navigation path */}
                    <div className="text-sm text-gray-600 mb-4">
                        <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>App Title</span>
                        {' > '}
                        {categoryName ? (
                            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>
                                {categoryName}
                            </span>
                        ) : (
                            <span>Category</span>
                        )}
                        {' > New Question'}
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        {userInfo?.username || 'Username'}, enter your question:
                    </h2>

                    {generalError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <p className="font-bold">Error!</p>
                            <p className="text-sm">{generalError}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                            <p className="font-bold">Success!</p>
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Optional Title (e.g., "Camera lens recommendation?")
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                placeholder="Enter an optional title for your question"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionContent">
                                Question Content
                            </label>
                            <textarea
                                id="questionContent"
                                rows="8"
                                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 resize-y ${contentError ? 'border-red-500' : ''}`}
                                placeholder="Type your question here (must end with a question mark)"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setContentError(''); // Clear error on change
                                }}
                                required
                            ></textarea>
                            {contentError && <p className="text-red-500 text-xs italic mt-2">{contentError}</p>}
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
                            >
                                Submit Question
                            </button>
                            <button
                                type="button" // Use type="button" to prevent form submission
                                onClick={backToQuestionsHandler}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
                            >
                                Back to Questions
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default NewQuestionScreen;
