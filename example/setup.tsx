import { Editor } from "slate"
import { createBasePlugin, SlatePen } from "slate-pen"
import {
  createAnchorPlugin,
  createBrPlugin,
  createHtmlPlugin,
  createImgPlugin,
  createPicturePlugin,
} from "../src"
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
