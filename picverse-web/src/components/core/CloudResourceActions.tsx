"use client";

import { Grid, List } from "lucide-react";
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
} from "@app/components";

import { EResourceType } from "@app/lib/enums";

const listModes = [
  { name: "grid", icon: <Grid size={18} /> },
  { name: "list", icon: <List size={18} /> },
] as const;

const CloudResourceActions: FC<{
  onSearchChange: (value: string) => void;
  onFieldFilterChange: (field: keyof Resource, value: string) => void;
}> = ({ onSearchChange, onFieldFilterChange }) => (
  <div className="flex items-center gap-3">
    <div className="grid grid-cols-2 gap-3">
      <Input placeholder="Search..." onChange={(e) => onSearchChange(e.target.value)} />
      <Select defaultValue="-" onValueChange={(type) => onFieldFilterChange("type", type)}>
        <SelectTrigger>
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
    <TabsList>
      {listModes.map((mode) => (
        <TabsTrigger key={`tab:${mode.name}`} value={mode.name}>
          {mode.icon}
        </TabsTrigger>
      ))}
    </TabsList>
  </div>
);

export default CloudResourceActions;
