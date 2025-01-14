"use client";

import { FC } from "react";
import { ContentSection, MediaEditor, TagInput } from ".";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Button,
} from "../shadcn";
import { useForm } from "react-hook-form";
import { CloudUpload, Upload } from "lucide-react";

type CreatePinFormProps = {};

const CreatePinForm: FC<CreatePinFormProps> = ({}) => {
  const form = useForm<CreatePinRequest>({
    defaultValues: {
      title: "",
      description: "",
      resources: [],
      tags: [],
      isPublic: false,
      allowComment: false,
      allowShare: false,
    },
  });

  const formErrors = form.formState.errors;

  const onCreatePin = form.handleSubmit((data) => {});

  return (
    <Form {...form}>
      <form onSubmit={onCreatePin}>
        <MediaEditor />
        <ContentSection
          heading="Create pin"
          className="container py-10"
          actions={
            <Button
              disabled={!form.formState.isValid}
              className="rounded-full"
              size="sm"
              type="submit"
              variant="outline"
            >
              Upload <Upload />
            </Button>
          }
        >
          <div className="grid grid-cols-12 md:gap-x-5 lg:gap-x-10 gap-y-7">
            <hr className="col-span-full" />

            <div className="col-span-full md:col-span-6 lg:col-span-5 h-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="h-full flex flex-col space-y-4">
                    <FormLabel>Media</FormLabel>
                    <FormControl>
                      <Label
                        htmlFor="uploadFileInput"
                        className="min-h-[300px] flex-1 flex flex-col items-center justify-center rounded-lg border border-dashed cursor-pointer"
                      >
                        <input
                          id="uploadFileInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          // onChange={handleFileChange}
                        />

                        <>
                          <CloudUpload className="text-gray-500" />
                          <p className="text-xs">Upload file</p>
                        </>
                      </Label>
                    </FormControl>
                    {/* {formErrors.firstName && <FormMessage>{formErrors.firstName.message}</FormMessage>} */}
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full md:col-span-6 lg:col-span-7 space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Add title" {...field} />
                    </FormControl>
                    {/* {formErrors.firstName && <FormMessage>{formErrors.firstName.message}</FormMessage>} */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Add description" {...field} />
                    </FormControl>
                    {/* {formErrors.firstName && <FormMessage>{formErrors.firstName.message}</FormMessage>} */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="boardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select board" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="male">Male</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    {/* {formErrors.gender && <FormMessage>{formErrors.gender.message}</FormMessage>} */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagInput tags={field.value} setTags={() => {}} />
                    </FormControl>
                    {/* {formErrors.firstName && <FormMessage>{formErrors.firstName.message}</FormMessage>} */}
                  </FormItem>
                )}
              />

              <ContentSection heading="Other options" className="space-y-4">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="is-public-pin">Public pin</Label>
                            <p className="text-sm text-muted-foreground">
                              make this pin public so other users can view it
                            </p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} id="is-public-pin" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="allow-comment-pin">Allow comment</Label>
                            <p className="text-sm text-muted-foreground">allow other users to comment on this pin</p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} id="allow-comment-pin" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="allow-share-pin">Allow share</Label>
                            <p className="text-sm text-muted-foreground">allow other users to share on this pin</p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} id="allow-share-pin" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </ContentSection>
            </div>
          </div>
        </ContentSection>
      </form>
    </Form>
  );
};

export default CreatePinForm;
