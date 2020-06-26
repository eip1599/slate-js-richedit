import React, { useState } from "react";
import { createEditor, Node, Range } from "slate";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { ReferenceObject } from "popper.js";

import { DefaultElement } from "./elements";
import { Toolbar } from "./toolbar";
import { LeafElement } from "./elements/LeafElement";
import { withLinks } from "./plugins/link";

function renderElement(props: RenderElementProps) {
  return <DefaultElement {...props} />;
}

function renderLeaf(props: RenderLeafProps) {
  return <LeafElement {...props} />;
}

export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

export function Editor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const editor = React.useMemo(() => withLinks(withReact(createEditor())), []);

  const [toolbarAnchor, setToolbarAnchor] = useState<ReferenceObject | null>(
    null,
  );

  const handleSelection = (ev: React.SyntheticEvent<HTMLDivElement, Event>) => {
    ev.preventDefault();

    // filter out outside selection
    if (!editor.selection || Range.isCollapsed(editor.selection)) {
      setToolbarAnchor(null);
      return;
    }

    // editor.selection is not updated/synced yet, use native selection
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setToolbarAnchor(null);
      return;
    }

    const DOMRange = selection.getRangeAt(0);
    const DOMRect = DOMRange.getBoundingClientRect();

    // "debounce"
    setTimeout(() => {
      setToolbarAnchor({
        clientWidth: DOMRect.width,
        clientHeight: DOMRect.height,
        getBoundingClientRect: () => DOMRect,
      });
    }, 100);
  };

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onSelect={handleSelection}
        onBlur={() => setToolbarAnchor(null)}
        {...other}
      />
      <Toolbar open={!!toolbarAnchor} anchorEl={toolbarAnchor} />
    </Slate>
  );
}

export { Node };
