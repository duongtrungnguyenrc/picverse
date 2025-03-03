"use client";

import { FC } from "react";

import PicverseImage from "./PicverseImage";
import Typography from "./Typography";

type PinListingProps = {
  initialData: PaginationResponse<Pin>;
};

const PinListing: FC<PinListingProps> = ({ initialData }) => {
  const pins = initialData.data;

  return (
    <>
      <div className="grid grid-cols-12">
        {pins.map((pin) => {
          if (typeof pin.resource === "string") return null;

          return (
            <div key={["board", "dtl", pin._id].join(":")} className="col-span-6 md:col-span-4 lg:col-span-3">
              <PicverseImage id={pin._id} alt={pin.title} width={pin.resource.width} height={pin.resource.height} />
            </div>
          );
        })}
      </div>
      {pins.length === 0 && <Typography className="text-center">No pins to present</Typography>}
    </>
  );
};

export default PinListing;
