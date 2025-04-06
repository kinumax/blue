// pages/api/message.ts
import Pusher from 'pusher';
import { NextApiRequest, NextApiResponse } from 'next';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, message } = req.body;

  await pusher.trigger('chat', 'message:new', {
    username,
    message,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({ status: 'sent' });
}
