import React, { createElement, FC } from "react"
import { isTagBlockActive } from "../format"
import { TTagElement } from "../html"
import { TSlatePlugin } from "../plugin"
import { formatVoidToString } from "../util"
import { RenderElementProps } from "slate-react"

export const BR_TAG = "br"

export const createBrPlugin = (): TSlatePlugin => ({
  toHtml: node => {
    if ((node as TTagElement).tag === "br") {
      return formatVoidToString(node.tag, node.attributes)
    }
    return ""
  },
  fromHtmlElement: el => {
    const tag = el.nodeName.toLowerCase()
    if (tag === BR_TAG) {
      return { text: "\n" }
    }
    return null
  },
  extendEditor: editor => {
    const { isVoid } = editor
    editor.isVoid = element => {
      return (element as TTagElement).tag === BR_TAG ? true : isVoid(element)
    }
  },
  RenderElement: props => {
    const element = props.element as TTagElement
    if ((element as TTagElement).tag === "br") {
      return <HtmlVoidElement {...props} />
    }
    return null
  },
  isActive: editor => isTagBlockActive(editor, BR_TAG),
})

const HtmlVoidElement: FC<RenderElementProps> = ({ attributes, element }) => {
  return createElement((element as TTagElement).tag, attributes)
}
HtmlVoidElement.displayName = "HtmlVoidElement"
