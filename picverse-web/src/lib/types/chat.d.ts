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
  otherMemberProfiles: Array<Pick<Profile, "_id" | "firstName" | "lastName" | "profilePicture">>;
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

declare type CurrentConversation = {
  info: Omit<Conversation, "_id"> &
    Partial<BaseModel> & {
      receiverId?: string;
    };
  currentPage: number;
};

declare type ChatContextType = {
  isConnected: boolean;
  conversations: Conversation[];
  currentConversation: CurrentConversation | null;
  messages: Message[];
  initSocket: VoidFunction;
  sendMessage: (payload: SendMessageDto) => void;
  changeConversation: (conversation: CurrentConversation | null) => void;
};
