import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";

export interface ChatRoomProps {
  messages: ChatMessageProps[];
  currentUser: string;
}

export function ChatRoom({ messages, currentUser }: ChatRoomProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    // メッセージが追加されたら自動スクロール
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div ref={scrollAreaRef} className="flex-1 relative">
      <ScrollArea className="h-full p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              メッセージはまだありません。<br />
              最初のメッセージを送信しましょう！
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
                isCurrentUser={message.sender === currentUser}
                avatar={message.avatar}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
