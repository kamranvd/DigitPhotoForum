

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // This will contain any custom global CSS or Tailwind imports

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Inject Tailwind CSS CDN for styling
const tailwindScript = document.createElement('script');
tailwindScript.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindScript);

// Inject Inter font from Google Fonts for better typography
const interFontLink = document.createElement('link');
interFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
interFontLink.rel = 'stylesheet';
document.head.appendChild(interFontLink);

// Apply Inter font globally using inline style (Tailwind usually handles this via config)
document.body.style.fontFamily = "'Inter', sans-serif";
