"use client"

import React, { useState } from 'react';
import ChatBot from './ChatBot';

const FloatingBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Bot Icon */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 text-white rounded-full shadow-2xl w-16 h-16 border-4 border-white flex items-center justify-center hover:scale-110 transition-all duration-200"
        onClick={() => setOpen(true)}
        aria-label="Open ChatBot"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
      >
        <img src="/head-logo.png" alt="Bot" className="w-10 h-10 rounded-full border-2 border-blue-200" />
      </button>
      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-[110px] right-8 z-50 flex flex-col items-end">
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-[370px] max-w-[90vw] relative border-2 border-blue-200 animate-fade-in-up flex flex-col" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}>
            {/* Card header with close button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-blue-100 bg-white rounded-t-3xl shadow-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img src="/head-logo.png" alt="Bot Avatar" className="w-12 h-12 rounded-full border-2 border-blue-400 shadow" />
                <div>
                  <div className="text-lg font-bold text-darkblue">Welfare AI Assistant</div>
                  <div className="text-xs text-gray-500">Powered by Idara Al-Khair Walfare Society</div>
                </div>
              </div>
              <button
                className="text-white bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 hover:from-blue-700 hover:to-blue-500 border-4 border-white shadow-xl text-xl font-bold flex items-center justify-center transition-all duration-200"
                onClick={() => setOpen(false)}
                aria-label="Close ChatBot"
                style={{ borderRadius: '50%', width: 40, height: 40, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="#2563eb"/><line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2"/></svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <ChatBot sendIcon />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingBot;
