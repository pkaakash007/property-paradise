import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { getChatThreads, getChatMessages, sendChatMessage } from "../../lib/api";
import type { ChatThread, ChatMessage } from "../../lib/api";
import { Send, MessageSquare, User, RefreshCw, ArrowLeft } from "lucide-react";

export default function ChatSupport() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchThreads = () => {
    getChatThreads().then((data) => {
      setThreads(data);
      setLoading(false);
    });
  };

  const fetchMessages = () => {
    if (!selectedThread) return;
    getChatMessages(selectedThread.senderEmail).then((data) => {
      setMessages(data);
    });
  };

  // Poll Threads List every 2 minutes (120000 ms)
  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 120000);
    return () => clearInterval(interval);
  }, []);

  // Poll selected thread messages every 2 minutes (120000 ms)
  useEffect(() => {
    if (!selectedThread) {
      setMessages([]);
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 120000);
    return () => clearInterval(interval);
  }, [selectedThread]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const messageContent = replyText.trim();
    setReplyText("");

    // Optimistic Update
    const tempMsg: ChatMessage = {
      senderEmail: "admin",
      senderName: "Admin Advisor",
      receiverEmail: selectedThread.senderEmail,
      message: messageContent,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    const success = await sendChatMessage("admin", "Admin Support", messageContent, selectedThread.senderEmail);
    if (success) {
      fetchMessages(); // immediately refresh
    }
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-[#E7E5DF] overflow-hidden shadow-sm animate-fadeIn">
        
        {/* Left Side: Threads List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-[#E7E5DF] flex flex-col shrink-0 ${selectedThread ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-[#E7E5DF] flex items-center justify-between bg-[#F7F5F0]">
            <h2 className="font-serif text-base font-bold text-[#17212B]">Support Channels</h2>
            <button 
              onClick={fetchThreads}
              title="Manual Refresh"
              className="p-1 rounded-lg hover:bg-slate-200 transition-colors text-[#53606C] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-[#E7E5DF]">
            {loading ? (
              <div className="p-6 text-center text-xs text-[#53606C] font-semibold">
                Loading support channels...
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#53606C] font-semibold">
                No active chat threads found.
              </div>
            ) : (
              threads.map((thread) => {
                const active = selectedThread?.senderEmail === thread.senderEmail;
                return (
                  <button
                    key={thread.senderEmail}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full p-4 text-left flex flex-col gap-1.5 transition-all ${
                      active ? "bg-[#123B5D]/10 border-l-4 border-[#123B5D]" : "hover:bg-[#F7F5F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17212B] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#C7A76C]" />
                        {thread.senderName}
                      </span>
                      <span className="text-[9px] font-semibold text-[#8E8E93]">
                        {thread.lastMessageAt ? new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#53606C] font-medium line-clamp-1">
                      {thread.lastMessage}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Panel */}
        <div className={`flex-1 flex flex-col bg-[#F7F5F0] ${!selectedThread ? "hidden md:flex" : "flex"}`}>
          {selectedThread ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 border-b border-[#E7E5DF] bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedThread(null)}
                    className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-[#53606C] transition-colors"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" />
                  </button>
                  <div>
                    <h3 className="text-xs font-bold text-[#17212B] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Chatting with {selectedThread.senderName}
                    </h3>
                    <p className="text-[10px] text-[#53606C] font-semibold mt-0.5">
                      ID: {selectedThread.senderEmail}
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchMessages}
                  title="Manual Refresh Chat"
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-[#53606C] cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => {
                  const isAdmin = msg.senderEmail === "admin";
                  return (
                    <div 
                      key={index} 
                      className={`flex items-start gap-2.5 ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      {!isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-[#123B5D] text-white flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0">
                          {selectedThread.senderName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col max-w-[70%]">
                        <div 
                          className={`rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                            isAdmin 
                              ? "bg-[#123B5D] text-white" 
                              : "bg-white border border-[#E7E5DF] text-[#17212B]"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className={`text-[9px] text-[#8E8E93] mt-1 font-semibold ${isAdmin ? "text-right" : "text-left"}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Form */}
              <form 
                onSubmit={handleSendReply}
                className="p-4 border-t border-[#E7E5DF] bg-white flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedThread.senderName}...`}
                  className="flex-1 bg-[#F7F5F0] border border-[#E7E5DF] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#123B5D] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-3 bg-[#123B5D] hover:bg-[#17212B] text-white rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#53606C]">
              <MessageSquare className="w-12 h-12 text-[#C7A76C] mb-3" />
              <h3 className="font-serif text-base font-bold text-[#17212B]">No Chat Selected</h3>
              <p className="text-xs text-[#8E8E93] max-w-xs mt-1 leading-relaxed">
                Select a support channel conversation thread from the list to reply. Refresh interval is set to 2 minutes. Click the refresh icon to pull manually.
              </p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
