"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock, KeyRound, Timer } from "lucide-react";
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

const ForgotPasswordPage: FC = () => {
  const forgotPasswordForm = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      emailOrUserName: "",
    },
  });

  const resetPasswordForm = useForm<
    Pick<ResetPasswordRequest, "newPassword" | "otpCode"> & { confirmPassword: string }
  >({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      otpCode: "",
    },
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

  const onResetPassword = resetPasswordForm.handleSubmit((data) =>
    resetPassword({
      newPassword: data.newPassword,
      otpCode: data.otpCode,
      sessionId: sessionId || "",
    }),
  );

  return (
    <div className="animate-opacity-fade-in w-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 shadow-lg dark:shadow-purple-900/30">
      <div
        className="flex min-w-full transition-all duration-500 ease-in-out"
        style={{ transform: `translateX(-${sessionId ? 100 : 0}%)` }}
      >
        <div className="min-w-full p-8 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">Reset your password by email or username</p>
          </div>

          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit((data) => forgotPassword(data))} className="space-y-6">
              <FormField
                control={forgotPasswordForm.control}
                name="emailOrUserName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="Enter your email or username" {...field} />
                      </div>
                    </FormControl>
                    {forgotPasswordFormErrors.emailOrUserName && (
                      <FormMessage>{forgotPasswordFormErrors.emailOrUserName.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <Button
                disabled={sendingForgotPassword}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {sendingForgotPassword ? (
                  <>
                    Sending Reset Link
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {sessionId && (
          <div className="min-w-full p-8 space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
            </div>

            <Form {...resetPasswordForm}>
              <form onSubmit={onResetPassword} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                            <Input type="password" className="pl-10" placeholder="Enter new password" {...field} />
                          </div>
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
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                            <Input type="password" className="pl-10" placeholder="Confirm new password" {...field} />
                          </div>
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
                      <FormLabel className="flex items-center gap-2">
                        <span>OTP Code</span>
                        <CountDown milisecconds={15 * 60 * 1000} timeFormat={countDownTimeFormat}>
                          {(timeDifference) => (
                            <div className="flex items-center text-xs text-rose-500 font-medium gap-1">
                              <Timer className="h-3 w-3" />
                              <span>Valid for {timeDifference}</span>
                            </div>
                          )}
                        </CountDown>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          <Input
                            maxLength={6}
                            minLength={6}
                            className="pl-10 tracking-widest font-mono text-center"
                            placeholder="123456"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {resetPasswordFormErrors.otpCode && (
                        <FormMessage>{resetPasswordFormErrors.otpCode.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <Button
                  disabled={sendingResetPassword}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {sendingResetPassword ? (
                    <>
                      Resetting Password
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Reset Password"
                  )}
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
