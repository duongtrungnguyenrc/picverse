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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn";
import { useAcessRecords } from "@app/lib/hooks";
import Pagination from "./Pagination";

type LoginHistoryDialogProps = {
  children: ReactNode;
};

const LoginHistoryDialog: FC<LoginHistoryDialogProps> = ({ children }) => {
  const [page, setPage] = useState<number>(1);

  const { data: records } = useAcessRecords({ page });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Login history</DialogTitle>
        </DialogHeader>

        <div>
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

            <TableFooter className="bg-transparent hover:bg-transparent pt-5">
              {records?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    "No records found
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={4}>
                  <div className="w-full flex-center">
                    <Pagination
                      currentPage={records?.meta.page || 1}
                      pageCount={records?.meta.pages || 0}
                      onChangePage={setPage}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginHistoryDialog;
