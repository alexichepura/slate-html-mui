import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@material-ui/core"
import Link from "@material-ui/icons/Link"
import isUrl from "is-url"
import React, { FC, useState, AnchorHTMLAttributes } from "react"
import { Editor, Element as SlateElement, Text, Node, Range, Path, Transforms } from "slate"
import { useSlate, RenderElementProps } from "slate-react"
import { ToolbarButton, TToolbarButtonProps } from "./toolbar-button"
import { TTagElement } from "./html"

export const LINK_TAG = "a"
export const SET_LINK_COMMAND = "set_link"

type TSetLinkCommand = {
  attributes: AnchorHTMLAttributes<any>
  text: string
  range: Range
}
export type THtmlLinkSlateElement = TTagElement & {
  text: Text["text"]
  attributes: AnchorHTMLAttributes<any>
}

type TLinkSelection = {
  range: Range | null
  isExpanded: boolean
  link: THtmlLinkSlateElement | null
  text: string
}
type TLinkButtonState = {
  open: boolean
  attributes: AnchorHTMLAttributes<any>
} & TLinkSelection

type TLinkButtonStateInitial = Omit<TLinkButtonState, "open">

const defaults: TLinkButtonState = {
  open: false,
  range: null,
  isExpanded: false,
  link: null,
  text: "",
  attributes: {},
}

const match = (node: Node): boolean => (node as TTagElement).tag === LINK_TAG

const isLinkActive = (editor: Editor) => {
  return !!findLink(editor)
}
const findLinkEntry = (editor: Editor): [THtmlLinkSlateElement, Path] => {
  const [linkEntry] = Editor.nodes(editor, { match })
  return linkEntry as [THtmlLinkSlateElement, Path]
}
const findLink = (editor: Editor): THtmlLinkSlateElement | null => {
  const linkEntry = findLinkEntry(editor)
  return linkEntry ? linkEntry[0] : null
}

const getInitialLinkData = (editor: Editor): TLinkButtonStateInitial => {
  const link = findLink(editor)

  const isExpanded = editor.selection ? Range.isExpanded(editor.selection) : false

  const text =
    editor.selection && isExpanded
      ? Editor.string(editor, editor.selection)
      : (link && Node.string(link)) || ""

  return {
    isExpanded,
    link,
    text,
    range: editor.selection ? { ...editor.selection } : null,
    attributes: {
      href: (link && link.attributes.href) || "",
      title: (link && link.attributes.title) || "",
      target: (link && link.attributes.target) || "",
    },
  }
}

export const isHtmlAnchorElement = (
  element: SlateElement | TTagElement | Text
): element is THtmlLinkSlateElement => {
  return element.tag === LINK_TAG
}
const cleanAttributesMutate = (attributes: AnchorHTMLAttributes<any>) =>
  Object.entries(attributes).forEach(([key, value]) => {
    return (value === null || value === undefined) && delete (attributes as any)[key]
  })
export const HtmlAnchorElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  const resultAttributes: AnchorHTMLAttributes<any> = {
    ...attributes,
    ...element.attributes,
    target: element.attributes.target || null,
    title: element.attributes.title || null,
  }
  cleanAttributesMutate(resultAttributes)
  return React.createElement(LINK_TAG, resultAttributes, children)
}

type TLinkButtonProps = {} & Omit<TToolbarButtonProps, "tooltipTitle">
export const LinkButton: FC<TLinkButtonProps> = ({ ...rest }) => {
  const editor = useSlate()
  const isActive = isLinkActive(editor)
  const [state, setState] = useState<TLinkButtonState>(defaults)
  const mergeState = (partState: Partial<TLinkButtonState>) => setState({ ...state, ...partState })

  const handleOpen = () => {
    const linkData = getInitialLinkData(editor)
    mergeState({ open: true, ...linkData })
  }

  return (
    <>
      <ToolbarButton
        tooltipTitle="Link"
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={handleOpen}
        {...rest}
      >
        <Link />
      </ToolbarButton>
      <LinkFormDialog state={state} mergeState={mergeState} />
    </>
  )
}

export const withLink = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = element => {
    return (element as TTagElement).tag === LINK_TAG ? true : isInline(element)
  }

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, { attributes: { href: text }, range: editor.range, text })
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain")

    if (text && isUrl(text)) {
      wrapLink(editor, { attributes: { href: text }, range: editor.range, text })
    } else {
      insertData(data)
    }
  }

  return editor
}

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match })
}

const wrapLink = (editor: Editor, command: TSetLinkCommand): void => {
  const { range, attributes, text } = command
  const foundLinkEntry = findLinkEntry(editor)
  Transforms.setSelection(editor, range)
  const isCollapsed = range && Range.isCollapsed(range)

  const link: TTagElement = {
    tag: LINK_TAG,
    attributes,
    children: [{ text }],
  }

  if (!foundLinkEntry && isCollapsed) {
    Transforms.insertNodes(editor, [link as SlateElement], { at: range })
  } else {
    if (isCollapsed) {
      const path = foundLinkEntry[1]
      Transforms.setNodes(editor, link, { at: path, split: true })
    } else {
      Transforms.wrapNodes(editor, link as SlateElement, { at: range, split: true })
    }
    Transforms.collapse(editor, { edge: "end" })
  }
}

type TLinkFormDialogProps = {
  state: TLinkButtonState
  mergeState(state: Partial<TLinkButtonState>): void
}
export const LinkFormDialog: FC<TLinkFormDialogProps> = ({ state, mergeState }) => {
  const editor = useSlate()

  const handleClose = () => {
    mergeState(defaults)
  }

  const handleOk = () => {
    cleanAttributesMutate(state.attributes)

    if (!state.range) {
      throw new Error("Invalid range. Must be typeof Range.")
    }
    const command: TSetLinkCommand = {
      attributes: state.attributes,
      range: state.range,
      text: state.text,
    }
    wrapLink(editor, command)
    handleClose()
  }

  const handleRemove = () => {
    unwrapLink(editor)
    handleClose()
  }
  return (
    <Dialog open={state.open} onClose={handleClose} aria-labelledby="link-form-dialog-title">
      <DialogTitle id="link-form-dialog-title">Insert/Edit Link</DialogTitle>
      <DialogContent>
        <TextField
          label="Text to display"
          value={state.text}
          onChange={e => mergeState({ text: e.target.value })}
          fullWidth
        />
        <TextField
          label="Attribute: title"
          value={state.attributes.title}
          onChange={e => mergeState({ attributes: { ...state.attributes, title: e.target.value } })}
          fullWidth
        />
        <TextField
          label="Attribute: href"
          value={state.attributes.href}
          onChange={e => mergeState({ attributes: { ...state.attributes, href: e.target.value } })}
          fullWidth
        />
        <TextField
          label="Attribute: target"
          value={state.attributes.target}
          onChange={e =>
            mergeState({ attributes: { ...state.attributes, target: e.target.value } })
          }
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
        <Button onClick={handleRemove} color="secondary">
          Remove link
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
