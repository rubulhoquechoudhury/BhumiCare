"use client";

import { marked } from 'marked';
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Languages, ChevronDown, ChevronUp } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "ai" | string;
  content: string;
  index: number;
}

marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function ChatMessageBubble({ role, content, index }: ChatMessageProps) {
  const { language, translateText } = useLanguage();
  const [displayContent, setDisplayContent] = useState(content);
  const [showOriginal, setShowOriginal] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [isLocalTranslating, setIsLocalTranslating] = useState(false);

  const isAI = role === "ai" || role === "model";

  useEffect(() => {
    let isMounted = true;

    if (isAI && language !== "en") {
      setIsLocalTranslating(true);

      translateText(content).then((t) => {
        if (isMounted) {
          if (t !== content) {
            setDisplayContent(t);
            setTranslated(true);
          } else {
            setDisplayContent(content);
            setTranslated(false);
          }
          setIsLocalTranslating(false);
        }
      });
    } else {
      setDisplayContent(content);
      setTranslated(false);
      setIsLocalTranslating(false);
    }

    return () => {
      isMounted = false;
    };
  }, [content, language, isAI, translateText]);

  const shownContent = showOriginal ? content : displayContent;
  const htmlContent = isAI ? (marked.parse(shownContent) as string) : "";

  return (
    <div
      className={`animate-slide-up ${role === "user" ? "flex justify-end" : "flex justify-start"}`}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mr-3 mt-1 shrink-0 border border-border-light overflow-hidden">
          <Image
            src="/bhumicare-logo.png"
            alt="BhumiCare Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain scale-[1.8]"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-w-[100%] sm:max-w-[85%]">
        <div
          className={`overflow-hidden px-5 py-4 ${
            role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
          }`}
        >
          {isAI ? (
            <>
              {/* Translating shimmer */}
              {isLocalTranslating && language !== "en" && (
                <div className="h-4 w-48 bg-border-light rounded animate-pulse mb-2" />
              )}
              <div
                className={`ai-response text-base leading-relaxed text-text-primary transition-opacity duration-300 ${isLocalTranslating ? 'opacity-50' : 'opacity-100'}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </>
          ) : (
            <p className="text-base leading-relaxed">{content}</p>
          )}
        </div>

        {/* Show original toggle — only if translated */}
        {isAI && translated && !isLocalTranslating && (
          <button
            onClick={() => setShowOriginal((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-accent transition-colors self-start ml-1"
          >
            <Languages size={12} />
            {showOriginal ? (
              <><ChevronUp size={11} /> Show translation</>
            ) : (
              <><ChevronDown size={11} /> Show original</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
