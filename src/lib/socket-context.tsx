'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// メッセージの型定義
export interface Message {
  id: string;
  content: string;
  sender: string;
  senderId?: string;
  timestamp: string;
  isSystem?: boolean;
}

// コメントの型定義
export interface Comment {
  id: string;
  messageId: string;
  content: string;
  sender: string;
  senderId?: string;
  timestamp: string;
}

// ユーザーの型定義
export interface User {
  id: string;
  name: string;
  isOnline: boolean;
}

// SocketContextの型定義
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  comments: Comment[];
  users: User[];
  currentUser: User | null;
  sendMessage: (content: string) => void;
  sendComment: (messageId: string, content: string) => void;
  joinChat: (name: string) => void;
}

// デフォルト値
const defaultSocketContext: SocketContextType = {
  socket: null,
  isConnected: false,
  messages: [],
  comments: [],
  users: [],
  currentUser: null,
  sendMessage: () => {},
  sendComment: () => {},
  joinChat: () => {},
};

// コンテキストの作成
const SocketContext = createContext<SocketContextType>(defaultSocketContext);

// コンテキストプロバイダー
export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Socket.io接続の初期化
  useEffect(() => {
    // サーバーへの接続
    const socketInstance = io('', {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    // 接続イベント
    socketInstance.on('connect', () => {
      console.log('Socket.io接続成功');
      setIsConnected(true);
    });

    // 切断イベント
    socketInstance.on('disconnect', () => {
      console.log('Socket.io切断');
      setIsConnected(false);
    });

    // ユーザーリスト受信イベント
    socketInstance.on('users:list', (usersList: User[]) => {
      setUsers(usersList);
      // 自分自身のユーザー情報を設定
      const me = usersList.find(user => user.id === socketInstance.id);
      if (me) {
        setCurrentUser(me);
      }
    });

    // 新規ユーザー参加イベント
    socketInstance.on('user:joined', (user: User) => {
      setUsers(prev => [...prev, user]);
    });

    // ユーザー退出イベント
    socketInstance.on('user:left', (user: { id: string }) => {
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, isOnline: false } : u
      ));
    });

    // 新規メッセージ受信イベント
    socketInstance.on('message:new', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // 新規コメント受信イベント
    socketInstance.on('comment:new', (comment: Comment) => {
      setComments(prev => [...prev, comment]);
    });

    // クリーンアップ
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // チャットに参加
  const joinChat = (name: string) => {
    if (socket && isConnected) {
      socket.emit('user:join', { name });
    }
  };

  // メッセージ送信
  const sendMessage = (content: string) => {
    if (socket && isConnected && currentUser) {
      socket.emit('message:send', { content });
    }
  };

  // コメント送信
  const sendComment = (messageId: string, content: string) => {
    if (socket && isConnected && currentUser) {
      socket.emit('comment:send', { messageId, content });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        messages,
        comments,
        users,
        currentUser,
        sendMessage,
        sendComment,
        joinChat,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// カスタムフック
export function useSocket() {
  return useContext(SocketContext);
}
