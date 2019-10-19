import { Plugin, EventHook } from "slate-react"
import React from "react"
import { isKeyHotkey } from "is-hotkey"
import { EBlock, EMark } from "./button"

const isBoldHotkey = isKeyHotkey("mod+b")
const isItalicHotkey = isKeyHotkey("mod+i")
const isUnderlinedHotkey = isKeyHotkey("mod+u")
const isCodeHotkey = isKeyHotkey("mod+`")

export const renderBlock: Plugin["renderBlock"] = (props, _editor, next) => {
  const { attributes, children, node } = props

  switch (node.type) {
    case EBlock.h1:
      return <h1 {...attributes}>{children}</h1>
    case EBlock.h2:
      return <h2 {...attributes}>{children}</h2>
    case EBlock.blockquote:
      return <blockquote {...attributes}>{children}</blockquote>
    case EBlock.list_item:
      return <li {...attributes}>{children}</li>
    case EBlock.list_bulleted:
      return <ul {...attributes}>{children}</ul>
    case EBlock.list_numbered:
      return <ol {...attributes}>{children}</ol>
    default:
      return next()
  }
}

export const renderMark: Plugin["renderMark"] = (props, _editor, next) => {
  const { children, mark, attributes } = props

  switch (mark.type) {
    case EMark.bold:
      return <strong {...attributes}>{children}</strong>
    case EMark.code:
      return <code {...attributes}>{children}</code>
    case EMark.italic:
      return <em {...attributes}>{children}</em>
    case EMark.underlined:
      return <u {...attributes}>{children}</u>
    default:
      return next()
  }
}

export const onKeyDown: EventHook = (_event, editor, next) => {
  const event = _event as KeyboardEvent
  let mark

  if (isBoldHotkey(event)) {
    mark = EMark.bold
  } else if (isItalicHotkey(event)) {
    mark = EMark.italic
  } else if (isUnderlinedHotkey(event)) {
    mark = EMark.underlined
  } else if (isCodeHotkey(event)) {
    mark = EMark.code
  } else {
    return next()
  }

  event.preventDefault()
  editor.toggleMark(mark)
}
