import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Accordion from 'react-bootstrap/Accordion';

import "./custom.css"

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

    useEffect(() => {
        const userRef = doc(collection(db, 'user'), userProp.uid);

        try {
            const unsubscribe = onSnapshot(userRef, (doc) => {
                const data = doc.data() || {};
                setUserData(data);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Error attaching onSnapshot listener:', error);
        }
    }, [db, userProp]);

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
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Knobs and Dials</Accordion.Header>
                    <Accordion.Body>
                        <label htmlFor="temperature">Temperature:</label>
                        <input
                            type="range"
                            id="temperature"
                            min={0.01}
                            max={0.99}
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
                            <option value={5}>5</option>
                        </select>
                        <br />

                        <label htmlFor="index">Index:</label>
                        <select
                            id="index"
                            value={index}
                            onChange={(e) => setIndex(e.target.value)}
                        >
                            {userData && userData.indicies && Object.keys(userData.indicies).map((indexName) => (
                                <option key={indexName} value={indexName}>
                                    {userData.indicies[indexName].friendly_name}
                                </option>
                            ))}
                        </select>
                        <br />

                        <label htmlFor="model">Model:</label>
                        <select
                            id="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        >
                            {userData && userData.models && Object.keys(userData.models).map((modelName) => (
                                <option key={modelName} value={modelName}>
                                    {userData.models[modelName].friendly_name}
                                </option>
                            ))}
                        </select>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Chats</Accordion.Header>
                    <Accordion.Body>
                        {userData && userData.chats && Array.isArray(userData.chats) ? (
                            userData.chats.map((chat, index) => (
                                <div key={index}>{chat}</div>
                            ))
                        ) : (
                            <div>No chats available</div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>User</Accordion.Header>
                    <Accordion.Body>Not Yet Implemented</Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>

    );
}

export default Sidebar;
