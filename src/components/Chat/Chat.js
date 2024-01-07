import React, { useEffect, useState, useRef } from 'react';
import { httpsCallable } from 'firebase/functions';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ChatBubble from "../ChatBubble/ChatBubble";
import {Button, Modal} from "react-bootstrap";
import AddIndex from "../AddIndex/AddIndex";
import ServerErrorPopup from "../ServerErrorPopup/ServerErrorPopup";

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

    const lastChatBubbleRef = useRef(null);
    const chatContainerRef = useRef(null);

    const [showServerErrorPopup, setShowServerErrorPopup] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [serverErrorStackTrace, setServerErrorStackTrace] = useState('');
    // Access the history object
    const navigate = useNavigate();

    const handleCloseServerErrorPopup = () => setShowServerErrorPopup(false);

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

    useEffect(() => {
        // Scroll to the bottom of the chat container
        // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        // Scroll to the last chat bubble
        if (lastChatBubbleRef.current) {
            lastChatBubbleRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
                    { text: "", isUser: false },

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
        }).then((response) => {
            if (response.data.status === 'success') {
                // Do nothing
            } else if (response.data.status === 'error') {
                console.log('ruh-roh', response);
                console.log(response.data.error_message);

                setServerErrorMessage(response.data.error_message);
                setServerErrorStackTrace(response.data.stack_trace);
                setShowServerErrorPopup(true);
            }
            setQuery('');
            setLoading(false);
        });
    };

    return (
        <div className="col-md-9">
            <div className="container">
                <div className="chat-container" ref={chatContainerRef}>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <ChatBubble key={index} message={message} />
                        ))}
                        <div ref={lastChatBubbleRef} />
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
            <Modal show={showServerErrorPopup} onHide={handleCloseServerErrorPopup}>
                <Modal.Header closeButton>
                    <Modal.Title>I just want to DIE!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ServerErrorPopup closePopup={handleCloseServerErrorPopup}
                              errorMessage={serverErrorMessage}
                              stackTrace={serverErrorStackTrace}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseServerErrorPopup}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Chat;
