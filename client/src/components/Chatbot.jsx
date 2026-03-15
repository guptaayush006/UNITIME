import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";

// 👇 Added isDark prop here
const Chatbot = ({ isDark }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I am your UniTime assistant. Ask me about study plans, schedules, or coding help!", 
      sender: "ai" 
    },
  ]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      
      const aiMessage = { 
        text: data.text || "Sorry, I am unable to answer right now.", 
        sender: "ai" 
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not connect to UniTime Server.", sender: "error" },
      ]);
    }

    setLoading(false);
  };

  return (
    // 👇 Dynamic Classes based on isDark prop
    <div className={`flex flex-col w-[350px] h-[500px] border rounded-2xl overflow-hidden shadow-2xl font-sans transition-colors duration-300
      ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
      
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center gap-2 shadow-md">
        <div className="bg-white/20 p-1.5 rounded-full">
            <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
            <h3 className="text-white font-bold text-sm">UniTime AI</h3>
            <p className="text-indigo-100 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
            </p>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-200
        ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border
                ${msg.sender === "user" 
                  ? "bg-indigo-100 border-indigo-200" 
                  : msg.sender === "error" 
                    ? "bg-red-100 border-red-200" 
                    : isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"
                }`}>
                {msg.sender === "user" ? <User size={14} className="text-indigo-600" /> : 
                 msg.sender === "error" ? <AlertCircle size={14} className="text-red-600" /> : 
                 <Bot size={14} className="text-indigo-600" />}
            </div>

            {/* Bubble */}
            <div 
                className={`p-3 text-sm max-w-[80%] shadow-sm transition-colors duration-300
                    ${msg.sender === "user" 
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none" 
                        : msg.sender === "error"
                        ? "bg-red-50 text-red-600 border border-red-200 rounded-2xl"
                        : isDark 
                          ? "bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-tl-none" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-2">
             <div className={`w-8 h-8 rounded-full border flex items-center justify-center
                ${isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"}`}>
                <Bot size={14} className="text-indigo-600" />
             </div>
             <div className={`p-3 rounded-2xl rounded-tl-none border flex items-center gap-2 text-xs
                ${isDark 
                  ? "bg-slate-800 border-slate-700 text-slate-400" 
                  : "bg-white border-slate-100 text-slate-500"}`}>
                <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-3 border-t flex gap-2 transition-colors duration-300
        ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className={`flex-1 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border-none transition-all
            ${isDark 
              ? "bg-slate-900 text-white placeholder-slate-500" 
              : "bg-slate-100 text-slate-800 placeholder-slate-400"}`}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white p-2 rounded-full transition-all shadow-md flex items-center justify-center w-10 h-10"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;