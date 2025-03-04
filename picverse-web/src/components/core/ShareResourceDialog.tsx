"use client";

import { Link2, Check } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent, Button } from "../shadcn";

type ShareResourceDialogProps = {
  url: string;
  resourceId: string;
  description?: string;
  children: ReactNode;
};

const ShareResourceDialog: FC<ShareResourceDialogProps> = ({ url, resourceId, description, children }) => {
  const [copied, setCopied] = useState(false);

  const imageUrl = `${window.location.origin}/public/image?id=${resourceId}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedDescription}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${imageUrl}&description=${encodedDescription}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share content</DialogTitle>
        </DialogHeader>

        <div className="flex-center space-x-5">
          <Button variant="secondary" className="rounded-full w-[50px] h-[50px] relative" onClick={copyToClipboard}>
            {copied ? <Check size={24} className="text-green-500" /> : <Link2 size={24} />}
          </Button>

          <Link href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Image src="/icons/facebook-logo.svg" alt="facebook logo" width={50} height={50} />
          </Link>
          <Link href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
            <Image src="/icons/twitter-logo.svg" alt="twitter logo" width={50} height={50} />
          </Link>
          <Link href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Image src="/icons/linkedin-logo.svg" alt="linkedin logo" width={50} height={50} />
          </Link>
          <Link href={shareLinks.pinterest} target="_blank" rel="noopener noreferrer">
            <Image src="/icons/pinterest-logo.svg" alt="pinterest logo" width={40} height={40} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResourceDialog;
