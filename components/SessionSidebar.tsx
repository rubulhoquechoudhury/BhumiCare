"use client";

import { SessionListItem } from "@/types/database";
import Image from "next/image";

interface SessionSidebarProps {
  sessions: SessionListItem[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  isOpen,
  onClose,
}: SessionSidebarProps) {
  // Group sessions by date
  const grouped = groupByDate(sessions);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed sm:relative z-50 sm:z-auto
          top-0 left-0 h-full sm:h-auto
          w-72 sm:w-[280px]
          bg-surface-card sm:bg-surface-card/95 backdrop-blur-2xl
          border-r border-border
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border-light">
          <div className="flex items-center justify-between mb-5 sm:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-border-light">
                <Image src="/bhumicare-logo.png" alt="BhumiCare Logo" width={40} height={40} className="w-full h-full object-contain scale-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">BhumiCare AI</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-surface-hover transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full py-3.5 rounded-[20px] bg-primary text-white text-sm font-semibold
              hover:bg-primary-light active:scale-[0.98] transition-all
              flex items-center justify-center gap-2 shadow-sm shadow-primary/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm font-medium text-text-secondary">No chats yet</p>
              <p className="text-xs text-text-muted mt-1.5">Start a conversation to see your history here.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([label, items]) => (
              <div key={label} className="mb-4">
                <p className="text-[11px] font-bold text-text-muted/80 uppercase tracking-wider px-3 mb-2">
                  {label}
                </p>
                <div className="space-y-1">
                  {items.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        onClose();
                      }}
                      className={`w-full text-left p-3.5 rounded-[20px] transition-all group relative overflow-hidden
                        ${
                          activeSessionId === session.id
                            ? "bg-accent-wash/80 border border-accent/20"
                            : "hover:bg-surface-hover border border-transparent"
                        }`}
                    >
                      <p className={`text-sm font-semibold truncate ${
                        activeSessionId === session.id ? "text-primary" : "text-text-primary"
                      }`}>
                        {session.title || "Untitled Chat"}
                      </p>
                      {session.soil_snapshot && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/60 border border-border-light text-text-secondary">
                            pH {session.soil_snapshot.ph}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/60 border border-border-light text-text-secondary">
                            N {session.soil_snapshot.nitrogen}
                          </span>
                        </div>
                      )}
                      {session.summary && (
                        <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                          {session.summary}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

function groupByDate(sessions: SessionListItem[]) {
  const groups: Record<string, SessionListItem[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  for (const session of sessions) {
    const date = new Date(session.created_at).toDateString();
    let label: string;

    if (date === today) label = "Today";
    else if (date === yesterday) label = "Yesterday";
    else {
      const diffDays = Math.floor(
        (now.getTime() - new Date(session.created_at).getTime()) / 86400000
      );
      if (diffDays < 7) label = "This Week";
      else label = "Older";
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(session);
  }

  return groups;
}
