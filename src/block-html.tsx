import { FC } from "react"

import FormatListNumbered from "@material-ui/icons/FormatListNumbered"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
import FormatQuote from "@material-ui/icons/FormatQuote"
import React from "react"
import { BlockPlugin } from "./block-plugin"
import { Plugin, Editor } from "slate-react"
import { Value } from "slate"
import { useSlateEditor } from "./editor"
import { ToolbarButton, TToolbarButtonProps } from "./toolbar-button"

export enum EHtmlBlock {
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

export const hasBlock = (value: Value, type: string) => {
  return value.blocks.some(node => (node ? node.type === type : false))
}

const DEFAULT_NODE = EHtmlBlock.p

type TBlockButtonProps = {
  blockType: string
  toggle: (editor: Editor, type: string) => void
  isActive?: boolean
} & TToolbarButtonProps
export const BlockButton: FC<TBlockButtonProps> = ({ blockType, isActive, toggle, ...rest }) => {
  const editor = useSlateEditor()

  if (isActive === undefined) {
    isActive = hasBlock(editor.value, blockType)
  }

  return (
    <ToolbarButton
      color={isActive ? "primary" : "default"}
      variant={isActive ? "contained" : "text"}
      onClick={() => toggle(editor, blockType)}
      {...rest}
    />
  )
}

const useIsListActive = (type: string, childType: string): boolean => {
  const editor = useSlateEditor()
  const { value } = editor
  const { document, blocks } = value

  if (blocks.size > 0) {
    const parent = document.getParent(blocks.first().key)
    return hasBlock(value, childType) && parent && "type" in parent ? parent.type === type : false
  }
  return false
}

const useToggleListBlock = (editor: Editor, type: string) => {
  const { value } = editor
  const { document } = value

  // Handle the extra wrapping required for list buttons.
  const isList = hasBlock(value, EHtmlBlock.li)
  const isType = value.blocks.some(block => {
    if (!block) {
      return false
    }
    return !!document.getClosest(block.key, parent =>
      parent && "type" in parent ? parent.type === type : false
    )
  })

  if (isList && isType) {
    editor
      .setBlocks(DEFAULT_NODE)
      .unwrapBlock(EHtmlBlock.ul)
      .unwrapBlock(EHtmlBlock.ol)
  } else if (isList) {
    editor.unwrapBlock(type === EHtmlBlock.ul ? EHtmlBlock.ol : EHtmlBlock.ul).wrapBlock(type)
  } else {
    editor.setBlocks(EHtmlBlock.li).wrapBlock(type)
  }
}

const useToggleBlock = (editor: Editor, type: string) => {
  const { value } = editor

  const isActive = hasBlock(value, type)
  const isList = hasBlock(value, EHtmlBlock.li)

  if (isList) {
    editor
      .setBlocks(isActive ? DEFAULT_NODE : type)
      .unwrapBlock(EHtmlBlock.ul)
      .unwrapBlock(EHtmlBlock.ol)
  } else {
    editor.setBlocks(isActive ? DEFAULT_NODE : type)
  }
}

export const BlockH1Button: FC = () => {
  const type = EHtmlBlock.h1
  return (
    <BlockButton
      tooltipTitle="Heading 1"
      blockType={type}
      toggle={useToggleBlock}
      children={type.toUpperCase()}
    />
  )
}
export const BlockH1Plugin = BlockPlugin({
  type: EHtmlBlock.h1,
  component: EHtmlBlock.h1,
})

export const BlockH2Button: FC = () => {
  const type = EHtmlBlock.h2
  return (
    <BlockButton
      tooltipTitle="Heading 2"
      blockType={type}
      toggle={useToggleBlock}
      children={type.toUpperCase()}
    />
  )
}
export const BlockH2Plugin = BlockPlugin({
  type: EHtmlBlock.h2,
  component: EHtmlBlock.h2,
})

export const BlockH3Button: FC = () => {
  const type = EHtmlBlock.h3
  return (
    <BlockButton
      tooltipTitle="Heading 3"
      blockType={type}
      toggle={useToggleBlock}
      children={type.toUpperCase()}
    />
  )
}
export const BlockH3Plugin = BlockPlugin({
  type: EHtmlBlock.h3,
  component: EHtmlBlock.h3,
})

export const BlockH4Button: FC = () => {
  const type = EHtmlBlock.h4
  return (
    <BlockButton
      tooltipTitle="Heading 4"
      blockType={type}
      toggle={useToggleBlock}
      children={type.toUpperCase()}
    />
  )
}
export const BlockH4Plugin = BlockPlugin({
  type: EHtmlBlock.h4,
  component: EHtmlBlock.h4,
})

export const BlockBlockquoteButton: FC = () => {
  const type = EHtmlBlock.blockquote
  return (
    <BlockButton
      tooltipTitle="Blockquote"
      blockType={type}
      toggle={useToggleBlock}
      children={<FormatQuote />}
    />
  )
}
export const BlockBlockquotePlugin = BlockPlugin({
  type: EHtmlBlock.blockquote,
  component: EHtmlBlock.blockquote,
})

export const BlockOlButton: FC = () => {
  const type = EHtmlBlock.ol
  const isActive = useIsListActive(type, EHtmlBlock.li)
  return (
    <BlockButton
      tooltipTitle="Numbered (ordered) list"
      blockType={type}
      isActive={isActive}
      toggle={useToggleListBlock}
      children={<FormatListNumbered />}
    />
  )
}
export const BlockOlPlugin = BlockPlugin({
  type: EHtmlBlock.ol,
  component: EHtmlBlock.ol,
})
export const BlockUlButton: FC = () => {
  const type = EHtmlBlock.ul
  const isActive = useIsListActive(type, EHtmlBlock.li)
  return (
    <BlockButton
      tooltipTitle="Bulleted (unordered) list"
      blockType={type}
      isActive={isActive}
      toggle={useToggleListBlock}
      children={<FormatListBulleted />}
    />
  )
}
export const BlockUlPlugin = BlockPlugin({
  type: EHtmlBlock.ul,
  component: EHtmlBlock.ul,
})
// export const BlockLiButton: FC = () => {
//   const type = EHtmlBlock.li
//   return (
//     <BlockButton
//       tooltipTitle="List item"
//       blockType={type}
//       toggle={useToggleBlock}
//       children={type}
//     />
//   )
// }
export const BlockLiPlugin = BlockPlugin({
  type: EHtmlBlock.li,
  component: EHtmlBlock.li,
})

export const BlockPlugins: Plugin[] = [
  BlockH1Plugin,
  BlockH2Plugin,
  BlockH3Plugin,
  BlockH4Plugin,
  BlockBlockquotePlugin,
  BlockOlPlugin,
  BlockUlPlugin,
  BlockLiPlugin,
]
