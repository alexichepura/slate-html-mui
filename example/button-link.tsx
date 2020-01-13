import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import React, { FC } from "react"
import { TLinkFormDialogProps, TTagElement } from "../src"
import { useSlate } from "slate-react"
import { ToolbarButton } from "../src/toolbar-button"
import { Editor, Transforms } from "slate"
import { LINK_TAG } from "../src/link"

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
      <DialogTitle id="link-form-dialog-title">Insert/Edit Button Link</DialogTitle>
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

const DATA_ATTRIBUTE = "data-button"

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
      children={"BtL"}
    />
  )
}
ButtonLinkButton.displayName = "ButtonLinkButton"

const insertButtonLink = (editor: Editor) => {
  const link: TTagElement = {
    tag: LINK_TAG,
    attributes: {
      [DATA_ATTRIBUTE]: "true",
    },
    children: [{ text: "text" }],
  }

  Transforms.setNodes(editor, link)
  return
}

const isElementButtonLink = (tagElement: TTagElement) => {
  return (
    tagElement.tag === LINK_TAG &&
    tagElement.attributes &&
    tagElement.attributes[DATA_ATTRIBUTE] === "true"
  )
}

export const isButtonLinkActive = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => isElementButtonLink(n as TTagElement),
  })

  return !!match
}

export const withButtonLink = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = element => {
    return isElementButtonLink(element as TTagElement) ? false : isInline(element)
  }

  return editor
}
