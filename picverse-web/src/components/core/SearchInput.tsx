"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Command, Search, UserCircle } from "lucide-react";
import Image from "next/image";

import { Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from "../shadcn";
import { useMutateSearch, useSearchHistory, useTrendingKeywords } from "@app/lib/hooks";
import { ESearchTarget } from "@app/lib/enums";
import { getResourceUrl } from "@app/lib/utils";

const SearchDialog: FC = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const { data: searchProfileResponse, mutate: searchProfile } = useMutateSearch();
  const { data: searchPinResponse, mutate: searchPin } = useMutateSearch();

  const searchProfileResult: Array<Profile> = useMemo(
    () => (searchProfileResponse?.pages?.flatMap((page) => page.data) as Array<Profile>) ?? [],
    [searchProfileResponse],
  );
  const searchPinResult: Array<Pin> = useMemo(
    () => (searchPinResponse?.pages?.flatMap((page) => page.data) as Array<Pin>) ?? [],
    [searchPinResponse],
  );

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpenDialog(true);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, []);

  const onSearch = useDebouncedCallback((query: string) => {
    searchProfile({ query, target: ESearchTarget.PROFILE });
    searchPin({ query, target: ESearchTarget.PIN });
  }, 300);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <div>
          <Button size="sm" className="lg:hidden rounded-lg transition-all h-10 w-10" variant="outline">
            <Search size={18} />
          </Button>
          <div className="relative hidden lg:block transition-all">
            <div className="flex items-center gap-1 text-gray-400 text-sm absolute right-3 left-3 top-0 bottom-0">
              <Search size={18} />
            </div>

            <Input className="rounded-lg text-sm px-10 h-10" placeholder="Search..." />

            <div className="flex items-center gap-1 text-gray-400 text-sm absolute right-3 top-0 bottom-0">
              <Command size={14} /> K
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>

        <SearchInput onSearch={onSearch} />
        <SearchHistorySection />
        <SearchTrendingSection />
        <SearchResults profiles={searchProfileResult} pins={searchPinResult} />
      </DialogContent>
    </Dialog>
  );
};

const SearchInput: FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => (
  <div className="relative mb-4">
    <Input
      onChange={(e) => onSearch(e.target.value)}
      className="rounded-lg text-sm px-10 py-6"
      placeholder="Enter keywords..."
    />
    <div className="absolute left-3 top-0 bottom-0 flex items-center text-gray-400">
      <Search size={20} />
    </div>
  </div>
);

const SearchHistorySection: FC = () => {
  const { data } = useSearchHistory();

  return (
    <SearchSection
      title="Search history"
      items={data?.pages.flatMap((page) => page.data.map((item) => item.query)) ?? []}
    />
  );
};

const SearchTrendingSection: FC = () => {
  const { data } = useTrendingKeywords();

  return <SearchSection title="Search trendings" items={data?.pages.flatMap((page) => page.data) ?? []} />;
};

const SearchSection: FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ul className="flex flex-wrap gap-2 overflow-x-auto">
      {items.length > 0 ? (
        items.map((item, index) => (
          <li key={index}>
            <Button variant="outline">{item}</Button>
          </li>
        ))
      ) : (
        <p className="text-gray-400">No result found</p>
      )}
    </ul>
  </div>
);

const SearchResults: FC<{ profiles: Profile[]; pins: Pin[] }> = ({ profiles, pins }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">Search result</h3>
    {profiles.length > 0 && (
      <ul className="flex flex-wrap gap-2 overflow-x-auto">
        {profiles.map((item) => (
          <li key={item._id}>
            <Button variant="outline">
              <UserCircle /> {`${item.firstName} ${item.lastName}`}
            </Button>
          </li>
        ))}
      </ul>
    )}
    {pins.length > 0 && (
      <ul className="flex flex-wrap gap-2 overflow-x-auto mt-5">
        {pins.map((item) => (
          <li key={item._id}>
            <div className="w-[150px] h-[100px] relative rounded-lg overflow-hidden">
              <Image src={getResourceUrl(item.resource)} alt="" layout="fill" />
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SearchDialog;
