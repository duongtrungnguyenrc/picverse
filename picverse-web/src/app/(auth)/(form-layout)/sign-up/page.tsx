"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, Phone, Calendar, Users, Lock } from "lucide-react";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
} from "@app/components";
import { signUpSchema } from "@app/lib/validations";
import { useSignUp } from "@app/lib/hooks";
import { EGender } from "@app/lib/enums";

type SignUpFormData = SignUpRequest & { confirmPassword: string };

const steps = [
  { title: "Personal Info", description: "Basic information about you" },
  { title: "Contact Details", description: "How we can reach you" },
  { title: "Security", description: "Protect your account" },
];

const SignUpPage: FC = () => {
  const [step, setStep] = useState(0);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
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
    <div className="animate-opacity-fade-in w-full overflow-hidden rounded-2xl backdrop-blur-sm dark:bg-gray-800/90 shadow-lg dark:shadow-purple-900/30">
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-center">Create an Account</h1>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-base font-medium">{steps[step].title}</p>
              <p className="text-sm text-muted-foreground">{steps[step].description}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => signUp(data))} className="space-y-6 overflow-x-hidden">
            <Progress value={(step + 1) * (100 / steps.length)} className="h-1" />

            <div
              className="flex transition-all duration-500 ease-in-out"
              style={{ transform: `translateX(-${step * 100}%)` }}
            >
              <div className="min-w-full space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="John" {...field} />
                          </div>
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Doe" {...field} />
                          </div>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="email" placeholder="you@example.com" {...field} />
                        </div>
                      </FormControl>
                      {formErrors.email && <FormMessage>{formErrors.email.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>

              <div className="min-w-full space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="date" {...field} />
                          </div>
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
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Object.values(EGender).map((gender) => {
                                    return (
                                      <SelectItem
                                        className="capitalize"
                                        key={`sign-up:gender:${gender}`}
                                        value={gender}
                                      >
                                        {gender}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="tel" placeholder="(123) 456-7890" {...field} />
                        </div>
                      </FormControl>
                      {formErrors.phone && <FormMessage>{formErrors.phone.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>

              <div className="min-w-full space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="password" placeholder="Create a password" {...field} />
                        </div>
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="password" placeholder="Confirm your password" {...field} />
                        </div>
                      </FormControl>
                      {formErrors.confirmPassword && <FormMessage>{formErrors.confirmPassword.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep((prev) => prev - 1)}
                disabled={step === 0}
                type="button"
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep((prev) => prev + 1)}
                  type="button"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  disabled={isPending}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isPending ? (
                    <>
                      Creating Account
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </div>

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

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
