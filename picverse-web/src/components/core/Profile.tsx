"use client";

import { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage, Button } from "../shadcn";
import { useChat, useProfile } from "@app/lib/hooks";
import { cn } from "@app/lib/utils";
import { MessageSquareText } from "lucide-react";

type ProfileProps = {
  signature: string;
};

const Profile: FC<ProfileProps> = ({ signature }) => {
  const isMyProfile = signature === "me";

  const { data: profile, isPending } = useProfile(isMyProfile ? undefined : signature);
  const { changeCurrentConversation } = useChat();

  const pendingClass: string = isPending ? "animate-pulse" : "";

  const onStartNewConversation = () => {
    if (profile) {
      changeCurrentConversation({
        receiverId: signature,
        members: [],
        otherMemberProfiles: [profile],
      });
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div className={cn("w-full flex justify-center bg-gray-200 pt-[150px] rounded-3xl mb-[50px]", pendingClass)}>
        <div className="relative translate-y-[40%]">
          <Avatar
            className={cn("rounded-full border-2 w-[150px] h-[150px] border-white bg-gray-200 relative", pendingClass)}
          >
            {profile && (
              <>
                <AvatarImage src={profile.avatar} alt={profile.firstName} />
                <AvatarFallback className="text-6xl">{`${profile.firstName[0]}${profile.lastName[0]}`}</AvatarFallback>
              </>
            )}
          </Avatar>

          {!isMyProfile && (
            <Button
              onClick={onStartNewConversation}
              size="icon"
              className="absolute bottom-1 right-1 rounded-full w-10 aspect-square border-2 border-background"
            >
              <MessageSquareText />
            </Button>
          )}
        </div>
      </div>

      <h3 className={cn("text-3xl font-bold mt-5", pendingClass)}>
        {profile?.firstName} {profile?.lastName}
      </h3>
      <p className={cn("mt-1", pendingClass)}>duongtrungnguyenrc@gmail.com</p>
    </section>
  );
};

export default Profile;
