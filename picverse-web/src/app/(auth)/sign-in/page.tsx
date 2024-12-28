"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Logo } from "@app/components";
import { useGoogleSignIn, useSignIn } from "@app/lib/hooks";
import { signInSchema } from "@app/lib/validations";
import { cn } from "@app/lib/utils";

type SignInPageProps = {};

const SignInPage: FC<SignInPageProps> = ({}) => {
  const form = useForm<SignInDto>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      emailOrUserName: "",
      password: "",
    },
  });

  const { errors: formErrors } = form.formState;

  const { mutate: googleSignIn, isPending: isGoogleSignInProcessing } = useGoogleSignIn();
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <section
      className={cn(
        "bg-gray-50 h-screen dark:bg-gray-900 bg-gradient auth",
        isGoogleSignInProcessing ? "opacity-70 pointer-events-none" : "",
      )}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 animate-fade-in">
        <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Logo />
          Picverse
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-10 sm:p-8">
            <div>
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              {isGoogleSignInProcessing && (
                <div className="flex items-center justify-center">
                  <p className="text-xs text-gray-500">Google auth processing</p>
                  <Loader2 size={13} className="animate-spin ml-1" />
                </div>
              )}
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => signIn(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="emailOrUserName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or user name:</FormLabel>
                      <FormControl>
                        <Input className="p-2.5" placeholder="abc@gmail.com" {...field} />
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
                        <Input className="p-2.5" placeholder="••••••••" type="password" {...field} />
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
                  <Link href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
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

                <Button type="button" variant="outline" className="w-full" onClick={() => googleSignIn()}>
                  <svg
                    width="800px"
                    height="800px"
                    viewBox="-3 0 262 262"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                  >
                    <path
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      fill="#4285F4"
                    />
                    <path
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      fill="#34A853"
                    />
                    <path
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      fill="#FBBC05"
                    />
                    <path
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                  {"Don't have an account yet?"}
                  <Link href="/sign-up" className="ms-1 font-medium text-blue-500 hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
