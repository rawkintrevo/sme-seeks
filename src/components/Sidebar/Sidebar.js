import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';



function Sidebar({ temperature,
                     setTemperature,
                     topK,
                     setTopK,
                     index,
                     setIndex,
                     model,
                     setModel,
                 setChatId,
                 user}) {
    const [isSubItemsVisible, setSubItemsVisible] = useState(false);

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
                                <option
                                    value="huggingface-docs-test-23-12-22">Hugging
                                    Face Docs
                                </option>
                                {/* Add other index options here */}
                            </select>
                            <br/>

                            <label htmlFor="model">Model:</label>
                            <select
                                id="model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            >
                                <option value="gpt-3.5-turbo">OpenAI: GPT 3.5
                                    Turbo
                                </option>
                                {/* Add other model options here */}
                            </select>
                        </div>
                    )}
                </div>

            </div>

    )
}

export default Sidebar;
