"use client";

import { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../shadcn";
import { useProfile } from "@app/lib/hooks";
import { cn } from "@app/lib/utils";

type ProfileProps = {
  signature: string;
};

const Profile: FC<ProfileProps> = ({ signature }) => {
  const { data: profile, isPending } = useProfile(signature === "me" ? undefined : signature);

  const pendingClass: string = isPending ? "animate-pulse" : "";

  return (
    <section className="flex flex-col items-center">
      <div className={cn("w-full flex justify-center bg-gray-200 pt-[150px] rounded-3xl mb-[50px]", pendingClass)}>
        <Avatar
          className={cn(
            "rounded-full border-2 w-[150px] h-[150px] border-white bg-gray-200 translate-y-[40%] relative",
            pendingClass,
          )}
        >
          {profile && (
            <>
              <AvatarImage src={profile.profilePicture} alt={profile.firstName} />
              <AvatarFallback className="text-6xl">{`${profile.firstName[0]}${profile.lastName[0]}`}</AvatarFallback>
            </>
          )}
        </Avatar>
      </div>

      <h3 className={cn("text-3xl font-bold mt-5", pendingClass)}>{profile?.firstName}</h3>
      <p className={cn("mt-1", pendingClass)}>duongtrungnguyenrc@gmail.com</p>
    </section>
  );
};

export default Profile;
