declare type Message = BaseModel & {
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
};

declare type Conversation = BaseModel & {
  members: string[];
  themeColor?: string;
  lastMessage?: Message;
  otherMemberProfiles: Array<Pick<Profile, "_id" | "firstName" | "lastName" | "avatar">>;
  newNotifications?: number;
};

declare type SendMessageDto = {
  receiverId?: string;
  conversationId?: string;
  content: string;
};

declare type NewConversation = {
  receiverId: string;
  receiverProfile: Profile;
};

declare type CurrentConversation =
  | (Omit<Conversation, "_id"> &
      Partial<BaseModel> & {
        receiverId?: string;
      })
  | null;

declare type ChatContextType = {
  isConnected: boolean;
  currentConversation: CurrentConversation;
  initSocket: VoidFunction;
  sendMessage: (payload: SendMessageDto) => void;
  changeCurrentConversation: (conversation: CurrentConversation) => void;
};
