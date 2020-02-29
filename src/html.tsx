import escapeHtml from "escape-html"
import { Descendant, Editor, Element as SlateElement, Node, Text } from "slate"
import { EHtmlBlockTag, EHtmlMarkTag, EHtmlVoidTag } from "./format"
import { IMG_TAG } from "./image/img"
import { deserializePicture, serializePicture } from "./image/picture"
import { isHtmlAnchorElement, LINK_TAG } from "./link"
import { formatTagToString, formatVoidToString, getAttributes } from "./util"

type TPartialNode = Partial<Node>
export type TTagElement = {
  tag: string
  children?: TPartialNode[]
  [key: string]: any
}

const isTagElement = (el: any): el is TTagElement => {
  return "tag" in el
}

export type THtmlEditor = Editor & {
  toHtml: (element: Node) => void
  fromHtml: (element: HTMLElement) => void
}

// SERIALIZE
export type TSerialize<T = Node> = (node: TPartialNode | TPartialNode | T) => string

export const createSerializer = (editor: Editor): TSerialize => {
  return function serialize<T = Node>(node: TPartialNode | TPartialNode | T): string {
    const picture = serializePicture(node)
    if (picture) return picture

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
      return node.map(n => editor.serializeToHtmlString(n)).join("")
    }

    const children =
      (Editor.isBlock(editor, node) || Editor.isInline(editor, node)) && node.children
        ? node.children.map(n => editor.serializeToHtmlString(n)).join("")
        : ""

    if (isTagElement(node)) {
      if (node.tag in EHtmlBlockTag) {
        return formatTagToString(node.tag, null, children)
      }

      if (isHtmlAnchorElement(node)) {
        const attributes = {
          ...node.attributes,
          href: node.attributes.href ? escapeHtml(node.attributes.href || "") : null,
        }
        return formatTagToString(node.tag, attributes, children)
      }

      if (node.tag in EHtmlVoidTag) {
        return formatVoidToString(node.tag, null)
      }
    }

    return children
  }
}

// DESEREALIZE
type TDeserializeInput = Element | ChildNode
type TDeserializeOutput = SlateElement | Text | string | null | Descendant[] | TTagElement
export type TDeserialize<T = unknown> = (el: TDeserializeInput) => TDeserializeOutput | T

export const createDeserializer = (editor: Editor): TDeserialize => {
  function deserializeChildNodes(nodes: NodeListOf<ChildNode> | HTMLCollection) {
    return Array.from(nodes)
      .map(editor.deserializeHtmlElement)
      .flat()
  }
  return function deserialize<T>(element: TDeserializeInput): TDeserializeOutput | T {
    const el: Element = element as Element

    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return deserializeChildNodes(firstElementChild.childNodes)
      }
      return deserializeChildNodes(el.children)
    }

    if (el.nodeType === 3) {
      const text = el.textContent || ""
      return { text }
    }
    if (el.nodeType !== 1) return null

    const picture = deserializePicture(el)
    if (picture) return picture

    const tag = el.nodeName.toLowerCase()

    if (tag === EHtmlVoidTag.br) {
      return { text: "\n" }
    }

    const children = deserializeChildNodes(el.childNodes)
    const attributes = getAttributes(el)

    if (tag in EHtmlBlockTag || tag === LINK_TAG || tag === IMG_TAG) {
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
