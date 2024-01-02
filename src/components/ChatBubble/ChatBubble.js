import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaFile, FaComment } from 'react-icons/fa';

function ChatBubble({ message }) {
    const [showSources, setShowSources] = useState(false);
    const hasSources = message.sources && message.sources.length > 0;

    const handleToggleSources = () => {
        if (hasSources) {
            setShowSources(!showSources);
        } else {
            console.log("No sources to show, ignoring.")
        }

    };

    return (
        <div className={`message ${message.isUser ? "user" : "ai"}`}>
            <div className="message-content">
                {showSources ? (
                    <div>
                        {message.sources.map((source, index) => (
                            <div key={index}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                    {source.title !== "" ? source.title : source.url}
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                )}
            </div>
            <div className="message-icons">
                <FaComment
                    className={`message-icon ${showSources ? "active" : ""}`}
                    onClick={handleToggleSources}
                />
                {hasSources && (
                    <FaFile
                        className={`message-icon ${showSources ? "" : "active"}`}
                        onClick={handleToggleSources}
                    />
                )}
            </div>
        </div>
    );
}

export default ChatBubble;
