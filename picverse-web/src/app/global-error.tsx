"use client";

import Link from "next/link";
import { CloudOff, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@app/components";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
          <div className="flex flex-col items-center max-w-md text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <CloudOff className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="mb-4 text-6xl font-bold tracking-tight text-purple-600 dark:text-purple-400">500</h1>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight">Something went wrong</h2>
            <p className="mb-8 text-muted-foreground">
              We&apos;re experiencing some turbulence in our cloud. Our team has been notified and is working to fix the
              issue.
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
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
