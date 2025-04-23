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
          {heading && <h1 className="font-semibold">{heading}</h1>}
          {subHeading && <p className="text-sm">{subHeading}</p>}
        </div>

        {actions}
      </div>
      {children}
    </section>
  );
};

export default ContentSection;
