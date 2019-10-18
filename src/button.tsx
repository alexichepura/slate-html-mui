import { FC } from "react"
import { IconButton } from "@material-ui/core"
import FormatBold from "@material-ui/icons/FormatBold"
import React from "react"
import { useSlateMui } from "./context"

export enum EBlocks {
  "h1" = "h1",
  "list_numbered" = "list_numbered",
  "list_bulleted" = "list_bulleted",
  "list_item" = "list_item",
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
  const type = EBlocks.h1
  const slateMui = useSlateMui()

  let isActive = slateMui.hasBlock(type)

  if ([EBlocks.list_numbered, EBlocks.list_bulleted].includes(type)) {
    const { document, blocks } = slateMui.value

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key)
      isActive =
        slateMui.hasBlock(EBlocks.list_item) && parent && "type" in parent
          ? parent.type === type
          : false
    }
  }

  return (
    <IconButton
      color={isActive ? "primary" : "default"}
      onMouseDown={() => slateMui.editor.toggleMark(type)}
    >
      <FormatBold />
    </IconButton>
  )
}
