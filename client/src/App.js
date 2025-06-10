

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import NewQuestionScreen from './screens/NewQuestionScreen'; // Import NewQuestionScreen


// This will check if user info exists in localStorage
const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children; // Render the component if authenticated
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardScreen />
              </ProtectedRoute>
            }
          />
          {/* Protected New Question Route */}
          <Route
            path="/category/:categoryId/new-question"
            element={
              <ProtectedRoute>
                <NewQuestionScreen /> {/* Replaced placeholder with actual component */}
              </ProtectedRoute>
            }
          />
          {/* Placeholder for question detail route */}
          <Route
            path="/question/:id"
            element={
              <ProtectedRoute>
                {/* This will be the QuestionDetailScreen component */}
                <div>Question Details (Coming Soon)</div>
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
