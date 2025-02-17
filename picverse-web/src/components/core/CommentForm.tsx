"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Button, Textarea } from "@app/components";
import { ArrowUp, Loader2 } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage src={""} />
        <AvatarFallback>TN</AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[60px] pr-20 resize-none rounded-xl"
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
