import { SignUp } from "@clerk/nextjs";
import { FC } from "react";

type SignUpPageProps = {};

const SignUpPage: FC<SignUpPageProps> = ({}) => {
  return (
    <>
      <SignUp signInUrl="/sign-in" />
    </>
  );
};

export default SignUpPage;
