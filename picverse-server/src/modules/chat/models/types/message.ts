export type IMessage = {
      conversationId: DocumentId;
      senderId: DocumentId;
      content: string;
      createdAt: Date;
}