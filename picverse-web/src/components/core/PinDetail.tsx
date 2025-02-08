import { Bookmark, Heart } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage, Button, DrawerTitle } from "@app/components";
import { cn } from "@app/lib/utils";

type PinDetailProps = {
  stickyProfile?: boolean;
  inDrawer?: boolean;
  className?: string;
};

const PinDetail: FC<PinDetailProps> = ({ stickyProfile, inDrawer, className }) => {
  return (
    <div className={cn("relative overflow-y-auto scroll-smooth space-y-2", className)}>
      {/* Title */}

      <div className="mt-10">
        <div className="container">
          {inDrawer ? (
            <DrawerTitle className="h1 text-3xl">Dashboard for an Analytics Software ✦ Ascend</DrawerTitle>
          ) : (
            <h1 className="h1 text-3xl">Dashboard for an Analytics Software ✦ Ascend</h1>
          )}
        </div>
      </div>

      {/* Author info */}
      <div className={cn("top-0 left-0 z-20 bg-white", stickyProfile ? "sticky" : "relative")}>
        <div className="container flex items-center justify-between w-full py-3">
          <div className="flex-center gap-x-2">
            <Avatar className="h-[3rem] w-[3rem]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h4 className="font-bold text-sm">Halo Product for HALO LAB</h4>
              <p className="text-xs font-medium text-green-600">Available for download</p>
            </div>
          </div>

          <ul className="flex-center gap-x-2.5">
            <li>
              <Button variant="outline" className="rounded-full w-10 h-10" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </li>

            <li>
              <Button variant="outline" className="rounded-full w-10 h-10" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
            </li>

            <li>
              <Button className="rounded-full h-10 px-5" size="sm">
                Get in touch
              </Button>
            </li>
          </ul>
        </div>
      </div>

      {/* Image */}

      <div>
        <div className="container ">
          <div className="border-1 relative h-[800px]">
            <Image
              className="object-contain border w-full h-full"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
              alt=";"
              layout="fill"
            />
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="space-y-5 py-10">
        <div className="container flex-center space-x-5">
          <span className="flex-1 h-[3px] bg-gray-300" />
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="flex-1 h-[3px] bg-gray-300" />
        </div>

        <div className="flex-center flex-col space-y-3">
          <p className="h2 text-black">Halo Lab</p>
          <p className="text-sm">Creating stars in the digital universe ✨ ⤵</p>
          <Button className="rounded-full h-10 px-5" size="sm">
            Get in touch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
