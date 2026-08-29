import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getChatMessages, sendChatMessage, getChatThreads } from "../../lib/api";
import type { ChatMessage, ChatThread } from "../../lib/api";
import {
  X, Send, RefreshCw, MessageCircle, User,
  Sparkles, ArrowLeft, Users, Bot, Headphones
} from "lucide-react";

// ─── iOS-style palette ───────────────────────────────────────────────────────
// Neutral, monochrome, single accent (iOS blue). No gradients, no purple/gold.
const C = {
  bg: "#ffffff",
  bgSubtle: "#f2f2f7",     // iOS systemGray6
  border: "#e5e5ea",       // iOS systemGray5
  textPrimary: "#1c1c1e",
  textSecondary: "#8e8e93",
  accent: "#007aff",       // iOS blue
  accentText: "#ffffff",
  incomingBubble: "#e9e9eb", // iOS gray message bubble
  incomingText: "#1c1c1e",
};

// ─── Skeleton Loader ────────────────────────────────────────────────────────
function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse" style={{ background: C.bg }}>
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: C.border }} />
        <div className="flex flex-col gap-1.5 max-w-[75%]">
          <div className="h-3 rounded-full" style={{ width: "80%", background: C.bgSubtle }} />
          <div className="h-3 rounded-full" style={{ width: "95%", background: C.bgSubtle }} />
          <div className="h-3 rounded-full" style={{ width: "65%", background: C.bgSubtle }} />
        </div>
      </div>
      <div className="flex items-end gap-2 justify-end">
        <div className="flex flex-col gap-1.5 max-w-[55%] items-end">
          <div className="h-3 rounded-full" style={{ width: "90%", background: C.bgSubtle }} />
          <div className="h-3 rounded-full" style={{ width: "70%", background: C.bgSubtle }} />
        </div>
      </div>
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: C.border }} />
        <div className="flex flex-col gap-1.5 max-w-[60%]">
          <div className="h-3 rounded-full" style={{ width: "88%", background: C.bgSubtle }} />
          <div className="h-3 rounded-full" style={{ width: "60%", background: C.bgSubtle }} />
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
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isSwitching: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
        >
          <Sparkles className="w-4 h-4" style={{ color: C.accent }} />
        </div>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Ai</p>
        </div>
      </div>

      {isSwitching ? (
        <ChatSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5" style={{ background: C.bg }}>
          {messages.map((msg, index) => {
            const isAI = msg.senderEmail === "ai";
            return (
              <div key={index} className={`flex items-end gap-2 ${isAI ? "justify-start" : "justify-end"}`}>
                <div className="flex flex-col max-w-[78%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-line ${isAI ? "rounded-bl-sm" : "rounded-br-sm"
                      }`}
                    style={
                      isAI
                        ? { background: C.incomingBubble, color: C.incomingText }
                        : { background: C.accent, color: C.accentText }
                    }
                  >
                    {msg.message}
                  </div>
                  <span
                    className={`text-[9px] mt-1 px-1 ${isAI ? "text-left" : "text-right"}`}
                    style={{ color: C.textSecondary }}
                  >
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <div
                className="rounded-2xl px-4 py-2.5 flex gap-1 items-center rounded-bl-sm"
                style={{ background: C.incomingBubble }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: C.textSecondary }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ background: C.textSecondary }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ background: C.textSecondary }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="p-3 flex items-center gap-2"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message AI Concierge..."
          className="flex-1 rounded-full px-4 py-2 text-[13px] focus:outline-none transition-all"
          style={{ background: C.bgSubtle, border: `1px solid ${C.border}`, color: C.textPrimary }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 rounded-full disabled:opacity-30 transition-all cursor-pointer"
          style={{ background: C.accent }}
        >
          <Send className="w-3.5 h-3.5" style={{ color: C.accentText }} />
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
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
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
  if (isSwitching) {
    return <ChatSkeleton />;
  }

  // Admin: Thread List
  if (isAdmin && !selectedThread) {
    return (
      <>
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
            >
              <Users className="w-3.5 h-3.5" style={{ color: C.textPrimary }} />
            </div>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Customer Threads</p>
              <p className="text-[10px]" style={{ color: C.textSecondary }}>
                {adminThreads.length} active conversation{adminThreads.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAdminThreads}
            className="p-1.5 rounded-full transition-colors cursor-pointer"
            style={{ color: C.textSecondary }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ background: C.bg }}>
          {threadsLoading ? (
            <div className="p-6 text-center text-[12px]" style={{ color: C.textSecondary }}>Loading conversations...</div>
          ) : adminThreads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Users className="w-10 h-10" style={{ color: C.border }} />
              <p className="text-[12px] font-medium" style={{ color: C.textSecondary }}>No active conversations yet.</p>
              <p className="text-[10px]" style={{ color: C.textSecondary }}>Customer messages will appear here.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.border }}>
              {adminThreads.map((thread) => (
                <button
                  key={thread.senderEmail}
                  onClick={() => { setSelectedThread(thread); setMessages([]); }}
                  className="w-full p-4 text-left flex flex-col gap-1 transition-colors hover:bg-black/[0.02] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold flex items-center gap-2" style={{ color: C.textPrimary }}>
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0"
                        style={{ background: C.bgSubtle, color: C.textPrimary, border: `1px solid ${C.border}` }}
                      >
                        {thread.senderName.slice(0, 2).toUpperCase()}
                      </span>
                      {thread.senderName}
                    </span>
                    <span className="text-[10px]" style={{ color: C.textSecondary }}>
                      {thread.lastMessageAt
                        ? new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
                  <p className="text-[12px] line-clamp-1 pl-8" style={{ color: C.textSecondary }}>
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
          style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
        >
          <button
            onClick={() => { setSelectedThread(null); setMessages([]); }}
            className="p-1 rounded-full transition-colors cursor-pointer"
            style={{ color: C.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0"
            style={{ background: C.bgSubtle, color: C.textPrimary, border: `1px solid ${C.border}` }}
          >
            {selectedThread.senderName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>{selectedThread.senderName}</p>
            <p className="text-[10px]" style={{ color: C.textSecondary }}>{selectedThread.senderEmail}</p>
          </div>
          <button
            onClick={fetchAdminThreadMessages}
            className="ml-auto p-1.5 rounded-full transition-colors cursor-pointer"
            style={{ color: C.textSecondary }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5" style={{ background: C.bg }}>
          {messages.map((msg, index) => {
            const isAdminMsg = msg.senderEmail === "admin";
            return (
              <div key={index} className={`flex items-end gap-2 ${isAdminMsg ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-line ${isAdminMsg ? "rounded-br-sm" : "rounded-bl-sm"
                      }`}
                    style={
                      isAdminMsg
                        ? { background: C.accent, color: C.accentText }
                        : { background: C.incomingBubble, color: C.incomingText }
                    }
                  >
                    {!isAdminMsg && (
                      <div className="text-[10px] font-semibold mb-1" style={{ color: C.textSecondary }}>
                        {msg.senderName || selectedThread.senderName}
                      </div>
                    )}
                    {msg.message}
                  </div>
                  <span
                    className={`text-[9px] mt-1 px-1 ${isAdminMsg ? "text-right" : "text-left"}`}
                    style={{ color: C.textSecondary }}
                  >
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
          style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Reply to ${selectedThread.senderName}...`}
            className="flex-1 rounded-full px-4 py-2 text-[13px] focus:outline-none transition-all"
            style={{ background: C.bgSubtle, border: `1px solid ${C.border}`, color: C.textPrimary }}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 rounded-full disabled:opacity-30 transition-all cursor-pointer"
            style={{ background: C.accent }}
          >
            <Send className="w-3.5 h-3.5" style={{ color: C.accentText }} />
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
          style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
          >
            <Headphones className="w-3.5 h-3.5" style={{ color: C.textPrimary }} />
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Human Advisor</p>
            <p className="text-[10px]" style={{ color: C.textSecondary }}>
              Connect with a property specialist
            </p>
          </div>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5"
          style={{ background: C.bg }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
          >
            <User className="w-7 h-7" style={{ color: C.textSecondary }} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-[14px] font-semibold" style={{ color: C.textPrimary }}>Sign in to Chat</h4>
            <p className="text-[12px] leading-relaxed max-w-[210px] mx-auto" style={{ color: C.textSecondary }}>
              Connect with Rajesh or Ananya — our senior property advisors.
            </p>
          </div>
          <button
            onClick={() => openAuthModal("chat")}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ background: C.accent, color: C.accentText }}
          >
            Sign In to Continue
          </button>
          <button
            onClick={() => { setChatMode("ai"); setMessages([]); }}
            className="text-[12px] font-medium underline underline-offset-2 transition-colors"
            style={{ color: C.textSecondary }}
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
        style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
        >
          <Headphones className="w-3.5 h-3.5" style={{ color: C.textPrimary }} />
        </div>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Advisor</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5" style={{ background: C.bg }}>
        {messages.map((msg, index) => {
          const isAgent = msg.senderEmail === "admin" || msg.senderEmail === "ai";
          return (
            <div key={index} className={`flex items-end gap-2 ${isAgent ? "justify-start" : "justify-end"}`}>
              <div className="flex flex-col max-w-[75%]">
                <div
                  className={`rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-line ${isAgent ? "rounded-bl-sm" : "rounded-br-sm"
                    }`}
                  style={
                    isAgent
                      ? { background: C.incomingBubble, color: C.incomingText }
                      : { background: C.accent, color: C.accentText }
                  }
                >
                  {msg.message}
                </div>
                <span
                  className={`text-[9px] mt-1 px-1 ${isAgent ? "text-left" : "text-right"}`}
                  style={{ color: C.textSecondary }}
                >
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
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message your advisor..."
          className="flex-1 rounded-full px-4 py-2 text-[13px] focus:outline-none transition-all"
          style={{ background: C.bgSubtle, border: `1px solid ${C.border}`, color: C.textPrimary }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 rounded-full disabled:opacity-30 transition-all cursor-pointer"
          style={{ background: C.accent }}
        >
          <Send className="w-3.5 h-3.5" style={{ color: C.accentText }} />
        </button>
      </form>
    </>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const navigate = useNavigate();
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
          message: "Hi! I'm your AI concierge — ask me anything about our properties.",
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
    if (q.includes("agent") || q.includes("advisor"))
      return "Our senior luxury advisors are available to guide you through your plot or villa investment. You can reach the advisory desk at +91 97879 33444 or email advisory@propertyparadise.in.";
    if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
      return `Hello ${activeName}! I am here to help you navigate Property Paradise. Ask me about our Coimbatore villas, Ooty estates, Erode plots, or sales contact numbers!`;
    return "I want to make sure I give you correct details! You can ask me about Coimbatore villas, Ooty tea estate, Erode plots, RERA approvals, pricing, or how to contact our advisory desk.";
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
          className="w-[340px] sm:w-[360px] h-[510px] rounded-[18px] flex flex-col mb-4 overflow-hidden animate-fadeIn"
          style={{
            boxShadow: "0 20px 50px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            border: `1px solid ${C.border}`,
            background: C.bg,
          }}
        >
          {/* Top Bar */}
          <div
            className="px-4 py-2.5 flex items-center justify-between shrink-0"
            style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center p-1"
                style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
              >
                <img src="/icon.png" alt="PP" className="w-full h-full object-contain" />
              </div>
              <span className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Paradise Support</span>
            </div>

            {/* Mode Pill Toggle */}
            <div
              className="flex rounded-lg p-0.5 gap-0.5"
              style={{ background: C.bgSubtle, border: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => handleSwitchMode("ai")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer"
                style={
                  chatMode === "ai"
                    ? { background: C.bg, color: C.textPrimary, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }
                    : { color: C.textSecondary }
                }
              >
                <Bot className="w-2.5 h-2.5" />
                AI
              </button>
              <button
                onClick={() => handleSwitchMode("human")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer"
                style={
                  chatMode === "human"
                    ? { background: C.bg, color: C.textPrimary, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }
                    : { color: C.textSecondary }
                }
              >
                <User className="w-2.5 h-2.5" />
                {isAdminUser ? "Admin" : "Human"}
              </button>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-full transition-colors cursor-pointer"
              style={{ color: C.textSecondary }}
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
        onClick={() => {
          if (isAdminUser) {
            navigate("/admin/chat");
          } else {
            setIsChatOpen(!isChatOpen);
          }
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative z-[9999]"
        style={{
          background: C.accent,
          boxShadow: "0 8px 24px rgba(0,122,255,0.35)",
          border: "1px solid rgba(255,255,255,0.4)",
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