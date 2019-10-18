import { Plugin, EventHook } from "slate-react"
import React from "react"
import { isKeyHotkey } from "is-hotkey"

const isBoldHotkey = isKeyHotkey("mod+b")
const isItalicHotkey = isKeyHotkey("mod+i")
const isUnderlinedHotkey = isKeyHotkey("mod+u")
const isCodeHotkey = isKeyHotkey("mod+`")

export const renderBlock: Plugin["renderBlock"] = (props, _editor, next) => {
  const { attributes, children, node } = props

  switch (node.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>
    case "list-item":
      return <li {...attributes}>{children}</li>
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>
    default:
      return next()
  }
}

export const renderMark: Plugin["renderMark"] = (props, _editor, next) => {
  const { children, mark, attributes } = props

  switch (mark.type) {
    case "bold":
      return <strong {...attributes}>{children}</strong>
    case "code":
      return <code {...attributes}>{children}</code>
    case "italic":
      return <em {...attributes}>{children}</em>
    case "underlined":
      return <u {...attributes}>{children}</u>
    default:
      return next()
  }
}

export const onKeyDown: EventHook = (_event, editor, next) => {
  const event = _event as KeyboardEvent
  let mark

  if (isBoldHotkey(event)) {
    mark = "bold"
  } else if (isItalicHotkey(event)) {
    mark = "italic"
  } else if (isUnderlinedHotkey(event)) {
    mark = "underlined"
  } else if (isCodeHotkey(event)) {
    mark = "code"
  } else {
    return next()
  }

  event.preventDefault()
  editor.toggleMark(mark)
}
