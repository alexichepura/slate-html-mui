import { Value, Inline } from "slate"
import { TToolbarButtonProps, ToolbarButton } from "./toolbar-button"
import Link from "@material-ui/icons/Link"
import React, { FC, useState } from "react"
import { useSlateEditor, useSlateEditorValue } from "./editor"
import { Plugin, Editor, getEventTransfer, SlateType } from "slate-react"
import isUrl from "is-url"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core"

export const LINK_INLINE_TYPE = "a"

const hasLinks = (value: Value) => {
  return value.inlines.some(inline => Boolean(inline && inline.type === LINK_INLINE_TYPE))
}
const findLink = (value: Value): Inline | null =>
  value.inlines.find(inline => Boolean(inline && inline.type === LINK_INLINE_TYPE))

const getLinkData = (value: Value): TLinkData & { text: string } => {
  const link = findLink(value)
  const text = value.selection.isExpanded ? value.fragment.text : link ? link.text : ""
  return {
    href: link ? link.data.get("href") : "",
    title: link ? link.data.get("title") : "",
    target: link ? link.data.get("target") : "",
    text,
  }
}

type TLinkData = {
  href: string
  title: string
  target: string
}
type TLinkButtonState = {
  open: boolean
  text: string
} & TLinkData
const defaults: TLinkButtonState = {
  open: false,
  href: "",
  text: "",
  title: "",
  target: "",
}

type TLinkButtonProps = {} & Omit<TToolbarButtonProps, "tooltipTitle">
export const LinkButton: FC<TLinkButtonProps> = ({ ...rest }) => {
  const value = useSlateEditorValue()
  const isActive = hasLinks(value)
  const [state, setState] = useState<TLinkButtonState>(defaults)
  const mergeState = (partState: Partial<TLinkButtonState>) => setState({ ...state, ...partState })

  const handleOpen = () => {
    const linkData = getLinkData(value)
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

type TLinkPluginOptions = {
  nodeType: string
}
export const CreateLinkPlugin = (options: TLinkPluginOptions): Plugin => {
  const { nodeType } = options
  const plugin: Plugin = {
    renderInline: (props, _editor, next) => {
      const { attributes, children, node } = props
      if (node.type === options.nodeType) {
        const { data } = node
        const href = data.get("href")
        const target = data.get("target")
        const title = data.get("title")
        return React.createElement(
          nodeType,
          { ...attributes, href, target: target || undefined, title: title || undefined },
          children
        )
      } else {
        return next()
      }
    },
    onPaste: (event, editor, next) => {
      if (editor.value.selection.isCollapsed) return next()

      const transfer = (getEventTransfer(event) as any) as {
        // TODO should be fixed in types
        type: SlateType
        text: string
      }

      const { type, text } = transfer
      if (type !== "text" && type !== "html") return next()
      if (!isUrl(text)) return next()

      if (hasLinks(editor.value)) {
        editor.command(unwrapLink)
      }

      editor.command(wrapLink, { href: text })
    },
  }
  return plugin
}

export const LinkPlugin = CreateLinkPlugin({ nodeType: LINK_INLINE_TYPE })

const wrapLink = (editor: Editor, data: TLinkData) => {
  editor.wrapInline({
    type: LINK_INLINE_TYPE,
    data,
  })
  editor.moveToEnd()
}

const unwrapLink = (editor: Editor) => {
  editor.unwrapInline(LINK_INLINE_TYPE)
}

type TLinkFormDialogProps = {
  state: TLinkButtonState
  mergeState(state: Partial<TLinkButtonState>): void
}
export const LinkFormDialog: FC<TLinkFormDialogProps> = ({ state, mergeState }) => {
  const editor = useSlateEditor()

  const handleClose = () => {
    mergeState(defaults)
  }

  const handleOk = () => {
    editor
      .insertText(state.text)
      .moveFocusBackward(state.text.length)
      .command(wrapLink, { href: state.href, title: state.title, target: state.target })
    handleClose()
  }

  const handleRemove = () => {
    editor.command(unwrapLink)
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
