"use client";

import { FC, useState, useRef, useCallback, useEffect } from "react";
import { Minus, X, Image, Smile, Send, Loader2 } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import Picker from "@emoji-mart/react";

import { useChat, useMessages } from "@app/lib/hooks";
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
  const { sendMessage, current, setCurrent } = useChat();
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: messagesData, isLoading } = useMessages(current.conversation?._id || "");

  const messages = (messagesData?.pages || []).reduce((prev, page) => [...page.data, ...prev], [] as Array<Message>);

  const scrollToBottom = useCallback(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    sendMessage({
      conversationId: current.conversation?._id,
      receiverId: current.conversation?.receiverId,
      content: input.trim(),
    });

    setInput("");
  }, [input, current.conversation, sendMessage]);

  const onClose = useCallback(() => {
    setCurrent({ isOpen: false, conversation: null });
  }, [setCurrent]);

  const conversationName: string =
    `${current.conversation?.otherMemberProfiles?.[0]?.firstName} ${current.conversation?.otherMemberProfiles?.[0]?.lastName}` ||
    "Unknow conversation";

  const splitedName: Array<string> = conversationName.split(" ");

  const fallbackName: string = splitedName[0]?.[0] + splitedName[splitedName.length - 1]?.[0];

  const onOpenChange = (isOpen: boolean) => {
    setCurrent({ ...current, isOpen });
  };

  return (
    !!current.conversation && (
      <div className="fixed bottom-5 right-5 rounded-2xl z-50">
        <Popover modal={false} open={current.isOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger>
            <ChatAvatar newNotifications={0} fallbackName={fallbackName} avatar="https://example.com/" />
          </PopoverTrigger>
          <PopoverContent className="w-[350px] rounded-2xl p-0" align="end">
            <div>
              <ChatHeader conversationName={conversationName} fallbackName={fallbackName} onClose={onClose} />
              <ChatMessages
                fallbackName={fallbackName}
                current={current}
                messages={messages}
                messagesContainerRef={messagesContainerRef}
                isLoading={isLoading}
              />
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
        <AvatarImage src="https://example.com/" />
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

const ChatMessages: FC<{
  current: Current;
  messages: Message[];
  fallbackName: string;
  isLoading: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
}> = ({ current, isLoading, fallbackName, messages, messagesContainerRef }) => (
  <div ref={messagesContainerRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
    {isLoading ? (
      <div className="w-full flex-center flex-col text-xs text-gray-500 animate-pulse">
        <Loader2 className="animate-spin w-3 h-3" />
        Loading messages
      </div>
    ) : (
      messages.map((message) => {
        const isOwn =
          current.conversation?.otherMemberProfiles.some((profile) => profile._id == message.senderId) || false;

        return <ChatMessage key={message._id} fallbackName={fallbackName} message={message} isOwn={isOwn} />;
      })
    )}
  </div>
);

const ChatMessage: FC<{ message: Message; fallbackName: string; isOwn: boolean }> = ({
  message,
  fallbackName,
  isOwn,
}) => {
  return (
    <div className={cn("flex", !isOwn ? "justify-end" : "justify-start")}>
      {isOwn && (
        <Avatar className="w-6 h-6 mr-2">
          <AvatarImage src="https://example.com/" alt="User" />
          <AvatarFallback className="text-[0.5rem]">{fallbackName}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-xl px-3.5 py-1.5",
          !isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
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
}> = ({ input, setInput, handleSend }) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  return (
    <div className="p-4 border-t flex items-center gap-2 relative">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Image className="h-5 w-5" />
      </Button>

      <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="end">
          <Picker
            set="apple"
            onEmojiSelect={(emoji: any) => {
              setInput(input + emoji.native);
              setEmojiPickerOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

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
};

export default FloatingChat;
