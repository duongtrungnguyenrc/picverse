import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { NetworkStatus, Providers } from "@app/components";
import "@app/styles/globals.scss";
import { cn } from "@app/lib/utils";

export const metadata: Metadata = {
  title: "Picverse",
  description: "Cloud social media platform",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={cn(inter.className, "font-inter antialiased")}>
          {children}
          <Toaster position="bottom-center" />
          <NetworkStatus />
        </body>
      </html>
    </Providers>
  );
}
