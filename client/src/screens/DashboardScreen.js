

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardScreen = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null); // State to hold logged-in user info
    const [categories, setCategories] = useState([]); // State to hold forum categories
    const [selectedCategory, setSelectedCategory] = useState(null); // State for currently selected category
    const [questions, setQuestions] = useState([]); // State to hold questions for the selected category
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState('');
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [errorQuestions, setErrorQuestions] = useState('');

    useEffect(() => {
        // Check for user info in local storage on component mount
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            // If no user info, redirect to login
            navigate('/login');
        }
    }, [navigate]); // Depend on navigate to avoid lint warnings, although it's stable

    // Fetch categories when component mounts or userInfo changes (i.e., user logs in)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                setErrorCategories('');
                const { data } = await axios.get('http://localhost:5000/api/categories');
                setCategories(data);
                setLoadingCategories(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setErrorCategories('Failed to load categories. Please try again later.');
                setLoadingCategories(false);
            }
        };

        if (userInfo) { // Only fetch if user is logged in
            fetchCategories();
        }
    }, [userInfo]); // Re-fetch categories if userInfo changes

    // Fetch questions when a category is selected
    useEffect(() => {
        const fetchQuestions = async () => {
            if (selectedCategory) {
                try {
                    setLoadingQuestions(true);
                    setErrorQuestions('');
                    const { data } = await axios.get(`http://localhost:5000/api/questions/category/${selectedCategory.id}`);
                    setQuestions(data);
                    setLoadingQuestions(false);
                } catch (err) {
                    console.error('Error fetching questions:', err);
                    setErrorQuestions('Failed to load questions for this category.');
                    setLoadingQuestions(false);
                    setQuestions([]); // Clear questions on error
                }
            } else {
                setQuestions([]); // Clear questions if no category selected
            }
        };

        fetchQuestions();
    }, [selectedCategory]); // Re-fetch questions when selectedCategory changes


    // Handle logout
    const logoutHandler = () => {
        localStorage.removeItem('userInfo'); // Remove user info from local storage
        setUserInfo(null); // Clear user info from state
        navigate('/login'); // Redirect to login page
    };

    if (!userInfo) {
        // Render nothing or a loading spinner while checking auth status
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">App Title</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Welcome, <span className="font-semibold">{userInfo.username}</span></span>
                    <button
                        onClick={logoutHandler}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-grow overflow-hidden">
                {/* Left Sidebar - Categories */}
                <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0 overflow-y-auto custom-scrollbar">
                    <h2 className="text-xl font-bold mb-4">Categories</h2>
                    {loadingCategories ? (
                        <p>Loading categories...</p>
                    ) : errorCategories ? (
                        <p className="text-red-300">{errorCategories}</p>
                    ) : (
                        <nav>
                            <ul>
                                {categories.map((category) => (
                                    <li key={category.id} className="mb-2">
                                        <button
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left p-2 rounded-lg transition duration-200
                                                ${selectedCategory && selectedCategory.id === category.id
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'hover:bg-gray-700 text-gray-200'}`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </aside>

                {/* Right Content Area - Questions */}
                <main className="flex-grow p-6 bg-gray-50 overflow-y-auto">
                    {selectedCategory ? (
                        <>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                                {selectedCategory.name}
                                <span className="ml-3 text-sm text-gray-500">
                                    {selectedCategory.description}
                                </span>
                            </h2>
                            <div className="mb-6 flex justify-end">
                                {/* New Question Button - TODO: Implement functionality */}
                                <button
                                    onClick={() => navigate(`/category/${selectedCategory.id}/new-question`)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-200"
                                >
                                    New Question
                                </button>
                            </div>

                            {loadingQuestions ? (
                                <p className="text-center text-gray-600">Loading questions...</p>
                            ) : errorQuestions ? (
                                <p className="text-center text-red-500">{errorQuestions}</p>
                            ) : questions.length === 0 ? (
                                <p className="text-center text-gray-600">No questions yet for this category. Be the first to ask!</p>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((question) => (
                                        <div key={question.id} className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                            <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                                {/* TODO: Link to question detail */}
                                                <button
                                                    onClick={() => navigate(`/question/${question.id}`)}
                                                    className="hover:underline text-left"
                                                >
                                                    {question.title || question.content.substring(0, 70) + (question.content.length > 70 ? '...' : '')}
                                                </button>
                                            </h3>
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <span>by: {question.user.username}</span>
                                                <span>{new Date(question.created_at).toLocaleDateString()} {new Date(question.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
\
                                            <span className="text-sm text-gray-600 mt-2 block">
                                                {/* For now, just display a placeholder or fetch count separately if needed */}
                                                {question.answers && question.answers.length > 0 ? `${question.answers.length} Answers` : '0 Answers'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-600 text-xl mt-20">Select a Category to view its questions.</p>
                    )}
                </main>
            </div>
            {/* Custom scrollbar styles (inline or in index.css) */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2c3e50; /* Darker background for scroll track */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4a5568; /* Greyish thumb */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6b7280; /* Lighter grey on hover */
                }
            `}</style>
        </div>
    );
};

export default DashboardScreen;
