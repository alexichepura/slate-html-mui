import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import PhotoLibrary from "@material-ui/icons/PhotoLibrary"
import React, { CSSProperties, FC, HTMLAttributes, useState } from "react"
import { Editor, Element as SlateElement, Node, Path, Range, Text, Transforms } from "slate"
import { RenderElementProps, useFocused, useSelected, useSlate } from "slate-react"
import { TTagElement } from "../html"
import { ToolbarButton, TToolbarButtonProps } from "../toolbar-button"

export const PICTURE_TAG = "picture"

type TSetPictureCommand = {
  attributes: HTMLAttributes<any>
  range: Range
}
export type THtmlPictureSlateElement = TTagElement & {
  attributes: HTMLAttributes<any>
}

type TPictureButtonState = {
  open: boolean
  range: Range | null
  attributes: HTMLAttributes<any>
}

type TPictureButtonStateInitial = Omit<TPictureButtonState, "open">

const defaults: TPictureButtonState = {
  open: false,
  range: null,
  attributes: {},
}

const match = (node: Node): boolean => {
  return (node as TTagElement).tag === PICTURE_TAG
}

const isPictureActive = (editor: Editor) => {
  return !!findPicture(editor)
}
const findPictureEntry = (editor: Editor): [THtmlPictureSlateElement, Path] => {
  const [pictureEntry] = Editor.nodes(editor, { match })
  return pictureEntry as [THtmlPictureSlateElement, Path]
}
const findPicture = (editor: Editor): THtmlPictureSlateElement | null => {
  const pictureEntry = findPictureEntry(editor)
  return pictureEntry ? pictureEntry[0] : null
}

const getInitialPictureData = (editor: Editor): TPictureButtonStateInitial => {
  const picture = findPicture(editor)
  return {
    range: editor.selection ? { ...editor.selection } : null,
    attributes: picture ? picture.attributes : {},
  }
}

export const isHtmlPictureElement = (
  element: SlateElement | TTagElement | Text
): element is THtmlPictureSlateElement => {
  return element.tag === PICTURE_TAG
}
const cleanAttributesMutate = (attributes: HTMLAttributes<any>) =>
  Object.entries(attributes).forEach(([key, value]) => {
    return (value === null || value === undefined) && delete (attributes as any)[key]
  })
export const HtmlPictureElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  const style: CSSProperties = {
    display: "inline-block",
    fontSize: 0,
    boxShadow: `${selected && focused ? "0 0 0 3px #B4D5FF" : "none"}`,
  }
  return (
    <span {...attributes}>
      <span contentEditable={false} style={style}>
        <picture {...element.attributes}>
          <img />
        </picture>
      </span>
      {children}
    </span>
  )
}
HtmlPictureElement.displayName = "HtmlPictureElement"

type TPictureButtonProps = {
  PictureFormDialog?: FC<TPictureFormDialogProps>
} & Omit<TToolbarButtonProps, "tooltipTitle">
export const PictureButton: FC<TPictureButtonProps> = ({
  PictureFormDialog: _PictureFormDialog,
  ...rest
}) => {
  const editor = useSlate()
  const isActive = isPictureActive(editor)
  const [state, setState] = useState<TPictureButtonState>(defaults)
  const mergeState = (partState: Partial<TPictureButtonState>) =>
    setState({ ...state, ...partState })

  const handleOpen = () => {
    mergeState({ open: true, ...getInitialPictureData(editor) })
  }

  const onOk = () => {
    const { attributes } = state
    cleanAttributesMutate(attributes)
    if (!state.range) {
      throw new Error("Invalid range. Must be typeof Range.")
    }
    const command: TSetPictureCommand = { attributes, range: state.range }
    insertPicture(editor, command)
    mergeState({ open: false })
  }

  const PictureFormDialogComponent = _PictureFormDialog || PictureFormDialog
  return (
    <>
      <ToolbarButton
        tooltipTitle="Picture"
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={handleOpen}
        {...rest}
      >
        <PhotoLibrary />
      </ToolbarButton>
      <PictureFormDialogComponent
        open={state.open}
        attributes={state.attributes}
        onOk={onOk}
        updateAttribute={(name, value) =>
          mergeState({ attributes: { ...state.attributes, [name]: value } })
        }
        onClose={() => mergeState({ open: false })}
      />
    </>
  )
}
PictureButton.displayName = "PictureButton"

const isPictureTag = (element: TTagElement) => {
  return element.tag === PICTURE_TAG
}

export const withPicture = (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return isPictureTag(element as TTagElement) ? true : isVoid(element)
  }

  return editor
}

const insertPicture = (editor: Editor, command: TSetPictureCommand) => {
  const { attributes, range } = command
  const picture: TTagElement = {
    tag: PICTURE_TAG,
    attributes,
    children: [{ text: "" }],
  }
  Transforms.insertNodes(editor, picture as SlateElement, { at: range })
}

export type TPictureFormDialogProps = {
  attributes: HTMLAttributes<any>
  open: boolean
  updateAttribute: (name: keyof HTMLAttributes<any>, value: string) => void
  onClose: () => void
  onOk: () => void
}
export const PictureFormDialog: FC<TPictureFormDialogProps> = ({
  open,
  attributes,
  updateAttribute,
  onClose,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="picture-form-dialog-title">
      <DialogTitle id="picture-form-dialog-title">Insert/Edit Picture</DialogTitle>
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
PictureFormDialog.displayName = "PictureFormDialog"
