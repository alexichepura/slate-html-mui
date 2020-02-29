import escapeHtml from "escape-html"
import { Editor, Node, Text } from "slate"
import { ReactEditor } from "slate-react"
import { EHtmlBlockTag, EHtmlMarkTag, EHtmlVoidTag } from "./format"
import { LINK_TAG } from "./link"
import { formatTagToString, formatVoidToString, getAttributes } from "./util"

type TPartialNode = Partial<Node>
export type TTagElement = {
  tag: string
  children?: TPartialNode[]
  [key: string]: any
}

export type TToHtml = (element: TPartialNode) => string
export type TFromHtmlElement = (
  element: HTMLElement | ChildNode
) => (TTagElement | TPartialNode | any) | (TTagElement | TPartialNode | any)[]

export type THtmlEditor = ReactEditor & {
  toHtml: TToHtml
  fromHtmlElement: TFromHtmlElement
  fromHtml: (html: string) => (TTagElement | TPartialNode)[]
}

export const toHtmlgetChildren = (editor: THtmlEditor, node: TPartialNode) => {
  const children =
    (Editor.isBlock(editor, node) || Editor.isInline(editor, node)) && node.children
      ? node.children.map(n => editor.toHtml(n)).join("")
      : ""
  return children
}
export const createToHtml = (editor: THtmlEditor): TToHtml => {
  return function toHtml(node): string {
    if (Text.isText(node)) {
      const markTag = Object.entries(node).find(([k, v]) => k in EHtmlMarkTag && v === true)
      let text
      if (markTag && markTag[0]) {
        text = formatTagToString(markTag[0], null, escapeHtml(node.text))
      } else {
        text = escapeHtml(node.text)
      }
      return text.split("\n").join("<br/>")
    }

    if (Array.isArray(node)) {
      return node.map(n => editor.toHtml(n)).join("")
    }

    if (node.tag in EHtmlBlockTag) {
      const children = toHtmlgetChildren(editor, node)
      return formatTagToString(node.tag, null, children)
    }

    if (node.tag in EHtmlVoidTag) {
      return formatVoidToString(node.tag, null)
    }

    const children = toHtmlgetChildren(editor, node)
    return children
  }
}

export const fromHtmlChildNodes = (
  editor: THtmlEditor,
  nodes: NodeListOf<ChildNode> | HTMLCollection
) => {
  return Array.from(nodes)
    .map(editor.fromHtmlElement)
    .flat()
}

export const createFromHtml = (editor: THtmlEditor): TFromHtmlElement => {
  return function fromHtml(element) {
    const el: Element = element as Element

    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return fromHtmlChildNodes(editor, firstElementChild.childNodes)
      }
      return fromHtmlChildNodes(editor, el.children)
    }

    if (el.nodeType === 3) {
      const text = el.textContent || ""
      return { text }
    }
    if (el.nodeType !== 1) return null

    const tag = el.nodeName.toLowerCase()

    if (tag === EHtmlVoidTag.br) {
      return { text: "\n" }
    }

    const children = fromHtmlChildNodes(editor, el.childNodes)
    const attributes = getAttributes(el)

    if (tag in EHtmlBlockTag || tag === LINK_TAG) {
      if (children.length === 0) {
        children.push({ text: "" } as Text)
      }
      return { tag, attributes, children }
    }

    if (tag in EHtmlMarkTag) {
      return children.map(child => {
        const text = typeof child === "string" ? child : child.text
        return { [tag]: true, attributes, text }
      })
    }

    if (tag in EHtmlVoidTag) {
      return {
        tag,
        attributes,
        children: [{ text: "" }],
      }
    }

    return children
  }
}
