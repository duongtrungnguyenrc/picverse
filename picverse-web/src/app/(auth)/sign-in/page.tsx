"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

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
  Logo,
} from "@app/components";
import { signInSchema } from "@app/lib/validations";
import { useSignIn } from "@app/lib/hooks";

type SignInPageProps = {};

const SignInPage: FC<SignInPageProps> = ({}) => {
  const form = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      emailOrUserName: "",
      password: "",
    },
  });

  const { errors: formErrors } = form.formState;

  const { mutate: signIn, isPending } = useSignIn();

  return (
    <div className="p-6 space-y-10 sm:p-8">
      <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Sign in to your account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => signIn(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="emailOrUserName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or user name:</FormLabel>
                <FormControl>
                  <Input className="p-2.5 text-sm" placeholder="abc@gmail.com" {...field} />
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
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input className="p-2.5 text-sm" placeholder="••••••••" type="password" {...field} />
                </FormControl>
                {formErrors.password && <FormMessage>{formErrors.password.message}</FormMessage>}
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                  Remember me
                </label>
              </div>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <Button disabled={isPending} type="submit" className="w-full font-bold">
            Sign in {isPending && <Loader2 size={16} className="animate-spin" />}
          </Button>

          <div className="my-6 flex items-center justify-center">
            <span className="flex-grow h-px bg-gray-300" />
            <p className="px-4 text-gray-500">or continue with</p>
            <span className="flex-grow h-px bg-gray-300" />
          </div>

          <GoogleSignInButton />

          <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
            {"Don't have an account yet?"}
            <Link href="/sign-up" className="ms-1 font-medium text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignInPage;
