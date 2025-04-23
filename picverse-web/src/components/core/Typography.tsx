import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@app/lib/utils";

const typographyVariants = cva("text-normal", {
  variants: {
    variant: {
      h1: "text-4xl font-semibold md:font-bold md:text-5xl md:tracking-[-0.02em] lg:text-6xl lg:leading-[72px] text-gray-900",
      h2: "text-lg md:text-2xl font-semibold tracking-[-0.02em] text-gray-900",
      h3: "text-base font-semibold tracking-[-0.02em] text-gray-900",
      h4: "text-sm font-semibold",
      subtitle: "text-lg md:text-xl",
      body1: "text-base",
      body2: "text-sm",
      body3: "text-xs",
    },
  },
  defaultVariants: {
    variant: "body2",
  },
});

interface TypographyProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {
  component?: React.ElementType;
}

const elementMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  subtitle: "p",
  body1: "p",
  body2: "p",
  body3: "p",
};

type ComponentElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

const Typography = React.forwardRef<HTMLHeadingElement | HTMLParagraphElement, TypographyProps>(
  ({ component, className = "", variant, children, ...props }: TypographyProps, ref) => {
    const Comp = (component ? component : variant ? elementMapping[variant] : "p") as ComponentElement;

    return (
      <Comp className={cn(typographyVariants({ variant }), className)} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);

Typography.displayName = "Typography";

export default Typography;
