import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getChatMessages, sendChatMessage, getChatThreads } from "../../lib/api";
import type { ChatMessage, ChatThread } from "../../lib/api";
import {
  X, Send, RefreshCw, MessageCircle, User,
  Sparkles, ArrowLeft, Users, Bot, Headphones
} from "lucide-react";

// ─── Skeleton Loader ────────────────────────────────────────────────────────
function AISkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse"
      style={{ background: "linear-gradient(180deg, #0f0b1e 0%, #13102a 100%)" }}>
      {/* Bot bubble wide */}
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: "rgba(109,40,217,0.4)" }} />
        <div className="flex flex-col gap-1.5 max-w-[75%]">
          <div className="h-3 rounded-full" style={{ width: "80%", background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3 rounded-full" style={{ width: "95%", background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3 rounded-full" style={{ width: "65%", background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
      {/* User bubble */}
      <div className="flex items-end gap-2 justify-end">
        <div className="flex flex-col gap-1.5 max-w-[55%] items-end">
          <div className="h-3 rounded-full" style={{ width: "90%", background: "rgba(109,40,217,0.3)" }} />
          <div className="h-3 rounded-full" style={{ width: "70%", background: "rgba(109,40,217,0.3)" }} />
        </div>
      </div>
      {/* Bot bubble narrow */}
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: "rgba(109,40,217,0.4)" }} />
        <div className="flex flex-col gap-1.5 max-w-[60%]">
          <div className="h-3 rounded-full" style={{ width: "88%", background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3 rounded-full" style={{ width: "60%", background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
    </div>
  );
}

function HumanSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse" style={{ background: "#0a1018" }}>
      {/* Agent bubble */}
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: "rgba(199,167,108,0.3)" }} />
        <div className="flex flex-col gap-1.5 max-w-[75%]">
          <div className="h-3 rounded-full" style={{ width: "85%", background: "rgba(199,167,108,0.10)" }} />
          <div className="h-3 rounded-full" style={{ width: "70%", background: "rgba(199,167,108,0.10)" }} />
        </div>
      </div>
      {/* User bubble */}
      <div className="flex items-end gap-2 justify-end">
        <div className="flex flex-col gap-1.5 max-w-[55%] items-end">
          <div className="h-3 rounded-full" style={{ width: "90%", background: "rgba(199,167,108,0.2)" }} />
          <div className="h-3 rounded-full" style={{ width: "60%", background: "rgba(199,167,108,0.2)" }} />
        </div>
      </div>
      {/* Agent bubble */}
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: "rgba(199,167,108,0.3)" }} />
        <div className="flex flex-col gap-1.5 max-w-[65%]">
          <div className="h-3 rounded-full" style={{ width: "78%", background: "rgba(199,167,108,0.10)" }} />
          <div className="h-3 rounded-full" style={{ width: "50%", background: "rgba(199,167,108,0.10)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── AI Panel ───────────────────────────────────────────────────────────────
function AIPanel({
  messages,
  isTyping,
  inputMessage,
  setInputMessage,
  onSubmit,
  messagesEndRef,
  isSwitching,
}: {
  messages: ChatMessage[];
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isSwitching: boolean;
}) {
  return (
    <>
      {/* AI Header Band */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, #1a1033 0%, #2d1b69 60%, #3b2a8a 100%)" }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <Sparkles className="w-4 h-4 text-violet-300" />
        </div>
        <div>
          <p className="text-[11px] font-black text-white tracking-wide">AI Concierge</p>
          <p className="text-[9px] text-violet-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Trained on Property Paradise catalog
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-[9px] font-bold bg-violet-500/30 text-violet-200 px-2 py-0.5 rounded-full border border-violet-500/40">
            AI
          </span>
        </div>
      </div>

      {/* Messages — show skeleton while switching */}
      {isSwitching ? <AISkeleton /> : null}
      {!isSwitching && /* Messages */true &&
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ background: "linear-gradient(180deg, #0f0b1e 0%, #13102a 100%)" }}
        >
          {messages.map((msg, index) => {
            const isAI = msg.senderEmail === "ai";
            return (
              <div key={index} className={`flex items-end gap-2 ${isAI ? "justify-start" : "justify-end"}`}>
                {isAI && (
                  <div
                    className="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #4f35c2, #7c3aed)" }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex flex-col max-w-[78%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-[11.5px] leading-relaxed whitespace-pre-line ${isAI ? "text-slate-100 rounded-bl-sm" : "text-white rounded-br-sm font-semibold"
                      }`}
                    style={
                      isAI
                        ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }
                        : { background: "linear-gradient(135deg, #6d28d9, #4f46e5)" }
                    }
                  >
                    {msg.message}
                  </div>
                  <span className={`text-[8px] text-violet-400/60 mt-1 px-1 font-bold ${isAI ? "text-left" : "text-right"}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <div
                className="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4f35c2, #7c3aed)" }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div
                className="rounded-2xl px-4 py-2.5 flex gap-1 items-center rounded-bl-sm"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>}
      {/* Input always visible even during skeleton */}

      {/* AI Input */}
      <form
        onSubmit={onSubmit}
        className="p-3 flex items-center gap-2"
        style={{ background: "#0f0b1e", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask AI about properties, prices..."
          className="flex-1 rounded-full px-4 py-2 text-xs font-semibold focus:outline-none transition-all text-white placeholder-violet-300/40"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 rounded-full disabled:opacity-30 transition-all cursor-pointer shadow-lg"
          style={{ background: "linear-gradient(135deg, #6d28d9, #4f46e5)" }}
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </form>
    </>
  );
}

// ─── Human / Admin Panel ─────────────────────────────────────────────────────
function HumanPanel({
  messages,
  inputMessage,
  setInputMessage,
  onSubmit,
  messagesEndRef,
  user,
  openAuthModal,
  setChatMode,
  setMessages,
  isAdmin,
  adminThreads,
  threadsLoading,
  selectedThread,
  setSelectedThread,
  fetchAdminThreads,
  fetchAdminThreadMessages,
  isSwitching,
}: {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  user: { email: string; name: string; role?: string } | null;
  openAuthModal: (ctx: string) => void;
  setChatMode: (m: "ai" | "human") => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isAdmin: boolean;
  adminThreads: ChatThread[];
  threadsLoading: boolean;
  selectedThread: ChatThread | null;
  setSelectedThread: (t: ChatThread | null) => void;
  fetchAdminThreads: () => void;
  fetchAdminThreadMessages: () => void;
  isSwitching: boolean;
}) {
  // Show skeleton while mode is switching
  if (isSwitching) {
    return <HumanSkeleton />;
  }
  // Admin: Thread List
  if (isAdmin && !selectedThread) {
    return (
      <>
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: "#111827", borderBottom: "1px solid #1f2937" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
            >
              <Users className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white">Customer Threads</p>
              <p className="text-[9px] text-amber-400 font-semibold">
                {adminThreads.length} active conversation{adminThreads.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAdminThreads}
            className="p-1.5 rounded-full text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ background: "#0d1117" }}>
          {threadsLoading ? (
            <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading conversations...</div>
          ) : adminThreads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Users className="w-10 h-10 text-slate-700" />
              <p className="text-xs text-slate-500 font-semibold">No active conversations yet.</p>
              <p className="text-[10px] text-slate-600">Customer messages will appear here.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "#1f2937" }}>
              {adminThreads.map((thread) => (
                <button
                  key={thread.senderEmail}
                  onClick={() => { setSelectedThread(thread); setMessages([]); }}
                  className="w-full p-4 text-left flex flex-col gap-1 transition-colors hover:bg-white/[0.03] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold shrink-0"
                        style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)", color: "#111" }}
                      >
                        {thread.senderName.slice(0, 2).toUpperCase()}
                      </span>
                      {thread.senderName}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold">
                      {thread.lastMessageAt
                        ? new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 pl-8 group-hover:text-slate-400 transition-colors">
                    {thread.lastMessage}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // Admin: Conversation View
  if (isAdmin && selectedThread) {
    return (
      <>
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ background: "#111827", borderBottom: "1px solid #1f2937" }}
        >
          <button
            onClick={() => { setSelectedThread(null); setMessages([]); }}
            className="p-1 rounded-full text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-extrabold shrink-0"
            style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)", color: "#111" }}
          >
            {selectedThread.senderName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-black text-white">{selectedThread.senderName}</p>
            <p className="text-[9px] text-amber-400 font-semibold">{selectedThread.senderEmail}</p>
          </div>
          <button
            onClick={fetchAdminThreadMessages}
            className="ml-auto p-1.5 rounded-full text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#0d1117" }}>
          {messages.map((msg, index) => {
            const isAdminMsg = msg.senderEmail === "admin";
            return (
              <div key={index} className={`flex items-end gap-2 ${isAdminMsg ? "justify-end" : "justify-start"}`}>
                {!isAdminMsg && (
                  <div
                    className="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center text-[9px] font-extrabold"
                    style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)", color: "#111" }}
                  >
                    {selectedThread.senderName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-[11.5px] leading-relaxed whitespace-pre-line ${isAdminMsg ? "rounded-br-sm text-[#111]" : "rounded-bl-sm text-white"
                      }`}
                    style={
                      isAdminMsg
                        ? { background: "linear-gradient(135deg, #C7A76C, #b09054)" }
                        : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {msg.message}
                  </div>
                  <span className={`text-[8px] text-slate-500 mt-1 px-1 font-bold ${isAdminMsg ? "text-right" : "text-left"}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={onSubmit}
          className="p-3 flex items-center gap-2"
          style={{ background: "#111827", borderTop: "1px solid #1f2937" }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Reply to ${selectedThread.senderName}...`}
            className="flex-1 rounded-full px-4 py-2 text-xs font-semibold focus:outline-none transition-all text-white placeholder-slate-500"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 rounded-full disabled:opacity-30 transition-all cursor-pointer shadow-lg"
            style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
          >
            <Send className="w-3.5 h-3.5 text-[#111]" />
          </button>
        </form>
      </>
    );
  }

  // Regular User: Not Signed In
  if (!user) {
    return (
      <>
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ background: "#0f1923", borderBottom: "1px solid rgba(199,167,108,0.15)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
          >
            <Headphones className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-white">Human Advisor</p>
            <p className="text-[9px] font-semibold" style={{ color: "#C7A76C" }}>
              Connect with a property specialist
            </p>
          </div>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5"
          style={{ background: "#0a1018" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(199,167,108,0.15), rgba(199,167,108,0.05))",
              border: "1px solid rgba(199,167,108,0.2)",
            }}
          >
            <User className="w-7 h-7" style={{ color: "#C7A76C" }} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-white">Sign in to Chat</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[210px] mx-auto">
              Connect with Rajesh or Ananya — our senior property advisors.
            </p>
          </div>
          <button
            onClick={() => openAuthModal("chat")}
            className="w-full py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
          >
            Sign In to Continue
          </button>
          <button
            onClick={() => { setChatMode("ai"); setMessages([]); }}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
          >
            Use AI Concierge instead
          </button>
        </div>
      </>
    );
  }

  // Regular User: Human Chat
  return (
    <>
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: "#0f1923", borderBottom: "1px solid rgba(199,167,108,0.15)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
        >
          <Headphones className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-black text-white">Human Advisor</p>

        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#0a1018" }}>
        {messages.map((msg, index) => {
          const isAgent = msg.senderEmail === "admin" || msg.senderEmail === "ai";
          return (
            <div key={index} className={`flex items-end gap-2 ${isAgent ? "justify-start" : "justify-end"}`}>
              {isAgent && (
                <div
                  className="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
                >
                  <img src="/icon.png" alt="Advisor" className="w-full h-full object-contain" />
                </div>
              )}
              <div className="flex flex-col max-w-[75%]">
                <div
                  className={`rounded-2xl px-3.5 py-2 text-[11.5px] leading-relaxed whitespace-pre-line ${isAgent ? "rounded-bl-sm text-white" : "rounded-br-sm text-[#111]"
                    }`}
                  style={
                    isAgent
                      ? { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(199,167,108,0.12)" }
                      : { background: "linear-gradient(135deg, #C7A76C, #b09054)" }
                  }
                >
                  {msg.message}
                </div>
                <span className={`text-[8px] mt-1 px-1 font-bold text-amber-600/50 ${isAgent ? "text-left" : "text-right"}`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={onSubmit}
        className="p-3 flex items-center gap-2"
        style={{ background: "#0f1923", borderTop: "1px solid rgba(199,167,108,0.12)" }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message your advisor..."
          className="flex-1 rounded-full px-4 py-2 text-xs font-semibold focus:outline-none transition-all text-white placeholder-slate-500"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(199,167,108,0.15)" }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 rounded-full disabled:opacity-30 transition-all cursor-pointer shadow-lg"
          style={{ background: "linear-gradient(135deg, #C7A76C, #a07840)" }}
        >
          <Send className="w-3.5 h-3.5 text-[#111]" />
        </button>
      </form>
    </>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const { user, openAuthModal, isChatOpen, setIsChatOpen, chatMode, setChatMode } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [adminThreads, setAdminThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [threadsLoading, setThreadsLoading] = useState(false);

  useEffect(() => {
    setIsSwitching(true);
    const timer = setTimeout(() => setIsSwitching(false), 300);
    return () => clearTimeout(timer);
  }, [chatMode]);

  const activeEmail = user?.email || "";
  const activeName = user?.name || "Guest";
  const isAdminUser = user ? user.role === "admin" : false;

  useEffect(() => {
    if (chatMode === "ai" && messages.length === 0) {
      setMessages([
        {
          senderEmail: "ai",
          senderName: "AI Concierge",
          receiverEmail: activeEmail,
          message:
            "Hello! I am your AI Paradise Concierge, trained on our real estate catalog. Ask me anything about our Coimbatore villas, Ooty tea estate, Erode plots, pricing, or how to book a site visit!",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [chatMode, messages.length, activeEmail]);

  const fetchAdminThreads = () => {
    setThreadsLoading(true);
    getChatThreads().then((data) => { setAdminThreads(data); setThreadsLoading(false); });
  };

  useEffect(() => {
    if (isAdminUser && chatMode === "human" && isChatOpen) fetchAdminThreads();
  }, [isAdminUser, chatMode, isChatOpen]);

  const fetchAdminThreadMessages = () => {
    if (!selectedThread) return;
    getChatMessages(selectedThread.senderEmail).then((data) => setMessages(data));
  };

  useEffect(() => {
    if (!isAdminUser || !selectedThread) return;
    fetchAdminThreadMessages();
    const interval = setInterval(fetchAdminThreadMessages, 120000);
    return () => clearInterval(interval);
  }, [selectedThread]);

  const fetchMsgs = () => {
    if (chatMode !== "human" || !activeEmail || isAdminUser) return;
    getChatMessages(activeEmail).then((data) => setMessages(data));
  };

  useEffect(() => {
    if (chatMode !== "human" || !activeEmail || !isChatOpen || isAdminUser) return;
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 120000);
    return () => clearInterval(interval);
  }, [activeEmail, isChatOpen, chatMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen, isTyping]);

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("price") || q.includes("cost") || q.includes("budget") || q.includes("how much") || q.includes("pricing"))
      return "Here is the pricing breakdown for our exclusive portfolio:\n1. Coimbatore (Kailash Nagar): Luxury 3/4 BHK Villas starting from \u20b91.2 Crores to \u20b92.5 Crores.\n2. Erode (Alamelu Avenue): Residential Plots starting from \u20b925 Lakhs.\n3. Ooty: Premium Tea Estate Bungalow priced at \u20b94.8 Crores.";
    if (q.includes("coimbatore") || q.includes("kailash nagar") || q.includes("periyanaickenpalayam") || q.includes("villa"))
      return "In Coimbatore (Kailash Nagar, Periyanaickenpalayam), we have premium 3 & 4 BHK Luxury Villas. They feature private pools, smart home automation, high-end marble flooring, and 24/7 security. Prices start from \u20b91.2 Cr.";
    if (q.includes("erode") || q.includes("plot") || q.includes("alamelu") || q.includes("land"))
      return "In Erode, we offer premium residential plots at 'Alamelu Avenue'. These plots are fully RERA approved, have blacktop roads, underground water/electricity pipelines, and are ready for immediate villa construction. Prices start from \u20b925 Lakhs.";
    if (q.includes("ooty") || q.includes("estate") || q.includes("tea") || q.includes("bungalow"))
      return "In Ooty, we have a breathtaking tea estate bungalow spread across lush green landscapes. It offers scenic mountain views, organic tea gardens, and premium British-style architecture. Priced at \u20b94.8 Crores.";
    if (q.includes("contact") || q.includes("phone") || q.includes("number") || q.includes("call") || q.includes("email"))
      return "You can reach our sales desk directly via:\n\u2022 Phone: +91 97879 33444 or +91 97879 22333\n\u2022 Email: sales@propertyparadise.in\n\u2022 Office: Kailash Nagar, Periyanaickenpalayam, Coimbatore, India.";
    if (q.includes("visit") || q.includes("book") || q.includes("site") || q.includes("schedule"))
      return "You can book a site visit easily! Just click the 'Book Visit' button directly on any property page, select your preferred date/time, and our agent will meet you at the site. Alternatively, call us at +91 97879 33444.";
    if (q.includes("rera") || q.includes("legal") || q.includes("approve"))
      return "All properties listed on Property Paradise are 100% RERA registered, legally vetted, and clear-titled. We provide complete documentation support, including parent deeds and encumbrance certificates.";
    if (q.includes("agent") || q.includes("advisor") || q.includes("rajesh") || q.includes("ananya"))
      return "Our senior luxury advisors are:\n\u2022 Rajesh K. Varma (Principal Advisor) - Specializes in Coimbatore Villas and Commercial deals.\n\u2022 Ananya Sundaram (Luxury Estate Agent) - Expert in Ooty Estates and Erode Residential Projects.";
    if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
      return `Hello ${activeName}! I am here to help you navigate Property Paradise. Ask me about our Coimbatore villas, Ooty estates, Erode plots, or agent contact numbers!`;
    return "I want to make sure I give you correct details! You can ask me about Coimbatore villas, Ooty tea estate, Erode plots, RERA approvals, pricing, or how to contact our advisors Rajesh and Ananya.";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const msgText = inputMessage.trim();
    setInputMessage("");

    if (isAdminUser && chatMode === "human" && selectedThread) {
      const adminMsg: ChatMessage = {
        senderEmail: "admin",
        senderName: "Admin Advisor",
        receiverEmail: selectedThread.senderEmail,
        message: msgText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, adminMsg]);
      await sendChatMessage("admin", "Admin Advisor", msgText, selectedThread.senderEmail);
      fetchAdminThreadMessages();
      return;
    }

    const userMsg: ChatMessage = {
      senderEmail: activeEmail || "guest",
      senderName: activeName,
      receiverEmail: chatMode === "ai" ? "ai" : "admin",
      message: msgText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (chatMode === "ai") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            senderEmail: "ai",
            senderName: "AI Concierge",
            receiverEmail: activeEmail,
            message: getAIResponse(msgText),
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 1000);
    } else {
      if (!activeEmail) return;
      const success = await sendChatMessage(activeEmail, activeName, msgText);
      if (success) fetchMsgs();
    }
  };

  const handleSwitchMode = (mode: "ai" | "human") => {
    if (mode === "human" && !user) { openAuthModal("chat"); return; }
    setChatMode(mode);
    setMessages([]);
    setSelectedThread(null);
  };

  const isPropertyDetailPage = window.location.pathname.startsWith("/property/");

  return (
    <div className={`fixed ${isPropertyDetailPage ? "bottom-20 sm:bottom-6" : "bottom-6"} right-6 z-[9998] flex flex-col items-end font-sans`}>
      {isChatOpen && (
        <div
          className="w-[340px] sm:w-[360px] h-[510px] rounded-[22px] flex flex-col mb-4 overflow-hidden animate-fadeIn"
          style={{
            boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.06)",
            background: chatMode === "ai" ? "#0f0b1e" : "#0a1018",
          }}
        >
          {/* Top Bar */}
          <div
            className="px-4 py-2.5 flex items-center justify-between shrink-0"
            style={{
              background: chatMode === "ai"
                ? "linear-gradient(135deg, #1a1033 0%, #2d1b69 100%)"
                : "#111827",
              borderBottom: chatMode === "ai"
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid #1f2937",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center p-1"
                style={{
                  background: chatMode === "ai" ? "rgba(255,255,255,0.08)" : "rgba(199,167,108,0.15)",
                  border: chatMode === "ai" ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(199,167,108,0.25)",
                }}
              >
                <img src="/icon.png" alt="PP" className="w-full h-full object-contain" />
              </div>
              <span className="text-[11px] font-black text-white tracking-wide">Paradise Support</span>
            </div>

            {/* Mode Pill Toggle */}
            <div
              className="flex rounded-lg p-0.5 gap-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => handleSwitchMode("ai")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[9.5px] font-bold transition-all cursor-pointer"
                style={
                  chatMode === "ai"
                    ? { background: "linear-gradient(135deg, #6d28d9, #4f46e5)", color: "white" }
                    : { color: "rgba(255,255,255,0.4)" }
                }
              >
                <Bot className="w-2.5 h-2.5" />
                AI
              </button>
              <button
                onClick={() => handleSwitchMode("human")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[9.5px] font-bold transition-all cursor-pointer"
                style={
                  chatMode === "human"
                    ? { background: "linear-gradient(135deg, #C7A76C, #a07840)", color: "#111" }
                    : { color: "rgba(255,255,255,0.4)" }
                }
              >
                <User className="w-2.5 h-2.5" />
                {isAdminUser ? "Admin" : "Human"}
              </button>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {chatMode === "ai" ? (
              <AIPanel
                messages={messages}
                isTyping={isTyping}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSubmit={handleSendMessage}
                messagesEndRef={messagesEndRef}
                isSwitching={isSwitching}
              />
            ) : (
              <HumanPanel
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSubmit={handleSendMessage}
                messagesEndRef={messagesEndRef}
                user={user}
                openAuthModal={openAuthModal}
                setChatMode={setChatMode}
                setMessages={setMessages}
                isAdmin={isAdminUser}
                adminThreads={adminThreads}
                threadsLoading={threadsLoading}
                selectedThread={selectedThread}
                setSelectedThread={setSelectedThread}
                fetchAdminThreads={fetchAdminThreads}
                fetchAdminThreadMessages={fetchAdminThreadMessages}
                isSwitching={isSwitching}
              />
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative z-[9999]"
        style={{
          background: isAdminUser
            ? "linear-gradient(135deg, #C7A76C, #a07840)"
            : "linear-gradient(135deg, #3b2a8a, #4f46e5)",
          boxShadow: isAdminUser
            ? "0 8px 24px rgba(199,167,108,0.4)"
            : "0 8px 24px rgba(109,40,217,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        title={isAdminUser ? "Advisor Console" : "Chat with Advisor"}
      >
        {isChatOpen ? (
          <X className="w-5 h-5 text-white animate-fadeIn" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white animate-fadeIn" />
        )}
        {!isChatOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white animate-ping" />
          </span>
        )}
      </button>
    </div>
  );
}
