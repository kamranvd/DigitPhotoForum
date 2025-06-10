

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AnswerModal = ({ questionId, onClose, onAnswerSubmitted }) => {
    const [answerContent, setAnswerContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!answerContent.trim()) {
            setError('Answer content cannot be empty.');
            return;
        }

        setLoading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post(
                'http://localhost:5000/api/answers',
                { content: answerContent, questionId: questionId },
                config
            );

            setLoading(false);
            onAnswerSubmitted(); // Call parent function to close modal and refresh answers

        } catch (err) {
            console.error('Error submitting answer:', err.response ? err.response.data : err.message);
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Failed to submit answer. Please try again.'
            );
            setLoading(false);
        }
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Your Answer</h3>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <p className="font-bold">Error!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="answerContent" className="block text-gray-700 text-sm font-bold mb-2">
                            Your Answer:
                        </label>
                        <textarea
                            id="answerContent"
                            rows="6"
                            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 resize-y ${error ? 'border-red-500' : ''}`}
                            placeholder="Type your answer here..."
                            value={answerContent}
                            onChange={(e) => {
                                setAnswerContent(e.target.value);
                                setError(''); // Clear error on change
                            }}
                            required
                            disabled={loading}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 flex items-center"
                            disabled={loading}
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnswerModal;
