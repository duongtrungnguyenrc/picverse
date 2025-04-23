"use client";

import { useForm } from "react-hook-form";
import { FC } from "react";

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
  Textarea,
  RadioGroup,
  RadioGroupItem,
  Label,
  ContentSection,
} from "@app/components";
import { useUpdateProfile } from "@app/lib/hooks";
import { EGender } from "@app/lib/enums";

type SettingProfileFormProps = {
  profile?: ProfileDetail;
};

const SettingProfileForm: FC<SettingProfileFormProps> = ({ profile }) => {
  const { mutate: updateProfile } = useUpdateProfile();

  const form = useForm<UpdateProfileRequest>({
    defaultValues: {
      ...profile,
    },
  });

  const onUpdateProfile = form.handleSubmit(async (data) => {
    updateProfile(data);
  });

  if (!profile) {
    return <div>Unknow error...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={onUpdateProfile}>
        <ContentSection className="space-y-5" heading="Profile information">
          {/* <FormField
            control={form.control}
            name="avatar"
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
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
                  <FormMessage />
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
                  <FormMessage />
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
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-10">
                    {Object.values(EGender).map((gender) => {
                      return (
                        <div key={`upt:profile:gender:${gender}`} className="flex items-center space-x-2">
                          <RadioGroupItem value={gender} id={`upt:profile:gender:${gender}`} />
                          <Label htmlFor={`upt:profile:gender:${gender}`}>{gender}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
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
                    placeholder="Enter your phone number"
                    className="text-sm placeholder:text-sm h-[50px] rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio: {field.value?.length}/50</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-sm placeholder:text-sm h-[50px] rounded-lg"
                    placeholder="Tell about your story"
                    maxLength={50}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                  <Input
                    type="date"
                    className="text-sm placeholder:text-sm h-[50px] rounded-lg"
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      field.onChange(date.toISOString());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ContentSection>

        <ContentSection className="space-y-5 mt-10" heading="Privacy settings">
          <div className="flex justify-between">
            <div>
              <h4 className="h4">Lock your profile</h4>
              <p>Temporary lock your profile. You can reactive every time</p>
            </div>
            <Button type="button" className="text-red-500 rounded-full" variant="outline">
              Lock profile
            </Button>
          </div>

          <div className="flex justify-between">
            <div>
              <h4 className="h4">Delete profile and all data</h4>
              <p>Delete your profile and all data. You can&apos;t recover your profile</p>
            </div>
            <Button type="button" className="text-red-500 rounded-full" variant="outline">
              Delete profile
            </Button>
          </div>
        </ContentSection>

        {form.formState.isDirty && (
          <Button type="submit" className="w-full animate-in">
            Save Changes
          </Button>
        )}
      </form>
    </Form>
  );
};

export default SettingProfileForm;
