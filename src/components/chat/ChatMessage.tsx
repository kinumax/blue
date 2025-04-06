import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
  avatar?: string;
}

export function ChatMessage({ content, sender, timestamp, isCurrentUser, avatar }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex w-full mb-4 gap-2",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={avatar} alt={sender} />
        <AvatarFallback className={cn(
          "text-white text-xs",
          isCurrentUser ? "bg-blueberry-accent" : "bg-primary"
        )}>
          {sender.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl shadow-sm",
          isCurrentUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        )}>
          <p className="text-sm">{content}</p>
        </div>
        
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <span className="font-medium mr-1">{sender}</span>
          <span>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
