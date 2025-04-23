"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ArrowUp, Loader2 } from "lucide-react";

import { Button, Textarea } from "@app/components";

interface CommentFormProps {
  onComment: (content: CreateCommentRequest) => Promise<void>;
}

export function CommentForm({ onComment }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await onComment({ content });
      setContent("");

      if (textAreaRef.current) {
        textAreaRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onContentChange = useDebouncedCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, 300);

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Textarea
          ref={textAreaRef}
          onChange={onContentChange}
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
