import { Value } from "slate"
import { TToolbarButtonProps, ToolbarButton } from "./toolbar-button"
import Link from "@material-ui/icons/Link"
import React, { FC } from "react"
import { useSlateEditor, useSlateEditorValue } from "./editor"
import { Plugin, Editor, getEventTransfer, SlateType } from "slate-react"
import isUrl from "is-url"

const LINK_NODE_TYPE = "a"

export const hasLinks = (value: Value) => {
  return value.inlines.some(inline => Boolean(inline && inline.type === LINK_NODE_TYPE))
}

type TLinkButtonProps = {} & Omit<TToolbarButtonProps, "tooltipTitle">
export const LinkButton: FC<TLinkButtonProps> = ({ ...rest }) => {
  const editor = useSlateEditor()
  const value = useSlateEditorValue()
  const isActive = hasLinks(value)

  return (
    <ToolbarButton
      tooltipTitle="Link"
      color={isActive ? "primary" : "default"}
      variant={isActive ? "contained" : "text"}
      onClick={() => onClickLink(editor)}
      {...rest}
    >
      <Link />
    </ToolbarButton>
  )
}

const onClickLink = (editor: Editor) => {
  const { value } = editor

  if (hasLinks(value)) {
    editor.command(unwrapLink)
  } else if (value.selection.isExpanded) {
    const href = window.prompt("Enter the URL of the link:")

    if (href == null) {
      return
    }

    editor.command(wrapLink, href)
  } else {
    const href = window.prompt("Enter the URL of the link:")

    if (href == null) {
      return
    }

    const text = window.prompt("Enter the text for the link:")

    if (text == null) {
      return
    }

    editor
      .insertText(text)
      .moveFocusBackward(text.length)
      .command(wrapLink, href)
  }
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
        return React.createElement(nodeType, { ...attributes, href }, children)
      } else {
        return next()
      }
    },
    onPaste: (event, editor, next) => {
      if (editor.value.selection.isCollapsed) return next()

      const transfer = (getEventTransfer(event) as any) as {
        type: SlateType
        text: string
      } // TODO should be fixed in types

      const { type, text } = transfer
      if (type !== "text" && type !== "html") return next()
      if (!isUrl(text)) return next()

      if (hasLinks(editor.value)) {
        editor.command(unwrapLink)
      }

      editor.command(wrapLink, text)
    },
  }
  return plugin
}

export const LinkPlugin = CreateLinkPlugin({ nodeType: LINK_NODE_TYPE })

const wrapLink = (editor: Editor, href: string) => {
  editor.wrapInline({
    type: LINK_NODE_TYPE,
    data: { href },
  })

  editor.moveToEnd()
}

const unwrapLink = (editor: Editor) => {
  editor.unwrapInline(LINK_NODE_TYPE)
}
