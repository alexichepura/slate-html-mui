import CodeTwoTone from "@material-ui/icons/CodeTwoTone"
import FormatBold from "@material-ui/icons/FormatBold"
import FormatItalicTwoTone from "@material-ui/icons/FormatItalicTwoTone"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
import FormatListNumbered from "@material-ui/icons/FormatListNumbered"
import FormatQuote from "@material-ui/icons/FormatQuote"
import FormatUnderlinedTwoTone from "@material-ui/icons/FormatUnderlinedTwoTone"
import React, { FC } from "react"
import { EHtmlBlockTag, EHtmlMarkTag } from "./format"
import { RedoButton, UndoButton } from "./history"
import { BR_TAG } from "./html/br"
import { ImgButton } from "./image/img"
import { PictureButton } from "./image/picture"
import { LinkButton } from "./link"
import { TagMarkButton, TagBlockButton } from "./toolbar-button"

export const Toolbar: FC<JSX.IntrinsicElements["div"]> = props => {
  return (
    <div {...props}>
      <UndoButton />
      <RedoButton />

      <TagMarkButton tooltipTitle="Bold" tag={EHtmlMarkTag.b} children={<FormatBold />} />
      <TagMarkButton
        tooltipTitle="Strong"
        tag={EHtmlMarkTag.strong}
        children={<strong>S</strong>}
      />
      <TagMarkButton
        tooltipTitle="Code (monospace)"
        tag={EHtmlMarkTag.code}
        children={<CodeTwoTone />}
      />
      <TagMarkButton
        tooltipTitle="Italic (emphasis)"
        tag={EHtmlMarkTag.em}
        children={<FormatItalicTwoTone />}
      />
      <TagMarkButton
        tooltipTitle="Code (monospace)"
        tag={EHtmlMarkTag.u}
        children={<FormatUnderlinedTwoTone />}
      />
      <LinkButton />
      <ImgButton />
      <PictureButton />

      <TagBlockButton
        tooltipTitle="Heading 1"
        tag={EHtmlBlockTag.h1}
        children={EHtmlBlockTag.h1.toUpperCase()}
      />
      <TagBlockButton
        tooltipTitle="Heading 2"
        tag={EHtmlBlockTag.h2}
        children={EHtmlBlockTag.h2.toUpperCase()}
      />
      <TagBlockButton
        tooltipTitle="Heading 3"
        tag={EHtmlBlockTag.h3}
        children={EHtmlBlockTag.h3.toUpperCase()}
      />
      <TagBlockButton
        tooltipTitle="Heading 4"
        tag={EHtmlBlockTag.h4}
        children={EHtmlBlockTag.h4.toUpperCase()}
      />
      <TagBlockButton
        tooltipTitle="Blockquote"
        tag={EHtmlBlockTag.blockquote}
        children={<FormatQuote />}
      />
      <TagBlockButton
        tooltipTitle="Numbered (ordered) list"
        tag={EHtmlBlockTag.ol}
        children={<FormatListNumbered />}
      />
      <TagBlockButton
        tooltipTitle="Bulleted (unordered) list"
        tag={EHtmlBlockTag.ul}
        children={<FormatListBulleted />}
      />
      <TagMarkButton
        tooltipTitle="Line break"
        tag={BR_TAG}
        children={BR_TAG.toUpperCase()}
        onActivate={editor => editor.insertText("\n")}
      />
    </div>
  )
}
Toolbar.displayName = "Toolbar"
