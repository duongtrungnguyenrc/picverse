"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";

import { Logo } from "@app/components";

type AuthFormLayoutProps = {
  children: ReactNode;
};

const AuthFormLayout: FC<AuthFormLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-violet-200 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 py-8 mx-auto">
        <Link
          href="/"
          className="flex items-center mb-8 space-x-2 text-2xl font-semibold transition-transform hover:scale-105"
        >
          <Logo />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Picverse</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="animate-fade-in backdrop-blur-sm bg-white/80 dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-xl dark:shadow-purple-900/30 border border-purple-100 dark:border-purple-900 transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-800/30">
            {children}
          </div>
        </div>
        <p className="mt-10 text-xs text-muted-foreground uppercase">Secured by Picverse - Informations reserved</p>
      </div>
    </div>
  );
};

export default AuthFormLayout;
