"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components";
import { signUpSchema } from "@app/lib/validations";
import { useSignUp } from "@app/lib/hooks";
import { EGender } from "@app/lib/enums";

type SignUpPageProps = {};
type SignUpFormData = SignUpRequest & { confirmPassword: string };

const steps = 3;

const SignUpPage: FC<SignUpPageProps> = ({}) => {
  const [step, setStep] = useState(0);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userName: "",
      firstName: "",
      lastName: "",
      birth: "",
      gender: EGender.MALE,
      phone: "",
    },
  });

  const { errors: formErrors } = form.formState;
  const { mutate: signUp, isPending } = useSignUp();

  return (
    <div className="p-6 space-y-10 sm:p-8">
      <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Sign up new account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => signUp(data))} className="space-y-4 w-full overflow-x-hidden">
          <div className="flex transition-all" style={{ translate: `-${step * 100}%` }}>
            <div className="min-w-full space-y-3">
              <div className="grid gap-3 grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name:</FormLabel>
                      <FormControl>
                        <Input className="text-sm placeholder:text-sm" placeholder="John" {...field} />
                      </FormControl>
                      {formErrors.firstName && <FormMessage>{formErrors.firstName.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name:</FormLabel>
                      <FormControl>
                        <Input className="text-sm placeholder:text-sm" placeholder="Doe" {...field} />
                      </FormControl>
                      {formErrors.lastName && <FormMessage>{formErrors.lastName.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm placeholder:text-sm"
                        type="email"
                        placeholder="example@domain.com"
                        {...field}
                      />
                    </FormControl>
                    {formErrors.email && <FormMessage>{formErrors.email.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>

            <div className="min-w-full space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date:</FormLabel>
                      <FormControl>
                        <Input className="text-sm placeholder:text-sm" type="date" {...field} />
                      </FormControl>
                      {formErrors.birth && <FormMessage>{formErrors.birth.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender:</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {formErrors.gender && <FormMessage>{formErrors.gender.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number:</FormLabel>
                    <FormControl>
                      <Input className="text-sm p-2.5" type="tel" placeholder="0123456789" {...field} />
                    </FormControl>
                    {formErrors.phone && <FormMessage>{formErrors.phone.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>

            <div className="min-w-full space-y-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    {formErrors.password && <FormMessage>{formErrors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password:</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    {formErrors.confirmPassword && <FormMessage>{formErrors.confirmPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setStep((prev) => --prev)}
              disabled={step === 0}
              type="button"
              variant="outline"
              className="w-full font-bold flex-1"
            >
              Back
            </Button>
            {step < steps - 1 ? (
              <Button
                onClick={() => setStep((prev) => ++prev)}
                disabled={isPending}
                type="button"
                className="w-full font-bold flex-1"
              >
                Next
              </Button>
            ) : (
              <Button disabled={isPending} type="button" className="w-full font-bold flex-1">
                Sign up {isPending && <Loader2 size={16} className="animate-spin" />}
              </Button>
            )}
          </div>

          <div className="my-6 flex items-center justify-center">
            <span className="flex-grow h-px bg-gray-300" />
            <p className="px-4 text-gray-500">or continue with</p>
            <span className="flex-grow h-px bg-gray-300" />
          </div>

          <GoogleSignInButton />

          <p className="text-sm placeholder:text-sm text-center font-light text-gray-500 dark:text-gray-400">
            Already have an account?
            <Link href="/sign-in" className="ms-1 font-medium text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignUpPage;
