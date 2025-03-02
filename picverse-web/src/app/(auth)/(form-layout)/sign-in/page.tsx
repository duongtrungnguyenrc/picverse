import { FC } from "react";

import { SignInForm } from "@app/components";

type SignInPageProps = {
  searchParams: Promise<{ redirect?: boolean }>;
};

const SignInPage: FC<SignInPageProps> = async ({ searchParams }) => {
  const { redirect } = await searchParams;

  return <SignInForm redirect={redirect}/>;
};

export default SignInPage;
