import { notFound, redirect, RedirectType } from "next/navigation";
import Lottie from "lottie-react";
import { FC } from "react";

import loadingAnimation from "@app/assets/lotties/loading.json";
import { ECloudStorage } from "@app/lib/enums";

type CallbackPropsType = {
  searchParams: Promise<{ storage: ECloudStorage; error?: string }>;
};

const LinkStorageCallbackPage: FC<CallbackPropsType> = async ({ searchParams }) => {
  const { storage, error } = await searchParams;

  if (!error) {
    redirect("/cloud", RedirectType.replace);
  }

  if (!storage || !Object.values(ECloudStorage).includes((storage as ECloudStorage) ?? "")) notFound();

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-gray-500">
      {error ? (
        <>
          <p className="text-lg font-semibold">Link with {storage} storage failed</p>
          <p className="text-sm">{error}</p>
        </>
      ) : (
        <Lottie animationData={loadingAnimation} className="w-[150px] h-[150px]" loop />
      )}
    </div>
  );
};

export default LinkStorageCallbackPage;
