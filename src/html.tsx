import { LINK_INLINE_TYPE, isHtmlAnchorElement, THtmlLinkJsxElement } from "./link"

import escapeHtml from "escape-html"
import { Node, Text, Descendant } from "slate"
import { EHtmlBlockFormat, EHtmlTextFormat } from "./format"
import { Element as SlateElement } from "slate"

type TAttributes = Record<string, string | undefined | null> | null

const attributes2String = (attributes: TAttributes): string => {
  if (!attributes) {
    return ""
  }
  const attributesString = Object.entries(attributes)
    .filter(([_k, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      return `${k}="${v}"`
    })
    .join(" ")
  return attributesString.length > 0 ? " " + attributesString : ""
}

const formatToString = (node: Node, attributes: TAttributes, children: string) => {
  return `<${node.type}${attributes2String(attributes)}>${children}</${node.type}>`
}

export const serialize = (node: Node | Node[]): string => {
  if (Text.isText(node)) {
    return escapeHtml(node.text)
  }

  if (Array.isArray(node)) {
    return node.map(serialize).join("")
  }

  const children = node.children.map(n => serialize(n)).join("")

  if (node.type in EHtmlBlockFormat || node.type in EHtmlTextFormat) {
    return formatToString(node, null, children)
  }

  if (isHtmlAnchorElement(node)) {
    const attributes = {
      ...node.attributes,
      href: node.attributes.href ? escapeHtml(node.attributes.href || "") : null,
    }
    return formatToString(node, attributes, children)
  }

  return children
}

import { jsx } from "slate-hyperscript"

export const deserialize = (
  el: Element | ChildNode
): SlateElement | string | null | Descendant[] => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  }

  const children = Array.from(el.childNodes).map(deserialize)

  const nodeNameLowerCase = el.nodeName.toLowerCase()
  if (nodeNameLowerCase in EHtmlBlockFormat || nodeNameLowerCase in EHtmlTextFormat) {
    return jsx("element", { type: nodeNameLowerCase }, children)
  }

  switch (nodeNameLowerCase) {
    case "body":
      return jsx("fragment", {}, children)
    case "br":
      return "\n"
    case "a":
      const linkElement: THtmlLinkJsxElement = {
        type: LINK_INLINE_TYPE,
        attributes: {
          href: (el as Element).getAttribute("href"),
          title: (el as Element).getAttribute("title"),
          target: (el as Element).getAttribute("target"),
        },
      }
      return jsx("element", linkElement, children)
    default:
      return el.textContent
  }
}
