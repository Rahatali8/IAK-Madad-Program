
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/components/providers/auth-provider";

interface ChatBotProps {
  sendIcon?: boolean;
}

const ChatBot = ({ sendIcon }: ChatBotProps) => {
  const { user } = useAuth();
  const initialBotMsg = user && user.fullName
    ? `Sawal pochain ${user.fullName}, main aap ki madad karne ke liye yahan hoon.`
    : 'Sawal pochain, main aap ki madad karne ke liye yahan hoon.';
  const [messages, setMessages] = useState([
    { sender: 'bot', text: initialBotMsg }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const [greeted, setGreeted] = useState(false);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);
    setInput('');

    // Greeting logic
    const greetingRegex = /assalam\s*o\s*alaikum|as-salamu\s*alaykum|السلام علیکم/i;
    if (greetingRegex.test(input) && !greeted) {
      setTimeout(() => {
        setMessages(msgs => [...msgs, { sender: 'bot', text: 'Wa alaikum assalam!' }]);
        setLoading(false);
        setGreeted(true);
      }, 500);
      return;
    }

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      // Typewriter effect: show bot reply word by word
  let botReply = (data.reply as string);
  // Remove all forms of 'Assalam o Alaikum' from bot reply
  botReply = botReply.replace(/assalam[ou]*\s*alaikum|as[-\s]*salamu\s*alaykum|السلام[\s]*علیکم|assalamu\s*alaikum/gi, '').replace(/^[\s\n]+|[\s\n]+$/g, '').replace(/^[.!?\s]+/, '');
      const words = botReply.split(' ');
      let currentText = '';
      words.forEach((word: string, i: number) => {
        setTimeout(() => {
          currentText = currentText ? currentText + ' ' + word : word;
          setMessages(msgs => {
            // Remove last bot message if still typing
            const msgsCopy = [...msgs];
            if (msgsCopy.length && msgsCopy[msgsCopy.length - 1].sender === 'bot' && msgsCopy[msgsCopy.length - 1].text !== '⚠️ Kuch ghalat ho gaya, dobara koshish karein.') {
              msgsCopy.pop();
            }
            return [...msgsCopy, { sender: 'bot', text: currentText }];
          });
        }, i * 50); // 50ms per word for smooth typing
      });
      setTimeout(() => setLoading(false), Math.max(700, words.length * 50));
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: '⚠️ Kuch ghalat ho gaya, dobara koshish karein.' }]);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-2xl p-0 flex flex-col border border-blue-300" style={{ minHeight: 500, position: 'relative' }}>
  {/* ...header removed, handled by FloatingBot... */}
      {/* Chat area with subtle background */}
      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-br from-white via-blue-50 to-blue-100" style={{ maxHeight: 370 }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}> 
            <div className={`max-w-[75%] px-6 py-4 rounded-[2rem] shadow-xl ${msg.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-2 border-blue-300' : 'bg-white text-blue-900 border-2 border-blue-100'} text-sm whitespace-pre-line font-normal tracking-wide`} style={{ fontFamily: 'Segoe UI, sans-serif', letterSpacing: '0.01em', opacity: 0.95 }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-6">
            <div className="bg-white border-2 border-blue-200 px-6 py-4 rounded-[2rem] shadow-xl text-[1rem] flex items-center gap-3 font-semibold tracking-wide animate-pulse">
              <span className="text-lightblue">Thinking<span className="inline-block">...</span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t px-6 py-6 bg-white flex items-center gap-3 rounded-b-3xl">
        <input
          className="flex-1 border-2 border-blue-300 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[1rem] shadow-md font-medium"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Apna sawal likhein..."
          disabled={loading}
        />
        <button
          className="px-0 py-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-full shadow-xl transition-all duration-200 flex items-center justify-center"
          onClick={sendMessage}
          disabled={loading}
          style={{ width: 56, height: 56, minWidth: 56, minHeight: 56 }}
        >
          {sendIcon ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:2}}>
              <circle cx="12" cy="12" r="11" fill="#2563eb" stroke="#2563eb" />
              <path d="M8 12h8M12 8l4 4-4 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
