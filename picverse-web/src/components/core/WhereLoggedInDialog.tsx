"use client";

import { FC, ReactNode, useState, useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn";
import { useAcessRecords } from "@app/lib/hooks";
import Pagination from "./Pagination";
import Typography from "./Typography";

type WhreLoggedInDialogProps = {
  children: ReactNode;
};

const WhreLoggedInDialog: FC<WhreLoggedInDialogProps> = ({ children }) => {
  const [page, setPage] = useState<number>(1);
  const { data: records } = useAcessRecords({ page });

  const groupedRecords = useMemo(() => {
    if (!records?.data) return [];

    const groupedMap = new Map<string, { count: number; record: AccessRecord }>();

    records.data.forEach((record) => {
      const key = `${record.browserName}-${record.ipAddress}-${record.location}`;
      if (groupedMap.has(key)) {
        groupedMap.get(key)!.count += 1;
      } else {
        groupedMap.set(key, { count: 1, record });
      }
    });

    return Array.from(groupedMap.values());
  }, [records]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[60vw] min-h-[70vh] max-h-screen lg:max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Login history</DialogTitle>
        </DialogHeader>

        <div className="w-full overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Browser</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last logged in</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {groupedRecords.map(({ count, record }) => (
                <TableRow key={`${record.browserName}-${record.ipAddress}-${record.location}`}>
                  <TableCell>{record.browserName || "-"}</TableCell>
                  <TableCell>{record.ipAddress || "-"}</TableCell>
                  <TableCell>{new Date(record.createdAt).toLocaleString() || "-"}</TableCell>
                  <TableCell className="text-center">{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-transparent hover:bg-transparent flex-center w-full pt-5">
          {groupedRecords.length === 0 && <Typography>No records found</Typography>}

          <Pagination
            currentPage={records?.meta.page || 1}
            pageCount={records?.meta.pages || 0}
            onChangePage={setPage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhreLoggedInDialog;
