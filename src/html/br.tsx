import React from "react"
import { Editor } from "slate"
import { TTagElement } from "./html"
import { TSlatePlugin } from "../pen/plugin"
import { formatVoidToString } from "../pen/util"

export const BR_TAG = "br"

export const createBrPlugin = (): TSlatePlugin => ({
  toHtml: node => {
    if ((node as TTagElement).tag === "br") {
      return formatVoidToString(node.tag, node.attributes)
    }
    return null
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
      return <br {...props.attributes} />
    }
    return null
  },
})

export const insertBr = (editor: Editor) => editor.insertText("\n")
