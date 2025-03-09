import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import InputBar from './InputBar';
import sendMessage from '../Api.js';

function ChatWindow() {
    const [response, setResponse] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const responseEndRef = useRef(null);

    const scrollToBottom = () => {
        responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [response]);

    const handleSendMessage = async (message) => {
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: "user" }]);
        setIsLoading(true); 
        try {
            const res = await sendMessage(message, setResponse, setIsLoading);
            setMessages((prevMessages) => [...prevMessages, { text: res, sender: "ai" }]);
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { text: "Error reaching API", sender: "ai" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-window">
            <div className="message-list">
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
                {isLoading && (
                    <div className="typing-indicator">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                )}
                {messages.length > 0 && messages[messages.length-1].text !== response && response !== "" && <Message key={messages.length} message={{ text: response, sender: "ai" }}  />}

                <div ref={responseEndRef} />
            </div>
            <InputBar onSendMessage={handleSendMessage} />
        </div>
    );
}

export default ChatWindow;
