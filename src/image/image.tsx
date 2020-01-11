import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import Image from "@material-ui/icons/Image"
import React, { FC, useState, ImgHTMLAttributes } from "react"
import { Editor, Element as SlateElement, Text, Node, Range, Path, Transforms } from "slate"
import { useSlate, RenderElementProps } from "slate-react"
import { ToolbarButton, TToolbarButtonProps } from "../toolbar-button"
import { TTagElement } from "../html"

export const IMG_TAG = "img"

type TSetImageCommand = {
  attributes: ImgHTMLAttributes<any>
  range: Range
}
export type THtmlImageSlateElement = TTagElement & {
  attributes: ImgHTMLAttributes<any>
}

type TImageButtonState = {
  open: boolean
  range: Range | null
  attributes: ImgHTMLAttributes<any>
}

type TImageButtonStateInitial = Omit<TImageButtonState, "open">

const defaults: TImageButtonState = {
  open: false,
  range: null,
  attributes: {},
}

const match = (node: Node): boolean => {
  return (node as TTagElement).tag === IMG_TAG
}

const isImageActive = (editor: Editor) => {
  return !!findImage(editor)
}
const findImageEntry = (editor: Editor): [THtmlImageSlateElement, Path] => {
  const [imageEntry] = Editor.nodes(editor, { match })
  return imageEntry as [THtmlImageSlateElement, Path]
}
const findImage = (editor: Editor): THtmlImageSlateElement | null => {
  const imageEntry = findImageEntry(editor)
  return imageEntry ? imageEntry[0] : null
}

const getInitialImageData = (editor: Editor): TImageButtonStateInitial => {
  const image = findImage(editor)
  return {
    range: editor.selection ? { ...editor.selection } : null,
    attributes: image ? image.attributes : {},
  }
}

export const isHtmlImageElement = (
  element: SlateElement | TTagElement | Text
): element is THtmlImageSlateElement => {
  return element.tag === IMG_TAG
}
const cleanAttributesMutate = (attributes: ImgHTMLAttributes<any>) =>
  Object.entries(attributes).forEach(([key, value]) => {
    return (value === null || value === undefined) && delete (attributes as any)[key]
  })
export const HtmlImageElement: FC<RenderElementProps> = ({ attributes, element }) => {
  const resultAttributes: ImgHTMLAttributes<any> = {
    ...attributes,
    ...element.attributes,
  }
  cleanAttributesMutate(resultAttributes)
  return React.createElement(IMG_TAG, resultAttributes)
}
HtmlImageElement.displayName = "HtmlImageElement"

type TImageButtonProps = {} & Omit<TToolbarButtonProps, "tooltipTitle">
export const ImageButton: FC<TImageButtonProps> = ({ ...rest }) => {
  const editor = useSlate()
  const isActive = isImageActive(editor)
  const [state, setState] = useState<TImageButtonState>(defaults)
  const mergeState = (partState: Partial<TImageButtonState>) => setState({ ...state, ...partState })

  const handleOpen = () => {
    mergeState({ open: true, ...getInitialImageData(editor) })
  }

  const onOk = () => {
    const { attributes } = state
    cleanAttributesMutate(attributes)
    if (!state.range) {
      throw new Error("Invalid range. Must be typeof Range.")
    }
    const command: TSetImageCommand = { attributes, range: state.range }
    insertImage(editor, command)
    mergeState({ open: false })
  }

  return (
    <>
      <ToolbarButton
        tooltipTitle="Image"
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={handleOpen}
        {...rest}
      >
        <Image />
      </ToolbarButton>
      <ImageFormDialog
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
ImageButton.displayName = "ImageButton"

const isImageTag = (element: TTagElement) => {
  return element.tag === IMG_TAG
}

export const withImage = (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return isImageTag(element as TTagElement) || isVoid(element)
  }

  return editor
}

const insertImage = (editor: Editor, command: TSetImageCommand) => {
  const { attributes, range } = command
  const image: TTagElement = {
    tag: IMG_TAG,
    attributes,
    children: [{ text: "" }],
  }
  Transforms.insertNodes(editor, image as SlateElement, { at: range })
}

type TImageFormDialogProps = {
  attributes: ImgHTMLAttributes<any>
  open: boolean
  updateAttribute: (name: keyof ImgHTMLAttributes<any>, value: string) => void
  onClose: () => void
  onOk: () => void
}
export const ImageFormDialog: FC<TImageFormDialogProps> = ({
  open,
  attributes,
  updateAttribute,
  onClose,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="image-form-dialog-title">
      <DialogTitle id="image-form-dialog-title">Insert/Edit Image</DialogTitle>
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
ImageFormDialog.displayName = "ImageFormDialog"
