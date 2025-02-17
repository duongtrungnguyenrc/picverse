"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@app/components";

import { formatDistanceToNow } from "date-fns";
import { CommentForm } from "./CommentForm";

interface CommentThreadProps {
  comments: Cmt[];
}

export default function CommentThread({ comments }: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleSubmitReply = async (parentId: string) => {
    console.log("Submitting reply to", parentId, newComment);
    setReplyingTo(null);
    setNewComment("");
  };

  const renderComment = (comment: Cmt, isReply = false) => {
    const replies = comments.filter((c) => c.replyFor?._id === comment._id);

    return (
      <div key={comment._id} className={`${isReply ? "ml-12" : ""} mb-3`}>
        <div className="flex gap-2">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={comment.by.avatar} />
            <AvatarFallback>{comment.by.firstName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="rounded-2xl bg-muted px-4 py-2 break-words">
              <div className="font-semibold text-sm">{`${comment.by.firstName} ${comment.by.lastName}`}</div>
              <p className="text-sm">{comment.content}</p>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs px-2">
              <Button
                variant="link"
                className="p-0 h-auto text-muted-foreground hover:text-primary hover:no-underline"
                onClick={() => setReplyingTo(comment._id)}
              >
                Reply
              </Button>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>

            {replyingTo === comment._id && (
              <div className="mt-5">
                <CommentForm
                  onSubmit={function (content: string): Promise<void> {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {replies.length > 0 && <div className="mt-5">{replies.map((reply) => renderComment(reply, true))}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-4">{comments.filter((c) => !c.replyFor).map((comment) => renderComment(comment))}</div>
  );
}
