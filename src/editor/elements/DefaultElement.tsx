import React from "react";
import { Typography } from "@material-ui/core";
import { RenderElementProps } from "slate-react";

export const DefaultElement = React.forwardRef(function DefaultElement(
  { attributes, element, children }: RenderElementProps,
  ref: React.Ref<HTMLElement>,
) {
  switch (element.type) {
    case "link":
      return (
        <a {...attributes} href={element.url as string}>
          {children}
        </a>
      );
  }
  return <Typography ref={ref}>{children}</Typography>;
});
