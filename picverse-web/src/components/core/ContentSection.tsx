import { cn } from "@app/lib/utils";
import { FC, ReactElement, ReactNode } from "react";

type ContentSectionProps = {
  children: ReactNode;
  heading?: string;
  subHeading?: string;
  className?: string;
  actions?: ReactElement;
};

const ContentSection: FC<ContentSectionProps> = ({ children, heading, subHeading, className, actions }) => {
  return (
    <section className={cn("mb-5", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          {heading && <h1 className="font-bold">{heading}</h1>}
          {subHeading && <h2 className="text-sm font-semibold">{subHeading}</h2>}
        </div>

        {actions}
      </div>
      {children}
    </section>
  );
};

export default ContentSection;
