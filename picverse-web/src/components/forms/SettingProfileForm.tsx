"use client";

import { useForm } from "react-hook-form";
import { FC, useEffect } from "react";

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

  const form = useForm<UpdateProfileRequest>({});
  const { errors: formErrors } = form.formState;

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
          <FormField
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
                {formErrors.avatar && <FormMessage>{formErrors.avatar.message}</FormMessage>}
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
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || ""}
                    className="flex gap-10"
                  >
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
                    placeholder="Enter your phone number"
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
        </ContentSection>

        <ContentSection className="space-y-5 mt-10" heading="Privacy settings">
          <div className="flex justify-between">
            <div>
              <h4 className="h4">Lock your profile</h4>
              <p>Temporary lock your profile. You can reactive every time</p>
            </div>
            <Button className="text-red-500 rounded-full" variant="outline">
              Lock profile
            </Button>
          </div>

          <div className="flex justify-between">
            <div>
              <h4 className="h4">Delete profile and all data</h4>
              <p>Delete your profile and all data. You can&apos;t recover your profile</p>
            </div>
            <Button className="text-red-500 rounded-full" variant="outline">
              Delete profile
            </Button>
          </div>
        </ContentSection>

        <div className="flex justify-end gap-3">
          <Button>Update</Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingProfileForm;
