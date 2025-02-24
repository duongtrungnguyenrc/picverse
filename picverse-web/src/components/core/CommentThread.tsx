"use client";

import { Avatar, AvatarFallback, AvatarImage, Button, Typography, Skeleton } from "@app/components";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

import { CommentForm } from "./CommentForm";

interface CommentThreadProps {
  comments: Cmt[];
  onReplyComment: (content: CraeteCommentRequest) => Promise<void>;
  isLoading: boolean;
}

export default function CommentThread({ comments, onReplyComment, isLoading }: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const renderComment = (comment: Cmt, isReply = false) => {
    const replies = comments.filter((c) => c.replyFor === comment._id);

    return (
      <div key={comment._id} className={`${isReply ? "ml-12" : ""} mb-3`}>
        <div className="flex gap-2">
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarImage src={comment.by.avatar} />
            <AvatarFallback>{comment.by.firstName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="rounded-2xl bg-muted px-4 py-2 break-words">
              <Typography variant="h4">{`${comment.by.firstName} ${comment.by.lastName}`}</Typography>
              <Typography variant="body2">{comment.content}</Typography>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs px-2">
              <Button
                variant="link"
                className="p-0 h-auto text-muted-foreground hover:text-primary text-sm hover:no-underline"
                onClick={() => setReplyingTo(comment._id)}
              >
                Reply
              </Button>
              <span className="text-muted-foreground">
                {comment.createdAt ? formatDistanceToNow(comment.createdAt, { addSuffix: true }) : "Invalid date"}
              </span>
            </div>

            {replyingTo === comment._id && (
              <div className="mt-5">
                <CommentForm onComment={(newComment) => onReplyComment({ ...newComment, replyFor: comment._id })} />
              </div>
            )}
          </div>
        </div>

        {replies.length > 0 && <div className="mt-5">{replies.map((reply) => renderComment(reply, true))}</div>}
      </div>
    );
  };

  const rootComments = comments.filter((c) => !c.replyFor);

  return (
    <div className="space-y-4">
      {isLoading ? (
        [...Array(3)].map((_, index) => (
          <div key={index} className="flex gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ))
      ) : rootComments.length > 0 ? (
        rootComments.map((comment) => renderComment(comment))
      ) : (
        <Typography className="text-center text-gray-500">Empty comment</Typography>
      )}
    </div>
  );
}
