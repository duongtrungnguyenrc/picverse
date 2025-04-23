"use client";

import { useForm } from "react-hook-form";
import { FC, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
  RadioGroup,
  RadioGroupItem,
  Button,
} from "../shadcn";
import { ContentSection, Label } from "@app/components";
import { loadAccountConfig } from "@app/lib/actions";
import { EInboxConfig } from "@app/lib/enums";
import { useUpdateAccountConfig } from "@app/lib/hooks";

type SettingPermissionsFormProps = {
  config: AccountConfig;
};

const SettingPermissionsForm: FC<SettingPermissionsFormProps> = ({ config }) => {
  const { handleUpdateAccountConfig, isPending } = useUpdateAccountConfig();

  const form = useForm<AccountConfig>({
    defaultValues: {
      ...config,
    },
  });

  useEffect(() => {
    async function fetchConfig() {
      const config = await loadAccountConfig();
      form.reset(config);
    }
    fetchConfig();
  }, [form.reset]);

  const onSubmit = form.handleSubmit(handleUpdateAccountConfig);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8 pb-10">
        <ContentSection heading="Inboxes" subHeading="Choose who can inbox with you">
          <FormField
            control={form.control}
            name="inboxConfig"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inbox Permissions</FormLabel>
                <FormControl>
                  <RadioGroup className="space-y-3" onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={EInboxConfig.ALL} id="inbox-1" />
                      <Label htmlFor="inbox-1">Everyone on Picverse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={EInboxConfig.FOLLOWING} id="inbox-2" />
                      <Label htmlFor="inbox-2">Only people you follow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={EInboxConfig.OFF} id="inbox-3" />
                      <Label htmlFor="inbox-3">Off</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ContentSection>

        <hr />

        <ContentSection heading="Comments" subHeading="Allow comments on your Pins" className="space-y-5">
          <FormField
            control={form.control}
            name="allowComment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments">Enable Comments</Label>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="comments" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </ContentSection>

        <hr />

        <ContentSection heading="Notifications" subHeading="Choose how you want to be notified" className="space-y-5">
          <FormField
            control={form.control}
            name="allowNotify"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">In-app notifications</Label>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="notifications" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="email-notifications" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowNotify"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push notifications</Label>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="push-notifications" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </ContentSection>

        {form.formState.isDirty && (
          <Button disabled={isPending} className="w-full animate-in">
            Save Changes
          </Button>
        )}
      </form>
    </Form>
  );
};

export default SettingPermissionsForm;
