import { FC, ReactNode } from "react";
import { X } from "lucide-react";

import { Button, Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@app/components";
import PinDetail from "./PinDetail";

type PinDrawerProps = {
  children: ReactNode;
};

const PinDrawer: FC<PinDrawerProps> = ({ children }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-screen overflow-hidden border-none outline-none bg-transparent">
        <div className="flex justify-end">
          <DrawerClose asChild>
            <Button className="bg-transparent hover:bg-transparent" variant="ghost">
              <X className="text-white" />
            </Button>
          </DrawerClose>
        </div>

        <PinDetail className="bg-white rounded-3xl" stickyProfile />
      </DrawerContent>
    </Drawer>
  );
};

export default PinDrawer;
