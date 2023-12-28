import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { httpsCallable } from 'firebase/functions';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

function Chat({
                  chatId,
                  db,
                  functions,
                  user,
              }) {
    const [newChat, setNewChat] = useState(true);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const chatRef = doc(collection(db, 'chat'), chatId);

        try {
            const unsubscribe = onSnapshot(chatRef, (doc) => {
                if (doc.exists()) {
                    console.log("Doc exists: ", chatId, doc)
                    console.log(doc.exists())
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
            }, { merge: true });
            setNewChat(false);
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: query, isUser: true },
            { text: '', isUser: false },
        ]);

        const sme = httpsCallable(functions, 'sme');
        sme({
            query,
            index: 'huggingface-docs-test-23-12-22',
            model: 'gpt-3.5-turbo',
            temperature: 0.1,
            top_k: 5,
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
    );
}

export default Chat;
