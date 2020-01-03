import React from "react"
import { RenderElementProps } from "slate-react"
import { HtmlBlockElement, HtmlVoidElement, isHtmlBlockElement, isHtmlVoidElement } from "./format"
import { HtmlAnchorElement, isHtmlAnchorElement } from "./link"
import { TTagElement } from "./html"

export const RenderElement = (props: RenderElementProps) => {
  const element = props.element as TTagElement
  if (isHtmlBlockElement(element)) {
    return <HtmlBlockElement {...props} />
  }
  if (isHtmlAnchorElement(element)) {
    return <HtmlAnchorElement {...props} />
  }
  if (isHtmlVoidElement(element)) {
    return <HtmlVoidElement {...props} />
  }
  console.warn("INVALID ELEMENT", element)
  return <p>INVALID ELEMENT</p>
}
