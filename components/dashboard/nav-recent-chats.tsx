"use client";

import { useState, useEffect, useMemo } from "react";
import { MoreHorizontal, MessageSquare, Trash2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatContext } from "@/components/context/ChatContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';

interface Chat {
  id: string;
  name: string;
  url: string;
  urlI: string;
  icon: React.ComponentType;
}

const NavRecentChats = () => {
  const { chats, setChats, isLoading, error } = useChatContext();
  const [visibleChats, setVisibleChats] = useState<Chat[]>([]);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const chatAbriendoNotify = () => toast("(3s) PDF procesándose...");
  const chatBorradoNotify = () => toast("(3s) PDF borrado!");
  const chatsPerPage = 3;

// Memoriza la lista completa de chats formateados
const formattedChats = useMemo(() => {
  return chats.map((entry: any, index: number) => ({
    id: entry.id,
    name: entry.nameChat || "Chat sin título",
    url: `/dashboard/recent-chats/${entry.id}`,
    urlI: `/dashboard/recent-chats/${index}`, // Usa id consistentemente
    icon: MessageSquare,
  }));
}, [chats]);

  useEffect(() => {
    if (chats.length > 0) {
      setVisibleChats(formattedChats.slice(0, page * chatsPerPage));
    } else {
      setVisibleChats([]);
    }
  }, [chats, page, formattedChats]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const handleLoadLess = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const userId = session?.user?.id;
    if (!userId) {
      console.error("No se encontró el userId");
      return;
    }

    try {
      const response = await fetch(
        `/api/delete-chatentries?userId=${encodeURIComponent(
          userId
        )}&chatId=${encodeURIComponent(chatId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el chat");
      }

      // Actualizar el estado local filtrando por id
      setChats(chats.filter((chat) => chat.id !== chatId));
      chatBorradoNotify();
      console.log(`Chat ${chatId} eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar el chat:", error);
    }
  };

  const hasMore = visibleChats.length < chats.length;
  const hasLess = page > 1;

  if (isLoading) return <div>  🔃 Cargando chats...</div>;
  if (error) return <div>{error}</div>;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {visibleChats.map((item) => (
          <SidebarMenuItem key={item.id}> {/* Usar id como key */}
            <SidebarMenuButton asChild>
              <Link href={item.urlI} onClick={chatAbriendoNotify}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
              
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-lg" side="right" align="end">
                <DropdownMenuItem onClick={() => handleDeleteChat(item.id)}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {hasLess && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLoadLess} className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>Less</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLoadMore} className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavRecentChats;