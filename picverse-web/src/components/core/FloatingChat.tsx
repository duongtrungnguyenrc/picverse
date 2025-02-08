"use client";

import { FC, useState, useRef, useCallback, useEffect } from "react";
import { Minus, X, Image, Smile, Send } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

import { useChat } from "@app/lib/hooks";
import { cn } from "@app/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components";

type FloatingChatProps = {};

const FloatingChat: FC<FloatingChatProps> = () => {
  const { messages, sendMessage, currentConversation, changeConversation } = useChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    sendMessage({
      conversationId: currentConversation?.info._id,
      receiverId: currentConversation?.info.receiverId,
      content: input.trim(),
    });

    setInput("");
  }, [input, currentConversation, sendMessage]);

  const onClose = useCallback(() => {
    changeConversation(null);
    setOpen(false);
  }, [changeConversation]);

  useEffect(() => {
    if (currentConversation) {
      setOpen(true);
    }
  }, [currentConversation]);

  const conversationName: string =
    currentConversation?.info.otherMemberProfiles?.reduce((prev, conv) => {
      return prev ? `${prev}, ${conv.firstName} ${conv.lastName}` : `${conv.firstName} ${conv.lastName}`;
    }, "") || "Unknow conversation";

  const splitedName: Array<string> = (
    `${currentConversation?.info.otherMemberProfiles?.[0]?.lastName}${currentConversation?.info.otherMemberProfiles?.[0]?.lastName}` ||
    "Unknown"
  ).split(" ");

  const fallbackName: string = splitedName[0]?.[0] + splitedName[splitedName.length - 1]?.[0];

  return (
    currentConversation && (
      <div className="fixed bottom-5 right-5 rounded-2xl z-50">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <ChatAvatar
              newNotifications={0}
              fallbackName={fallbackName}
              avatar="https://example.com/default-avatar.png"
            />
          </PopoverTrigger>
          <PopoverContent className="w-[350px] rounded-2xl p-0" align="end">
            <div>
              <ChatHeader conversationName={conversationName} fallbackName={fallbackName} onClose={onClose} />
              <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
              <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  );
};

const ChatAvatar: FC<{ newNotifications: number; fallbackName: string; avatar: string }> = ({
  newNotifications,
  fallbackName,
  avatar,
}) => {
  return (
    <div className="relative">
      {newNotifications != 0 && (
        <span className="absolute top-0 right-0 rounded-full w-5 flex-center border-2 border-background aspect-square bg-red-500 z-10 text-white text-xs font-semibold">
          {newNotifications}
        </span>
      )}

      <Avatar className="w-12 h-12 border cursor-pointer mr-2">
        <AvatarImage src={avatar} alt="User" />
        <AvatarFallback>{fallbackName}</AvatarFallback>
      </Avatar>
    </div>
  );
};

const ChatHeader: FC<{ conversationName: string; fallbackName: string; onClose: () => void }> = ({
  conversationName,
  fallbackName,
  onClose,
}) => (
  <div className="flex items-center justify-between p-3 border-b">
    <div className="flex items-center space-x-3 w-full rounded">
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://example.com/default-avatar.png" />
        <AvatarFallback>{fallbackName}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <div className="font-semibold text-sm">{conversationName}</div>
        <p className="text-xs text-muted-foreground">Active now</p>
      </div>
    </div>
    <div className="flex items-center gap-1">
      <PopoverClose className="focus-visible:outline-none" asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Minus className="h-4 w-4" />
        </Button>
      </PopoverClose>
      <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full">
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const ChatMessages: FC<{ messages: Message[]; messagesEndRef: React.RefObject<HTMLDivElement> }> = ({
  messages,
  messagesEndRef,
}) => (
  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
    {messages.map((message) => (
      <ChatMessage key={message._id} message={message} />
    ))}
    <div ref={messagesEndRef} />
  </div>
);

const ChatMessage: FC<{ message: Message }> = ({ message }) => {
  const isOwn = message.senderId === "currentUserId"; // Replace with actual logic

  return (
    <div className={cn("flex", !isOwn ? "justify-end" : "justify-start")}>
      {isOwn && (
        <Avatar className="w-6 h-6 mr-2">
          <AvatarImage src="https://example.com/default-avatar.png" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn("max-w-[70%] rounded-2xl px-4 py-2", !isOwn ? "bg-primary text-primary-foreground" : "bg-muted")}
      >
        <span className="text-sm">{message.content}</span>
      </div>
    </div>
  );
};

const ChatInput: FC<{
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}> = ({ input, setInput, handleSend }) => (
  <div className="p-4 border-t flex items-center gap-2">
    <Button variant="ghost" size="icon" className="rounded-full">
      <Image className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon" className="rounded-full">
      <Smile className="h-5 w-5" />
    </Button>
    <Input
      value={input}
      autoFocus
      onChange={(e) => setInput(e.target.value)}
      placeholder="Aa"
      className="rounded-full h-10"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSend();
        }
      }}
    />
    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSend}>
      <Send className="h-5 w-5" />
    </Button>
  </div>
);

export default FloatingChat;
