import { FC } from "react"
import { IconButton } from "@material-ui/core"
import FormatBold from "@material-ui/icons/FormatBold"
import FormatListNumbered from "@material-ui/icons/FormatListNumbered"
import React from "react"
import { useSlateMui } from "./context"

export enum EBlock {
  "h1" = "h1",
  "h2" = "h2",
  "h3" = "h3",
  "h4" = "h4",
  "blockquote" = "blockquote",
  "list_numbered" = "list_numbered",
  "list_bulleted" = "list_bulleted",
  "list_item" = "list_item",
}
export enum EMark {
  "bold" = "bold",
  "code" = "code",
  "italic" = "italic",
  "underlined" = "underlined",
}

export const MarkupButton: FC = () => {
  const type = "bold"
  const slateMui = useSlateMui()
  const isActive = slateMui.hasMark("bold")

  return (
    <IconButton
      color={isActive ? "primary" : "default"}
      onMouseDown={() => slateMui.editor.toggleMark(type)}
    >
      <FormatBold />
    </IconButton>
  )
}

export const BlockButton: FC = () => {
  const type = EBlock.list_numbered
  const slateMui = useSlateMui()

  let isActive = slateMui.hasBlock(type)

  if ([EBlock.list_numbered, EBlock.list_bulleted].includes(type)) {
    const { document, blocks } = slateMui.value

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key)
      isActive =
        slateMui.hasBlock(EBlock.list_item) && parent && "type" in parent
          ? parent.type === type
          : false
    }
  }

  return (
    <IconButton
      color={isActive ? "primary" : "default"}
      onMouseDown={() => slateMui.toggleBlock(type)}
    >
      <FormatListNumbered />
    </IconButton>
  )
}
