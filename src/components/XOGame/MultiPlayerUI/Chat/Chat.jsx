"use client";

import { BUTTON_SOUND } from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useRef, useState } from "react";
import s from "./Chat.module.scss";
import { useTranslations } from "next-intl";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const playSound = usePreloadSounds({ button: BUTTON_SOUND });
  const t = useTranslations("chat");

  const { mySymbol } = useMultiplayerStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);

      // Play sound when receiving message from opponent
      if (message.sender !== mySymbol) {
        playSound(BUTTON_SOUND, 0.3);
      }

      // Increment unseen count only if chat is closed and message is not from current user
      if (!isChatOpen && message.sender !== mySymbol) {
        setUnseenCount((prev) => prev + 1);
      }
    });

    socket.on("user-typing", ({ sender }) => {
      if (sender !== mySymbol) {
        setIsOpponentTyping(true);
        // Play sound when opponent starts typing
        playSound(BUTTON_SOUND, 0.2);
      }
    });

    socket.on("user-stop-typing", ({ sender }) => {
      if (sender !== mySymbol) {
        setIsOpponentTyping(false);
      }
    });

    return () => {
      socket.off("chat-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [isChatOpen, mySymbol]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const messageData = {
        text: inputMessage.trim(),
        sender: mySymbol,
        timestamp: new Date().toISOString(),
      };

      socket.emit("chat-message", messageData);
      socket.emit("user-stop-typing", { sender: mySymbol });
      setInputMessage("");
      typingTimeoutRef.current = null;

      // Play sound when sending message
      playSound(BUTTON_SOUND, 0.3);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);

    // Emit typing event only if user starts typing and hasn't typed recently
    if (value.trim() && !typingTimeoutRef.current) {
      socket.emit("user-typing", { sender: mySymbol });
      typingTimeoutRef.current = true;
    }

    // Clear typing indicator if input becomes empty
    if (!value.trim() && typingTimeoutRef.current) {
      socket.emit("user-stop-typing", { sender: mySymbol });
      typingTimeoutRef.current = null;
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Reset unseen count when opening chat
      setUnseenCount(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`${s.chat} ${isChatOpen ? s.open : ""}`}>
      <button
        className={s.chatHeader}
        onClick={toggleChat}
        aria-label={isChatOpen ? t("close_chat") : t("open_chat")}
        aria-expanded={isChatOpen}
      >
        <span>{t("title")}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {unseenCount > 0 && (
            <span className={s.notificationBadge}>
              {unseenCount > 99 ? "99+" : unseenCount}
            </span>
          )}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isChatOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            )}
          </svg>
        </div>
      </button>

      <div className={s.chatContent}>
        <div className={s.messagesContainer}>
          {messages.length === 0 ? (
            <div className={s.emptyState}>
              <p>{t("no_messages_yet")}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`${s.message} ${
                  message.sender === mySymbol ? s.ownMessage : s.opponentMessage
                }`}
              >
                <div className={s.messageHeader}>
                  <span className={s.sender}>
                    {message.sender === mySymbol ? t("you") : t("opponent")}
                  </span>
                  <span className={s.timestamp}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className={s.messageText}>{message.text}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
          {isOpponentTyping && (
            <div className={s.typingIndicator}>
              <span className={s.typingText}>{t("opponent_typing")}</span>
              <div className={s.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <form className={s.inputContainer} onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder={t("type_message")}
            className={s.messageInput}
            aria-label="Type a message"
            maxLength={200}
          />
          <button
            type="submit"
            className={s.sendButton}
            aria-label="Send message"
            disabled={!inputMessage.trim()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
