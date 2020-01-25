import escapeHtml from "escape-html"
import { Descendant, Element as SlateElement, Text } from "slate"
import { EHtmlBlockTag, EHtmlMarkTag, EHtmlVoidTag } from "./format"
import { IMG_TAG, isHtmlImgElement } from "./image/img"
import { isHtmlPictureElement, deserializePicture, serializePicture } from "./image/picture"
import { isHtmlAnchorElement, LINK_TAG } from "./link"
import { formatTagToString, formatVoidToString, getAttributes } from "./util"

export type TTagElement = {
  tag: string
  children?: (TTagElement | Text)[]
  [key: string]: any
}

// SERIALIZE
type TSerializeInput = TTagElement | TTagElement[] | Text | Text[] | Node[]
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

  const children = node.children && node.children.map(n => serialize(n, cb)).join("")
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
function deserializeChildNodes<T>(nodes: NodeListOf<ChildNode>, cb?: TDeserialize<T>) {
  return Array.from(nodes)
    .map(n => deserialize(n, cb))
    .flat()
}

type TDeserializeInput = Element | ChildNode
type TDeserializeOutput = SlateElement | Text | string | null | Descendant[] | TTagElement
export type TDeserialize<T = unknown> = (
  el: TDeserializeInput,
  cb?: TDeserialize<T>
) => TDeserializeOutput | T
export function deserialize<T>(
  element: TDeserializeInput,
  cb?: TDeserialize<T>
): TDeserializeOutput | T {
  const cbResult = cb && cb(element)
  if (cbResult) return cbResult

  if (element.nodeType === 3) return { text: element.textContent || "" }
  const el: Element = element as Element

  if (el.nodeType !== 1) return null
  if (el.nodeName === "BODY") {
    if (el.firstChild && el.firstChild.nodeName === "B") {
      return deserializeChildNodes(el.firstChild.childNodes, cb)
    }
    return deserializeChildNodes(el.childNodes, cb)
  }

  const picture = deserializePicture(el)
  if (picture) return picture

  const tag = el.nodeName.toLowerCase()

  if (tag === EHtmlVoidTag.br) {
    return { text: "\n" }
  }

  const children = deserializeChildNodes(el.childNodes, cb)
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

// modified from https://stackoverflow.com/questions/8987550/convert-css-text-to-javascript-object/43012849
// type TParseCssResult = {
//   cssText: string
//   ruleName: string
//   style: CSSProperties
// }
// function parseCSSText(cssText: string): TParseCssResult {
//   const cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ")
//   const style: any = {} // TODO proper types
//   const [, ruleName = "", rule = ""] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt]
//   const properties = rule.split(";").map(o => o.split(":").map(x => x && x.trim()))
//   for (var [property, value] of properties) {
//     const cssPropertyName = cssToJs(property)
//     style[cssPropertyName] = value
//   }
//   return { cssText, ruleName, style }
// }

// const cssToJs = (s: string) => s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase())
