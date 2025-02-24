"use client";

import { FC, useCallback } from "react";

import { CommentForm } from "./CommentForm";
import CommentThread from "./CommentThread";
import { usePinComments } from "@app/lib/hooks";
import ContentSection from "./ContentSection";
import { Button } from "../shadcn";

type CommentSectionProps = {
  pinId: string;
};

const PinCommentsSection: FC<CommentSectionProps> = ({ pinId }) => {
  const { comments, isLoading, createComment, fetchNextPage } = usePinComments(pinId);

  const handleSubmitComment = useCallback(
    async (content: CraeteCommentRequest) => {
      createComment(content);
    },
    [createComment],
  );

  return (
    <ContentSection heading="Comments" className="space-y-5 w-full">
      <CommentForm onComment={handleSubmitComment} />
      <CommentThread comments={comments} onReplyComment={handleSubmitComment} isLoading={isLoading} />

      {fetchNextPage && (
        <div className="flex-center">
          <Button onClick={() => fetchNextPage()} className="text-xs rounded-full" size="sm">
            Load more
          </Button>
        </div>
      )}
    </ContentSection>
  );
};

export default PinCommentsSection;
