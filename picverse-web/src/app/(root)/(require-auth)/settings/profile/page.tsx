"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectValue,
  Textarea,
} from "@app/components";
import { EGender } from "@app/lib/enums";
import { FC } from "react";
import { useForm } from "react-hook-form";

type SettingProfilePageProps = {};

const SettingProfilePage: FC<SettingProfilePageProps> = ({}) => {
  const form = useForm<UpdateProfileRequest>();
  const { errors: formErrors } = form.formState;

  return (
    <Form {...form}>
      <form className="space-y-5">
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar:</FormLabel>
              <FormControl>
                <div className="flex items-center gap-5">
                  <Avatar className="w-[100px] h-[100px]">
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback className="text-4xl">CN</AvatarFallback>
                  </Avatar>

                  <Button type="button" variant="secondary" className="rounded-full text-sm">
                    Change
                  </Button>
                </div>
              </FormControl>
              {formErrors.profilePicture && <FormMessage>{formErrors.profilePicture.message}</FormMessage>}
            </FormItem>
          )}
        />

        <div className="grid gap-3 grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name:</FormLabel>
                <FormControl>
                  <Input className="text-sm placeholder:text-sm h-[50px] rounded-lg" placeholder="John" {...field} />
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
                <FormLabel>Last name:</FormLabel>
                <FormControl>
                  <Input className="text-sm placeholder:text-sm h-[50px] rounded-lg" placeholder="Doe" {...field} />
                </FormControl>
                {formErrors.lastName && <FormMessage>{formErrors.lastName.message}</FormMessage>}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender:</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange({ name: "gender", value })}>
                  <SelectTrigger className="h-[50px]">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(EGender).map((gender) => {
                        return (
                          <SelectItem key={`update-profile:gender:${gender}`} value={gender}>
                            {gender}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {formErrors.gender && <FormMessage>{formErrors.gender.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone:</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  className="text-sm placeholder:text-sm h-[50px] rounded-lg"
                  {...field}
                />
              </FormControl>
              {formErrors.phone && <FormMessage>{formErrors.phone.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio:</FormLabel>
              <FormControl>
                <Textarea
                  className="text-sm placeholder:text-sm h-[50px] rounded-lg"
                  placeholder="Tell about your story"
                  {...field}
                />
              </FormControl>
              {formErrors.bio && <FormMessage>{formErrors.bio.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth:</FormLabel>
              <FormControl>
                <Input type="date" className="text-sm placeholder:text-sm h-[50px] rounded-lg" {...field} />
              </FormControl>
              {formErrors.birth && <FormMessage>{formErrors.birth.message}</FormMessage>}
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button className="text-red-500" variant="outline">
            Lock profile
          </Button>
          <Button>Update</Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingProfilePage;
