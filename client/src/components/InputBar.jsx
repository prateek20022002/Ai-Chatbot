import React, { useState, useRef, useEffect } from 'react';

function InputBar({ onSendMessage }) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            //Reset text area height
            textareaRef.current.style.height = 'auto';
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            handleSubmit(event);
        }
    };

    const handleClear = () => {
        setMessage('');
        textareaRef.current.style.height = 'auto';

    };
    const adjustHeight = () => {
        if(textareaRef.current){
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };
    useEffect(() => {
        adjustHeight()
    }, [message]);
    return (
        <form className="input-bar" onSubmit={handleSubmit}>
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1} 
            />
            {message && <button type='button' className="clear-button" onClick={handleClear}>✕</button>}

            <button type="submit">Send</button>
        </form>
    );
}

export default InputBar;
