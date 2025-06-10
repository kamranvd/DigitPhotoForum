// client/src/screens/QuestionDetailScreen.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AnswerModal from '../components/AnswerModal'; // Will create this in the next step

const QuestionDetailScreen = () => {
    const { id } = useParams(); // Get question ID from URL
    const navigate = useNavigate();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAnswerModal, setShowAnswerModal] = useState(false); // State for modal visibility
    const [userInfo, setUserInfo] = useState(null); // State to store user info

    // Fetch user info from localStorage on component mount
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            navigate('/login'); // Redirect if not authenticated
        }
    }, [navigate]);

    // Function to fetch question details
    const fetchQuestionDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await axios.get(`http://localhost:5000/api/questions/${id}`);
            setQuestion(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching question details:', err);
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : 'Failed to load question details.');
            setLoading(false);
        }
    };

    // Fetch question details when component mounts or ID changes
    useEffect(() => {
        fetchQuestionDetails();
    }, [id]); // Re-fetch if question ID changes

    // Handle answer submission success (called from AnswerModal)
    const handleAnswerSubmitted = () => {
        setShowAnswerModal(false); // Close modal
        fetchQuestionDetails(); // Re-fetch question details to show the new answer
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600 text-lg">Loading question...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Question Not Found</h2>
                    <p className="text-gray-600">The question you are looking for does not exist.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
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
            <main className="flex-grow p-6 bg-gray-50 flex flex-col items-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-8">
                    {/* Breadcrumb / Navigation path */}
                    <div className="text-sm text-gray-600 mb-4">
                        <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>App Title</span>
                        {' > '}
                        <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>
                            {question.category?.name || 'Category'}
                        </span>
                        {' > Question Details'}
                    </div>

                    {/* Question Details */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{question.title || 'No Title'}</h2>
                    <p className="text-gray-700 text-lg mb-4">{question.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-b pb-4">
                        <span>by: <span className="font-semibold">{question.user?.username}</span></span>
                        <span>
                            on: {new Date(question.created_at).toLocaleDateString()} at {new Date(question.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Answer Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowAnswerModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow transition duration-200 transform hover:scale-105"
                        >
                            Answer
                        </button>
                    </div>

                    {/* Answers Section */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                        {question.answers?.length || 0} Answers
                    </h3>
                    <div className="space-y-4">
                        {question.answers && question.answers.length > 0 ? (
                            question.answers.map((answer) => (
                                <div key={answer.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                                    <p className="text-gray-700 mb-3">{answer.content}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>by: <span className="font-semibold">{answer.user?.username}</span></span>
                                        <span>
                                            on: {new Date(answer.created_at).toLocaleDateString()} at {new Date(answer.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center">No answers yet. Be the first to answer!</p>
                        )}
                    </div>
                </div>

                {/* Back to Dashboard Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-200 mt-6"
                >
                    Back to Dashboard
                </button>
            </main>

            {/* Answer Submission Modal */}
            {showAnswerModal && (
                <AnswerModal
                    questionId={question.id}
                    onClose={() => setShowAnswerModal(false)}
                    onAnswerSubmitted={handleAnswerSubmitted}
                />
            )}
        </div>
    );
};

export default QuestionDetailScreen;
