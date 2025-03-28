'use client';

import { useState } from 'react';
import { RecentChat } from '@/components/chat/recent-chat';
import { Header } from '@/components/chat/site-header';
import { useChats } from '@/hooks/useChats';
import { useParams } from 'next/navigation';

export default function UserRecentChat() {
  const [totalTokens, setTotalTokens] = useState<string | null>(null);
  const [TotaltotalTokens, setTotalTotalTokens] = useState<string | null>(null);
  const [nameChat, setNameChat] = useState<string | null>(null);
  const [totalSaldo, setTotalSaldo] = useState<string | null>(null);
  const { chats, isLoading } = useChats();

  const params = useParams();
  const chatIdParam = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
  const chatId = parseInt(chatIdParam, 10);

  if (isLoading) {
    return <div>Cargando chats...</div>;
  }

  // Verifica si chatId es un índice válido
  const chat = !isNaN(chatId) && chatId >= 0 && chatId < chats.length ? chats[chatId] : null;

  if (!chat) {
    return <div>Chat no encontrado</div>;
  }


  const initialMessages = chat.content ? chat.content : [];
  const chatName = chat.nameChat || 'Chat sin título'; // Usa el nameChat del chat encontrado


  return (
    <main className="flex flex-col h-screen items-center p-4 bg-[#f6f6f3]">
      <Header 
        TotaltotalTokens={TotaltotalTokens ?? ''} 
        totalTokens={totalTokens ?? ''} 
        nameChat={chatName ?? 'Mi Chat'} // Pasa el nameChat directamente
        totalSaldo={totalSaldo ?? ''}
      />
      <RecentChat
        id={chat.id || 'research'}
        initialMessages={initialMessages}
        setTotalTotalTokens={setTotalTotalTokens}
        setTotalTokens={setTotalTokens}
        setNameChat={setNameChat}
        setTotalSaldo={setTotalSaldo}
      />
    </main>
  );
}