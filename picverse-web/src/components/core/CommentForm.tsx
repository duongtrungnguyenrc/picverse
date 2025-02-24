"use client";

import { useState } from "react";
import { Button, Textarea } from "@app/components";
import { ArrowUp, Loader2 } from "lucide-react";

interface CommentFormProps {
  onComment: (content: CraeteCommentRequest) => Promise<void>;
}

export function CommentForm({ onComment }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onComment({ content });
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[60px] pr-20 resize-none rounded-xl text-sm"
        />
        <Button
          className="absolute bottom-2 right-2 rounded-full w-7 h-7"
          size="icon"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUp className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  );
}
