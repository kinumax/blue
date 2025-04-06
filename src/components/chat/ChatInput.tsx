import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, placeholder = "メッセージを入力...", disabled = false }: ChatInputProps) {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t bg-card/50 backdrop-blur-sm">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="anasui-input flex-1"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={disabled || !message.trim()} 
        className="anasui-button-primary h-10 w-10 rounded-full p-2"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">送信</span>
      </Button>
    </form>
  );
}
