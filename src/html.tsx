import escapeHtml from "escape-html"
import { Node, Text } from "slate"
import { ReactEditor } from "slate-react"
import { EHtmlBlockTag, EHtmlMarkTag, EHtmlVoidTag } from "./format"
import { LINK_TAG } from "./link"
import { formatTagToString, formatVoidToString, getAttributes } from "./util"
import { SlatePluginator } from "./pluginator"

export type TPartialNode = Partial<Node>
export type TTagElement = {
  tag: string
  children?: TPartialNode[]
  [key: string]: any
}

export type TToHtml = (element: TPartialNode, pluginator: SlatePluginator) => string
export type TFromHtml = (html: string) => (TTagElement | TPartialNode)[]
export type TFromHtmlElement = (
  element: HTMLElement | ChildNode,
  pluginator: SlatePluginator
) => (TTagElement | TPartialNode | any) | (TTagElement | TPartialNode | any)[]

export type THtmlEditor = ReactEditor & {
  html: SlatePluginator
}

export const createToHtml = (pluginator: SlatePluginator): TToHtml => {
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
      return node.map(n => pluginator.toHtml(n)).join("")
    }

    if (node.tag in EHtmlBlockTag) {
      const children = pluginator.toHtmlgetChildren(node)
      return formatTagToString(node.tag, null, children)
    }

    if (node.tag in EHtmlVoidTag) {
      return formatVoidToString(node.tag, null)
    }

    const children = pluginator.toHtmlgetChildren(node)
    return children
  }
}

export const createFromHtml = (pluginator: SlatePluginator): TFromHtmlElement => {
  return function fromHtml(element) {
    const el: Element = element as Element

    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return pluginator.fromHtmlChildNodes(firstElementChild.childNodes)
      }
      return pluginator.fromHtmlChildNodes(el.children)
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

    if (tag in EHtmlBlockTag || tag === LINK_TAG) {
      const children = pluginator.fromHtmlChildNodes(el.childNodes)
      const attributes = getAttributes(el)
      if (children.length === 0) {
        children.push({ text: "" } as Text)
      }
      return { tag, attributes, children }
    }

    if (tag in EHtmlMarkTag) {
      const children = pluginator.fromHtmlChildNodes(el.childNodes)
      return children.map(child => {
        const text = typeof child === "string" ? child : child.text
        const attributes = getAttributes(el)
        return { [tag]: true, attributes, text }
      })
    }

    if (tag in EHtmlVoidTag) {
      const attributes = getAttributes(el)
      return {
        tag,
        attributes,
        children: [{ text: "" }],
      }
    }

    return null
  }
}
