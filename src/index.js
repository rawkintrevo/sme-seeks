import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login/Login';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyCVTd278zN5qswOuz7Pbm0aF7K6xVW9fos",
    authDomain: "sme-seeks.firebaseapp.com",
    projectId: "sme-seeks",
    storageBucket: "sme-seeks.appspot.com",
    messagingSenderId: "257591867911",
    appId: "1:257591867911:web:285912444252915be548a2",
    measurementId: "G-V9JQQZZ25H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App app={app} />} />
                <Route path="/login" element={<Login app={app} />} />
            </Routes>
        </Router>
    </React.StrictMode>
);

reportWebVitals();
