import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import Link from "@material-ui/icons/Link"
import isUrl from "is-url"
import React, { FC, useState } from "react"
import { Editor, Element as SlateElement, Text, Node, Range, Command } from "slate"
import { useSlate, RenderElementProps } from "slate-react"
import { ToolbarButton, TToolbarButtonProps } from "./toolbar-button"

export const LINK_INLINE_TYPE = "a"
export const SET_LINK_COMMAND = "set_link"

type TLinkAttributes = {
  href?: string
  title?: string
  target?: string
}
type TSetLinkCommand = {
  type: Command["type"]
  attributes: TLinkAttributes
  text: string
}
export type THtmlLinkSlateElement = {
  type: SlateElement["type"]
  children: SlateElement["children"]
  text: Text["text"]
  attributes: TLinkAttributes
}
export type THtmlLinkJsxElement = {
  type: SlateElement["type"]
  attributes: {
    href: string | null
    title: string | null
    target: string | null
  }
}
type TAttributes = Record<string, string | undefined | null>

const isCommand_set_link = (command: Command): command is TSetLinkCommand => {
  return command.type === SET_LINK_COMMAND
}

type TLinkSelection = {
  isExpanded: boolean
  link: THtmlLinkSlateElement | null
  text: string
}
type TLinkButtonState = {
  open: boolean
} & TLinkSelection &
  TLinkAttributes

const defaults: TLinkButtonState = {
  open: false,
  isExpanded: false,
  link: null,
  href: "",
  text: "",
  title: "",
  target: "",
}

const isLinkActive = (editor: Editor) => {
  return !!findLink(editor)
}
const findLink = (editor: Editor): THtmlLinkSlateElement | null => {
  const [linkEntry] = Editor.nodes(editor, { match: { type: LINK_INLINE_TYPE } })
  return linkEntry ? ((linkEntry[0] as unknown) as THtmlLinkSlateElement) : null
}

const getLinkData = (editor: Editor): TLinkAttributes & TLinkSelection => {
  const link = findLink(editor)

  const isExpanded = editor.selection ? Range.isExpanded(editor.selection) : false

  const text =
    editor.selection && isExpanded
      ? Editor.text(editor, editor.selection)
      : (link && Node.text(link)) || ""

  return {
    isExpanded,
    link,
    text,
    href: (link && link.attributes.href) || "",
    title: (link && link.attributes.title) || "",
    target: (link && link.attributes.target) || "",
  }
}

export const isHtmlAnchorElement = (element: SlateElement): element is THtmlLinkSlateElement => {
  return element.type === LINK_INLINE_TYPE
}
const cleanAttributesMutate = (attributes: TAttributes) =>
  Object.keys(attributes).forEach(key => {
    return (attributes[key] === null || attributes[key] === undefined) && delete attributes[key]
  })
export const HtmlAnchorElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  const resultAttributes: TAttributes & TLinkAttributes = {
    ...attributes,
    ...element.attributes,
    target: element.attributes.target || null,
    title: element.attributes.title || null,
  }
  cleanAttributesMutate(resultAttributes)
  return React.createElement(LINK_INLINE_TYPE, resultAttributes, children)
}

type TLinkButtonProps = {} & Omit<TToolbarButtonProps, "tooltipTitle">
export const LinkButton: FC<TLinkButtonProps> = ({ ...rest }) => {
  const editor = useSlate()
  const isActive = isLinkActive(editor)
  const [state, setState] = useState<TLinkButtonState>(defaults)
  const mergeState = (partState: Partial<TLinkButtonState>) => setState({ ...state, ...partState })

  const handleOpen = () => {
    const linkData = getLinkData(editor)
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
  const { exec, isInline } = editor

  editor.isInline = element => {
    return element.type === LINK_INLINE_TYPE ? true : isInline(element)
  }

  editor.exec = command => {
    if (isCommand_set_link(command)) {
      if (editor.selection) {
        wrapLink(editor, command)
      }

      return
    }

    let insertText
    if (command.type === "insert_data") {
      insertText = command.data.getData("text/plain")
    } else if (command.type === "insert_text") {
      insertText = command.text
    }

    if (insertText && isUrl(insertText)) {
      wrapLink(editor, insertText)
    } else {
      exec(command)
    }
  }

  return editor
}

const unwrapLink = (editor: Editor) => {
  Editor.unwrapNodes(editor, { match: { type: LINK_INLINE_TYPE } })
}

const wrapLink = (editor: Editor, command: TSetLinkCommand): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const link: SlateElement = {
    type: LINK_INLINE_TYPE,
    attributes: command.attributes,
    children: [],
  }
  Editor.wrapNodes(editor, link, { split: true })
  Editor.collapse(editor, { edge: "end" })
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
    const attributes = {
      href: state.href,
      title: state.title || null,
      target: state.target || null,
    }
    cleanAttributesMutate(attributes)
    editor.exec({
      type: SET_LINK_COMMAND,
      attributes,
    })
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
          value={state.title}
          onChange={e => mergeState({ title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Attribute: href"
          value={state.href}
          onChange={e => mergeState({ href: e.target.value })}
          fullWidth
        />
        <TextField
          label="Attribute: target"
          value={state.target}
          onChange={e => mergeState({ target: e.target.value })}
          fullWidth
        />
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
