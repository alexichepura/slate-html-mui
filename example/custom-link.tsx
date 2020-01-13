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
          label="Attribute: href"
          value={attributes.href}
          onChange={e => updateAttribute("href", e.target.value)}
          fullWidth
        />
        <TextField
          label="Is button"
          value={attributes["data-button"] || ""}
          onChange={e => updateAttribute("data-button", e.target.value)}
          select
          fullWidth
        >
          <MenuItem value="">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
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
