"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FC, ReactNode, useState } from "react";
import { X } from "lucide-react";

import { Button, Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@app/components";
import PinDetail from "./PinDetail";

type PinDrawerProps = {
  children: ReactNode;
  pinId: string;
};

const PinDrawer: FC<PinDrawerProps> = ({ children, pinId }) => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-screen overflow-hidden border-none outline-none bg-transparent">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Pin detail</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>

        <div className="flex justify-end">
          <DrawerClose asChild>
            <Button className="bg-transparent hover:bg-transparent" variant="ghost">
              <X className="text-white" />
            </Button>
          </DrawerClose>
        </div>

        <PinDetail pinId={pinId} className="bg-white rounded-3xl" stickyProfile prefetch={open} />
      </DrawerContent>
    </Drawer>
  );
};

export default PinDrawer;
