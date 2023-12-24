import ReactMarkdown from "react-markdown";
import React from "react";
import {httpsCallable} from "firebase/functions";


function Chat({ query, setQuery, loading, setLoading, messages, setMessages, functions }) {

    const handleGenerate = async () => {
        setLoading(true);

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