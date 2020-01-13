import CodeTwoTone from "@material-ui/icons/CodeTwoTone"
import FormatBold from "@material-ui/icons/FormatBold"
import FormatItalicTwoTone from "@material-ui/icons/FormatItalicTwoTone"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
import FormatListNumbered from "@material-ui/icons/FormatListNumbered"
import FormatQuote from "@material-ui/icons/FormatQuote"
import FormatUnderlinedTwoTone from "@material-ui/icons/FormatUnderlinedTwoTone"
import React, { FC } from "react"
import {
  EHtmlBlockTag,
  EHtmlMarkTag,
  EHtmlVoidTag,
  ImgButton,
  LinkButton,
  PictureButton,
  RedoButton,
  TagButton,
  UndoButton,
} from "../src"
import { CustomImgFormDialog } from "./custom-img"
import { CustomLinkFormDialog } from "./custom-link"

export const CustomToolbar: FC<JSX.IntrinsicElements["div"]> = props => {
  return (
    <div {...props}>
      <UndoButton />
      <RedoButton />

      <TagButton tooltipTitle="Bold" tag={EHtmlMarkTag.b} children={<FormatBold />} />
      <TagButton tooltipTitle="Strong" tag={EHtmlMarkTag.strong} children={<strong>S</strong>} />
      <TagButton
        tooltipTitle="Code (monospace)"
        tag={EHtmlMarkTag.code}
        children={<CodeTwoTone />}
      />
      <TagButton
        tooltipTitle="Italic (emphasis)"
        tag={EHtmlMarkTag.em}
        children={<FormatItalicTwoTone />}
      />
      <TagButton
        tooltipTitle="Code (monospace)"
        tag={EHtmlMarkTag.u}
        children={<FormatUnderlinedTwoTone />}
      />
      <LinkButton />
      <LinkButton
        LinkFormDialog={CustomLinkFormDialog}
        tooltipTitle="Custom Link"
        children={"CL"}
      />
      <ImgButton ImgFormDialog={CustomImgFormDialog} />
      <PictureButton />

      <TagButton
        tooltipTitle="Heading 1"
        tag={EHtmlBlockTag.h1}
        children={EHtmlBlockTag.h1.toUpperCase()}
      />
      <TagButton
        tooltipTitle="Heading 2"
        tag={EHtmlBlockTag.h2}
        children={EHtmlBlockTag.h2.toUpperCase()}
      />
      <TagButton
        tooltipTitle="Heading 3"
        tag={EHtmlBlockTag.h3}
        children={EHtmlBlockTag.h3.toUpperCase()}
      />
      <TagButton
        tooltipTitle="Heading 4"
        tag={EHtmlBlockTag.h4}
        children={EHtmlBlockTag.h4.toUpperCase()}
      />
      <TagButton
        tooltipTitle="Blockquote"
        tag={EHtmlBlockTag.blockquote}
        children={<FormatQuote />}
      />
      <TagButton
        tooltipTitle="Numbered (ordered) list"
        tag={EHtmlBlockTag.ol}
        children={<FormatListNumbered />}
      />
      <TagButton
        tooltipTitle="Bulleted (unordered) list"
        tag={EHtmlBlockTag.ul}
        children={<FormatListBulleted />}
      />
      <TagButton
        tooltipTitle="Line break"
        tag={EHtmlVoidTag.br}
        children={EHtmlVoidTag.br.toUpperCase()}
      />
      {/* <TagButton
        tooltipTitle="Horizontal rule"
        tag={EHtmlVoidTag.hr}
        children={EHtmlVoidTag.hr.toUpperCase()}
      /> */}
    </div>
  )
}
CustomToolbar.displayName = "CustomToolbar"
