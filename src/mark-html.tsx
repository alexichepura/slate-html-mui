import { FC } from "react"
import FormatBold from "@material-ui/icons/FormatBold"
import FormatItalicTwoTone from "@material-ui/icons/FormatItalicTwoTone"
import FormatUnderlinedTwoTone from "@material-ui/icons/FormatUnderlinedTwoTone"
import CodeTwoTone from "@material-ui/icons/CodeTwoTone"
import React from "react"
import { MarkPlugin } from "./mark-plugin"
import { Plugin } from "slate-react"
import { Value } from "slate"
import { useSlateEditor, useSlateEditorValue } from "./editor"
import { ButtonProps } from "@material-ui/core/Button"
import { ToolbarButton } from "./toolbar-button"

export enum EHtmlMark {
  "b" = "b",
  "strong" = "strong",
  "code" = "code",
  "em" = "em",
  "u" = "u",
}

export const hasMark = (value: Value, type: string) => {
  return value.activeMarks.some(mark => (mark ? mark.type === type : false))
}

type TMarkButtonProps = {
  markType: string
} & ButtonProps
export const MarkButton: FC<TMarkButtonProps> = ({ markType, ...rest }) => {
  const editor = useSlateEditor()
  const value = useSlateEditorValue()
  const isActive = hasMark(value, markType)
  const onClick = () => {
    editor.toggleMark(markType)
  }
  return (
    <ToolbarButton
      color={isActive ? "primary" : "default"}
      variant={isActive ? "contained" : "text"}
      onClick={onClick}
      {...rest}
    />
  )
}

export const MarkBoldButton: FC = () => (
  <MarkButton markType={EHtmlMark.b} children={<FormatBold />} />
)
export const MarkBoldPlugin = MarkPlugin({
  type: EHtmlMark.b,
  component: EHtmlMark.b,
  hotkey: "mod+b",
})

export const MarkStrongButton: FC = () => (
  <MarkButton markType={EHtmlMark.strong} children={<strong>S</strong>} />
)
export const MarkStrongPlugin = MarkPlugin({
  type: EHtmlMark.strong,
  component: EHtmlMark.strong,
})

export const MarkCodeButton: FC = () => (
  <MarkButton markType={EHtmlMark.code} children={<CodeTwoTone />} />
)
export const MarkCodePlugin = MarkPlugin({
  type: EHtmlMark.code,
  component: EHtmlMark.code,
  hotkey: "mod+`",
})

export const MarkEmphasisButton: FC = () => (
  <MarkButton markType={EHtmlMark.em} children={<FormatItalicTwoTone />} />
)
export const MarkEmphasisPlugin = MarkPlugin({
  type: EHtmlMark.em,
  component: EHtmlMark.em,
  hotkey: "mod+i",
})

export const MarkUnderlinedButton: FC = () => (
  <MarkButton markType={EHtmlMark.u} children={<FormatUnderlinedTwoTone />} />
)
export const MarkUnderlinePlugin = MarkPlugin({
  type: EHtmlMark.u,
  component: EHtmlMark.u,
  hotkey: "mod+u",
})

export const MarkPlugins: Plugin[] = [
  MarkBoldPlugin,
  MarkStrongPlugin,
  MarkCodePlugin,
  MarkEmphasisPlugin,
  MarkUnderlinePlugin,
]
