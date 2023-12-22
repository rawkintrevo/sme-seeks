// eslint-disable-next-line
import React, { useState, useEffect } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getFunctions, httpsCallable } from "firebase/functions";


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
const functions = getFunctions(app);
// eslint-disable-next-line
const analytics = getAnalytics(app);

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // State variable for messages






  const handleGenerate = async () => {
    setLoading(true);
    setMessages([...messages, { text: query, isUser: true }]);
    // If len messages == 1 add "oook, cannnn doooooo"
    const sme = httpsCallable(functions, 'sme');
    sme({query: query})
        .then((result) => {
          setMessages([...messages, { text: result.data.text, isUser: false }]);
          setQuery('');
          setLoading(false);
        });
  };
  const [isSubItemsVisible, setSubItemsVisible] = useState(false);

  const toggleSubItems = () => {
    setSubItemsVisible(!isSubItemsVisible);
  };

  return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 sidebar" style={{
              backgroundColor: '#333333',
              height: '100vh',
              color: 'antiquewhite',
              fontFamily: 'Comic Sans MS',
              textAlign: 'left'}} >
              {/* You can place your sidebar content here */}
              Hi, I'm
              <h2>Mr. SMEseeks</h2>
              {/* Add your sidebar content here */}

                {/* Line with sub-items */}
                <div>
                  <p onClick={toggleSubItems} style={{ cursor: 'pointer' }}>Knobs and Buttons</p>
                  {isSubItemsVisible && (
                      <ul>
                        <li>Temperature (Creativity)</li>
                        <li>Top K (How Many Sources)</li>
                        <li>Index (SME in what?)</li>
                        <li>Model (GPT3.5/3.5-16k/4/LLama-7b-GGUF)</li>
                      </ul>
                  )}
                </div>

            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <div className="container">
                <div className="chat-container">
                  <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    ))}
                  </div>
                  <div className="chat-input">
                    <form>
                      <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>
                      <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleGenerate}
                          disabled={loading}
                      >
                        {loading ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
