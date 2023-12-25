// eslint-disable-next-line
import React, { useState, useEffect } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { v4 as uuidv4 } from 'uuid';

import { getFunctions } from "firebase/functions";

import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/Chat/Chat";

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
const db = getFirestore(app);
// eslint-disable-next-line
const analytics = getAnalytics(app);

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // State variable for messages
  const [temperature, setTemperature] = useState(0.1);
  const [topK, setTopK] = useState(5);
  const [index, setIndex] = useState('Huggingface Docs');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [chatId, setChatId] = useState(uuidv4());


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
            />
          </div>
        </div>
      </div>
  );
}

export default App;
