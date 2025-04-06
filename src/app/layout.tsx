import { SocketProvider } from '@/lib/socket-context';
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ブルーベリーチャット',
  description: 'ブルーベリーテーマの可愛いチャットアプリ',
  manifest: '/manifest.json',
  themeColor: '#6d4e9c', // ブルーベリーカラー
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ブルーベリーチャット',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  )
}
