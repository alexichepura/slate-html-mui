import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import React, { FC } from "react"
import { TImgFormDialogProps } from "../src/html/img"

export const CustomImgFormDialog: FC<TImgFormDialogProps> = ({
  open,
  attributes,
  updateAttribute,
  onClose,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="img-form-dialog-title">
      <DialogTitle id="img-form-dialog-title">Insert/Edit Custom Img</DialogTitle>
      <DialogContent>
        <TextField
          label="Attribute: src"
          value={attributes.src || ""}
          onChange={e => updateAttribute("src", e.target.value)}
          fullWidth
        />
        <TextField
          label="Attribute: alt"
          value={attributes.alt || ""}
          onChange={e => updateAttribute("alt", e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
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
CustomImgFormDialog.displayName = "CustomImgFormDialog"
