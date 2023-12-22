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
  const [isSubItemsVisible, setSubItemsVisible] = useState(false);
  const [temperature, setTemperature] = useState(0.1);
  const [topK, setTopK] = useState(5);
  const [index, setIndex] = useState('Huggingface Docs');
  const [model, setModel] = useState('gpt-3.5-turbo');





  const handleGenerate = async () => {
    setLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: query, isUser: true }
    ]);
    const sme = httpsCallable(functions, 'sme');
    sme({query: query})
        .then((result) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: result.data.text, isUser: false },
          ]);
          setQuery('');
          setLoading(false);
          console.log(messages)
        });
  };


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
                      <div>
                        <label htmlFor="temperature">Temperature:</label>
                        <input
                            type="range"
                            id="temperature"
                            min={0.1}
                            max={0.1}
                            step={0.01}
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        />
                        <span>{temperature.toFixed(2)}</span>
                        <br />

                        <label htmlFor="topK">Top K:</label>
                        <select
                            id="topK"
                            value={topK}
                            onChange={(e) => setTopK(parseInt(e.target.value))}
                        >
                          {/*<option value={1}>1</option>*/}
                          {/*<option value={2}>2</option>*/}
                          {/*<option value={3}>3</option>*/}
                          {/*<option value={4}>4</option>*/}
                          <option value={5}>5</option>
                        </select>
                        <br />

                        <label htmlFor="index">Index:</label>
                        <select
                            id="index"
                            value={index}
                            onChange={(e) => setIndex(e.target.value)}
                        >
                          <option value="huggingface-docs-test-23-12-22">Hugging Face Docs</option>
                          {/* Add other index options here */}
                        </select>
                        <br />

                        <label htmlFor="model">Model:</label>
                        <select
                            id="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        >
                          <option value="gpt-3.5-turbo">OpenAI: GPT 3.5 Turbo</option>
                          {/* Add other model options here */}
                        </select>
                      </div>
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
