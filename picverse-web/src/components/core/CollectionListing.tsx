import { FC } from "react";
import Image from "next/image";

type CollectionListingProps = {};

const CollectionListing: FC<CollectionListingProps> = ({}) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[0, 1].map((collection, index) => (
        <li key={index}>
          <div>
            <ul className="relative flex space-x-[-30px]">
              <li className="rounded-xl overflow-hidden border border-white w-[150px] h-[200px] relative transform z-30">
                <Image
                  className="object-cover"
                  src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
                  alt=""
                  layout="fill"
                />
              </li>
              <li className="rounded-xl overflow-hidden border border-white w-[150px] h-[200px] relative transform z-20">
                <Image
                  className="object-cover"
                  src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
                  alt=""
                  layout="fill"
                />
              </li>
              <li className="rounded-xl overflow-hidden border border-white w-[150px] h-[200px] relative transform z-10">
                <Image
                  className="object-cover"
                  src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
                  alt=""
                  layout="fill"
                />
              </li>
            </ul>

            <h4 className="h4 mt-2">Hình nền điện thoại</h4>
            <p>
              <b className="text-gray-600 font-semibold">7 ghim</b>
              <span className="text-xs ms-2">17 giờ</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CollectionListing;
