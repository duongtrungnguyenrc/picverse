"use client";

import { FC, ReactElement, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Button,
} from "@app/components";

const otpSchema = z.object({
  otpCode: z.string().length(6, "OTP must be 6 digits"),
});

type OtpDialogProps = {
  trigger?: ReactElement;
  title: string;
  open?: boolean;
  onSubmit: (otpCode: string) => void;
  onClose?: () => void;
  onResend?: () => void;
  isPending?: boolean;
};

const OtpDialog: FC<OtpDialogProps> = ({ trigger, title, open, isPending, onSubmit, onClose, onResend }) => {
  const [openState, setOpenState] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openState && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [openState, countdown]);

  const onOpenChange = (isOpen: boolean) => {
    setOpenState(isOpen);
    if (isOpen) {
      setCountdown(30);
    } else if (onClose) {
      onClose();
    }
  };

  const handleResend = () => {
    if (onResend) {
      onResend();
      setCountdown(30);
    }
  };

  return (
    <AlertDialog open={open || openState} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(({ otpCode }) => onSubmit(otpCode))}>
            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem>
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

            <div className="text-sm text-center">
              {countdown > 0 ? (
                <p>Resend OTP in {countdown} seconds</p>
              ) : (
                <Button variant="link" onClick={handleResend} className="p-0 h-auto">
                  Resend OTP
                </Button>
              )}
            </div>

            <AlertDialogFooter className="sm:justify-between">
              <AlertDialogCancel type="button" className="mt-0 sm:mt-0">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpDialog;
