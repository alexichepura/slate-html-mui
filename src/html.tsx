import escapeHtml from "escape-html"
import { Descendant, Element as SlateElement, Text } from "slate"
import { jsx as slateJsx } from "slate-hyperscript"
import { EHtmlBlockTag, EHtmlMarkTag, EHtmlNontextTag } from "./format"
import { isHtmlAnchorElement, LINK_INLINE_TYPE } from "./link"

type TSlateHtmlProps = {
  tag: string
  attributes: Record<string, string>
}

const slateHtml = (props: TSlateHtmlProps, children: any[]) => slateJsx("element", props, children)

type TAttributes = Record<string, any> | null
export type TTagElement = {
  tag: string
  children?: (TTagElement | Text)[]
}

const attributes2String = (attributes: TAttributes): string => {
  if (!attributes) {
    return ""
  }
  const attributesString = Object.entries(attributes)
    .filter(([_k, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      return `${k}="${String(v)}"`
    })
    .join(" ")
  return attributesString.length > 0 ? " " + attributesString : ""
}

const formatToString = (node: TTagElement, attributes: TAttributes, children: string) => {
  return `<${node.tag}${attributes2String(attributes)}>${children}</${node.tag}>`
}

export const serialize = (node: TTagElement | TTagElement[] | Text | Text[]): string => {
  if (Text.isText(node)) {
    return escapeHtml(node.text)
  }

  if (Array.isArray(node)) {
    return (node as (TTagElement | Text)[]).map(serialize).join("")
  }

  const children = node.children && node.children.map(n => serialize(n)).join("")
  if ((node.tag in EHtmlBlockTag || node.tag in EHtmlMarkTag) && children) {
    return formatToString(node, null, children)
  }
  if (isHtmlAnchorElement(node) && children) {
    const attributes = {
      ...node.attributes,
      href: node.attributes.href ? escapeHtml(node.attributes.href || "") : null,
    }
    return formatToString(node, attributes, children)
  }

  return children || ""
}

export const deserialize = (
  el: Element | ChildNode
): SlateElement | string | null | Descendant[] => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  }

  const children = Array.from(el.childNodes)
    .map(deserialize)
    .flat()

  if (el.nodeName === "BODY") {
    const body = slateJsx("fragment", {}, children)
    return body
  }

  const tag = el.nodeName.toLowerCase()
  const attributes = Array.from((el as Element).attributes).reduce<Record<string, string>>(
    (prev, attr) => {
      prev[attr.name] = attr.value
      return prev
    },
    {}
  )

  if (tag in EHtmlBlockTag) {
    if (children.length === 0) {
      children.push({ text: "" })
    }
    return slateHtml({ tag, attributes }, children)
  }

  if (tag in EHtmlMarkTag) {
    const textChildren = children.map(child => slateJsx("text", { [tag]: true, attributes }, child))
    return textChildren
  }

  if (tag === LINK_INLINE_TYPE || tag in EHtmlNontextTag) {
    return slateHtml({ tag, attributes }, children)
  }

  return children
}
