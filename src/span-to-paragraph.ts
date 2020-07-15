import { TSlatePlugin } from "slate-pen"
import { EHtmlBlock, getBlockElement } from "./html"

export const createSpanToParagraphPlugin = (): TSlatePlugin => ({
  fromHtmlElement: (el, slatePen) => {
    const type = el.nodeName.toLowerCase()

    if (type === "span") {
      return getBlockElement(el, EHtmlBlock.p, slatePen)
    }
    return null
  },
})
