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
  Input,
  Logo,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components";
import { useSignUp } from "@app/lib/hooks";
import { signUpSchema } from "@app/lib/validations";
import { EGender } from "@app/lib/enums";

type SignUpPageProps = {};
type SignUpFormData = SignUpDto & { confirmPassword: string };

const SignUpPage: FC<SignUpPageProps> = ({}) => {
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
    <section className="bg-gray-50 dark:bg-gray-900 bg-gradient auth">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 animate-fade-in">
        <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Logo />
          Picverse
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700  max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-10 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up new account
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => signUp(data))} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name:</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                          <Input placeholder="Doe" {...field} />
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
                        <Input type="email" placeholder="example@domain.com" {...field} />
                      </FormControl>
                      {formErrors.email && <FormMessage>{formErrors.email.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <Input type="tel" placeholder="0123456789" {...field} />
                      </FormControl>
                      {formErrors.phone && <FormMessage>{formErrors.phone.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                <Button disabled={isPending} type="submit" className="w-full font-bold">
                  Sign up {isPending && <Loader2 size={16} className="animate-spin" />}
                </Button>
                <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <Link href="/sign-in" className="ms-1 font-medium text-blue-500 hover:underline">
                    Sign in
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

export default SignUpPage;
