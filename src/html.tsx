import { Rule } from "slate-html-serializer"
import { EHtmlBlock } from "./block-html"
import { EHtmlMark } from "./mark-html"
import { LINK_INLINE_TYPE } from "./link"
import { createElement } from "react"

export const HTML_RULES: Rule[] = [
  {
    deserialize(el, next) {
      const tag = el.tagName.toLowerCase()
      if (tag in EHtmlBlock) {
        return {
          object: "block",
          type: tag,
          nodes: next(el.childNodes),
        }
      } else if (tag in EHtmlMark) {
        return {
          object: "mark",
          type: tag,
          nodes: next(el.childNodes),
        }
      } else if (tag === LINK_INLINE_TYPE) {
        return {
          object: "inline",
          type: tag,
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute("href"),
            title: el.getAttribute("title"),
            target: el.getAttribute("target"),
          },
        }
      }
      return undefined
    },
    serialize(obj, children) {
      if (obj.object === "block" || obj.object === "mark") {
        const attributes = {}
        return createElement(obj.type, attributes, children)
      }
      return undefined
    },
  },
]
