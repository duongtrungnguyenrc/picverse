import { FC } from "react";

import { Skeleton } from "@app/components";

const ProfileLoading: FC = () => {
  return (
    <section className="flex flex-col items-center">
      <div className="w-full flex justify-center bg-gray-200 pt-[150px] rounded-3xl mb-[50px] animate-pulse">
        <div className="relative translate-y-[40%]">
          <div className="w-[150px] h-[150px] bg-gray-300 rounded-full border-2 border-white"></div>
        </div>
      </div>

      <Skeleton className="w-40 h-8 mt-5 rounded-lg" />
      <Skeleton className="w-56 h-5 mt-2 rounded-lg" />
    </section>
  );
};

export default ProfileLoading;
