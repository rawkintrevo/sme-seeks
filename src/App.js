// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// import { getFunctions, httpsCallable } from "firebase/functions";


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
// const functions = getFunctions(app);
// eslint-disable-next-line
const analytics = getAnalytics(app);

function App() {
  const [query, setQuery] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxLen, setMaxLen] = useState(128);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');


  const handleGenerate = async () => {
    setLoading(true);
    // const response = await fetch(`/sme?query=${query}&temperature=${temperature}&max_len=${maxLen}`);
    // const data = await response.json();
    console.log("query: ", query)
    // const functions = getFunctions();
    // const sme = httpsCallable(functions, 'sme');
    // sme({query: query})
    //     .then((result) => {
    fetch('/sme')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log("call success", response)
          console.log(response.json())
          return response.json();
        })
        .then((result) => {
          console.log(result)
          setResponse(result.data.text);
          setLoading(false);
        });
  };

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="container">
            <form>
              <div className="mb-3">
                <label htmlFor="query" className="form-label">Query</label>
                <input
                    type="text"
                    className="form-control"
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="temperature" className="form-label">Temperature</label>
                <input
                    type="range"
                    className="form-range"
                    id="temperature"
                    min={0.5}
                    max={1.0}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxLen" className="form-label">Max Length</label>
                <select
                    className="form-select"
                    id="maxLen"
                    value={maxLen}
                    onChange={(e) => setMaxLen(parseInt(e.target.value))}
                >
                  <option value="64">64</option>
                  <option value="128">128</option>
                  <option value="256">256</option>
                  <option value="512">512</option>
                  <option value="1024">1024</option>
                  <option value="2048">2048</option>
                </select>
              </div>
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={loading}
              >
                {loading ? 'Loading...' : 'Generate'}
              </button>
            </form>
            {response && (
                <div className="mt-3">
                  <p>Response:</p>
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
            )}
          </div>
        </header>
      </div>
  );
}

export default App;
