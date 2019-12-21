import escapeHtml from "escape-html"
import { Descendant, Element as SlateElement, Node, Text } from "slate"
import { jsx as slateJsx } from "slate-hyperscript"
import { EHtmlBlockFormat, EHtmlTextFormat } from "./format"
import { isHtmlAnchorElement, LINK_INLINE_TYPE, THtmlLinkJsxElement } from "./link"

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

export const deserialize = (
  el: Element | ChildNode
): SlateElement | string | null | Descendant[] => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === "BR") {
    return "\n"
  }

  const children = Array.from(el.childNodes)
    .map(deserialize)
    .flat()

  if (el.nodeName === "BODY") {
    const body = slateJsx("fragment", {}, children)
    return body
  }

  const nodeNameLowerCase = el.nodeName.toLowerCase()

  if (nodeNameLowerCase in EHtmlBlockFormat) {
    const element = slateJsx("element", { type: nodeNameLowerCase }, children)
    return element
  }

  if (nodeNameLowerCase in EHtmlTextFormat) {
    const textChildren = children.map(child =>
      slateJsx("text", { [nodeNameLowerCase]: true }, child)
    )
    return textChildren
  }

  if (nodeNameLowerCase === LINK_INLINE_TYPE) {
    const linkElement: THtmlLinkJsxElement = {
      attributes: {
        href: (el as Element).getAttribute("href"),
        title: (el as Element).getAttribute("title"),
        target: (el as Element).getAttribute("target"),
      },
    }
    return slateJsx("element", linkElement, children)
  }

  return children
}
