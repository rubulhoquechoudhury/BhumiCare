"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SoilParams, SessionListItem } from "@/types/database";
import { FlaskConical, MessageSquare, TrendingUp, Sprout } from "lucide-react";
import SessionSidebar from "@/components/SessionSidebar";
import SoilOverlay from "@/components/SoilOverlay";
import SoilSummaryCard from "@/components/SoilSummaryCard";
import ChatMessageBubble from "@/components/ChatMessage";
import MarketPanel from "@/components/MarketPanel";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useLanguage } from "@/lib/language-context";

interface ChatMsg {
  role: "user" | "ai";
  content: string;
}

type ActiveTab = "chat" | "market";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [userId, setUserId] = useState("");

  // User
  const [userName, setUserName] = useState("");

  // Chats (formerly Sessions)
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Soil State for Current Chat
  const [lastSoilSnapshot, setLastSoilSnapshot] = useState<SoilParams | null>(null);
  const [soilLastUpdated, setSoilLastUpdated] = useState<string | null>(null);

  // Chat
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soilOverlayOpen, setSoilOverlayOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ── Fetch Chats ──
  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (e) {
      console.error("Failed to fetch chats:", e);
    }
  };

  // ── Load User + Chats on Mount ──
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Load user name
      const { data: userData } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      if (userData?.name) setUserName(userData.name);

      // Load chats
      await fetchSessions();
      setPageLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-scroll Chat ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Load a Specific Chat ──
  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages([]);

    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();

      if (data.messages) {
        setMessages(
          data.messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "ai",
            content: m.content,
          }))
        );
      }

      if (data.soilSnapshot) {
        setLastSoilSnapshot(data.soilSnapshot);
        setSoilLastUpdated(data.soilSnapshotDate || new Date().toISOString());
      } else {
        setLastSoilSnapshot(null);
        setSoilLastUpdated(null);
      }
    } catch (e) {
      console.error("Failed to load chat:", e);
    }
  };

  // ── New Chat ──
  const newSession = () => {
    setActiveSessionId(null);
    setMessages([]);
    // We clear soil state for a brand new chat
    setLastSoilSnapshot(null);
    setSoilLastUpdated(null);
    setChatInput("");
    inputRef.current?.focus();
  };

  // ── Send Message ──
  const sendMessage = useCallback(
    async (overrideMessage?: string, soilParams?: SoilParams) => {
      const msg = overrideMessage || chatInput.trim();
      if (!msg && !soilParams) return;

      const userMessage = soilParams
        ? `Analyze my soil: pH=${soilParams.ph}, Moisture=${soilParams.moisture}%, N=${soilParams.nitrogen}, P=${soilParams.phosphorus}, K=${soilParams.potassium}`
        : msg;

      setChatInput("");
      setLoading(true);

      // Add user message to chat
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            sessionId: activeSessionId,
            soilParams: soilParams || undefined,
          }),
        });

        const data = await res.json();

        if (data.error) {
          setMessages((prev) => [
            ...prev,
            { role: "ai", content: `Error: ${data.error}` },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "ai", content: data.response },
          ]);

          // Update session ID if a new chat was created on the backend
          if (data.sessionId && data.sessionId !== activeSessionId) {
            setActiveSessionId(data.sessionId);
          }

          // Refresh the sidebar to show the updated chat title/time
          fetchSessions();
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Failed to connect. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatInput, activeSessionId]
  );

  // ── Handle Soil Analysis from Overlay ──
  const handleSoilAnalyze = (params: SoilParams) => {
    setSoilOverlayOpen(false);
    setLastSoilSnapshot(params);
    setSoilLastUpdated(new Date().toISOString());
    sendMessage(
      `Analyze my soil: pH=${params.ph}, Moisture=${params.moisture}%, N=${params.nitrogen}, P=${params.phosphorus}, K=${params.potassium}`,
      params
    );
  };

  // ── Logout ──
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // ── Page Loading State ──
  if (pageLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center animate-pulse-soft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M7 20h10" />
              <path d="M10 20c5.5-2.5.8-6.4 3-10" />
              <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
            </svg>
          </div>
          <p className="text-sm text-text-muted">Loading BhumiCare AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen gradient-bg flex flex-col overflow-hidden">
      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border-light shrink-0">
        <div className="px-2 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="sm:hidden p-1.5 rounded-lg hover:bg-surface-hover"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-border-light flex items-center justify-center overflow-hidden shrink-0">
              <Image src="/bhumicare-logo.png" alt="BhumiCare" width={32} height={32} className="w-full h-full object-contain scale-[1.8]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-primary tracking-tight leading-tight whitespace-nowrap">BhumiCare AI</h1>
              <p className="text-[10px] text-text-muted leading-none hidden sm:block">Tea Intelligence Platform</p>
            </div>
          </div>

          {/* Center: Tab navigation */}
          <div className="hidden sm:flex items-center gap-1 bg-surface rounded-2xl p-1 border border-border-light">
            {([
              { id: "chat", label: t("nav.chat"), icon: MessageSquare },
              { id: "market", label: t("nav.market"), icon: TrendingUp },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === id
                    ? "bg-white text-text-primary shadow-sm border border-border-light"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Right: Language + User */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitch />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent-wash flex items-center justify-center border border-accent/20">
                <span className="text-xs font-bold text-accent">
                  {userName ? userName[0].toUpperCase() : "U"}
                </span>
              </div>
              <span className="text-sm font-medium text-text-secondary hidden sm:block">{userName || "User"}</span>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors" title="Sign out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="sm:hidden flex border-t border-border-light">
          {([
            { id: "chat", label: t("nav.chat"), icon: MessageSquare },
            { id: "market", label: t("nav.market"), icon: TrendingUp },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === id ? "text-accent border-b-2 border-accent" : "text-text-muted"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ═══ Main Layout ═══ */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={loadSession}
          onNewSession={newSession}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* ═══ Main Content Area ═══ */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 relative">
          {/* Market Panel */}
          {activeTab === "market" && userId && (
            <MarketPanel userId={userId} />
          )}

          {/* Chat Area (hidden when market tab active) */}
          <div className={activeTab !== "chat" ? "hidden" : "flex flex-col flex-1 min-h-0"}>
          {/* ── Pinned Soil Summary Card ── */}
          {lastSoilSnapshot && (lastSoilSnapshot.ph > 0 || lastSoilSnapshot.moisture > 0) && (
            <div className="shrink-0 px-4 sm:px-8 pt-3">
              <SoilSummaryCard
                soil={lastSoilSnapshot}
                lastUpdated={soilLastUpdated}
                onEdit={() => setSoilOverlayOpen(true)}
              />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 py-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                  <div className="w-32 h-32 rounded-[36px] bg-white flex items-center justify-center mb-6 border border-border-light shadow-xl shadow-accent/5 overflow-hidden">
                    <Image src="/bhumicare-logo.png" alt="BhumiCare Logo" width={128} height={128} className="w-full h-full object-contain scale-[1.8]" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-3 tracking-tight flex items-center justify-center gap-2">
                    Hi {userName || "there"}! <Sprout className="text-accent w-6 h-6" />
                  </h2>
                  <p className="text-base text-text-secondary max-w-md mb-8 leading-relaxed">
                    I&apos;m your AI soil advisor. Ask me anything about tea cultivation, or tap the <FlaskConical size={18} className="inline-block text-accent -mt-1 mx-0.5" /> button to analyze your soil.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {[
                      "What makes good tea soil?",
                      "Explain NPK for tea",
                      "Ideal pH for tea plants?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setChatInput(q);
                          setTimeout(() => sendMessage(q), 50);
                        }}
                        className="px-5 py-2.5 rounded-[20px] bg-white border border-border-light text-sm text-text-secondary font-medium
                          hover:bg-accent-wash hover:border-accent/30 hover:text-primary transition-all duration-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Prominent soil button in empty state */}
                  <button
                    onClick={() => setSoilOverlayOpen(true)}
                    className="px-8 py-4 rounded-[24px] gradient-button text-white font-semibold text-base
                      hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-accent/20
                      flex items-center gap-3"
                  >
                    <FlaskConical size={20} /> Enter Soil Parameters
                  </button>
                </div>
              ) : (
                /* Messages */
                <>
                  {messages.map((msg, i) => (
                    <ChatMessageBubble
                      key={i}
                      role={msg.role}
                      content={msg.content}
                      index={i}
                    />
                  ))}
                </>
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-accent-wash flex items-center justify-center mr-3 mt-1 shrink-0 border border-accent-pale">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                      <path d="M7 20h10" />
                      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                    </svg>
                  </div>
                  <div className="chat-bubble-ai px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-sm font-medium text-text-muted">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* ═══ Input Bar ═══ */}
          <div className="shrink-0 border-t border-border-light bg-white/80 backdrop-blur-2xl px-4 sm:px-8 py-4">
            <div className="max-w-3xl mx-auto flex gap-3">
              {/* Soil button */}
              <button
                onClick={() => setSoilOverlayOpen(true)}
                className={`shrink-0 w-12 h-12 rounded-[20px] flex items-center justify-center
                  active:scale-95 transition-all relative ${
                    lastSoilSnapshot && lastSoilSnapshot.ph > 0
                      ? "bg-accent-wash hover:bg-accent-pale border border-accent/30 text-accent"
                      : "bg-surface hover:bg-surface-hover border border-border-light text-text-secondary hover:text-text-primary"
                  }`}
                title="Open soil parameters"
              >
                <FlaskConical size={22} />
                {/* Green dot indicator when soil values exist */}
                {lastSoilSnapshot && lastSoilSnapshot.ph > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white shadow-sm" />
                )}
              </button>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything about soil & tea cultivation..."
                disabled={loading}
                className="flex-1 px-5 py-3 rounded-[20px] bg-surface/50 border border-border-light text-base input-focus-ring
                  disabled:opacity-50 placeholder:text-text-muted/60 min-w-0"
              />

              {/* Send button */}
              <button
                onClick={() => sendMessage()}
                disabled={!chatInput.trim() || loading}
                className="shrink-0 w-12 h-12 rounded-[20px] gradient-button text-white flex items-center justify-center
                  hover:opacity-90 active:scale-95 transition-all shadow-md shadow-accent/10
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Floating Soil FAB */}
          {messages.length > 0 && (!lastSoilSnapshot || lastSoilSnapshot.ph === 0) && (
            <button
              onClick={() => setSoilOverlayOpen(true)}
              className="soil-fab absolute bottom-24 right-4 sm:right-8 z-20
                w-14 h-14 rounded-[24px] gradient-button text-white
                flex items-center justify-center
                shadow-2xl shadow-accent/30 border border-white/20
                hover:scale-105 active:scale-95 transition-all animate-fade-in"
              title="Open soil parameters"
            >
              <FlaskConical size={24} />
            </button>
          )}
          </div>{/* end chat area */}
        </main>
      </div>

      {/* ═══ Soil Overlay ═══ */}
      <SoilOverlay
        isOpen={soilOverlayOpen}
        onClose={() => setSoilOverlayOpen(false)}
        onAnalyze={handleSoilAnalyze}
        initialValues={lastSoilSnapshot}
        analyzing={loading}
        lastUpdated={soilLastUpdated}
      />
    </div>
  );
}
