import CodeTwoTone from "@material-ui/icons/CodeTwoTone"
import FormatBold from "@material-ui/icons/FormatBold"
import FormatItalicTwoTone from "@material-ui/icons/FormatItalicTwoTone"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
import FormatListNumbered from "@material-ui/icons/FormatListNumbered"
import FormatQuote from "@material-ui/icons/FormatQuote"
import FormatUnderlinedTwoTone from "@material-ui/icons/FormatUnderlinedTwoTone"
import React, { FC } from "react"
import { Editor } from "slate"
import {
  EHtmlBlockTag,
  EHtmlMarkTag,
  ImgButton,
  LinkButton,
  PictureButton,
  RedoButton,
  TagBlockButton,
  TagMarkButton,
  ToolbarButton,
  UndoButton,
} from "../src"
import { insertBr } from "../src/html/br"
import { ButtonLinkButton } from "./button-link"
import { CustomImgFormDialog } from "./custom-img"
import { CustomLinkFormDialog } from "./custom-link"

export const CustomToolbar: FC<JSX.IntrinsicElements["div"] & { editor: Editor }> = ({
  editor,
  ...rest
}) => {
  return (
    <div {...rest}>
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
      <LinkButton
        LinkFormDialog={CustomLinkFormDialog}
        tooltipTitle="Custom Link"
        children={"CL"}
      />
      <ButtonLinkButton />

      <ImgButton ImgFormDialog={CustomImgFormDialog} />
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
      <ToolbarButton
        tooltipTitle="Line break"
        color="default"
        variant="text"
        onClick={() => {
          insertBr(editor)
        }}
        children={"BR"}
      />
    </div>
  )
}
CustomToolbar.displayName = "CustomToolbar"
