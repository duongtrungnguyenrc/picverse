"use client";

import { CldImage, getCldImageUrl } from "next-cloudinary";
import { Control, useForm } from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
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
  FormLabel,
  Switch,
  DialogFooter,
} from "@app/components";
import { skeletonPlaceholder, debounce, deepMergeObjects } from "@app/lib/utils";
import { aspectRatioOptions, transformationFeatures } from "@app/lib/constants";

type ImageAiTransformDialogProps = {
  children: React.ReactNode;
  cldImage: CloudinaryImage;
  onTransformed: (transformedImage: File) => void;
};

export default function ImageTransformDialog({ children, cldImage, onTransformed }: ImageAiTransformDialogProps) {
  const [transformationConfig, setTransformationConfig] = useState<CldTransformationConfig>();
  const [openDialog, setOpenDialog] = useState(false);
  const [transformState, setTransformState] = useState<CldTransformState>("default");
  const [activeFeature, setActiveFeature] = useState<CldTransformationFeatureKey>(
    Object.keys(transformationFeatures)[0] as CldTransformationFeatureKey,
  );

  const form = useForm<CldTransformFormType>({
    defaultValues: {
      aspectRatio: "1:1",
      prompt: "",
      from: "",
      to: "",
    },
  });

  const resetState = () => {
    form.reset();
    setTransformationConfig(undefined);
    setTransformState("default");
  };

  const onTransform = form.handleSubmit((data) => {
    resetState();
    setTransformState("transforming");

    const defaultConfig: CldTransformationConfig = {
      ...deepMergeObjects(transformationFeatures[activeFeature].config, transformationConfig),
      width: cldImage.width,
      height: cldImage.height,
    };

    setTransformationConfig({
      ...defaultConfig,
      [activeFeature]: {
        ...((defaultConfig[activeFeature] as object) || {}),
        ...data,
      },
    });
  });

  const onTabChange = (value: CldTransformationFeatureKey) => {
    resetState();
    setActiveFeature(value);
  };

  const onApplyTransformation = async () => {
    if (transformationConfig) {
      const transformedUrl = getCldImageUrl({
        src: cldImage.public_id,
        ...transformationConfig,
      });

      try {
        const response = await fetch(transformedUrl);
        const blob = await response.blob();

        const file = new File([blob], `transformed-${cldImage.public_id}.png`, { type: blob.type });

        onTransformed(file);

        resetState();
        setOpenDialog(false);
      } catch (error) {
        toast.error("Failed to fetch transformed image");
        console.error(error);
      }
    } else {
      toast.error("Please select a transformation");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[70vw] max-h-screen md:max-h-[80vh] rounded-none md:rounded-3xl flex flex-col bg-background">
        <DialogHeader>
          <DialogTitle>AI image transformation</DialogTitle>
        </DialogHeader>
        <div className="flex mt-4 space-x-4 overflow-y-auto">
          <SidebarTabs activeFeature={activeFeature} onTabChange={onTabChange} />
          <Form {...form}>
            <form onSubmit={onTransform} className="flex-1 space-y-4">
              <ImagePreviews
                cldImage={cldImage}
                transformState={transformState}
                setTransformState={setTransformState}
                transformationConfig={transformationConfig}
              />
              <DynamicFields activeFeature={activeFeature} control={form.control} />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button onClick={onApplyTransformation}>Apply Transformation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SidebarTabs = ({
  activeFeature,
  onTabChange,
}: {
  activeFeature: CldTransformationFeatureKey;
  onTabChange: (value: CldTransformationFeatureKey) => void;
}) => (
  <div className="lg:w-60 border-r pr-4">
    {Object.values(transformationFeatures).map((feat) => (
      <button
        key={feat.key}
        onClick={() => onTabChange(feat.key)}
        className={`flex items-center w-full px-4 py-2 space-x-2 text-left text-sm font-semibold mb-2 rounded-lg transition-colors ${
          activeFeature === feat.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        <feat.icon size={16} />
        <span className="hidden lg:block">{feat.title}</span>
      </button>
    ))}
  </div>
);

const ImagePreviews = ({
  cldImage,
  transformState,
  setTransformState,
  transformationConfig,
}: {
  cldImage: CloudinaryImage;
  transformState: CldTransformState;
  setTransformState: Dispatch<SetStateAction<CldTransformState>>;
  transformationConfig?: CldTransformationConfig;
}) => (
  <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
    <ImagePreview title="Original Image" cldImgPublicId={cldImage.public_id} />
    <TransformedImagePreview
      cldImgPublicId={cldImage.public_id}
      transformState={transformState}
      setTransformState={setTransformState}
      transformationConfig={transformationConfig}
    />
  </div>
);

const DynamicFields = ({
  activeFeature,
  control,
}: {
  activeFeature: CldTransformationFeatureKey;
  control: Control<CldTransformFormType>;
}) => (
  <>
    {activeFeature === "fillBackground" && <AspectRatioField control={control} />}
    {activeFeature === "remove" && <PromptField control={control} activeFeature={activeFeature} />}
    {activeFeature === "recolor" && <ToColorField control={control} />}
    {activeFeature === "replace" && <ReplaceFields control={control} />}
  </>
);

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
  cldImgPublicId,
  transformState,
  setTransformState,
  transformationConfig,
}: {
  cldImgPublicId: string;
  transformState: CldTransformState;
  setTransformState: Dispatch<SetStateAction<CldTransformState>>;
  transformationConfig?: CldTransformationConfig;
}) => (
  <div className="flex-1 w-full">
    <h4 className="text-lg font-semibold mb-2">Transformed Image</h4>
    <div className="p-3 rounded-lg border border-dashed overflow-hidden">
      <div className="relative flex-center h-[300px] group">
        {transformState != "default" ? (
          <>
            <CldImage
              src={cldImgPublicId}
              alt="Transformed image"
              placeholder={skeletonPlaceholder as any}
              className="object-contain w-full h-full"
              onLoad={() => setTransformState("transformed")}
              onError={() => debounce(() => setTransformState("error"), 8000)()}
              {...transformationConfig}
            />

            {transformState === "transforming" && (
              <div className="absolute align-middle flex flex-col items-center">
                <Loader2 size={16} className="animate-spin" />
                <p>Please wait...</p>
              </div>
            )}

            {["transformed", "error"].includes(transformState) && (
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

const AspectRatioField = ({ control }: { control: Control<CldTransformFormType> }) => (
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

const PromptField = ({
  control,
  activeFeature,
}: {
  control: Control<CldTransformFormType>;
  activeFeature: CldTransformationFeatureKey;
}) => (
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

const ReplaceFields = ({ control }: { control: Control<CldTransformFormType> }) => (
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

const ToColorField = ({ control }: { control: Control<CldTransformFormType> }) => (
  <>
    <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
      <FormField
        control={control}
        name="prompt"
        render={({ field }) => (
          <FormItem className="flex-1">
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
            <FormLabel>To color</FormLabel>
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
