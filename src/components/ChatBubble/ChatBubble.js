import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { RxText, RxQuote, RxInfoCircled } from "react-icons/rx";

function ChatBubble({ message }) {
    const [showSources, setShowSources] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const hasSources = message.sources && message.sources.length > 0;
    const hasMetadata = message.metadata;

    const handleToggleText = () => {
        setShowSources(false);
        setShowMetadata(false);
    }
    const handleToggleSources = () => {
        if (hasSources) {
            setShowSources(!showSources);
            setShowMetadata(false);
        } else {
            console.log("No sources to show, ignoring.")
        }

    };

    const handleToggleMetadata = () => {
        if (hasMetadata) {
            setShowMetadata(!showMetadata);
            setShowSources(false);
        } else {
            console.log("No metadata to show, ignoring.")
        }
    };

    return (
        <div className={`message ${message.isUser ? "user" : "ai"}`}>
            <div className="message-content">
                {showSources && !showMetadata ? (
                    <div>
                        {message.sources.map((source, index) => (
                            <div key={index}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                    {source.title !== "" ? source.title : source.url}
                                </a>
                            </div>
                        ))}
                    </div>
                ) : showMetadata ? (
                    <div>
                        {Object.entries(message.metadata).map(([key, value]) => (
                            <div key={key}>
                                <span>{key}: </span>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                )}
            </div>
            <div className="message-icons">
                <RxText
                    className={`message-icon ${showSources ? "active" : ""}`}
                    onClick={handleToggleText}
                />
                {hasSources && (
                    <RxQuote
                        className={`message-icon ${showSources ? "" : "active"}`}
                        onClick={handleToggleSources}
                    />
                )}
                {hasMetadata && (<RxInfoCircled
                    className={`message-icon ${showMetadata ? "active" : ""}`}
                    onClick={handleToggleMetadata}
                />
                )}
            </div>
        </div>
    );
}

export default ChatBubble;
