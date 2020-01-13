import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import React, { FC } from "react"
import { TPictureFormDialogProps } from "../src/image/picture"

export const CustomPictureFormDialog: FC<TPictureFormDialogProps> = ({
  open,
  attributes,
  updateAttribute,
  onClose,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="picture-form-dialog-title">
      <DialogTitle id="picture-form-dialog-title">Insert/Edit Custom Picture</DialogTitle>
      <DialogContent>
        <TextField
          label="Attribute: title"
          value={attributes.title || ""}
          onChange={e => updateAttribute("title", e.target.value)}
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
CustomPictureFormDialog.displayName = "CustomPictureFormDialog"
