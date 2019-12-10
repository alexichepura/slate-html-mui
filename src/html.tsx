import { LINK_INLINE_TYPE } from "./link"

import escapeHtml from "escape-html"
import { Node, Text, Descendant } from "slate"
import { EHtmlBlockFormat, EHtmlTextFormat } from "./format"
import { Element as SlateElement } from "slate"

const formatToString = (node: Node, children: string) => {
  return `<${node.type}>${children}</${node.type}>`
}

export const serialize = (node: Node | Node[]): string => {
  if (Text.isText(node)) {
    return escapeHtml(node.text)
  }

  if (Array.isArray(node)) {
    return node.map(serialize).join("")
  }

  const children = Array.from(node.children)
    .map(n => serialize(n))
    .join("")

  if (node.type in EHtmlBlockFormat || node.type in EHtmlTextFormat) {
    return formatToString(node, children)
  }

  if (node.type === LINK_INLINE_TYPE) {
    // `<a href="${escapeHtml(node.url)}">${children}</a>`
    return formatToString(node, children)
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
      return jsx(
        "element",
        {
          type: LINK_INLINE_TYPE,
          attributes: {
            href: (el as Element).getAttribute("href"),
            title: (el as Element).getAttribute("title"),
            target: (el as Element).getAttribute("target"),
          },
        },
        children
      )
    default:
      return el.textContent
  }
}
