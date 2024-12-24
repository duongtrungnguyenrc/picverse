"use client";

import Image from "next/image";
import { FC } from "react";

type ProfileProps = {
  username: string;
};

const Profile: FC<ProfileProps> = ({ username }) => {
  return (
    <section className="flex flex-col items-center">
      <div className="w-full flex justify-center bg-gray-200 pt-[150px] rounded-3xl mb-[50px]">
        <Image
          className="rounded-full border-2 border-white bg-gray-200 translate-y-[40%]"
          src={""}
          width={150}
          height={150}
          alt="Avatar"
        />
      </div>

      <h3 className="text-3xl font-bold mt-5">Duong Trung Nguyen</h3>
      <p className="mt-1">duongtrungnguyenrc@gmail.com</p>
    </section>
  );
};

export default Profile;
