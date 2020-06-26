import React from "react";
import { RenderLeafProps } from "slate-react";

export const LeafElement = ({
  attributes,
  children,
  leaf,
}: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
