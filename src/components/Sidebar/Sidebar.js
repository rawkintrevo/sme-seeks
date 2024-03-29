import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import Accordion from 'react-bootstrap/Accordion';
import {
    Button,
    Form,
    ListGroup, Modal
} from "react-bootstrap";
import { getAuth, signOut } from "firebase/auth";
import { Link } from 'react-router-dom';
import { FaEdit, FaShare, FaTrash } from 'react-icons/fa';

import "./custom.css"
import AddOpenAiApiKey from "../AddOpenAiApiKey/AddOpenAiApiKey";
import AddIndex from "../AddIndex/AddIndex";

function Sidebar({
                         temperature,
                     setTemperature,
                     topK,
                     setTopK,
                     index,
                     setIndex,
                     model,
                     setModel,
                     setChatId,
                     userProp,
                     db,
                 }) {

    const [userData, setUserData] = useState({});
    const [chatsArray, setChatsArray] = useState([])
    const [showOpenAiApiKeyPopup, setShowOpenAiApiKeyPopup] = useState(false);
    const [showAddIndexPopup, setShowAddIndexPopup] = useState(false);

    const hasOpenAIModel = Object.values(userData?.models || {}).some(
        (model) => model.type === 'openai'
    );

    const handleAddIndex = () => {
        setShowAddIndexPopup(true);
    }

    const handleCloseAddIndexPopup = () => {
        setShowAddIndexPopup(false);
    }

    const handleAddOpenAIKey = () => {
        setShowOpenAiApiKeyPopup(true);
    };

    const handleCloseOpenAiApiKeyPopup = () => {
        setShowOpenAiApiKeyPopup(false);
    }
    const handleDeleteChat = (chatId) => {
        const userDocRef = doc(collection(db, 'user'), userProp.uid);

        // 1. Update the user's data to remove the chat
        // Replace 'userDocRef' with a reference to the user's document in your database
        updateDoc(userDocRef, {  [`chats.${chatId}`]: null,})

        // 2. Remove the chat document from the chats collection
        // Replace 'chatsCollectionRef' with a reference to your chats collection in your database
        deleteDoc(doc(db, 'chat', chatId))
    };

    useEffect(() => {
        const userRef = doc(collection(db, 'user'), userProp.uid);
        try {
            const unsubscribe = onSnapshot(userRef, (doc) => {
                const data = doc.data() || {};
                setUserData(data);

                // Create an array of chat objects and filter out chats without lastAccessed
                const chatsArrayData = Object.entries(data?.chats || {})
                    .map(([chatId, chatData]) => ({ chatId, ...chatData }))
                    .filter((chat) => chat.lastAccessed) // Filter out chats without lastAccessed
                    .sort((a, b) => {
                        if (a.lastAccessed instanceof Date && b.lastAccessed instanceof Date) {
                            return b.lastAccessed.localeCompare(a.lastAccessed);
                        }
                        return 0; // Return 0 for invalid dates to maintain the original order
                    });
                setChatsArray(chatsArrayData);
            });


            return () => unsubscribe();
        } catch (error) {
            console.error('Error attaching onSnapshot listener:', error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, userProp.uid]);

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
    return (

        <div className="col-md-3 sidebar"
             style={{
                 backgroundColor: '#333333',
                 height: '100vh',
                 color: 'antiquewhite',
                 fontFamily: 'Comic Sans MS',
                 textAlign: 'left',
             }}>
            <h2>Mr. SMEseeks</h2>
            <Button variant="primary" href="/" style={{ marginBottom: '20px' }}>New Chat</Button>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Knobs and Dials</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Form.Group controlId="temperature">
                                <Form.Label>Temperature:</Form.Label>
                                <Form.Range
                                    min={0.01}
                                    max={0.99}
                                    step={0.01}
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                />
                                <Form.Text>{temperature.toFixed(2)}</Form.Text>
                            </Form.Group>

                            <Form.Group controlId="topK">
                                <Form.Label>Top K:</Form.Label>
                                <Form.Select
                                    value={topK}
                                    onChange={(e) => setTopK(parseInt(e.target.value))}
                                >
                                    {[...Array(5).keys()].map((number) => (
                                        <option key={number} value={number}>
                                            {number}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="index">
                                <Form.Label>Index:</Form.Label>
                                <Form.Select
                                    value={index}
                                    onChange={(e) => setIndex(e.target.value)}
                                >
                                    {userData?.indicies &&
                                        Object.keys(userData.indicies).map((indexName) => (
                                            <option key={indexName} value={indexName}>
                                                {userData.indicies[indexName].friendly_name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="model">
                                <Form.Label>Model:</Form.Label>
                                <Form.Select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                >
                                    {userData?.models &&
                                        Object.keys(userData.models).map((modelName) => (
                                            <option key={modelName} value={modelName}>
                                                {userData.models[modelName].friendly_name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Chats</Accordion.Header>
                    <Accordion.Body>
                        {chatsArray.length > 0 ? (
                            <ListGroup>
                                {chatsArray.map((chat, index) => (
                                    <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <Link to={`/${chat.chatId}`}>{chat.title}</Link>
                                        </div>
                                        <div>
                                            <FaEdit className="mx-2" />
                                            <FaShare className="mx-2" />
                                            <FaTrash
                                                className="mx-2"
                                                onClick={() => handleDeleteChat(chat.chatId)}
                                                // Pass the chatId to the handleDeleteChat function
                                            />
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <div>No chats available</div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>User</Accordion.Header>
                    <Accordion.Body>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {!hasOpenAIModel && (
                            <Button variant="primary"
                                    onClick={handleAddOpenAIKey}
                                    style={{ marginBottom: '10px' }}>
                                Add OpenAI API Key
                            </Button>
                        )}
                        <Button variant="primary"
                                onClick={handleAddIndex}
                                style={{ marginBottom: '10px' }}>
                            Add Index
                        </Button>
                        <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
                        </div>
                    </Accordion.Body>

                </Accordion.Item>

            </Accordion>
            <Modal show={showOpenAiApiKeyPopup} onHide={handleCloseOpenAiApiKeyPopup}>
                <Modal.Header closeButton>
                    <Modal.Title>Add OpenAI API Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddOpenAiApiKey onClose={handleCloseOpenAiApiKeyPopup}
                                     uid={userProp.uid}
                                     existingModels={userData?.models || {}}
                                     db={db}
                    />
                </Modal.Body>
            </Modal>
            <Modal show={showAddIndexPopup} onHide={handleCloseAddIndexPopup}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Index</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddIndex onClose={handleCloseAddIndexPopup}
                                     uid={userProp.uid}
                                     existingIndicies={userData?.indicies || {}}
                                     db={db}
                    />
                </Modal.Body>
            </Modal>
        </div>

    );
}

export default Sidebar;
