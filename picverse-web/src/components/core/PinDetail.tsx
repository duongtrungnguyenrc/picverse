"use client";

import { Bookmark, Heart, Share } from "lucide-react";
import type { FC } from "react";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  PicverseImage,
  PinCommentsSection,
  RequireAuthFeature,
  ShareResourceDialog,
  Skeleton,
  Typography,
} from "@app/components";
import { usePinLikes } from "@app/lib/hooks";
import { getResourceUrl, skeletonPlaceholder } from "@app/lib/utils";

type PinDetailProps = {
  pin: PinDetail;
};

const PinDetailComponent: FC<PinDetailProps> = ({ pin }) => {
  console.log(pin);

  return (
    <main className="py-6 space-y-5">
      {/* Header Section */}
      <section className="container mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{pin.title}</h1>
        <div className="flex flex-wrap gap-2">
          {pin.tags.map((tag) => (
            <Badge key={`pin:dtl:tag:${tag}`} className="text-sm rounded-lg">
              {tag}
            </Badge>
          ))}
        </div>
        <Typography className="text-muted-foreground">{pin.description}</Typography>
      </section>

      {/* Main Content */}
      <div className="container space-y-5">
        {/* Image Section */}
        <section>
          <div className="relative flex-center w-full overflow-hidden rounded-lg bg-muted h-fit">
            <PicverseImage
              id={pin.resource._id}
              alt={pin.title || ""}
              width={pin.resource.width}
              height={pin.resource.height}
              className="object-contain"
              placeholder="blur"
              blurDataURL={skeletonPlaceholder}
              priority
            />
          </div>
        </section>

        {/* Interactions & Comments Section */}
        <section className="space-y-6 max-h-full">
          <InteractionButtons isLoading={false} pinId={pin._id} data={pin} isLiked={pin?.liked} />
          <PinCommentsSection pinId={pin._id} />
        </section>
      </div>

      {/* Author Section */}
      <AuthorSection isLoading={false} data={pin} />
    </main>
  );
};

type InteractionButtonsProps = {
  isLoading: boolean;
  pinId: string;
  data: PinDetail;
  isLiked?: boolean;
};

const InteractionButtons: FC<InteractionButtonsProps> = ({ isLoading, pinId, data, isLiked }) => {
  if (isLoading) {
    return (
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <PinLikeButton isLiked={isLiked} pinId={pinId} />
      {/* <Button variant="outline" size="icon" className="rounded-full">
        <Bookmark className="h-4 w-4" />
        <span className="sr-only">Bookmark</span>
      </Button> */}
      <ShareResourceDialog
        url={typeof window !== "undefined" ? window.location.href : ""}
        resourceId={data.resource._id}
        description={data?.description || ""}
      >
        <Button variant="outline" size="icon" className="rounded-full">
          <Share className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </ShareResourceDialog>
    </div>
  );
};

type AuthorSectionProps = {
  isLoading: boolean;
  data?: PinDetail;
};

const AuthorSection: FC<AuthorSectionProps> = ({ isLoading, data }) => {
  return (
    <section className="mt-16 border-t pt-8">
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-20 w-20">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-full" />
          ) : (
            <>
              <AvatarImage src={data?.author.avatar || ""} alt={data?.author.firstName || ""} />
              <AvatarFallback className="text-2xl font-semibold">{data?.author.firstName?.[0]}</AvatarFallback>
            </>
          )}
        </Avatar>

        <div className="text-center">
          {isLoading ? (
            <>
              <Skeleton className="mx-auto h-6 w-40" />
              <Skeleton className="mx-auto mt-2 h-4 w-48" />
            </>
          ) : (
            <>
              <Typography variant="h2" className="font-semibold">
                {data?.author.firstName} {data?.author.lastName}
              </Typography>
              <Typography variant="body1" className="mt-2 text-muted-foreground">
                {data?.description}
              </Typography>
              <Link href={`/profile/${data?.authorId}`} className="mt-4 inline-block">
                <Button className="rounded-full" size="sm">
                  Get in touch
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

type PinLikeButtonProps = {
  pinId: string;
  isLiked?: boolean;
};

const PinLikeButton: FC<PinLikeButtonProps> = ({ pinId, isLiked }) => {
  const { toggleLike, isLoading: isLikeLoading } = usePinLikes(pinId);

  const handleLike = () => {
    if (!isLikeLoading) {
      toggleLike();
    }
  };

  return (
    <RequireAuthFeature>
      <Button variant="outline" size="icon" className="rounded-full" onClick={handleLike} disabled={isLikeLoading}>
        <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        <span className="sr-only">Like</span>
      </Button>
    </RequireAuthFeature>
  );
};

export default PinDetailComponent;
