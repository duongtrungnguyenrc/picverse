"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { FC, ReactNode } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Checkbox,
} from "../shadcn";
import { useChangePassword } from "@app/lib/hooks";

type ChangePasswordDialogProps = {
  children: ReactNode;
};

const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ children }) => {
  const form = useForm<MutatePassword<ChangePasswordRequest>>();
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const { errors: formErrors } = form.formState;

  const onSubmit = async (data: MutatePassword<ChangePasswordRequest>) => {
    await changePassword(data);

    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your password</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input className="h-[3rem]" type="password" placeholder="Enter old password" {...field} />
                  </FormControl>
                  {formErrors.oldPassword && <FormMessage>{formErrors.oldPassword.message}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input className="h-[3rem]" type="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  {formErrors.newPassword && <FormMessage>{formErrors.newPassword.message}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input className="h-[3rem]" type="password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  {formErrors.confirmPassword && <FormMessage>{formErrors.confirmPassword.message}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="revokeAllSessions"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="revoke-sessions" onCheckedChange={field.onChange} />
                    <label htmlFor="revoke-sessions" className="text-sm text-gray-500 dark:text-gray-400 select-none">
                      Log out of all devices.
                    </label>
                  </div>
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isPending ? (
                <>
                  Change Password
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
