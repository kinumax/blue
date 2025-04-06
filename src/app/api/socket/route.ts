import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log('Socket.io サーバーを初期化します...');
    
    // Socket.ioサーバーを作成
    const io = new SocketIOServer(res.socket.server);
    
    // ユーザー情報を保存するオブジェクト
    const users: Record<string, { id: string; name: string; isOnline: boolean }> = {};
    
    // 接続イベントのハンドリング
    io.on('connection', (socket) => {
      console.log('クライアント接続:', socket.id);
      
      // ユーザー参加イベント
      socket.on('user:join', (userData: { name: string }) => {
        const user = {
          id: socket.id,
          name: userData.name,
          isOnline: true
        };
        
        // ユーザー情報を保存
        users[socket.id] = user;
        
        // 参加したユーザーに現在のユーザーリストを送信
        socket.emit('users:list', Object.values(users));
        
        // 他のユーザーに新しいユーザーが参加したことを通知
        socket.broadcast.emit('user:joined', user);
        
        // システムメッセージを全員に送信
        io.emit('message:new', {
          id: Date.now().toString(),
          content: `${userData.name}さんが参加しました`,
          sender: 'システム',
          timestamp: new Date().toISOString(),
          isSystem: true
        });
      });
      
      // メッセージ送信イベント
      socket.on('message:send', (message) => {
        const user = users[socket.id];
        if (!user) return;
        
        const newMessage = {
          id: Date.now().toString(),
          content: message.content,
          sender: user.name,
          senderId: socket.id,
          timestamp: new Date().toISOString()
        };
        
        // 全員にメッセージを送信
        io.emit('message:new', newMessage);
      });
      
      // コメント送信イベント
      socket.on('comment:send', (comment) => {
        const user = users[socket.id];
        if (!user) return;
        
        const newComment = {
          id: Date.now().toString(),
          messageId: comment.messageId,
          content: comment.content,
          sender: user.name,
          senderId: socket.id,
          timestamp: new Date().toISOString()
        };
        
        // 全員にコメントを送信
        io.emit('comment:new', newComment);
      });
      
      // 切断イベント
      socket.on('disconnect', () => {
        const user = users[socket.id];
        if (!user) return;
        
        // ユーザー情報を更新
        user.isOnline = false;
        
        // 他のユーザーに通知
        socket.broadcast.emit('user:left', { id: socket.id });
        
        // システムメッセージを全員に送信
        io.emit('message:new', {
          id: Date.now().toString(),
          content: `${user.name}さんが退出しました`,
          sender: 'システム',
          timestamp: new Date().toISOString(),
          isSystem: true
        });
        
        // 一定時間後にユーザー情報を削除
        setTimeout(() => {
          delete users[socket.id];
          io.emit('users:list', Object.values(users));
        }, 5000);
      });
    });
    
    // Socket.ioサーバーをNextサーバーにアタッチ
    res.socket.server.io = io;
  }
  
  res.end();
}
