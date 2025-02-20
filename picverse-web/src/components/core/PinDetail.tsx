"use client";

import { Bookmark, Heart } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, CommentSection, Skeleton } from "@app/components";
import { cn, getResourceUrl } from "@app/lib/utils";
import { usePinDetail } from "@app/lib/hooks";
import Link from "next/link";

type PinDetailProps = {
  pinId: string;
  stickyProfile?: boolean;
  className?: string;
  prefetch?: boolean;
};

const PinDetail: FC<PinDetailProps> = ({ pinId, stickyProfile, prefetch, className }) => {
  const { data, isFetching } = usePinDetail(pinId, prefetch);

  return (
    <div className={cn("relative overflow-y-auto scroll-smooth space-y-4", className)}>
      <div className="mt-10">
        <div className="container">
          {isFetching ? <Skeleton className="h-10 w-3/4" /> : <h1 className="h1 text-3xl">{data?.title}</h1>}
          {isFetching ? (
            <Skeleton className="h-5 w-1/2 mt-3" />
          ) : (
            <div className="flex gap-2 mt-3">
              {data?.tags.map((tag) => {
                return <Badge key={`pin:dtl:tag:${tag}`}>{tag}</Badge>;
              })}
            </div>
          )}
        </div>
      </div>

      <div className={cn("top-0 left-0 z-20 bg-white", stickyProfile ? "sticky" : "relative")}>
        <div className="container flex items-center justify-between w-full py-3">
          <div className="flex-center gap-x-2">
            <Avatar className="h-[3rem] w-[3rem]">
              {isFetching ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                <>
                  <AvatarImage src={data?.author.avatar || "/default-avatar.png"} alt={data?.author.firstName} />
                  <AvatarFallback>{data?.author.firstName[0]}</AvatarFallback>
                </>
              )}
            </Avatar>

            <div>
              {isFetching ? (
                <>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm">
                    {data?.author.firstName} {data?.author.lastName}
                  </h4>
                  <p className="text-xs font-medium text-green-600">Available for download</p>
                </>
              )}
            </div>
          </div>

          <ul className="flex-center gap-x-2.5">
            <li>
              <Button variant="outline" className="rounded-full w-10 h-10" size="sm">
                <Heart className={`w-4 h-4 ${data?.liked ? "text-red-500" : ""}`} />
              </Button>
            </li>

            <li>
              <Button variant="outline" className="rounded-full w-10 h-10" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
            </li>

            {stickyProfile && (
              <li>
                <Link href={`/pin/${pinId}`}>
                  <Button className="rounded-full h-10 px-5" size="sm">
                    Go to detail
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <div className="container">
          <div className="border-1 relative h-[800px]">
            {isFetching ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <Image
                className="object-contain border w-full h-full"
                src={data?.resource ? getResourceUrl(data?.resource.toString()) : "/placeholder.jpg"}
                alt={data?.title || ""}
                layout="fill"
                priority
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-5 py-10">
        <div className="container flex-center space-x-5">
          <span className="flex-1 h-[3px] bg-gray-300" />
          <Avatar className="w-16 h-16">
            {isFetching ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : (
              <>
                <AvatarImage src={data?.author.avatar || "/default-avatar.png"} alt={data?.author.firstName} />
                <AvatarFallback>{data?.author.firstName[0]}</AvatarFallback>
              </>
            )}
          </Avatar>
          <span className="flex-1 h-[3px] bg-gray-300" />
        </div>

        <div className="flex-center flex-col space-y-3">
          {isFetching ? (
            <>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <p className="h2 text-black">
                {data?.author.firstName} {data?.author.lastName}
              </p>
              <p className="text-sm">{data?.description}</p>
              <Button className="rounded-full h-10 px-5" size="sm">
                Get in touch
              </Button>
            </>
          )}
        </div>
      </div>

      <CommentSection />
    </div>
  );
};

export default PinDetail;
