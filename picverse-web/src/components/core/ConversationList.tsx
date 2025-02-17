"use client";

import { Search, MoreHorizontal, PenSquare, Loader2 } from "lucide-react";
import { FC, ReactNode, useMemo, useState } from "react";

import { useChat, useConversations } from "@app/lib/hooks";
import { formatTimestamp } from "@app/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
} from "../shadcn";

type ConversationListProps = {
  children: ReactNode;
};

const ConversationList: FC<ConversationListProps> = ({ children }) => {
  const { changeCurrentConversation } = useChat();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: conversations = [], isLoading } = useConversations();

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;

    return conversations.filter((conv) => conv._id?.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, search]);

  const onSelectConversation = (conversation: Conversation) => {
    changeCurrentConversation(conversation);
  };

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <div className="relative">
          {conversations.some((conversation) => conversation.newNotifications) && (
            <span className="absolute top-0 right-0 rounded-full w-2 aspect-square bg-red-500" />
          )}

          {children}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[360px] h-[600px] rounded-2xl flex flex-col">
        <div className="p-2 flex items-center justify-between border-b">
          <h1 className="text-2xl font-bold">Chats</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PenSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversation"
              className="pl-10 text-sm focus-visible:ring-2 ring-offset-background focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none h-10 bg-muted rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 p-2 overflow-y-auto">
          {isLoading ? (
            <div className="w-full flex-center flex-col text-xs text-gray-500 animate-pulse">
              <Loader2 className="animate-spin w-3 h-3" />
              Loading conversations
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const conversationName: string =
                conversation.otherMemberProfiles?.reduce((prev, conv) => {
                  return prev ? `${prev}, ${conv.firstName} ${conv.lastName}` : `${conv.firstName} ${conv.lastName}`;
                }, "") || "Unknow conversation";

              return (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversation.otherMemberProfiles?.[0]?.avatar ||
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-07%20at%2016.42.36-NdWXa1FBTDWerl6bG5gSc5qSPS1poG.png"
                        }
                      />
                      <AvatarFallback>{conversation._id?.[0]}</AvatarFallback>
                    </Avatar>
                    {conversation && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{conversationName}</div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-1">
                      <span>
                        {conversation.lastMessage?.senderId === "currentUser" && "You: "}
                        {conversation.lastMessage?.content}
                      </span>
                      <span>·</span>
                      <span>{formatTimestamp(conversation.lastMessage?.createdAt)}</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-xs text-center w-full text-gray-500">No conversation to present</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationList;
