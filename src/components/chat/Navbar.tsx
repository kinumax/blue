import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Settings, Menu } from "lucide-react";

export interface NavbarProps {
  title: string;
  onToggleSidebar: () => void;
  activeTab: 'chat' | 'users' | 'settings';
  onChangeTab: (tab: 'chat' | 'users' | 'settings') => void;
}

export function Navbar({ title, onToggleSidebar, activeTab, onChangeTab }: NavbarProps) {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onChangeTab('chat')}
          className={activeTab === 'chat' ? 'anasui-button-primary' : ''}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only">チャット</span>
        </Button>
        
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onChangeTab('users')}
          className={activeTab === 'users' ? 'anasui-button-primary' : ''}
        >
          <Users className="h-5 w-5" />
          <span className="sr-only">ユーザー</span>
        </Button>
        
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onChangeTab('settings')}
          className={activeTab === 'settings' ? 'anasui-button-primary' : ''}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">設定</span>
        </Button>
      </div>
    </div>
  );
}
