import { Editor } from "slate"
import { createBasePlugin, SlatePen } from "slate-pen"
import {
  createAnchorPlugin,
  createBrPlugin,
  createHtmlPlugin,
  createImgPlugin,
  createPicturePlugin,
} from "../src"
import { createSpanToParagraphPlugin } from "../src/span-to-paragraph"
import { createButtonLinkPlugin } from "./button-link"

export const createSlatePen = (editor: Editor) =>
  new SlatePen({
    editor,
    plugins: [
      createBasePlugin(),
      createSpanToParagraphPlugin(),
      createHtmlPlugin(),
      createImgPlugin(),
      createPicturePlugin(),
      createAnchorPlugin(),
      createButtonLinkPlugin(),
      createBrPlugin(),
    ],
  })
