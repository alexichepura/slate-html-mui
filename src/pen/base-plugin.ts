import { TSlatePlugin } from "./plugin"

export const createBasePlugin = (): TSlatePlugin => ({
  toHtml: (node, slatePen) => {
    if (Array.isArray(node)) {
      return node.map(n => slatePen.toHtml(n)).join("")
    }

    return null
  },
  fromHtmlElement: (element, slatePen) => {
    const el: Element = element as Element

    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return slatePen.fromHtmlChildNodes(firstElementChild.childNodes)
      }
      return slatePen.fromHtmlChildNodes(el.children)
    }

    if (el.nodeType === 3) {
      const text = el.textContent || ""
      return { text }
    }
    if (el.nodeType !== 1) return null
    return null
  },
})
