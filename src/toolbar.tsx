import FormatBold from "@material-ui/icons/FormatBold"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
import FormatListNumbered from "@material-ui/icons/FormatListNumbered"
import FormatQuote from "@material-ui/icons/FormatQuote"
import FormatItalicTwoTone from "@material-ui/icons/FormatItalicTwoTone"
import FormatUnderlinedTwoTone from "@material-ui/icons/FormatUnderlinedTwoTone"
import CodeTwoTone from "@material-ui/icons/CodeTwoTone"
import React, { FC } from "react"
import { UndoButton, RedoButton } from "./history"
import { LinkButton, LinkPlugin } from "./link"
import { FormatButton } from "./toolbar-button"
import { EHtmlBlockFormat, EHtmlTextFormat } from "./format"

export const Toolbar: FC = () => {
  return (
    <div>
      <UndoButton />
      <RedoButton />

      <FormatButton tooltipTitle="Bold" format={EHtmlTextFormat.b} children={<FormatBold />} />
      <FormatButton
        tooltipTitle="Strong"
        format={EHtmlTextFormat.strong}
        children={<strong>S</strong>}
      />
      <FormatButton
        tooltipTitle="Code (monospace)"
        format={EHtmlTextFormat.code}
        children={<CodeTwoTone />}
      />
      <FormatButton
        tooltipTitle="Italic (emphasis)"
        format={EHtmlTextFormat.em}
        children={<FormatItalicTwoTone />}
      />
      <FormatButton
        tooltipTitle="Code (monospace)"
        format={EHtmlTextFormat.u}
        children={<FormatUnderlinedTwoTone />}
      />
      <LinkButton />

      <FormatButton
        tooltipTitle="Heading 1"
        format={EHtmlBlockFormat.h1}
        children={EHtmlBlockFormat.h1.toUpperCase()}
      />
      <FormatButton
        tooltipTitle="Heading 2"
        format={EHtmlBlockFormat.h2}
        children={EHtmlBlockFormat.h2.toUpperCase()}
      />
      <FormatButton
        tooltipTitle="Heading 3"
        format={EHtmlBlockFormat.h3}
        children={EHtmlBlockFormat.h3.toUpperCase()}
      />
      <FormatButton
        tooltipTitle="Heading 4"
        format={EHtmlBlockFormat.h4}
        children={EHtmlBlockFormat.h4.toUpperCase()}
      />
      <FormatButton
        tooltipTitle="Blockquote"
        format={EHtmlBlockFormat.blockquote}
        children={<FormatQuote />}
      />
      <FormatButton
        tooltipTitle="Numbered (ordered) list"
        format={EHtmlBlockFormat.blockquote}
        children={<FormatListNumbered />}
      />
      <FormatButton
        tooltipTitle="Bulleted (unordered) list"
        format={EHtmlBlockFormat.blockquote}
        children={<FormatListBulleted />}
      />
    </div>
  )
}
