import React, { FC } from "react"
import { Editor, Element } from "slate"
import { RenderElementProps, RenderLeafProps } from "slate-react"

export enum EHtmlMarkFormat {
  "b" = "b",
  "strong" = "strong",
  "code" = "code",
  "em" = "em",
  "u" = "u",
}

export enum EHtmlBlockFormat {
  "p" = "p",
  "h1" = "h1",
  "h2" = "h2",
  "h3" = "h3",
  "h4" = "h4",
  "blockquote" = "blockquote",
  "ol" = "ol",
  "ul" = "ul",
  "li" = "li",
}

export enum EHtmlListFormat {
  "ol" = "ol",
  "ul" = "ul",
}

export const DEFAULT_NODE_FORMAT = EHtmlBlockFormat.p

export const isHtmlBlockElement = (element: Element) => {
  return element.type in EHtmlBlockFormat
}
export const HtmlBlockElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  return React.createElement(element.type, attributes, children)
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  Object.keys(EHtmlMarkFormat).forEach(format => {
    if (leaf[format]) {
      children = React.createElement(format, {}, children)
    }
  })
  return <span {...attributes}>{children}</span>
}

export const isFormatActive = (editor: Editor, format: string) => {
  if (format in EHtmlMarkFormat) {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }

  if (format in EHtmlBlockFormat) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format,
    })

    return !!match
  }

  return false
}
