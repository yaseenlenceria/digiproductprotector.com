import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { streamAdvisorChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

const CopyrightAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello. I'm ProtectorAI. I can help answer questions about digital copyright, licensing models, and how to protect your assets. How can I assist you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await streamAdvisorChat(history, userMsg.text);
      
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      let fullText = '';
      for await (const chunk of stream) {
        const textChunk = chunk.text; // Access directly via property getter
        if (textChunk) {
            fullText += textChunk;
            setMessages(prev => prev.map(m => 
                m.id === modelMsgId ? { ...m, text: fullText } : m
            ));
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered an error connecting to the knowledge base. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="bg-brand-500/10 p-2 rounded-full">
          <Sparkles className="text-brand-400 w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-100">Protector Advisor</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs text-slate-400">Online • Gemini 2.5 Powered</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-600' : 'bg-slate-700'}`}>
                   {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                    <ReactMarkdown 
                        className="markdown-prose"
                        components={{
                            a: ({node, ...props}) => <a className="text-brand-300 underline" {...props} target="_blank" />
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                </div>
             </div>
          </div>
        ))}
        {isStreaming && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="flex gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                </div>
                <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about DMCA, Licensing, or Digital Rights..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-4 pr-12 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-slate-500"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
            AI can make mistakes. Please verify legal advice with a professional.
        </p>
      </div>
    </div>
  );
};

export default CopyrightAdvisor;
