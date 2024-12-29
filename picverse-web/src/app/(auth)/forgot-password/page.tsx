"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { FC, useCallback } from "react";

import {
  Button,
  CountDown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@app/components";
import { forgotPasswordSchema, resetPasswordSchema } from "@app/lib/validations";
import { useForgotPassword, useResetPassword } from "@app/lib/hooks";

type ForgotPasswordPageProps = {};

const ForgotPasswordPage: FC<ForgotPasswordPageProps> = ({}) => {
  const forgotPasswordForm = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      emailOrUserName: "",
    },
  });

  const resetPasswordForm = useForm<
    Pick<ResetPasswordRequest, "newPassword" | "otpCode"> & { confirmPassword: string }
  >({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const { errors: forgotPasswordFormErrors } = forgotPasswordForm.formState;
  const { errors: resetPasswordFormErrors } = resetPasswordForm.formState;

  const { data: sessionId, mutate: forgotPassword, isPending: sendingForgotPassword } = useForgotPassword();
  const { mutate: resetPassword, isPending: sendingResetPassword } = useResetPassword();

  const countDownTimeFormat = useCallback((timeDifference: number) => {
    const minutes = Math.floor(timeDifference / 1000 / 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 overflow-x-hidden">
      <div className="flex min-w-full transition-all" style={{ translate: `-${sessionId ? 100 : 0}%` }}>
        <div className="min-w-full p-6 space-y-10 sm:p-8">
          <div>
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot password
            </h1>
            <p className="text-center">Reset your password by email or user name</p>
          </div>
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit((data) => forgotPassword(data))} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="emailOrUserName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or user name:</FormLabel>
                    <FormControl>
                      <Input className="p-2.5" placeholder="abc@gmail.com" {...field} />
                    </FormControl>
                    {forgotPasswordFormErrors.emailOrUserName && (
                      <FormMessage>{forgotPasswordFormErrors.emailOrUserName.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <Button disabled={sendingForgotPassword} type="submit" className="w-full font-bold">
                Continue {sendingForgotPassword && <Loader2 size={16} className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
        {sessionId && (
          <div className="min-w-full p-6 space-y-10 sm:p-8">
            <div>
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Reset password
              </h1>
              <p className="text-center">6 characters otp code already sent to your email</p>
            </div>
            <Form {...resetPasswordForm}>
              <form
                onSubmit={resetPasswordForm.handleSubmit((data) =>
                  resetPassword({ newPassword: data.newPassword, otpCode: data.otpCode, sessionId }),
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password:</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        {resetPasswordFormErrors.newPassword && (
                          <FormMessage>{resetPasswordFormErrors.newPassword.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password:</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        {resetPasswordFormErrors.confirmPassword && (
                          <FormMessage>{resetPasswordFormErrors.confirmPassword.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={resetPasswordForm.control}
                  name="otpCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Otp code
                        <CountDown milisecconds={15 * 60 * 1000} timeFormat={countDownTimeFormat}>
                          {(timeDiffrence) => (
                            <span className="ms-1 text-xs text-red-500 font-semibold">(Valid in {timeDiffrence})</span>
                          )}
                        </CountDown>
                        :
                      </FormLabel>
                      <FormControl>
                        <Input maxLength={6} minLength={6} type="text" placeholder="123456" {...field} />
                      </FormControl>
                      {resetPasswordFormErrors.otpCode && (
                        <FormMessage>{resetPasswordFormErrors.otpCode.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <Button disabled={sendingResetPassword} type="submit" className="w-full font-bold">
                  Reset password {sendingResetPassword && <Loader2 size={16} className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
