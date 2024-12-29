import { AuthDetect, Logo } from "@app/components";
import Link from "next/link";
import { FC, ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <AuthDetect navigationTo={"/"} isSignedIn={false}>
      <div className="w-screen h-screen bg-gradient auth">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 animate-fade-in">
          <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <Logo />
            Picverse
          </Link>
          
          <div className="sm:min-w-auto min-w-[450px] w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700  max-h-[90vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthDetect>
  );
};

export default AuthLayout;
