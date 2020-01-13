import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@material-ui/core"
import React, { FC } from "react"
import { TLinkFormDialogProps } from "../src"

export const CustomLinkFormDialog: FC<TLinkFormDialogProps> = ({
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
          label="Attribute: title"
          value={attributes.title}
          onChange={e => updateAttribute("title", e.target.value)}
          fullWidth
        />
        <TextField
          label="Attribute: href"
          value={attributes.href}
          onChange={e => updateAttribute("href", e.target.value)}
          fullWidth
        />
        <TextField
          label="Attribute: target"
          value={attributes.target}
          onChange={e => updateAttribute("target", e.target.value)}
          select
          fullWidth
        >
          <MenuItem value="">_self (implicit)</MenuItem>
          <MenuItem value="_self">_self (explicit)</MenuItem>
          <MenuItem value="_blank">_blank</MenuItem>
          <MenuItem value="_parent">_parent</MenuItem>
          <MenuItem value="_top">_top</MenuItem>
        </TextField>
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
CustomLinkFormDialog.displayName = "CustomLinkFormDialog"
