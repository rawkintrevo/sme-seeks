import ReactMarkdown from "react-markdown";
import React, {useEffect, useState} from "react";
import {httpsCallable} from "firebase/functions";

import { collection, doc, onSnapshot } from "firebase/firestore";


function Chat({ query,
                  setQuery,
                  loading,
                  setLoading,
                  messages,
                  setMessages,
                  functions,
                  chatId,
              db}) {

    const [newChat, setNewChat] = useState(true);

    // Load chat messages from Firestore when chatId changes
    useEffect(() => {
        // Access Firestore instance from props or context


        const chatRef = doc(collection(db, 'chat'), chatId);
        console.log('chatRef', chatRef);
        // Add error handling for onSnapshot
        try {
            const unsubscribe = onSnapshot(chatRef, (doc) => {
                if (doc.exists) {
                    if (doc.data() === undefined) {
                        setNewChat(true);
                        console.log("Document does not exist!");
                    } else {
                        console.log("Document exists! data:", doc.data())
                        const data = doc.data() || {};
                        setMessages(data.messages || []);
                        setNewChat(false);
                    }
                } else {
                    setNewChat(true);
                    console.log("Document does not exist!");
                    // Handle case where document doesn't exist
                    // You might want to create it here or display a message
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Error attaching onSnapshot listener:", error);
            // Handle the error gracefully, e.g., display a user-friendly message
        }
    }, [chatId, db, setMessages]);

    const handleGenerate = async () => {
        setLoading(true);

        if (newChat) {
            console.log("New chat")
            const chatRef = doc(collection(db, 'chat'), chatId);;
            console.log('chatRef', chatRef)
            chatRef.set({
              messages: [
                  { text: query, isUser: true },
                    { text: "ooook, cannn doooo", isUser: false },
              ]
            });
            setNewChat(false);
        }
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

    return(
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
    )
}

export default Chat;