"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

// n8n webhook URL for chat
const WEBHOOK_URL = "https://abidemo15.app.n8n.cloud/webhook/19fb162f-87ff-454f-96b2-cce0aaa6e22b/chat";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore session
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem("chatSessionId", newSessionId);
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: uuidv4(),
      text: "Hello! Welcome to our dental practice. I'm here to help you with information about our services, answer your dental questions, or assist with scheduling an appointment. What can I help you with today?",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem("chatSessionId", newSessionId);
    localStorage.removeItem("chatHistory");

    const welcomeMessage: Message = {
      id: uuidv4(),
      text: "Hello! Welcome to our dental practice. I'm here to help you with information about our services, answer your dental questions, or assist with scheduling an appointment. What can I help you with today?",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message to UI
    const userMessage: Message = {
      id: uuidv4(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          action: "sendMessage",
          chatInput: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add bot response to UI
      const botMessage: Message = {
        id: uuidv4(),
        text: data.output || data.message || "I'm here to help! How can I assist you with your dental needs?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with webhook:", error);

      // Fallback bot message on error
      const errorMessage: Message = {
        id: uuidv4(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            {/* Dental Logo */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5b7c99] shadow-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                Dental Care Assistant
              </h1>
              <p className="text-sm text-gray-500">
                Professional dental support
              </p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg bg-[#5b7c99] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#4d6a82] active:scale-98"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        {/* Messages Area */}
        <div className="mb-4 flex-1 overflow-y-auto rounded-xl bg-white/70 p-6 shadow-sm backdrop-blur-sm">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-[#5b7c99] text-white shadow-sm"
                      : "bg-[#e8eaed] text-gray-900"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.sender === "bot" ? (
                      <ReactMarkdown
                        components={{
                          h3: ({ children }) => (
                            <h3 className="font-semibold text-base text-gray-900 mb-2 mt-1 first:mt-0">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0 text-gray-800">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="ml-5 mb-3 space-y-1.5 list-disc">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-gray-800">
                              {children}
                            </li>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-300/50 px-1.5 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                  <p
                    className={`mt-1.5 text-xs ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl bg-[#e8eaed] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="sticky bottom-0 flex gap-3 bg-[#f5f5f7] py-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about appointments, services, or dental care..."
            className="flex-1 rounded-lg border border-gray-300/60 bg-white/90 px-5 py-3.5 text-gray-900 placeholder-gray-500 shadow-sm backdrop-blur-sm transition-all focus:border-[#5b7c99] focus:outline-none focus:ring-2 focus:ring-[#5b7c99]/20"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#5b7c99] text-white shadow-sm transition-all hover:bg-[#4d6a82] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#5b7c99]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 bg-white/90 backdrop-blur-md py-4">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs text-gray-500">
            Session ID: <span className="font-mono text-[10px] text-gray-400">{sessionId}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
