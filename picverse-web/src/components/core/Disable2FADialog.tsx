"use client";

import { Lock, KeyRound, Loader2, ShieldOff } from "lucide-react";

import { useAuth, useDisable2FA } from "@app/lib/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
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
} from "../shadcn";
import { useForm } from "react-hook-form";

const Disable2FADialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const form = useForm<Disable2FARequest>({
    defaultValues: {
      otpCode: "",
      password: "",
    },
  });
  const { errors: formErrors } = form.formState;

  const { authorizeClient: refetchAccount } = useAuth();
  const { mutate: disableTwoFactor, isPending: isDisabling } = useDisable2FA();

  const handleDisable = form.handleSubmit((data: Disable2FARequest) => {
    disableTwoFactor(data, {
      onSuccess: () => {
        refetchAccount();
      },
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Disable two-factor authentication</DialogTitle>
          <DialogDescription>Enter two-factor authentication OTP code and your password to disable</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={handleDisable}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" type="password" placeholder="Enter your password" {...field} />
                    </div>
                  </FormControl>
                  {formErrors.password && <FormMessage>{formErrors.password.message}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Otp code</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        className="pl-10 text-center tracking-widest font-mono text-lg"
                        placeholder="000000"
                        maxLength={6}
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="w-full" variant="destructive" disabled={isDisabling}>
              {isDisabling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Disable 2FA
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Disable2FADialog;
