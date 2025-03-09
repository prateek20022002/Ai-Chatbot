import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

function Message({ message }) {
    return (
        <div className={`message ${message.sender}`}>
            <ReactMarkdown
            components={{
                code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                    <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    />
                ) : (
                    <code className={className} {...props}>
                    {children}
                    </code>
                )
                }
            }}
            >
                {message.text}
            </ReactMarkdown>
        </div>
    );
}

export default Message;
