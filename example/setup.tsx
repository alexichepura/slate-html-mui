import { Editor } from "slate"
import {
  createAnchorPlugin,
  createBrPlugin,
  createHtmlPlugin,
  createImgPlugin,
  createPicturePlugin,
} from "../src/html"
import { createBasePlugin, SlatePen } from "../src/pen"
import { createButtonLinkPlugin } from "./button-link"

export const createSlatePen = (editor: Editor) =>
  new SlatePen({
    editor,
    plugins: [
      createBasePlugin(),
      createHtmlPlugin(),
      createImgPlugin(),
      createPicturePlugin(),
      createAnchorPlugin(),
      createButtonLinkPlugin(),
      createBrPlugin(),
    ],
  })
