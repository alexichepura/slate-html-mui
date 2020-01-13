import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import React, { FC } from "react"
import { TLinkFormDialogProps } from "../src"
import { useSlate } from "slate-react"
import { ToolbarButton } from "../src/toolbar-button"
import { Editor, Transforms } from "slate"

export const ButtonLinkFormDialog: FC<TLinkFormDialogProps> = ({
  open,
  text,
  attributes,
  updateText,
  updateAttribute,
  onRemove,
  onClose,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="link-form-dialog-title">
      <DialogTitle id="link-form-dialog-title">Insert/Edit Link</DialogTitle>
      <DialogContent>
        <TextField
          label="Text to display"
          value={text}
          onChange={e => updateText(e.target.value)}
          fullWidth
        />
        <TextField
          label="Attribute: href"
          value={attributes.href}
          onChange={e => updateAttribute("href", e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onRemove} color="secondary">
          Remove link
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ButtonLinkFormDialog.displayName = "ButtonLinkFormDialog"

export const ButtonLinkButton: FC = () => {
  const slate = useSlate()
  const isActive = isButtonLinkActive(slate)
  return (
    <ToolbarButton
      tooltipTitle="Button Link"
      color={isActive ? "primary" : "default"}
      variant={isActive ? "contained" : "text"}
      onMouseDown={event => {
        event.preventDefault()
        insertButtonLink(slate)
      }}
      children={"BL"}
    />
  )
}
ButtonLinkButton.displayName = "ButtonLinkButton"

export const isButtonLinkActive = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => {
      return n.tag === "a" && n.attributes && n.attributes["data-button"]
    },
  })

  return !!match
}

const insertButtonLink = (editor: Editor) => {
  // const isActive = isButtonLinkActive(editor)

  Transforms.setNodes(editor, {
    tag: "a",
    attributes: {
      "data-button": "true",
    },
  })
  return
}
