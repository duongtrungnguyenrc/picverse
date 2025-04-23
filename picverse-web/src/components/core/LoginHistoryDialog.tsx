"use client";

import { FC, ReactNode, useState } from "react";

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

type LoginHistoryDialogProps = {
  children: ReactNode;
};

const LoginHistoryDialog: FC<LoginHistoryDialogProps> = ({ children }) => {
  const [page, setPage] = useState<number>(1);

  const { data: records } = useAcessRecords({ page });

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
                <TableHead>Ip address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records?.data.map((record) => {
                return (
                  <TableRow key={record._id}>
                    <TableCell>{record.browserName || "-"}</TableCell>
                    <TableCell>{record.ipAddress || "-"}</TableCell>
                    <TableCell>{record.location || "-"}</TableCell>
                    <TableCell>{new Date(record.createdAt).toLocaleString() || "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="bg-transparent hover:bg-transparent flex-center w-full pt-5">
          {records?.data.length === 0 && <Typography>No records found</Typography>}

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

export default LoginHistoryDialog;
