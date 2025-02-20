"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { FC, useCallback, useState } from "react";
import Link from "next/link";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  GoogleSignInButton,
  Input,
  Checkbox,
  OtpDiaglog,
} from "@app/components";
import { useAuth, useSignIn, useSignInWith2FA } from "@app/lib/hooks";
import { signInSchema } from "@app/lib/validations";
import { setAuthCookie } from "@app/lib/actions";

type SignInPageProps = {};

const SignInPage: FC<SignInPageProps> = () => {
  const [credential, set2FACredential] = useState<Require2FAResponse>();
  const { authorizeClient, ready } = useAuth();

  const form = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      emailOrUserName: "",
      password: "",
    },
  });

  const { errors: formErrors } = form.formState;
  const { mutate: signIn, isPending, isSuccess } = useSignIn();
  const { mutate: signInWith2FA, isPending: is2FAPending } = useSignInWith2FA();

  const onSignIn = (data: SignInRequest) => {
    signIn(data, {
      onSuccess: async (data) => {
        if ("require2FA" in data) {
          set2FACredential(data);
          return data;
        }
        set2FACredential(undefined);
        onSignInSuccess(data);
      },
    });
  };

  const onVerify2FA = useCallback(
    (otpCode: string) => {
      if (!credential) {
        toast.error("Invalid 2FA credential");
        return;
      }

      signInWith2FA(
        { accountId: credential.accountId, profileId: credential.profileId, otpCode },
        { onSuccess: onSignInSuccess },
      );
    },
    [credential],
  );

  const onSignInSuccess = async (data: TokenPair) => {
    await setAuthCookie(data);
    authorizeClient(undefined, {
      onSuccess: () => {
        toast.success("Sign in success");
      },
    });
  };

  return (
    <div className="p-8 space-y-8 bg-white/80 animate-opacity-fade-in ">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-5">
          <FormField
            control={form.control}
            name="emailOrUserName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="Enter your email or username" {...field} />
                  </div>
                </FormControl>
                {formErrors.emailOrUserName && <FormMessage>{formErrors.emailOrUserName.message}</FormMessage>}
              </FormItem>
            )}
          />

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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-500 dark:text-gray-400 select-none">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            disabled={isPending || !ready || isSuccess}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isPending || !ready || isSuccess ? (
              <>
                Signing in
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">
                or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton />

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 space-x-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </Form>

      <OtpDiaglog open={!!credential} isPending={is2FAPending} onSubmit={onVerify2FA} title="Enter OTP code" />
    </div>
  );
};

export default SignInPage;
