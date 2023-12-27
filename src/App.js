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


import { Navigate } from 'react-router-dom'; // Import for
// navigation

import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/Chat/Chat";


function App({app}) {
    // const navigate = useNavigate(); // Access navigation
    const functions = getFunctions(app);
    const db = getFirestore(app);
    const auth = getAuth(app);


  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // State variable for messages
  const [temperature, setTemperature] = useState(0.1);
  const [topK, setTopK] = useState(5);
  const [index, setIndex] = useState('huggingface-docs-test-23-12-22');
  const [model, setModel] = useState('gpt-3.5-turbo');
    const [chatId, setChatId] = useState(null); // Store chatId from URL
  // const [chatId, setChatId] = useState(uuidv4());

    useEffect(() => {
        // Extract chatId from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('chatId')) {
            setChatId(urlParams.get('chatId'));
        } else {
            setChatId(uuidv4());
        }
    }, []);

    const [user, setUser] = useState(null); // Track user authentication

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    if (!user) {
        // User not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    return (
      <div className="App">
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
          </div>
        </div>
      </div>
  );
}

export default App;
