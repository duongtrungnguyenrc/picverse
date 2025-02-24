"use client";

import { Bookmark, Heart as RegularHeart, Share } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  ContentSection,
  PinCommentsSection,
  ShareResourceDialog,
  Skeleton,
  Typography,
} from "@app/components";
import { getResourceUrl, skeletonPlaceholder } from "@app/lib/utils";
import { usePinDetail, usePinLikes } from "@app/lib/hooks";
import Link from "next/link";

type PinDetailProps = {
  pinId: string;
  prefetchedPin: PinDetail;
};

const PinDetail: FC<PinDetailProps> = ({ pinId, prefetchedPin }) => {
  const { data, isFetching } = usePinDetail(pinId, prefetchedPin);
  const isLoading = !data || isFetching;

  return (
    <div className="space-y-5">
      <section className="px-5 lg:px-10 space-y-5">
        <div className="flex-1">
          {isLoading ? <Skeleton className="h-10 w-3/4" /> : <h1 className="h1 text-3xl">{data.title}</h1>}
          {isLoading ? (
            <Skeleton className="h-5 w-1/2 mt-3" />
          ) : (
            <div className="flex gap-2 mt-3">
              {data.tags.map((tag) => {
                return <Badge key={`pin:dtl:tag:${tag}`}>{tag}</Badge>;
              })}
            </div>
          )}
        </div>
        <Typography>{data?.description}</Typography>
      </section>

      <div className="px-5 grid grid-cols-12 space-y-5 lg:space-y-0 lg:space-x-5 lg:px-10">
        <section className="border rounded-xl col-span-full lg:col-span-7 flex-center">
          {isLoading ? (
            <Skeleton className="w-[80%] h-full" />
          ) : (
            <Image
              className="object-contain max-w-[80%]"
              src={getResourceUrl(data.resource._id)}
              alt={data.title || ""}
              width={data.resource.width}
              height={data.resource.height}
              placeholder="blur"
              blurDataURL={skeletonPlaceholder}
              priority
            />
          )}
        </section>
        <div className="flex-1 col-span-full lg:col-span-5 px-0 lg:px-10 pb-10 space-y-5">
          <ContentSection heading="Interactions">
            <ul className="flex gap-x-2.5">
              {isLoading ? (
                <>
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </>
              ) : (
                <>
                  <li>
                    <PinLikeButton isLiked={data?.liked} pinId={pinId} />
                  </li>
                  <li>
                    <Button variant="outline" className="rounded-full w-10 h-10" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </li>

                  <ShareResourceDialog
                    url={typeof window !== "undefined" ? window.location.href : ""}
                    imageUrl={getResourceUrl(data.resource._id)}
                    description={data.description}
                  >
                    <li>
                      <Button variant="outline" className="rounded-full w-10 h-10" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                    </li>
                  </ShareResourceDialog>
                </>
              )}
            </ul>
          </ContentSection>
          <PinCommentsSection pinId={pinId} />
        </div>
      </div>

      {/* Footer */}
      <section className="space-y-5 py-10">
        <div className="px-5 lg:px-10 flex-center space-x-5">
          <span className="flex-1 h-[3px] bg-gray-300" />
          <Avatar className="w-16 h-16">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : (
              <>
                <AvatarImage src={data.author.avatar || ""} alt={data.author.firstName} />
                <AvatarFallback>{data.author.firstName[0]}</AvatarFallback>
              </>
            )}
          </Avatar>
          <span className="flex-1 h-[3px] bg-gray-300" />
        </div>

        <div className="flex-center flex-col space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <Typography variant="h2">
                {data.author.firstName} {data.author.lastName}
              </Typography>
              <Typography variant="body1" className="text-center">
                {data.description}
              </Typography>
              <Link href={`/${data.author.accountId}`}>
                <Button className="rounded-full h-10 px-5" size="sm">
                  Get in touch
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
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
    <Button variant="outline" className="rounded-full" size="icon" onClick={handleLike} disabled={isLikeLoading}>
      {<RegularHeart className={`w-5 h-5 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />}
    </Button>
  );
};

export default PinDetail;
