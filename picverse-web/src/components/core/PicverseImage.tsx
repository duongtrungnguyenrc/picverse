import Image, { ImageProps } from "next/image";
import { FC } from "react";

type PicverseImageProps = Omit<ImageProps, "src"> & {
  id: string;
};

const PicverseImage: FC<PicverseImageProps> = ({ id, ...props }) => {
  const imageUrl = `/public/image?id=${id}`;

  return <Image {...props} src={imageUrl} />;
};

export default PicverseImage;
