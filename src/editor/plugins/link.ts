import { Transforms, Editor, Range } from "slate";
import { ReactEditor } from "slate-react";

export const insertLink = (
  editor: Editor,
  url: string,
  selection: Range | undefined,
) => {
  if (selection) {
    wrapLink(editor, url, selection);
  }
};

export const isLinkActive = (
  editor: Editor,
  selection: Range | undefined = undefined,
) => {
  const [link] = Array.from(
    Editor.nodes(editor, {
      match: n => n.type === "link",
      at: selection,
    }),
  );

  return !!link;
};

export const unwrapLink = (
  editor: Editor,
  selection: Range | undefined = undefined,
) => {
  Transforms.unwrapNodes(editor, {
    match: n => n.type === "link",
    at: selection,
  });
};

const wrapLink = (
  editor: Editor,
  url: string,
  selection: Range | undefined,
) => {
  if (isLinkActive(editor, selection)) {
    unwrapLink(editor, selection);
  }

  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link, { at: selection });
  } else {
    Transforms.wrapNodes(editor, link, { split: true, at: selection });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const withLinks = (
  editor: Editor & ReactEditor,
): Editor & ReactEditor => {
  const { isInline } = editor;

  editor.isInline = element => {
    return element.type === "link" ? true : isInline(element);
  };

  return editor;
};
