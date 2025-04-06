'use client';

import React, { useState, useEffect } from 'react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ChatInput } from '@/components/chat/ChatInput';
import { UserList } from '@/components/chat/UserList';
import { Navbar } from '@/components/chat/Navbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSocket, Message, User } from '@/lib/socket-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const { 
    isConnected, 
    messages, 
    users, 
    currentUser, 
    sendMessage, 
    joinChat 
  } = useSocket();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'users' | 'settings'>('chat');
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [showJoinDialog, setShowJoinDialog] = useState(true);
  const [username, setUsername] = useState('');
  
  // 接続状態が変わったときにダイアログの表示状態を更新
  useEffect(() => {
    if (isConnected && currentUser) {
      setShowJoinDialog(false);
    }
  }, [isConnected, currentUser]);
  
  // メッセージ送信ハンドラー
  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };
  
  // チャット参加ハンドラー
  const handleJoinChat = () => {
    if (username.trim()) {
      joinChat(username);
    }
  };
  
  // サイドバー切り替え
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // メッセージをUIに適した形式に変換
  const formattedMessages = messages.map(message => ({
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp,
    isCurrentUser: currentUser ? message.senderId === currentUser.id : false,
  }));

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar 
        title="ブルーベリーチャット" 
        onToggleSidebar={toggleSidebar}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* デスクトップサイドバー */}
        <div className="hidden md:block w-72">
          <UserList 
            users={users} 
            currentUserId={currentUser?.id || ''}
            onSelectUser={setSelectedUserId}
            selectedUserId={selectedUserId}
          />
        </div>
        
        {/* モバイルサイドバー */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <UserList 
              users={users} 
              currentUserId={currentUser?.id || ''}
              onSelectUser={(userId) => {
                setSelectedUserId(userId);
                setSidebarOpen(false);
              }}
              selectedUserId={selectedUserId}
            />
          </SheetContent>
        </Sheet>
        
        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' && (
            <>
              <ChatRoom 
                messages={formattedMessages} 
                currentUser={currentUser?.name || ''}
              />
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={!isConnected || !currentUser}
              />
            </>
          )}
          
          {activeTab === 'users' && (
            <div className="flex-1 p-4 md:hidden">
              <UserList 
                users={users} 
                currentUserId={currentUser?.id || ''}
                onSelectUser={setSelectedUserId}
                selectedUserId={selectedUserId}
              />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="anasui-card max-w-md w-full">
                <h2 className="text-xl font-medium mb-4">設定</h2>
                <p className="text-muted-foreground">
                  ブルーベリーチャットへようこそ！<br />
                  このアプリはブルーベリーカラーとANASUIスタイルをテーマにした可愛いチャットアプリです。
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">接続状態:</p>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{isConnected ? 'オンライン' : 'オフライン'}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  バージョン: 1.0.0
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 参加ダイアログ */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ブルーベリーチャットへようこそ</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                ニックネーム
              </Label>
              <Input
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
                placeholder="ニックネームを入力してください"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleJoinChat} 
              disabled={!username.trim() || !isConnected}
              className="anasui-button-primary"
            >
              チャットに参加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
