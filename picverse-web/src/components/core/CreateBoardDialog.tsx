"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC, ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "../shadcn";
import { createBoardSchema } from "@app/lib/validations";

type CreateBoardDialogProps = {
  children: ReactNode;
};

const CreateBoardDialog: FC<CreateBoardDialogProps> = ({ children }) => {
  const [openDialog, setoOenDialog] = useState<boolean>(false);

  const form = useForm<CreateBoardRequest>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  const formErrors = form.formState.errors;

  const onCreateBoard = form.handleSubmit((data) => {});

  return (
    <Dialog open={openDialog} onOpenChange={setoOenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new board</DialogTitle>
          <DialogDescription>Create board to group your pins</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onCreateBoard} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter board name" {...field} />
                  </FormControl>
                  {formErrors.name && <FormMessage>{formErrors.name.message}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value}
                      onChange={(e) => field.onChange({ name: field.name, value: e.target.value })}
                      placeholder="Enter board description"
                    />
                  </FormControl>
                  {formErrors.description && <FormMessage>{formErrors.description.message}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex-center justify-between">
                      <FormLabel>Is private</FormLabel>

                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                  {formErrors.isPrivate && <FormMessage>{formErrors.isPrivate.message}</FormMessage>}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save board</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;
