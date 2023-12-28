import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { v4 as uuidv4 } from 'uuid';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';

function App({ app }) {
    const functions = getFunctions(app);
    const db = getFirestore(app);
    const auth = getAuth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatId, setChatId] = useState(null);

    const [temperature, setTemperature] = useState(0.1);
    const [topK, setTopK] = useState(5);
    const [index, setIndex] = useState('huggingface-docs-test-23-12-22');
    const [model, setModel] = useState('gpt-3.5-turbo');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            console.log(user)
            setLoading(false);
        });

        return unsubscribe;
    }, [auth]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setChatId(urlParams.get('chatId') || uuidv4());
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="App">
            <Outlet />
            <div className="container-fluid">
                <div className="row">
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
                        user={user}
                        db={db}
                    />
                    {chatId && (
                        <Chat
                            chatId={chatId}
                            db={db}
                            functions={functions}
                            user={user}
                            temperature={temperature}
                            topK={topK}
                            model={model}
                            index={index}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
