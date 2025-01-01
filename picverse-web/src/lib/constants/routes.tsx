import { Bell, Fingerprint, KeyRound, Shield, ThumbsUp, User } from "lucide-react";

export const settingRoutes: Array<Route> = [
  {
    name: "Account & security",
    path: "/settings",
    icon: <Shield size={16} />,
    description: "Overview and management of your account settings.",
  },
  {
    name: "Manage profile",
    path: "/settings/profile",
    icon: <User size={16} />,
    description: "Edit and update your personal profile information.",
  },
  {
    name: "Credentials",
    path: "/settings/credentials",
    icon: <KeyRound size={16} />,
    description: "Manage your account credentials and access tokens.",
  },
  {
    name: "Social permissions",
    path: "/settings/permissions",
    icon: <ThumbsUp size={16} />,
    description: "Manage your social media permissions and connections.",
  },
  {
    name: "Notifications",
    path: "/settings/notifications",
    icon: <Bell size={16} />,
    description: "Configure your notification preferences and alerts.",
  },
];
