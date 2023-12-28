import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { collection, doc, onSnapshot } from 'firebase/firestore';


function Sidebar({ temperature,
                     setTemperature,
                     topK,
                     setTopK,
                     index,
                     setIndex,
                     model,
                     setModel,
                 setChatId,
                 user,
                 db}) {
    const [isSubItemsVisible, setSubItemsVisible] = useState(false);
    const [userData, setUserData] = useState({})

    useEffect( () => {
        const userRef = doc(collection(db, 'user'), user.uid);

        try {
            const unsubscribe = onSnapshot(userRef, (doc) => {
                const data = doc.data() || {};
                setUserData(data);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Error attaching onSnapshot listener:', error);
        }
    })
    const toggleSubItems = () => {
        setSubItemsVisible(!isSubItemsVisible);
    };

    return (

            <div className="col-md-3 sidebar" style={{
                backgroundColor: '#333333',
                height: '100vh',
                color: 'antiquewhite',
                fontFamily: 'Comic Sans MS',
                textAlign: 'left'
            }}>
                {/* You can place your sidebar content here */}
                Hi, I'm
                <h2>Mr. SMEseeks</h2>

                <div>
                    <p onClick={toggleSubItems}
                       style={{cursor: 'pointer'}}>Knobs and Dials</p>
                    {isSubItemsVisible && (
                        <div>
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
                            <br/>

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
                            <br/>

                            <label htmlFor="index">Index:</label>
                            <select
                                id="index"
                                value={index}
                                onChange={(e) => setIndex(e.target.value)}
                            >
                                {Object.keys(userData.indicies).map((indexName) => (
                                    <option key={indexName} value={indexName}>
                                        {userData.indicies[indexName].friendly_name}
                                    </option>
                                ))}
                            </select>
                            <br/>

                            <label htmlFor="model">Model:</label>
                            <select
                                id="model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            >
                                {Object.keys(userData.models).map((modelName) => (
                                    <option key={modelName} value={modelName}>
                                        {userData.models[modelName].friendly_name}
                                    </option>
                                ))}
                                {/* Add other model options here */}
                            </select>
                        </div>
                    )}
                </div>

            </div>

    )
}

export default Sidebar;
