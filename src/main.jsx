// // Import the React library to use React features.
// import { StrictMode } from 'react'
// // Import the ReactDOM library to render the React application.
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'


// // Start the React application.
// // Create a root element in the HTML document and render the App component inside it.
// ReactDOM.createRoot(document.getElementById('root')).render(
//   // Wrap the App component in StrictMode to enable additional checks and warnings for potential issues in the application.
//   <React.StrictMode>
//      {/* Make authentication state available throughout the app. */}
//   <AuthProvider>
//      {/* Enable navigation without reloading the browser. */}
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
//   </AuthProvider>
//   </React.StrictMode>
// )


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);





