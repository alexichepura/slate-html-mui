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
import { Editor, Node, NodeEntry, Range } from "slate"
import { Element as SlateElement } from "slate"
import { useSlate } from "slate-react"
import { ToolbarButton, TToolbarButtonProps } from "./toolbar-button"

export const LINK_INLINE_TYPE = "a"

type TLinkAttributes = {
  href: string
  title: string
  target: string
}
type TLinkSelection = {
  isExpanded: boolean
  link: Node | null
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
  const link = findLink(editor)
  return !!link
}
const findLink = (editor: Editor): NodeEntry => {
  const [link] = Array.from(Editor.nodes(editor, { match: { type: LINK_INLINE_TYPE } }))
  return link
}

const getLinkData = (editor: Editor): TLinkAttributes & TLinkSelection => {
  const { value } = editor
  const [link] = findLink(value)
  const isExpanded = editor.selection ? Range.isExpanded(editor.selection) : false
  const text = isExpanded ? value.fragment.text : link ? link.text : ""
  console.log(link)
  return {
    isExpanded,
    link,
    text,
    href: link ? link.data.get("title") : "",
    title: link ? link.data.get("title") : "",
    target: link ? link.data.get("target") : "",
  }
}

type TLinkButtonProps = {} & Omit<TToolbarButtonProps, "tooltipTitle">
export const LinkButton: FC<TLinkButtonProps> = ({ ...rest }) => {
  const editor = useSlate()
  const isActive = isLinkActive(editor)
  const [state, setState] = useState<TLinkButtonState>(defaults)
  const mergeState = (partState: Partial<TLinkButtonState>) => setState({ ...state, ...partState })

  const handleOpen = () => {
    const linkData = getLinkData(editor.value)
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

export const withLinks = (editor: Editor) => {
  const { exec, isInline } = editor

  editor.isInline = element => {
    return element.type === LINK_INLINE_TYPE ? true : isInline(element)
  }

  editor.exec = command => {
    if (command.type === "insert_link") {
      const { url } = command

      if (editor.selection) {
        wrapLink(editor, url)
      }

      return
    }

    let text

    if (command.type === "insert_data") {
      text = command.data.getData("text/plain")
    } else if (command.type === "insert_text") {
      text = command.text
    }

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      exec(command)
    }
  }

  return editor
}

const unwrapLink = (editor: Editor) => {
  Editor.unwrapNodes(editor, { match: { type: LINK_INLINE_TYPE } })
}

const wrapLink = (editor: Editor, attributes: TLinkAttributes) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const link: SlateElement = { type: LINK_INLINE_TYPE, attributes, children: [] }
  Editor.wrapNodes(editor, link, { split: true })
  Editor.collapse(editor, { edge: "end" })
}

type TLinkFormDialogProps = {
  state: TLinkButtonState
  mergeState(state: Partial<TLinkButtonState>): void
}
export const LinkFormDialog: FC<TLinkFormDialogProps> = ({ state, mergeState }) => {
  const editor = useSlate()

  const wrap = () =>
    wrapLink(editor, { href: state.href, title: state.title, target: state.target })

  const handleClose = () => {
    mergeState(defaults)
  }

  const handleOk = () => {
    if (state.link) {
      unwrapLink(editor)
    }
    if (!state.isExpanded) {
      editor.insertText(state.text).moveFocusBackward(state.text.length)
    }
    wrap()
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
          autoFocus
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
