"use client";

import { useState, KeyboardEvent, FC } from "react";
import { X } from "lucide-react";
import { Input, Badge, Button } from "@app/components";

type TagInputProps = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const TagInput: FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-sm">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </Button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        placeholder="Add a tag..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="w-full"
      />
    </div>
  );
};

export default TagInput;
