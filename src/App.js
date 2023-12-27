// eslint-disable-next-line
import React, { useState, useEffect } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the functions you need from the SDKs you need

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFunctions} from "firebase/functions";


import { v4 as uuidv4 } from 'uuid';


import { Navigate, Outlet } from 'react-router-dom';

import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/Chat/Chat";



function App({app}) {
    // const navigate = useNavigate(); // Access navigation
    const functions = getFunctions(app);
    const db = getFirestore(app);
    // const auth = getAuth(app);
    const auth = getAuth();


    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]); // State variable for messages
    const [temperature, setTemperature] = useState(0.1);
    const [topK, setTopK] = useState(5);
    const [index, setIndex] = useState('huggingface-docs-test-23-12-22');
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [chatId, setChatId] = useState(null); // Store chatId from URL
    // const [chatId, setChatId] = useState(uuidv4());
    const [user, setUser] = useState(null); // Track user authentication


    useEffect(() => {
        // Extract chatId from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('chatId')) {
            setChatId(urlParams.get('chatId'));
            console.log("chatId from URL:", urlParams.get('chatId'));
        } else {
            setChatId(uuidv4());
            console.log("chatId from uuid")
        }
    }, []);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is authenticated
                console.log("authStateChanged- User:", user.uid);
                setUser(user);
            } else {
                // User is not authenticated
                console.log("authStateChanged- No user");
                setUser(null);
            }
            setLoading(false); // Update loading state
        });
    }, [auth]);


    if (loading) {
        // While loading, display a loading indicator
        return <div>Loading...</div>;
    } else if (user === null) {
        // User's authentication status is not determined yet, show loading or a login indicator
        return <div>Loading...</div>;
    } else if (!user) {
        // User is not authenticated, redirect to login
        return <Navigate to="/login" replace/>;
    } else {
        // User is authenticated, render the main content using Outlet
        return (
            <div className="App">
                <Outlet />
                <div className="container-fluid">
                    <div className="row">
                        {/* Sidebar */}
                        <Sidebar
                            temperature={temperature}
                            setTemperature={setTemperature}
                            topK={topK}
                            setTopK={setTopK}
                            index={index}
                            setIndex={setIndex}
                            model={model}
                            setModel={setModel}
                            setChatId={setChatId}
                        />


                        {/* Main Content */}
                        {chatId !== null && (
                            <Chat
                                query={query}
                                setQuery={setQuery}
                                loading={loading}
                                setLoading={setLoading}
                                messages={messages}
                                setMessages={setMessages}
                                functions={functions}
                                chatId={chatId}
                                db={db}
                                index={index}
                                model={model}
                                temperature={temperature}
                                topK={topK}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
