import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import Image from "@material-ui/icons/Image"
import React, { FC, ImgHTMLAttributes, useState } from "react"
import { Editor, Node, Path, Range, Text } from "slate"
import {
  formatVoidToString,
  getAttributes,
  insertBlock,
  isSlateTypeElement,
  TSlatePlugin,
  TSlateTypeElement,
} from "slate-pen"
import { RenderElementProps, useFocused, useSelected, useSlate } from "slate-react"
import { ToolbarButton, TToolbarButtonProps } from "./toolbar-button"

export const IMG_TAG = "img"

type TSetImgCommand = {
  attributes: ImgHTMLAttributes<any>
  range: Range
}
export type THtmlImgSlateElement = TSlateTypeElement & {
  attributes: ImgHTMLAttributes<any>
}

type TImgButtonState = {
  open: boolean
  range: Range | null
  attributes: ImgHTMLAttributes<any>
}

type TImgButtonStateInitial = Omit<TImgButtonState, "open">

const defaults: TImgButtonState = {
  open: false,
  range: null,
  attributes: {},
}

const match = (node: Node): boolean => {
  return (node as TSlateTypeElement).type === IMG_TAG
}

const isImgActive = (editor: Editor) => {
  return !!findImg(editor)
}
const findImgEntry = (editor: Editor): [THtmlImgSlateElement, Path] => {
  const [imgEntry] = Editor.nodes(editor, { match })
  return imgEntry as [THtmlImgSlateElement, Path]
}
const findImg = (editor: Editor): THtmlImgSlateElement | null => {
  const imgEntry = findImgEntry(editor)
  return imgEntry ? imgEntry[0] : null
}

const getInitialImgData = (editor: Editor): TImgButtonStateInitial => {
  const img = findImg(editor)
  return {
    range: editor.selection ? { ...editor.selection } : null,
    attributes: img ? img.attributes : {},
  }
}

export const isHtmlImgElement = (element: any): element is THtmlImgSlateElement => {
  return isSlateTypeElement(element) && element.type === IMG_TAG
}

const cleanAttributesMutate = (attributes: ImgHTMLAttributes<any>) =>
  Object.entries(attributes).forEach(([key, value]) => {
    return (value === null || value === undefined) && delete (attributes as any)[key]
  })
export const HtmlImgElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  const style = {
    display: "inline-block",
    fontSize: 0,
    boxShadow: `${selected && focused ? "0 0 0 3px #B4D5FF" : "none"}`,
  }
  return (
    <span {...attributes}>
      <span contentEditable={false} style={style}>
        <img {...(element.attributes as ImgHTMLAttributes<any>)} />
      </span>
      {children}
    </span>
  )
}
HtmlImgElement.displayName = "HtmlImgElement"

type TImgButtonProps = {
  ImgFormDialog?: FC<TImgFormDialogProps>
} & Omit<TToolbarButtonProps, "tooltipTitle">
export const ImgButton: FC<TImgButtonProps> = ({ ImgFormDialog: _ImgFormDialog, ...rest }) => {
  const editor = useSlate()
  const isActive = isImgActive(editor)
  const [state, setState] = useState<TImgButtonState>(defaults)
  const mergeState = (partState: Partial<TImgButtonState>) => setState({ ...state, ...partState })

  const handleOpen = () => {
    mergeState({ open: true, ...getInitialImgData(editor) })
  }

  const onOk = () => {
    const { attributes } = state
    cleanAttributesMutate(attributes)
    if (!state.range) {
      throw new Error("Invalid range. Must be typeof Range.")
    }
    const command: TSetImgCommand = { attributes, range: state.range }
    setImg(editor, command)
    mergeState({ open: false })
  }

  const ImgFormDialogComponent = _ImgFormDialog || ImgFormDialog
  return (
    <>
      <ToolbarButton
        tooltipTitle="Img"
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={handleOpen}
        {...rest}
      >
        <Image />
      </ToolbarButton>
      <ImgFormDialogComponent
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
ImgButton.displayName = "ImgButton"

const isImgTag = (element: TSlateTypeElement) => {
  return element.type === IMG_TAG
}

const setImg = (editor: Editor, command: TSetImgCommand) => {
  const { attributes, range } = command
  const img: THtmlImgSlateElement = {
    type: IMG_TAG,
    attributes,
    children: [{ text: "" }],
  }
  insertBlock(editor, img, range)
}

export type TImgFormDialogProps = {
  attributes: ImgHTMLAttributes<any>
  open: boolean
  updateAttribute: (name: keyof ImgHTMLAttributes<any>, value: string) => void
  onClose: () => void
  onOk: () => void
}
export const ImgFormDialog: FC<TImgFormDialogProps> = ({
  open,
  attributes,
  updateAttribute,
  onClose,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="img-form-dialog-title">
      <DialogTitle id="img-form-dialog-title">Insert/Edit Img</DialogTitle>
      <DialogContent>
        <TextField
          label="Attribute: src"
          value={attributes.src || ""}
          onChange={(e) => updateAttribute("src", e.target.value)}
          fullWidth
        />
        <TextField
          label="Attribute: alt"
          value={attributes.alt || ""}
          onChange={(e) => updateAttribute("alt", e.target.value)}
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
ImgFormDialog.displayName = "ImgFormDialog"

export const createImgPlugin = (): TSlatePlugin => ({
  toHtml: (slateElement) => {
    if (isHtmlImgElement(slateElement)) {
      return formatVoidToString(slateElement.type, slateElement.attributes)
    }
    return ""
  },
  fromHtmlElement: (el) => {
    const tag = el.nodeName.toLowerCase()
    if (tag === IMG_TAG) {
      const attributes = getAttributes(el as Element)
      const children: any[] = [{ text: "" } as Text]
      return { type: tag, attributes, children } as THtmlImgSlateElement
    }
    return null
  },
  extendEditor: (editor) => {
    const { isVoid } = editor
    editor.isVoid = (element) => {
      return isImgTag(element as TSlateTypeElement) ? true : isVoid(element)
    }
  },
  RenderElement: (props) => {
    if (isHtmlImgElement(props.element)) {
      return <HtmlImgElement {...props} />
    }
    return null
  },
})
