// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import NewQuestionScreen from './screens/NewQuestionScreen';
import QuestionDetailScreen from './screens/QuestionDetailScreen'; // Import QuestionDetailScreen


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
                <NewQuestionScreen />
              </ProtectedRoute>
            }
          />
          {/* Protected Question Detail Route */}
          <Route
            path="/question/:id"
            element={
              <ProtectedRoute>
                <QuestionDetailScreen /> {/* Replaced placeholder with actual component */}
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
