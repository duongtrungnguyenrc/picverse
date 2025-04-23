"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@app/components";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-12">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/20">
          <AlertTriangle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          We encountered an error while loading this page. You can try refreshing or return to the home page.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
