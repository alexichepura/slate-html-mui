import React from "react"
import { RenderElementProps } from "slate-react"
import { HtmlBlockElement, isHtmlBlockElement } from "./format"
import { HtmlAnchorElement, isHtmlAnchorElement } from "./link"

export const RenderElement = (props: RenderElementProps) => {
  if (isHtmlBlockElement(props.element)) {
    return <HtmlBlockElement {...props} />
  }
  if (isHtmlAnchorElement(props.element)) {
    return <HtmlAnchorElement {...props} />
  }
  return <p>INVALID ELEMENT</p>
}
