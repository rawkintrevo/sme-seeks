import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { httpsCallable } from 'firebase/functions';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Chat({
                  chatId,
                  db,
                  functions,
                  user,
    temperature,
    topK,
    model,
    index
              }) {
    const [newChat, setNewChat] = useState(true);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    // Access the history object
    const navigate = useNavigate();

    useEffect(() => {
        const chatRef = doc(collection(db, 'chat'), chatId);

        try {
            const unsubscribe = onSnapshot(chatRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data() || {};
                    setMessages(data.messages || []);
                    setNewChat(false);
                } else {
                    setNewChat(true);
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Error attaching onSnapshot listener:', error);
        }
    }, [chatId, db]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission and page refresh

        // Your message handling logic here
        handleGenerate();
    };
    const handleGenerate = async () => {
        setLoading(true);


        if (newChat) {
            const chatRef = doc(collection(db, 'chat'), chatId);
            setDoc(chatRef, {
                messages: [
                    { text: query, isUser: true },
                    { text: "ooook, cannn doooo...", isUser: false },
                    { text: '', isUser: false },
                ],
                title: "New Chat",
                lastAccess: new Date(),
                usersWithAccess: [user.uid]
            }, { merge: true });
            setNewChat(false);

            // Redirect to `/{chatId}`
            navigate(`/${chatId}`);
        } else {
            const chatRef = doc(collection(db, 'chat'), chatId);
            setDoc(chatRef, {
                messages: [
                    ...messages,
                    { text: query, isUser: true },
                    { text: '', isUser: false },
                ],
                lastAccess: new Date(),
            })
        }


        const sme = httpsCallable(functions, 'sme');
        sme({
            query,
            index: index,
            model: model,
            temperature: temperature,
            top_k: topK,
            chat_id: chatId,
            uid: user.uid,
        }).then(() => {
            setQuery('');
            setLoading(false);
        });
    };

    return (
        <div className="col-md-9">
            <div className="container">
                <div className="chat-container">
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.isUser ? "user" : "ai"}`}>
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                            <textarea
                                className="form-control"
                                placeholder="Type your message..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                rows="4" // Set the number of visible rows
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
    );
}

export default Chat;
