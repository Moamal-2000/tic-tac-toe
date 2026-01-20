"use client";

import { BUTTON_SOUND } from "@/data/sounds";
import { scrollToElementBottom } from "@/functions/helper";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useRef, useState } from "react";
import s from "./Chat.module.scss";
import ChatHeader from "./ChatHeader/ChatHeader";
import MessageInput from "./MessageInput/MessageInput";
import MessageList from "./MessageList/MessageList";
import TypingIndicator from "./TypingIndicator/TypingIndicator";

const Chat = () => {
  const { mySymbol, isChatOpen, updateMultiplayerState, unreadMessagesCount } =
    useMultiplayerStore();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const playSound = usePreloadSounds({ button: BUTTON_SOUND });

  useEffect(() => {
    scrollToElementBottom(messagesEndRef);
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
        updateMultiplayerState({
          unreadMessagesCount: unreadMessagesCount + 1,
        });
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
  }, [isChatOpen, mySymbol, unreadMessagesCount]);

  function sendMessage(event) {
    event.preventDefault();
    if (inputMessage.trim() === "") return;

    const messageData = {
      text: inputMessage.trim(),
      sender: mySymbol,
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat-message", messageData);
    socket.emit("user-stop-typing", { sender: mySymbol });

    setInputMessage("");
    typingTimeoutRef.current = null;
    playSound(BUTTON_SOUND, 0.3);
  }

  function handleInputChange(event) {
    const value = event.target.value;
    setInputMessage(value);

    const inputHasText = value.trim() && !typingTimeoutRef.current;
    const shouldClearTyping = !value.trim() && typingTimeoutRef.current;

    if (inputHasText) {
      socket.emit("user-typing", { sender: mySymbol });
      typingTimeoutRef.current = true;
    }

    if (shouldClearTyping) {
      socket.emit("user-stop-typing", { sender: mySymbol });
      typingTimeoutRef.current = null;
    }
  }

  return (
    <div className={`${s.chat} ${isChatOpen ? s.open : ""}`}>
      <ChatHeader />

      <div className={s.chatContent}>
        <div className={s.messagesContainer}>
          <MessageList messages={messages} />
          <TypingIndicator isVisible={isOpponentTyping} />
          <div ref={messagesEndRef} />
        </div>

        <MessageInput
          inputMessage={inputMessage}
          onInputChange={handleInputChange}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
