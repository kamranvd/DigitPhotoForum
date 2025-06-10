

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen'; // Import the LoginScreen component

const App = () => {
  return (
    // BrowserRouter is used to enable client-side routing
    <Router>
      <div className="App">
        {/* Routes define which component to render based on the URL */}
        <Routes>
          {/* Default route for the login page */}
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          {/* Other routes will be added here later (e.g., /register, /dashboard) */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
