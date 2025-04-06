'use client';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const pusher = new Pusher('あなたのPUSHER_KEY', {
      cluster: 'あなたのPUSHER_CLUSTER',
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message:new', (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, []);

  const sendMessage = async () => {
    await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'あなたの名前', message: input }),
    });
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}
