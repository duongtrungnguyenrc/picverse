"use client";

import { FC, useCallback, useState } from "react";
import { ArrowDown } from "lucide-react";

import { usePinComments } from "@app/lib/hooks";
import ContentSection from "./ContentSection";
import { CommentForm } from "./CommentForm";
import CommentThread from "./CommentThread";
import { Button } from "../shadcn";
import { cn } from "@app/lib/utils";
import RequireAuthFeature from "./RequireAuthFeature";
import Link from "next/link";

type CommentSectionProps = {
  pinId: string;
};

const PinCommentsSection: FC<CommentSectionProps> = ({ pinId }) => {
  const [isOpen, setisOpen] = useState(true);
  const { comments, isLoading, createComment, fetchNextPage, hasNextPage } = usePinComments(pinId);

  const handleSubmitComment = useCallback(
    async (content: CreateCommentRequest) => {
      createComment(content);
    },
    [createComment],
  );

  const onToggleOpen = () => setisOpen((prev) => !prev);

  return (
    <RequireAuthFeature>
      {(isAuthenticated) => {
        return (
          <ContentSection
            heading={isAuthenticated ? "Comments" : "Comments (Please sign in to comment)"}
            className="space-y-5 flex-1 w-full"
            actions={
              <div className="flex-center gap-2">
                {!isAuthenticated && (
                  <Link href="/sign-in?redirect=true">
                    <Button className="h-7 text-xs" variant="outline">
                      Login
                    </Button>
                  </Link>
                )}
                <Button onClick={onToggleOpen} className="rounded-full w-7 h-7" variant="outline" size="icon">
                  <ArrowDown className={cn("w-3 h-3 transition-all duration-300", isOpen ? "" : "rotate-180")} />
                </Button>
              </div>
            }
          >
            {isOpen && (
              <div className={cn("space-y-5", isLoading ? "cursor-none pointer-events-none opacity-70" : "")}>
                <div className={cn(isLoading ? "cursor-none pointer-events-none" : "")}>
                  <CommentForm onComment={handleSubmitComment} />
                </div>

                <CommentThread comments={comments} onReplyComment={handleSubmitComment} isLoading={isLoading} />

                {hasNextPage && (
                  <div className="flex-center">
                    <button
                      disabled={isLoading}
                      onClick={() => fetchNextPage()}
                      className="text-xs transition-all bg-transparent hover:bg-muted px-2 py-1 text-gray-600 rounded"
                    >
                      Load more
                    </button>
                  </div>
                )}
              </div>
            )}
          </ContentSection>
        );
      }}
    </RequireAuthFeature>
  );
};

export default PinCommentsSection;
