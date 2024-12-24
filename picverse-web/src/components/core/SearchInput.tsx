"use client";

import { FC, useEffect, useState } from "react";
import { Command, Search } from "lucide-react";

import { Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from "../shadcn";

type SearchInputProps = {};

const SearchInput: FC<SearchInputProps> = ({}) => {
  const [openDialogState, setOpenDialogState] = useState<boolean>(false);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpenDialogState(true);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <Dialog open={openDialogState} onOpenChange={setOpenDialogState}>
      <DialogTrigger asChild>
        <div>
          <Button className="lg:hidden rounded-lg transition-all" variant="outline">
            <Search size={18} />
          </Button>
          <div className="relative hidden lg:block transition-all">
            <div className="flex items-center gap-1 text-gray-400 text-sm absolute right-3 left-3 top-0 bottom-0">
              <Search size={18} />
            </div>

            <Input className="rounded-lg text-sm px-10" placeholder="Search..." />

            <div className="flex items-center gap-1 text-gray-400 text-sm absolute right-3 top-0 bottom-0">
              <Command size={14} /> K
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <div className="relative mt-5">
          <Input className="rounded-lg text-sm px-10 py-6" placeholder="Search..." />

          <div className="flex items-center gap-1 text-gray-400 text-sm absolute right-3 left-3 top-0 bottom-0">
            <Search size={20} />
          </div>
        </div>

        <ul className="items-center flex gap-3 max-w-full overflow-x-auto">
          <li>
            <Button variant="outline">All</Button>
          </li>
          <li>
            <Button variant="outline">Car</Button>
          </li>
          <li>
            <Button variant="outline">Background</Button>
          </li>
          <li>
            <Button variant="outline">Images</Button>
          </li>
          <li>
            <Button variant="outline">Background</Button>
          </li>
          <li>
            <Button variant="outline">Background</Button>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default SearchInput;
