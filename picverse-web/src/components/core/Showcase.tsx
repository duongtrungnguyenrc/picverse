import { FC } from "react";
import { Button } from "../shadcn";
import MansoryPinListing from "./MansoryPinListing";

type ShowcaseProps = {};

const Showcase: FC<ShowcaseProps> = ({}) => {
  return (
    <section id="gallery" className="p-5 lg:p-10">
      <div className="flex flex-col md:items-center">
        <h1 className="h2">Popular collections</h1>
        <p className="mt-2">Top-rated and trending templates, adored by users most</p>
        <ul className="items-center flex gap-3 mt-5 lg:mt-10 max-w-full overflow-x-auto py-5">
          <li>
            <Button variant="outline">All</Button>
          </li>
          <li>
            <Button variant="outline">Car</Button>
          </li>
          <li>
            <Button variant="outline">Background</Button>
          </li>
          <li>
            <Button variant="outline">Images</Button>
          </li>
          <li>
            <Button variant="outline">Background</Button>
          </li>
          <li>
            <Button variant="outline">Background</Button>
          </li>
        </ul>
      </div>

      <div className="mt-5 lg:mt-10">
        <MansoryPinListing />
      </div>
    </section>
  );
};

export default Showcase;
