import { getAttributes, TSlatePlugin } from "slate-pen"

export const createSpanToParagraphPlugin = (): TSlatePlugin => ({
  fromHtmlElement: (el, slatePen) => {
    const type = el.nodeName.toLowerCase()

    if (type === "span") {
      const children = slatePen.fromHtmlChildNodes(el.childNodes)
      const attributes = getAttributes(el)
      if (children.length === 0) {
        children.push({ text: "" })
      }
      return { type: "p", attributes, children }
    }
    return null
  },
})
