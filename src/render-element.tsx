import React from "react"
import { RenderElementProps } from "slate-react"
import { HtmlBlockElement, HtmlVoidElement, isHtmlBlockElement, isHtmlVoidElement } from "./format"
import { TTagElement } from "./html"
import { HtmlPictureElement, isPictureTag } from "./image/picture"
import { HtmlAnchorElement, isHtmlAnchorElement } from "./link"

export const RenderElement = (props: RenderElementProps) => {
  const element = props.element as TTagElement
  if (isHtmlBlockElement(element)) {
    return <HtmlBlockElement {...props} />
  }
  if (isHtmlAnchorElement(element)) {
    return <HtmlAnchorElement {...props} />
  }
  if (isPictureTag(element)) {
    return <HtmlPictureElement {...props} />
  }
  if (isHtmlVoidElement(element)) {
    return <HtmlVoidElement {...props} />
  }
  console.warn("INVALID ELEMENT", element)
  return <p>INVALID ELEMENT</p>
}
