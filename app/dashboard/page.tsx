'use client';

import { useState } from 'react';
import { Chat } from '@/components/chat/chat';
import { Header } from '@/components/chat/site-header';

export default function UserDashboard() {
  // Define el estado totalTokens en el componente padre
  const [totalTokens, setTotalTokens] = useState<string | null>(null);
  const [TotaltotalTokens, setTotalTotalTokens] = useState<string | null>(null);
  const [nameChat, setNameChat] = useState<string | null>(null);
  const [totalSaldo, setTotalSaldo] = useState<string | null>(null);

  return (
    <main className="flex flex-col h-screen items-center p-4 bg-[#f6f6f3]">
      {/* Pasa totalTokens a Header */}
      <Header 
      TotaltotalTokens={TotaltotalTokens ?? ''} 
      totalTokens={totalTokens ?? ''} 
      nameChat={nameChat ?? ''}
      totalSaldo={totalSaldo ?? ''} 
      />
      {/* Pasa setTotalTokens a Chat para que pueda actualizar el estado */}
      <Chat
        id="research"
        initialMessages={[]}
        setTotalTokens={setTotalTokens}
        setTotalTotalTokens={setTotalTotalTokens}
        setNameChat={setNameChat}
        setTotalSaldo={setTotalSaldo}
        totalTokens={totalTokens}
        TotaltotalTokens={TotaltotalTokens}
        nameChat={nameChat}
        totalSaldo={totalSaldo}
      />
  </main>
  );
}
