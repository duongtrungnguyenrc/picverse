import { Profile } from "@modules/profile";
import { IMessage } from "./message";

export type IConversation = {
  members: Array<DocumentId>;
  themeColor: string;
};

export type CalculatedConversation = IConversation & {
  lastMessage: IMessage;
  otherMemberProfiles: Array<Pick<Profile, "_id" | "firstName" | "lastName" | "profilePicture">>;
  newNotifications?: number;
};
