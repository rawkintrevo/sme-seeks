import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Import Router
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from "./components/Login/Login";
import {initializeApp} from "firebase/app";

import {getAnalytics} from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCVTd278zN5qswOuz7Pbm0aF7K6xVW9fos",
    authDomain: "sme-seeks.firebaseapp.com",
    projectId: "sme-seeks",
    storageBucket: "sme-seeks.appspot.com",
    messagingSenderId: "257591867911",
    appId: "1:257591867911:web:285912444252915be548a2",
    measurementId: "G-V9JQQZZ25H"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// eslint-disable-next-line
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
          <Routes>
              <Route path="/" element={<App app={app} />} /> {/* Route for the
               main
               app */}
              <Route path="/login" element={<Login app={app} />} /> {/* Route
               for the login page */}
          </Routes>
         <App />
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
