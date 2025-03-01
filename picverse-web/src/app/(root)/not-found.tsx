import { CloudOff, Home, Search } from "lucide-react";
import { Button } from "@app/components";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-purple-100 dark:bg-purple-900/20">
          <CloudOff className="w-12 h-12 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-purple-600 dark:text-purple-400">404</h1>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Page not found</h2>
        <p className="mb-8 text-muted-foreground">
          Oops! The content you&apos;re looking for seems to have drifted away into the cloud. Let&apos;s help you find
          your way back.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
