"use client";

import { Loader2, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Button,
  FormLabel,
  Switch,
} from "@app/components";

import { skeletonPlaceholder, debounce, deepMergeObjects } from "@app/lib/utils";
import { aspectRatioOptions, transformationFeatures } from "@app/lib/constants";

type CldImageTransformationFormProps = {
  form: UseFormReturn<CldTransformFormType>;
  activeFeature: CldTransformationFeatureKey;
  cldImage: CloudinaryImage;
};

const CldImageTransformationForm = ({ form, activeFeature, cldImage }: CldImageTransformationFormProps) => {
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState<CldTransformationConfig>();

  const onTransform = form.handleSubmit((data) => {
    setIsTransforming(true);

    const defaultconfig = {
      ...deepMergeObjects(transformationFeatures[activeFeature].config, transformationConfig),
      width: cldImage.width,
      height: cldImage.height,
    };

    setTransformationConfig({
      ...defaultconfig,
      [activeFeature]: {
        ...defaultconfig[activeFeature],
        ...data,
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onTransform} className="flex-1 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <ImagePreview title="Original Image" cldImgPublicId={cldImage.public_id} />
          <TransformedImagePreview
            cldImage={cldImage}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        {activeFeature === "fillBackground" && <AspectRatioField control={form.control} />}
        {["remove", "recolor"].includes(activeFeature) && (
          <PromptField control={form.control} activeFeature={activeFeature} />
        )}
        {activeFeature === "recolor" && <ToColorField control={form.control} />}
        {activeFeature === "replace" && <ReplaceFields control={form.control} />}
      </form>
    </Form>
  );
};

const ImagePreview = ({ title, cldImgPublicId }: { title: string; cldImgPublicId?: string }) => (
  <div className="flex-1 w-full">
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <div className="p-3 rounded-lg border border-dashed overflow-hidden">
      <div className="relative flex-center h-[300px]">
        {cldImgPublicId && (
          <CldImage
            width={300}
            height={300}
            src={cldImgPublicId}
            alt="Original image"
            placeholder={skeletonPlaceholder as any}
            className="object-contain w-full h-full"
          />
        )}
      </div>
    </div>
  </div>
);

const TransformedImagePreview = ({
  cldImage,
  isTransforming,
  setIsTransforming,
  transformationConfig,
}: {
  cldImage: CloudinaryImage;
  isTransforming: boolean;
  setIsTransforming: (value: boolean) => void;
  transformationConfig?: CldTransformationConfig;
}) => (
  <div className="flex-1 w-full">
    <h4 className="text-lg font-semibold mb-2">Transformed Image</h4>
    <div className="p-3 rounded-lg border border-dashed overflow-hidden">
      <div className="relative flex-center h-[300px] group">
        {transformationConfig ? (
          <>
            <CldImage
              width={cldImage.width}
              height={cldImage.height}
              src={cldImage.public_id}
              alt="Transformed image"
              placeholder={skeletonPlaceholder as any}
              className="object-contain w-full h-full"
              onLoad={() => setIsTransforming(false)}
              onError={() => debounce(() => setIsTransforming(false), 8000)()}
              {...transformationConfig}
            />
            {isTransforming ? (
              <div className="absolute align-middle flex flex-col items-center">
                <Loader2 className="animate-spin" />
                <p>Please wait...</p>
              </div>
            ) : (
              <Button
                className="absolute bottom-5 align-middle opacity-0 group-hover:opacity-100 transition-all"
                type="submit"
                variant="outline"
              >
                <Sparkles /> Transform
              </Button>
            )}
          </>
        ) : (
          <Button type="submit" variant="outline">
            <Sparkles /> Transform
          </Button>
        )}
      </div>
    </div>
  </div>
);

const AspectRatioField = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="aspectRatio"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Aspect ratio</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {Object.entries(aspectRatioOptions).map(([key, option]) => (
              <SelectItem key={key} value={key}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

const ToColorField = ({ control }: { control: any }) => (
  <>
    <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
      <FormField
        control={control}
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prompt</FormLabel>
            <FormControl>
              <Input placeholder={`Which object you want to recolor?`} {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="to"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>To</FormLabel>
            <FormControl>
              <Input placeholder="To" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
    <FormField
      control={control}
      name="multiple"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <FormLabel>Multiple objects</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  </>
);

const PromptField = ({ control, activeFeature }: { control: any; activeFeature: CldTransformationFeatureKey }) => (
  <>
    <FormField
      control={control}
      name="prompt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Prompt</FormLabel>
          <FormControl>
            <Input placeholder={`Which object you want to ${activeFeature}?`} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="multiple"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <FormLabel>Multiple objects</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  </>
);

const ReplaceFields = ({ control }: { control: any }) => (
  <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
    <FormField
      control={control}
      name="from"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>From</FormLabel>
          <FormControl>
            <Input placeholder="Replace from" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="to"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>To</FormLabel>
          <FormControl>
            <Input placeholder="To" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

export default CldImageTransformationForm;
