"use client";

import { Grid, List, Menu } from "lucide-react";
import { FC } from "react";

import {
  TabsList,
  TabsTrigger,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenu,
} from "@app/components";

import { EResourceType } from "@app/lib/enums";

const listModes = [
  { name: "grid", icon: <Grid size={18} /> },
  { name: "list", icon: <List size={18} /> },
] as const;

const CloudResourceActions: FC<{
  onSearchChange: (value: string) => void;
  onFieldFilterChange: (field: keyof Resource, value: string) => void;
}> = ({ onSearchChange, onFieldFilterChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="grid-cols-2 gap-3 hidden md:grid">
        <Input className="h-10" placeholder="Search..." onChange={(e) => onSearchChange(e.target.value)} />
        <Select defaultValue="-" onValueChange={(type) => onFieldFilterChange("type", type)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Resource type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="-">No type filter</SelectItem>
              {Object.values(EResourceType).map((type) => (
                <SelectItem key={`rs-filter:type:${type}`} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="block md:hidden">
          <Button variant="outline">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col gap-y-2 p-3 shadow-none">
          <Input className="h-10" placeholder="Search..." onChange={(e) => onSearchChange(e.target.value)} />
          <Select defaultValue="-" onValueChange={(type) => onFieldFilterChange("type", type)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="-">No type filter</SelectItem>
                {Object.values(EResourceType).map((type) => (
                  <SelectItem key={`rs-filter:type:${type}`} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </DropdownMenuContent>
      </DropdownMenu>
      <TabsList>
        {listModes.map((mode) => (
          <TabsTrigger key={`tab:${mode.name}`} value={mode.name}>
            {mode.icon}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default CloudResourceActions;
