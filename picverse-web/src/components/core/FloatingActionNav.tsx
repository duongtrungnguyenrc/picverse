"use client";

import { Bell, Home, Settings, Search, ArrowUp, MessageCircle } from "lucide-react";
import Link from "next/link";

import ConversationList from "./ConversationList";
import SignedIn from "./SignedIn";
import NotificationDropdown from "./NotificationDropdown";

const FloatingActionNav = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ul className="fixed bottom-5 left-1/2 -translate-x-[50%] flex-center gap-x-2 animate-in bg-white rounded-xl p-1 border transition-all">
      <li className="flex">
        <Link href="/" className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
          <Home className="h-4 w-4" />
        </Link>
      </li>
      <SignedIn>
        <li className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
          <Search className="h-4 w-4" />
        </li>
        <NotificationDropdown>
          <li className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
            <Bell className="h-4 w-4" />
          </li>
        </NotificationDropdown>
        <ConversationList>
          <li className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
            <MessageCircle className="h-4 w-4" />
          </li>
        </ConversationList>
        <li className="flex">
          <Link href="/settings" className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
            <Settings className="h-4 w-4" />
          </Link>
        </li>
      </SignedIn>
      <li className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={scrollToTop}>
        <ArrowUp className="h-4 w-4" />
      </li>
    </ul>
  );
};

export default FloatingActionNav;
