"use client";

import { MessageSquareText } from "lucide-react";
import { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage, Button } from "../shadcn";
import { useChat } from "@app/lib/hooks";

type ProfileProps = {
  profile: ProfileDetail;
  signature: string;
};

const Profile: FC<ProfileProps> = ({ profile, signature }) => {
  const isMyProfile = signature === "me";
  const { setCurrent } = useChat();

  const onStartNewConversation = () => {
    if (profile) {
      setCurrent({
        isOpen: true,
        conversation: {
          receiverId: signature,
          members: [],
          otherMemberProfiles: [profile],
        },
      });
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div className="w-full flex justify-center bg-gray-200 pt-[150px] rounded-3xl mb-[50px]">
        <div className="relative translate-y-[40%]">
          <Avatar className="rounded-full border-2 w-[150px] h-[150px] border-white bg-gray-200 relative">
            {profile ? (
              <>
                <AvatarImage src={profile.avatar} alt={profile.firstName} />
                <AvatarFallback className="text-6xl">{`${profile.firstName[0]}${profile.lastName[0]}`}</AvatarFallback>
              </>
            ) : null}
          </Avatar>

          {!isMyProfile && profile && (
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

      <h3 className="text-3xl font-bold mt-5">
        {profile?.firstName} {profile?.lastName}
      </h3>
      <p className="mt-1">{profile?.email}</p>
    </section>
  );
};

export default Profile;
