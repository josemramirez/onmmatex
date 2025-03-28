"use client";

import StatCard, { StatTypes } from "@/components/dashboard/StatCard";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
interface HeaderProps {
  TotaltotalTokens: string;
  totalTokens: string;
  nameChat: string;
  totalSaldo: string;
}
function formatTokens(tokens: number): string {
  if (tokens < 1000) {
    return `${tokens}`;
  } else if (tokens < 1000000) {
    const kValue = tokens / 1000;
    const formatted = kValue % 1 === 0 ? kValue.toString() : kValue.toFixed(1);
    return `${formatted}k`;
  } else {
    const mValue = tokens / 1000000;
    const formatted = mValue % 1 === 0 ? mValue.toString() : mValue.toFixed(1);
    return `${formatted}M`;
  }
}
export const Header = ({
  TotaltotalTokens,
  totalTokens,
  nameChat,
  totalSaldo
}: HeaderProps) => {
  //---- Saldo siempre --
  const [balance, setBalance] = useState<{
    totalTokens: number | undefined;
    totalSaldo: number | undefined;
  }>({
    totalTokens: undefined,
    totalSaldo: undefined
  });
  const [error, setError] = useState<string | null>(null);
  {/* Temas de sesion de usuario */}
  const {
    data: session,
    update
  } = useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    if (Number(totalTokens) === 0) {
      const fetchBalance = async () => {
        try {
          const response = await fetch(`/api/user-balance?userId=${userId}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
          setBalance(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      };
      fetchBalance();
    }
  }, []);
  if (error) return <p>Error:{error}</p>;

  //--- primera vez --
  const PriceToken = 0.01 / 1000;
  const TotaltotalTokensH_first = formatTokens(Number(balance.totalTokens));
  const TotalSaldoH_first = Number(balance.totalSaldo).toFixed(2);
  // ---- Cuenta de tokens y Saldo ----------------------------
  const SaldoComprado = Number(totalSaldo);
  // ----------------------------------------------------------

  const TotaltotalTokensH = Number(totalTokens) === 0 ? TotaltotalTokensH_first : formatTokens(Number(TotaltotalTokens));
  const TotalSaldoH = Number(totalTokens) === 0 ? TotalSaldoH_first : (SaldoComprado - Number(totalTokens) * PriceToken).toFixed(2);
  const totalTokensH = formatTokens(Number(totalTokens));
  const nameChatH = nameChat.slice(0, 10);
  return <>
      <header className="pt-4 fixed top-25 z-0 w-[750px] translate-y-[-1rem] animate-fade-in backdrop-blur-[12px] [--animation-delay:600ms] flex space-x-4 pr-0">


      <StatCard title="Proyecto" value={nameChat} type={StatTypes.SUBSCRIBERS} />

      <div className="flex space-x-4 ml-auto">
        <StatCard title="Saldo" value={TotalSaldoH} type={StatTypes.REVENUE} />

        <StatCard title="Tokens" value={totalTokensH} type={StatTypes.USERS} />

        <StatCard title="Total Tokens" value={TotaltotalTokensH} type={StatTypes.USERS} />
      </div>
      </header>
    </>;
};