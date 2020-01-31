import escapeHtml from "escape-html"
import { Descendant, Editor, Element as SlateElement, Text } from "slate"
import { EHtmlBlockTag, EHtmlMarkTag, EHtmlVoidTag } from "./format"
import { IMG_TAG, isHtmlImgElement } from "./image/img"
import { deserializePicture, isHtmlPictureElement, serializePicture } from "./image/picture"
import { isHtmlAnchorElement, LINK_TAG } from "./link"
import { formatTagToString, formatVoidToString, getAttributes } from "./util"

type TAnyElement = TTagElement | SlateElement | Text

export type TTagElement = {
  tag: string
  children?: TAnyElement[]
  [key: string]: any
}

// SERIALIZE
export type TSerializeInput = TAnyElement | TAnyElement[] | Node[]
export type TSerialize<T = unknown> = (node: TSerializeInput | T, cb?: TSerialize<T>) => string

export function serialize<T>(node: TSerializeInput, cb?: TSerialize<T>): string {
  const cbResult = cb && cb(node)
  if (cbResult) {
    return cbResult
  }

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
    return (node as (TTagElement | Text)[]).map(n => serialize(n, cb)).join("")
  }

  const children =
    node.children && (node.children as TAnyElement[]).map(n => serialize(n, cb)).join("")

  if (children === undefined) {
    return ""
  }
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

  if (isHtmlImgElement(node)) {
    return formatTagToString(node.tag, node.attributes, children)
  }
  if (isHtmlPictureElement(node)) {
    return formatTagToString(node.tag, node.attributes, children)
  }

  if (node.tag in EHtmlVoidTag) {
    return formatVoidToString(node.tag, null)
  }

  return children
}

// DESEREALIZE
type TDeserializeInput = Element | ChildNode
type TDeserializeOutput = SlateElement | Text | string | null | Descendant[] | TTagElement
export type TDeserialize<T = unknown> = (el: TDeserializeInput) => TDeserializeOutput | T

export const createDeserializer = (editor: Editor): TDeserialize => {
  function deserializeChildNodes(nodes: NodeListOf<ChildNode>) {
    return Array.from(nodes)
      .map(editor.deserializeHtmlElement)
      .flat()
  }
  return function deserialize<T>(element: TDeserializeInput): TDeserializeOutput | T {
    const el: Element = element as Element

    if (el.nodeType === 3) {
      const text = el.textContent || ""
      return { text }
    }
    if (el.nodeType !== 1) return null
    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return deserializeChildNodes(firstElementChild.childNodes)
      }
      return deserializeChildNodes(el.childNodes)
    }

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
