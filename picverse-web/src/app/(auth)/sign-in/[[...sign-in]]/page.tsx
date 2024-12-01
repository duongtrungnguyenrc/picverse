import { SignIn } from "@clerk/nextjs";
import { FC } from "react";

type SignInPageProps = {};

const SignInPage: FC<SignInPageProps> = ({}) => {
  return (
    <>
      <SignIn signUpUrl="/sign-up" />
    </>
  );
};

export default SignInPage;
