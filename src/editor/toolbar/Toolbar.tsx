import React, { useState } from "react";
import {
  Popper,
  PopperProps,
  ButtonGroup,
  IconButton,
  Input,
  Grow,
} from "@material-ui/core";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link,
  Close,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useSlate } from "slate-react";

import { toggleMark, isMarkActive, Format } from "../plugins/mark";
import { isLinkActive, insertLink, unwrapLink } from "../plugins/link";
import { Range, Path } from "slate";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.common.black,
  },
  button: {
    color: theme.palette.common.white,
    opacity: 0.75,
    "&:hover": {
      opacity: 1,
    },
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25, 1),
  },
  close: {
    opacity: 0.75,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
}));

export interface ToolbarProps extends Omit<PopperProps, "children"> {}

export function Toolbar({ open, ...otherProps }: ToolbarProps) {
  const [link, setLink] = React.useState<string | null>(null);
  const s = useStyles();
  const editor = useSlate();

  const handleMarkClick = (format: Format) => (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();
    toggleMark(editor, format);
  };
  const activeMarkColor = (format: Format) =>
    isMarkActive(editor, format) ? "primary" : "inherit";

  const [linkSelection, setLinkSelection] = useState<Range | null>(null);

  const handleAddLinkClick = () => {
    if (isLinkActive(editor)) {
      unwrapLink(editor);
    } else if (
      editor.selection &&
      Path.equals(editor.selection?.anchor.path, editor.selection?.focus.path)
    ) {
      setLinkSelection(editor.selection);
      setLink("");
    }
  };

  const handleInsertLink = () => {
    insertLink(editor, link!, linkSelection!);
    setLink(null);
  };

  return (
    <Popper
      {...otherProps}
      open={open || link !== null}
      transition
      placement="top"
      modifiers={{ offset: { offset: "0px, 5px" } }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          timeout={{ appear: 300, exit: 200, enter: 100 }}
        >
          <div className={s.root}>
            {link === null ? (
              /* Formatting controls */
              <ButtonGroup variant="text" color="primary">
                <IconButton
                  className={s.button}
                  size="small"
                  onMouseDown={handleMarkClick("bold")}
                >
                  <FormatBold
                    fontSize="small"
                    color={activeMarkColor("bold")}
                  />
                </IconButton>
                <IconButton
                  className={s.button}
                  size="small"
                  onMouseDown={handleMarkClick("italic")}
                >
                  <FormatItalic
                    fontSize="small"
                    color={activeMarkColor("italic")}
                  />
                </IconButton>
                <IconButton
                  className={s.button}
                  size="small"
                  onMouseDown={handleMarkClick("underline")}
                >
                  <FormatUnderlined
                    fontSize="small"
                    color={activeMarkColor("underline")}
                  />
                </IconButton>
                <IconButton
                  className={s.button}
                  size="small"
                  onClick={handleAddLinkClick}
                >
                  <Link
                    fontSize="small"
                    color={isLinkActive(editor) ? "primary" : "inherit"}
                  />
                </IconButton>
              </ButtonGroup>
            ) : (
              /* URL input field */
              <form
                onSubmit={(x) => {
                  x.preventDefault();
                  handleInsertLink();
                }}
              >
                <Input
                  className={s.input}
                  type="url"
                  value={link}
                  onChange={(x) => setLink(x.target.value)}
                  endAdornment={
                    <Close
                      className={s.close}
                      fontSize="small"
                      onClick={() => setLink(null)}
                    />
                  }
                  placeholder="https://"
                  disableUnderline
                  fullWidth
                  autoFocus
                />
              </form>
            )}
          </div>
        </Grow>
      )}
    </Popper>
  );
}
