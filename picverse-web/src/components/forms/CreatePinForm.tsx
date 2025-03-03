"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FC } from "react";

import { ContentSection, ImagePicker, PicverseImage, TagInput } from "../core";
import { useCreatePin } from "@app/lib/hooks";
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
  FormMessage,
} from "../shadcn";

type CreatePinFormProps = {
  boards: UserBoard[];
  resourceId?: string;
};

type CreatePinFormType = CreatePinRequest & { choosenImage: Partial<ChoosenImage> };

const CreatePinForm: FC<CreatePinFormProps> = ({ boards, resourceId }) => {
  const { handleCreatePin } = useCreatePin();
  const form = useForm<CreatePinFormType>({
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      allowComment: true,
      allowShare: true,
      choosenImage: {},
    },
  });

  const onCreatePin = form.handleSubmit((data: CreatePinFormType) => {
    if (resourceId) {
      handleCreatePin(
        {
          ...data,
          resourceId,
        },
        () => {
          form.reset();
        },
      );

      return;
    } else {
      handleCreatePin(data, () => {
        form.reset();
      });
    }
  });

  const onSetChoosenImage = (image?: Partial<ChoosenImage>) => {
    form.setValue("choosenImage", image ?? {});
  };

  return (
    <Form {...form}>
      <form onSubmit={onCreatePin}>
        <ContentSection heading="Create pin" className="container py-10">
          <div className="grid grid-cols-12 md:gap-x-5 lg:gap-x-10 gap-y-7">
            <hr className="col-span-full" />

            <div className="col-span-full md:col-span-6 lg:col-span-5 h-full">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="h-full flex flex-col space-y-4">
                    <FormLabel>Media</FormLabel>
                    <FormControl>
                      {resourceId ? (
                        <div className="min-h-[300px] flex-1 flex-center flex-col rounded-lg border border-dashed cursor-pointer group relative overflow-hidden">
                          <PicverseImage
                            id={resourceId}
                            alt="Preview image"
                            layout="fill"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <ImagePicker
                          onChange={field.onChange}
                          chosenImage={form.getValues("choosenImage")}
                          setChosenImage={onSetChoosenImage}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full md:col-span-6 lg:col-span-7 space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Add title" {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
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
                              {boards.map((board) => (
                                <SelectItem key={["create-pin", "board", board._id].join(":")} value={board._id}>
                                  {board.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
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
                      <TagInput tags={field.value} setTags={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ContentSection heading="Other options" className="space-y-4">
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

              <Button
                className="w-full"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                type="submit"
              >
                Create pin
              </Button>
            </div>
          </div>
        </ContentSection>
      </form>
    </Form>
  );
};

export default CreatePinForm;
